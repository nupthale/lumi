<script lang="tsx">
import { defineComponent, ref, onMounted, computed } from 'vue';
// @ts-ignore: Could not find a declaration file for module 'granim'
import Granim from 'granim';
import i18next from 'i18next';
import { message, Modal } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { X } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';

import GradientText from '@/components/GradientText/index.vue';
import { useContextStore } from '@/store/ui-states/context';

import { useImportJson } from './hooks/useImportJson';
import { useImportMd } from './hooks/useImportMd';

export default defineComponent({
    setup() {
        const route = useRoute();

        const dateRef = ref(dayjs());

        const contextStore = useContextStore();

        const canvasEl = ref<HTMLCanvasElement | null>(null);
        const granimRef = ref<any>(null);
        const isAnimating = ref(false); // Control animation state

        const fileInput = ref<HTMLInputElement | null>(null);

        const { importJson } = useImportJson();
        const { importMd } = useImportMd();

        const isJournalPage = computed(() => {
            return route.name === 'journals';
        });

        const granim = () => {
            if (canvasEl.value) {
                granimRef.value = new Granim({
                    element: canvasEl.value,
                    opacity: [0, 1],
                    // direction: 'radial',
                    direction: 'left-right',
                    states : {
                        "default-state": {
                            gradients: [
                                [
                                    { color: '#833ab4', pos: .2 },
                                    { color: '#fd1d1d', pos: .8 },
                                    { color: '#38ef7d', pos: 1 }
                                ], [
                                    { color: '#40e0d0', pos: 0 },
                                    { color: '#ff8c00', pos: .2 },
                                    { color: '#ff0080', pos: .75 }
                                ],
                            ],
                        }
                    }
                });
            }
        }

        onMounted(() => {
            // Start animation after a small delay to ensure DOM is ready
            setTimeout(() => {
                isAnimating.value = true;
            }, 10);
            
            granim();
        });

        const handleFileChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return
            
            // Get file name
            const fileName = file.name
            console.log('File name:', fileName);
            
            const names = fileName.split('.');
            const suffix = names.pop();
            const fileNameWithoutSuffix = names.join('.');

            if (!['md', 'json'].includes(suffix || '')) {
                message.error(i18next.t('import.hint'));
                return;
            }
        
            // Read file content
            const reader = new FileReader()
            reader.onload = (e) => {
                const fileContent = e.target?.result;
                console.log('File content:', fileContent);

                if (suffix === 'json') {
                    importJson(fileContent);
                } else if (suffix === 'md') {
                    importMd(fileNameWithoutSuffix, fileContent);
                }
            }
            
            // Read as text (for text files)
            reader.readAsText(file);
        }

        return () => (
            <div class={`fixed top-0 left-0 right-0 bottom-0 ${isAnimating.value ? 'animate-fade-in-scale' : ''}`}>
                <canvas class="absolute left-0 top-0 w-full h-full z-2 opacity-[0.12]" ref={canvasEl}></canvas>

                <div class={`importBox flex items-center justify-center flex-col absolute left-0 right-0 m-auto top-0 bottom-0 ${isAnimating.value ? 'animate-expand' : ''}`}>
                    <input 
                        type="file" 
                        ref={fileInput} 
                        class="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange} 
                    />

                    <GradientText
                        text={i18next.t('import.uploadText')}
                        colors={['#ffaa40', '#9c40ff', '#ffaa40']}
                        animation-speed={8}
                        show-border={false}
                        class="importText"
                    />
                    <div class="importHint mt-8">{i18next.t('import.hint')}</div>
                    <div class="mt-8">
                        <TextButton class="closeBtn" onClick={() => contextStore.setFileImportModalVisible(false)}>
                            <X size={24} />
                        </TextButton>
                    </div>
                </div>
            </div>
        );
    }
});
</script>

<style scoped>
.importBox {
    width: 100%;
    height: 100%;
    cursor: pointer;

    background: #ffffff0d;
    backdrop-filter: blur(4px);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 30px;
    border-color: #fff3;
    
    /* Initial state for animation */
    transform: scale(0);
    transform-origin: center center;
}

.importText {
    font-size: 28px;
}

.importHint {
    background: var(--blur-bg);
    padding: 4px 16px;
    border-radius: 8px;
    backdrop-filter: blur(2px);
}

.closeBtn {
    position: relative;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 48px;
    height: 48px!important;
    background: var(--blur-bg);
    border-radius: 100%!important;
}

/* Animation for fade in and scale */
@keyframes fadeInScale {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Animation for expanding the box */
@keyframes expand {
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
}

.animate-fade-in-scale {
    animation: fadeInScale 0.3s ease-out forwards;
}

.animate-expand {
    animation: expand 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.journalDate {
    font-size: 18px;
}

.journalDate :deep(.header-calendarBtn) {
    font-size: 18px!important;
}
</style>