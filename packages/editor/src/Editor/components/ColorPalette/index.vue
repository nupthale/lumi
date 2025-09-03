<script lang="tsx">
import { defineComponent, computed } from 'vue';
import { Type } from 'lucide';
import { i18next } from '@editor/i18n';

import LucideIcon from '../LucideIcon/index.vue';


export default defineComponent({
    emits: ['background', 'color'],
    props: {
        textColorEnable: {
            type: Boolean,
            default: true
        },
        borderColorEnable: {
            type: Boolean,
            default: false
        },
        bgColorEnable: {
            type: Boolean,
            default: true
        },
        bgColorTitle: {
            type: String,
            default: i18next.t('editor.colorPalette.background')
        },
        useLightBgColor: {
            type: Boolean,
            default: false
        },
    },
    setup(props, { emit }) {
        const textColors = computed(() => {
            return [
                'var(--palette-text-0)',
                'var(--palette-text-1)',
                'var(--palette-text-2)',
                'var(--palette-text-3)',
                'var(--palette-text-4)',
                'var(--palette-text-5)',
                'var(--palette-text-6)',
                'var(--palette-text-7)',
            ];
        });

        const borderColors = computed(() => {
            return [
                'var(--palette-border-0)',
                'var(--palette-border-1)',
                'var(--palette-border-2)',
                'var(--palette-border-3)',
                'var(--palette-border-4)',
                'var(--palette-border-5)',
                'var(--palette-border-6)',
            ];
        })

        const defaultBgColors = computed(() => {
            return [
                'var(--palette-bg-0)',
                'var(--palette-bg-1)',
                'var(--palette-bg-2)',
                'var(--palette-bg-3)',
                'var(--palette-bg-4)',
                'var(--palette-bg-5)',
                'var(--palette-bg-6)',
                'var(--palette-bg-7)',
                'var(--palette-bg-8)',  
                'var(--palette-bg-9)',  
                'var(--palette-bg-10)',
                'var(--palette-bg-11)',
                'var(--palette-bg-12)',
                'var(--palette-bg-13)',
                'var(--palette-bg-14)',
            ];
        });

        const lightBgColors = computed(() => {
            return [
                'var(--palette-bg-light-0)',
                'var(--palette-bg-light-1)',
                'var(--palette-bg-light-2)',
                'var(--palette-bg-light-3)',
                'var(--palette-bg-light-4)',
                'var(--palette-bg-light-5)',
                'var(--palette-bg-light-6)',
                'var(--palette-bg-light-7)',        
                'var(--palette-bg-light-8)',
                'var(--palette-bg-light-9)',
                'var(--palette-bg-light-10)',
                'var(--palette-bg-light-11)',
                'var(--palette-bg-light-12)',
                'var(--palette-bg-light-13)',
                'var(--palette-bg-light-14)',
            ]
        });

        const bgColors = computed(() => {
            return props.useLightBgColor? lightBgColors.value : defaultBgColors.value;
        });

        return () => (
            <div class="container">
                {
                    props.textColorEnable ? (
                        <div>
                            <div class="title">{i18next.t('editor.colorPalette.text')}</div>
                            <ul class="grid grid-cols-8">
                                {
                                    textColors.value.map(textColor => (
                                        <li key={textColor} class="textColor" style={{ color: textColor }} onClick={() => emit('color', textColor)}>
                                            <LucideIcon icon={Type} width={12}></LucideIcon>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ) : ''
                }
                {
                    props.borderColorEnable ? (
                        <div>
                            <div class="title">{i18next.t('editor.colorPalette.border')}</div>
                            <ul class="grid grid-cols-8">
                                <li class="borderColor" onClick={() => emit('border', 'transparent')}>
                                    <div class="borderColor0"></div>
                                </li>
                                {
                                    borderColors.value.map(borderColor => (
                                        <li key={borderColor} class="borderColor" style={{ background: borderColor }} onClick={() => emit('border', borderColor)}></li>
                                    ))
                                }
                            </ul>
                        </div>
                    ) : ''
                }
                {
                    props.bgColorEnable? (
                        <div>
                            <div class="title">{props.bgColorTitle}</div>
                            <ul class="grid grid-cols-8">
                                <li class="bgColor" onClick={() => emit('background', 'transparent')}>
                                    <div class="bgColor0"></div>
                                </li>
                                {
                                    bgColors.value.map(bgColor => (
                                        <li key={bgColor} class="bgColor" style={{ background: bgColor }} onClick={() => emit('background', bgColor)}></li>
                                    ))
                                }
                            </ul>
                        </div>
                    ) : ''
                }
            </div>
        );
    }
});
</script>

<style scoped>
.container {
    width: 230px;
    padding: 4px 10px 12px;
    border: 1px solid var(--float-border-color);
    border-radius: 6px;
    box-shadow: 0 6px 24px #1f23291a;
}

.title {
    color: var(--text-color);
    margin: 9px 0 7px 2px;
    font-size: 12px;
}

.textColor, .bgColor, .borderColor {
    position: relative;
    
    margin-bottom: 4px;
    border-radius: 4px;
    border: 2px solid var(--body-bg);
    height: 26px;
    cursor: pointer;
}

.textColor {
    display: flex;
    align-items: center;
    justify-content: center;
}

.textColor:before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid var(--color-palette-border);
}

.textColor:hover, .bgColor:hover, .borderColor:hover {
    border-color: #c2d4ff;
}

.textColor.active, .bgColor.active, .borderColor.active  {
    border-color: #336df4;
}

.textColor:hover:before, .textColor.active:before,
.bgColor:hover .bgColor0:before, .bgColor.active .bgColor0:before,
.borderColor:hover .borderColor0:before, .borderColor.active .borderColor0:before
{
    display: none;
}

.bgColor0, .borderColor0 {
    position: relative;
}

.bgColor0:before, .borderColor0:before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    border: 1px solid var(--color-palette-border);
    transform: scale(.5);
    transform-origin: 0 0;
    width: 42px;
    height: 42px;
    border-radius: 4px;
}

.bgColor0:after, .borderColor0:after {
    position: absolute;
    top: 2px;
    left: 22px;
    content: '';
    background: #8f959e;
    width: 1px;
    height: 56px;
    transform: scale(0.5) rotate(45deg);
    transform-origin: -1px -2px;
}
</style>