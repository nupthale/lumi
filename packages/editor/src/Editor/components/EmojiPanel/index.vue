<script lang="tsx">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import data from '@emoji-mart/data';
import { Picker } from 'emoji-mart';

import { useDark } from '@editor/Editor/hooks/useDark';

import './theme.less';

export default defineComponent({
    emits: ['select'],
    setup(_, { emit }) {
        const pickerRef = ref();
        const panelRef = ref();

        const isDark = useDark();

        const stopEvt = (e) => e.stopPropagation();

        onMounted(() => {
            if (panelRef.value) {
                pickerRef.value = new Picker({ 
                    data,
                    onEmojiSelect: (e) => emit('select', e),
                    theme: isDark.value ? 'dark' : 'light'
                });

                panelRef.value.appendChild(pickerRef.value);

                pickerRef.value.addEventListener('mouseup', stopEvt);
            }
        });

        onUnmounted(() => {
            if (pickerRef.value) {
                // 移除 DOM 元素
                pickerRef.value.remove();
                // 清空引用
                pickerRef.value = null;
            }

            if (panelRef.value) {
                pickerRef.value.removeEventListener('mouseup', stopEvt);
            }
        });

        return () => (
            <div ref={panelRef} onWheel={stopEvt}></div>
        );
    }
});
</script>

<style scoped></style>