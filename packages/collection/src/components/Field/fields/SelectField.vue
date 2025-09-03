<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { Select } from 'ant-design-vue';
import { useEventListener } from '@vueuse/core';

import { i18next } from '@collection/i18next';
import { getTextColor } from '@collection/shared/theme';
import { ColumnType, SelectColumnType, SelectOptionType } from '@collection/interface';

export default defineComponent({
    props: {
        column: Object as PropType<SelectColumnType>,
        value: {
            type: Array,
        },
        customOpen: Boolean,
        showPlaceholder: Boolean,
    },
    emits: ['change'],
    setup(props, { emit }) {
        const dropdownVisible = ref(false);

        useEventListener(document.body, 'click', (e) => {
            if (((e.target as HTMLElement).closest('.ant-select-dropdown'))) {
                return;
            }

            dropdownVisible.value = false;
        });

        const handleSelect = (val: string) => {
            if (props.column?.config?.multiple) {
                emit('change', [
                    ...(props.value || []),
                    val
                ]);
            } else {
                emit('change', [val]);

                dropdownVisible.value = false;
            }
        }

        const handleDeselect = (val: string) => {
            if (props.column?.config?.multiple) {
                const newValue = (props.value || []).filter(item => item !== val);

                emit('change', newValue);
            } else {
                emit('change', []);

                dropdownVisible.value = false;
            }
        }

        const customSlots = {
            tagRender: ({ option }: { option: SelectOptionType}) => {
                return option ? (
                    (
                        <div class="selectTag" key={option.value} style={{ background: `var(${option.color})`, color: `var(--${getTextColor(option.color)}900)`}}>
                            <span class="selectTag_text">
                                {option.label}
                            </span>
                        </div>
                    )
                ) : ''
            },
            option: (option: SelectOptionType) => {
                return (
                    (
                        <div class="selectTag" key={option.value} style={{ background: `var(${option.color})`, color: `var(--${getTextColor(option.color)}900)`}}>
                            <span class="selectTag_text">
                                {option.label}
                            </span>
                        </div>
                    )
                )
            }
        }

        return () => props.customOpen ? (
            <div class="w-full h-full container" onClick={() => dropdownVisible.value = true}>
                <Select
                    open={dropdownVisible.value}
                    class="selectField"
                    placeholder={props.showPlaceholder ? i18next.t('common.selectPlaceholder') : ''}
                    popupClassName="collectionSelectFieldPopover"
                    options={props.column?.config?.options || []}
                    mode={props.column?.config?.multiple ? 'multiple' : 'tags'}
                    value={props.value as string[]}
                    showSearch={Number(props.column?.config?.options?.length) > 10}
                    onSelect={handleSelect}
                    onDeselect={handleDeselect}
                >
                    {customSlots}
                </Select>
            </div>
        ) : (
            <div class="w-full h-full container">
                <Select
                    class="selectField"
                    placeholder={props.showPlaceholder ? i18next.t('common.selectPlaceholder') : ''}
                    popupClassName="collectionSelectFieldPopover"
                    options={props.column?.config?.options || []}
                    mode={props.column?.config?.multiple ? 'multiple' : 'tags'}
                    value={props.value as string[]}
                    showSearch={Number(props.column?.config?.options?.length) > 10}
                    onSelect={handleSelect}
                    onDeselect={handleDeselect}
                >
                    {customSlots}
                </Select>
            </div>
        );
    }
})
</script>

<style>
.collectionSelectFieldPopover .ant-select-item-option-selected {
    background: none!important;
}

.collectionSelectFieldPopover .ant-select-item {
    display: flex;
    align-items: center;
}

.collectionSelectFieldPopover .ant-select-item {
    display: flex;
    align-items: center;
}

.collectionSelectFieldPopover .ant-select-item-option-state .ant-icon {
    vertical-align: unset!important;
}

.collectionSelectFieldPopover .ant-select-item:hover {
    background: rgba(31, 35, 41, 0.08)!important;
}

.collectionSelectFieldPopover .ant-select-item-option-state {
    height: 14px;
    font-size: 12px;
    line-height: 0;
}
</style>

<style scoped>
.container {
    line-height: 0;
}

.selectField {
    width: 100%;
    min-height: 100%;
}

.selectField :deep(.ant-select-selector) {
    border: none!important;
    background: none;
    outline: none!important;
    padding: 0!important;
    box-shadow: none!important;
}

.selectField :deep(.ant-select-selector) {
    display: flex;
    align-items: center;
}

.selectField :deep(.ant-select-selector:after) {
    display: none;
}

.selectField :deep(.ant-select-selection-search-input) {
    height: 20px!important;
}

.selectField :deep(.ant-select-selection-placeholder) {
    transform: translateY(-6px)!important;
}

.selectField :deep(.ant-select-selection-overflow) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.selectField :deep(.ant-select-selection-overflow .ant-select-selection-overflow-item-suffix) {
    width: 0px;
    align-self: baseline;
}

.selectTag {
    width: fit-content;
    font-size: 12px;
    padding: 0 8px;
    border-radius: 12px;
    line-height: 18px;
    border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>