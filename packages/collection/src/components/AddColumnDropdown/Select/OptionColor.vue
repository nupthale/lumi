<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { Dropdown } from 'ant-design-vue';
import { ChevronDown } from 'lucide-vue-next';

import { SelectOptionType } from '../../../interface';

import { colors } from './color';

export default defineComponent({
    props: {
        item: Object as PropType<SelectOptionType>
    },
    emits: ['change'],
    setup(props, { emit }) {
        const handleSelect = (color: string) => {
            emit('change', color);
        }

        return () => (
            <div>
                <Dropdown>
                    {{
                        default: () => (
                            <div class="optionColor flex items-center justify-center mr-2" style={{ background: `var(${props.item?.color})` }}>
                                <ChevronDown width={14} height={14} />
                            </div>
                        ),
                        overlay: () => (
                            <div class="overlayContainer grid grid-cols-11 gap-1">
                                {
                                    colors.map(color => (
                                        <div class="colorItem" style={{background: `var(${color})`}} onClick={() => handleSelect(color)}></div>
                                    ))
                                }
                            </div>
                        )
                    }}
                </Dropdown>
            </div>
        );
    }
});
</script>

<style scoped>
.overlayContainer {
    padding: 12px;
    border: 1px solid var(--palette-border-0);
    background: var(--float-bg-2);
    border-radius: 8px;
    box-shadow: 0px 8px 24px 8px rgba(31, 35, 41, 0.04), 0px 6px 12px 0px rgba(31, 35, 41, 0.04), 0px 4px 8px -8px rgba(31, 35, 41, 0.06);
}

.optionColor {
    width: 18px;
    height: 18px;
    border-radius: 6px;
    cursor: pointer;
}

.optionColor:hover {
    opacity: 0.5;
}

.colorItem {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    cursor: pointer;
    transition: transform .1s ease;
}

.colorItem:hover {
    transform: scale(1.3);
}
</style>