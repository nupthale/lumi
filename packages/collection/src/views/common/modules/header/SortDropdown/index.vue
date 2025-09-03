<script lang="tsx">
import { defineComponent, PropType, inject, ref, computed } from 'vue';
import { Dropdown, Form, Select } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { Plus, ArrowDownAZ, ArrowUpAZ, Trash2, GripVertical } from 'lucide-vue-next';
import Sortable from 'sortablejs';
import { isNil } from 'lodash-es';

import { i18next } from '@collection/i18next';
import { CollectionSchemaType, OrderType, ColumnType, ColumnTypeEnum } from '@collection/interface';
import { themeTokens } from '@collection/shared/theme';
import { sort$ } from '@collection/events';

const FormItem = Form.Item;

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
    },
    setup(props, { slots }) {
        const id = inject<string>('id')!;

        const sortRef = ref();
        const sortContainer = ref();

        const orderFieldWrap = ref();

        const formModel = ref({
            list: [{
                columnId: undefined, order: 'asc'
            }] as {
                columnId?: string;
                order: 'asc' | 'desc';
            }[],
        });
        
        const handleVisibleChange = (visible: boolean) => {
            setTimeout(() => {
                if (visible) {
                    if (!props.schema) return;

                    sortRef.value = Sortable.create(sortContainer.value, {
                        handle: '.sortHandle',
                        direction: 'vertical',
                        animation: 150,
                        chosenClass: 'selected',
                        ghostClass: 'ghostClass',
                        easing: "cubic-bezier(1, 0, 0, 1)",
                        draggable: ".sortItem",
                        onEnd: (e) => {
                            const oldItem = formModel.value.list[e.oldIndex];

                            formModel.value.list.splice(e.oldIndex, 1);
                            formModel.value.list.splice(e.newIndex, 0, oldItem);

                            update();
                        }
                    });

                    const view = props.schema.views.find(view => view.id === props.schema?.viewId);
                    formModel.value = {
                        list: view?.orders || [{
                            columnId: undefined, order: 'asc'
                        }],
                    };
                } else {
                    sortRef.value?.destroy();
                }
            }, 0)
        }

        const handleAddRule = () => {
            formModel.value.list.push({
                columnId: undefined,
                order: 'asc',
            });
        }

        const update = () => {
            const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

            sort$.next({
                id,
                viewId: view?.id!,
                orders: formModel.value.list.filter(item => !isNil(item.columnId)) as OrderType[], 
            })
        }

        const handleDeleteRule = (index: number) => {
            formModel.value.list.splice(index, 1);

            update();
        }

        const handleSelectColumn = (val: string, item: OrderType) => {
            item.columnId = val || '';

            update();
        };

        const handleSelectOrder = (val: 'asc' | 'desc', item: OrderType) => {
            item.order = val || 'asc';

            update();
        };

        // 只保留当前columnId和未选择过的， 还要过滤image类型
        const getOptions = (columnId?: string) => {
            const selectedIds = formModel.value.list.map(item => item.columnId);

            return props.schema?.columns?.
                filter((item: ColumnType) => ![ColumnTypeEnum.IMAGE].includes(item.type)).
                filter(item => !selectedIds.includes(item.id) || item.id === columnId)?.
                map((column) => ({
                    label: column.title,
                    value: column.id,
                })) || [];
        }

        return () => (
            <Dropdown trigger="click" onOpenChange={handleVisibleChange}>
                {{
                    default: slots.default,
                    overlay: () => {
                        return (
                            <div class="dropdownContainer w-[344px]" onClick={e => e.stopPropagation()}>
                                <div class="text-xs lightText pl-3 my-2">{i18next.t('collection.sort.title')}</div>
                                <div onClick={e => e.stopPropagation()}>
                                    <Form class="p-1" model={formModel}>
                                        <div ref={sortContainer}>
                                            {
                                                formModel.value.list?.map((item, index) => (
                                                    <div class="sortItem flex items-center gap-1 mb-1" key={item.columnId}>
                                                        <div class="mx-1 sortHandle cursor-grabbing">
                                                            <GripVertical class="" width={'16px'} height={'16px' } />
                                                        </div>

                                                        <div class="orderFieldWrap flex items-center" key={index} ref={orderFieldWrap}>
                                                            <FormItem>
                                                                <Select
                                                                    value={item.columnId}
                                                                    onChange={(val) => handleSelectColumn(val, item)}
                                                                    style="width: 146px"
                                                                    options={getOptions(item.columnId)}
                                                                    placeholder={i18next.t('collection.sort.fieldPlaceholder')}
                                                                    getPopupContainer={() => orderFieldWrap.value || document.body}
                                                                />
                                                                
                                                            </FormItem>
                                                            <FormItem >
                                                                <Select
                                                                    value={item.order}
                                                                    onChange={(val) => handleSelectOrder(val, item)}
                                                                    allowClear={false}
                                                                    defaultActiveFirstOption
                                                                    getPopupContainer={() => orderFieldWrap.value || document.body}
                                                                >
                                                                    <Select.Option value={'asc'}>
                                                                        <div class="flex items-center gap-2">
                                                                            <ArrowDownAZ width="14px" height="14px" color={themeTokens.lightTextColor()} />
                                                                            <span class="text-xs">{i18next.t('collection.sort.ascending')}</span>
                                                                        </div>
                                                                    </Select.Option>
                                                                    <Select.Option value={'desc'}>
                                                                        <div class="flex items-center gap-2">
                                                                            <ArrowUpAZ width="14px" height="14px" color={themeTokens.lightTextColor()} />
                                                                            <span class="text-xs">{i18next.t('collection.sort.descending')}</span>
                                                                        </div>
                                                                    </Select.Option>
                                                                </Select>
                                                            </FormItem>

                                                            
                                                        </div>
                                                        <TextButton onClick={() => handleDeleteRule(index)}>
                                                            <Trash2 width="14px" height="14px" color={themeTokens.lightTextColor()} />
                                                        </TextButton>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <div class="mt-3">
                                            <TextButton size="small" type="primary" onClick={handleAddRule}>
                                                <div class="flex items-center gap-1">
                                                    <Plus width="14px" height="14px" color={themeTokens.lightTextColor()} />
                                                    {i18next.t('collection.sort.addSort')}
                                                </div>
                                            </TextButton>
                                        </div>
                                    </Form>
                                </div>
                                
                            </div>
                        )
                    }
                }}
            </Dropdown>
        )
    }
})
</script>

<style scoped>
.column {
    padding: 0 12px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
}

.columnItem.selected {
    background: var(--menu-item-hover);
}

.ghostClass {
    opacity: 0;
}

.orderFieldWrap {
    border: 1px solid var(--default-border-color);
    border-radius: 6px;
    overflow: hidden;
}

.orderFieldWrap :deep(.ant-form-item) {
    margin: 0!important;
}

.orderFieldWrap :deep(.ant-select-selector) {
    border: none!important;
    box-shadow: none!important;
    outline: none!important;
    border-radius: 0!important;
}

.orderFieldWrap :deep(.ant-select-item-option-content),
.orderFieldWrap :deep(.ant-select-selection-item) {
    display: flex;
    align-items: center;
}

.ghostClass {
    opacity: 0;
}
</style>