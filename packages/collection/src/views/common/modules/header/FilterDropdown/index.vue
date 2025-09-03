<script lang="tsx">
import { defineComponent, PropType, inject, ref, computed } from 'vue';
import { Dropdown, Form, Select } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { Plus, ArrowDownAZ, ArrowUpAZ, Trash2, GripVertical } from 'lucide-vue-next';
import Sortable from 'sortablejs';

import { i18next } from '@collection/i18next';
import I18n from '@collection/components/I18n/index.vue';
import { CollectionSchemaType, ColumnType, ColumnTypeEnum, ConditionType, OperatorEnum, SelectColumnType, FilterType, FilterMatchEnum } from '@collection/interface';
import { themeTokens } from '@collection/shared/theme';
import { filter$ } from '@collection/events';

import TextValueField from './values/text.vue';
import NumberValueField from './values/number.vue';
import DateValueField from './values/date.vue';
import SelectValueField from './values/select.vue';

const FormItem = Form.Item;

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
    },
    setup(props, { slots }) {
        const id = inject<string>('id')!;

        const sortRef = ref();
        const sortContainer = ref();

        const conditionFieldWrap = ref();

        const formModel = ref<FilterType>({
            conditions: [{
                columnId: undefined as any
            }],
            matches: FilterMatchEnum.AND,
        });

        const columnMap = computed(() => {
            return props.schema?.columns.reduce((acc, crt) => {
                acc[crt.id] = crt;
                return acc;
            }, {} as Record<string, ColumnType>) || {};
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
                        draggable: ".columnItem",
                        onEnd: (e) => {
                            const oldItem = formModel.value.conditions[e.oldIndex];

                            formModel.value.conditions.splice(e.oldIndex, 1);
                            formModel.value.conditions.splice(e.newIndex, 0, oldItem);

                            update();
                        }
                    });

                    const view = props.schema.views.find(view => view.id === props.schema?.viewId);

                    formModel.value = {
                        conditions: view?.filter?.conditions || [{
                            columnId: undefined as any
                        }],
                        matches: view?.filter?.matches || FilterMatchEnum.AND,
                    };
                }
            }, 0)
        }

        const handleAddRule = () => {
            formModel.value.conditions.push({
                columnId: undefined as any,
            });
        }

        const update = () => {
            console.info('####filter', formModel.value)

            const view = props.schema?.views.find(view => view.id === props.schema?.viewId);
            filter$.next({
                id,
                viewId: view?.id!,
                filter: {
                    ...formModel.value,
                }, 
            })
        }

        const handleDeleteRule = (index: number) => {
            formModel.value.conditions.splice(index, 1);

            update();
        }

        const handleSelectMatches = (val: FilterMatchEnum) => {
            formModel.value.matches = val;
            update();
        }

        const handleSelectColumn = (val: string, item: ConditionType) => {
            item.columnId = val || '';

            const operators = getOperatorOptions(val) || [];
            item.operator = operators[0]?.value;
            item.value = undefined;

            update();
        };

        const handleSelectOperator = (val: OperatorEnum, item: ConditionType) => {
            item.operator = val;

            update();
        };

        const getFieldOptions = () => {
            return (props.schema?.columns || [])?.
                filter((item: ColumnType) => ![ColumnTypeEnum.IMAGE].includes(item.type)).
                map((item: ColumnType) => ({
                    label: item.title,
                    value: item.id,
                }));
        }

        const getOperatorOptions = (columnId?: string) => {
            const column = props.schema?.columns?.find(item => item.id === columnId);
            
            if (!column) return [];

            if (column.type === ColumnTypeEnum.TEXT) {
                return [
                    { label: i18next.t('collection.operators.equal'), value: OperatorEnum.EQUAL },
                    { label: i18next.t('collection.operators.notEqual'), value: OperatorEnum.NOT_EQUAL },
                    { label: i18next.t('collection.operators.contains'), value: OperatorEnum.LIKE },
                    { label: i18next.t('collection.operators.notContains'), value: OperatorEnum.NOT_LIKE },
                    { label: i18next.t('collection.operators.isEmpty'), value: OperatorEnum.IS_NULL },
                    { label: i18next.t('collection.operators.isNotEmpty'), value: OperatorEnum.IS_NOT_NULL },
                ];
            } else if (
                [
                    ColumnTypeEnum.NUMBER,
                    ColumnTypeEnum.DATE,
                    ColumnTypeEnum.CURRENCY,
                ].includes(column.type)
            ) {
                return [
                    { label: i18next.t('collection.operators.equal'), value: OperatorEnum.EQUAL },
                    { label: i18next.t('collection.operators.notEqual'), value: OperatorEnum.NOT_EQUAL },
                    { label: i18next.t('collection.operators.lessThan'), value: OperatorEnum.LESS_THAN },
                    { label: i18next.t('collection.operators.lessThanOrEqual'), value: OperatorEnum.LESS_THAN_OR_EQUAL },
                    { label: i18next.t('collection.operators.greaterThan'), value: OperatorEnum.GREATER_THAN },
                    { label: i18next.t('collection.operators.greaterThanOrEqual'), value: OperatorEnum.GREATER_THAN_OR_EQUAL },
                    { label: i18next.t('collection.operators.isEmpty'), value: OperatorEnum.IS_NULL },
                    { label: i18next.t('collection.operators.isNotEmpty'), value: OperatorEnum.IS_NOT_NULL },
                ]; 
            } else if (column.type === ColumnTypeEnum.SELECT) {
                return [
                    { label: i18next.t('collection.operators.equal'), value: OperatorEnum.EQUAL },
                    { label: i18next.t('collection.operators.notEqual'), value: OperatorEnum.NOT_EQUAL },
                    { label: i18next.t('collection.operators.contains'), value: OperatorEnum.LIKE },
                    { label: i18next.t('collection.operators.notContains'), value: OperatorEnum.NOT_LIKE },
                    { label: i18next.t('collection.operators.isEmpty'), value: OperatorEnum.IS_NULL },
                    { label: i18next.t('collection.operators.isNotEmpty'), value: OperatorEnum.IS_NOT_NULL },
                ];
            } else {
                return [];
            }
        };

        return () => (
            <Dropdown trigger="click" placement='bottom' onOpenChange={handleVisibleChange}>
                {{
                    default: slots.default,
                    overlay: () => {
                        return (
                            <div class="dropdownContainer w-[540px]" onClick={e => e.stopPropagation()}>
                                <div class="flex items-center justify-between px-3 my-2" onClick={e => e.stopPropagation()}>
                                    <div class="text-xs lightText">{i18next.t('collection.filter.title')}</div>
                                    <div class="flex items-center">
                                        <I18n tKey="collection.filter.matches">
                                            {{
                                                match: () => (
                                                    <FormItem class="mx-2 !mb-0 text-xs" >
                                                        <Select
                                                            size="small"
                                                            value={formModel.value.matches}
                                                            onChange={handleSelectMatches}
                                                            style="width: 80px"
                                                            options={[
                                                                { label: i18next.t('collection.filter.matchesAll'), value: FilterMatchEnum.AND },
                                                                { label: i18next.t('collection.filter.matchesAny'), value: FilterMatchEnum.OR },
                                                            ]}
                                                            getPopupContainer={node => node.parentElement || document.body}
                                                        />
                                                    </FormItem>
                                                )
                                            }}
                                        </I18n>
                                    </div>
                                </div>
                                <div onClick={e => e.stopPropagation()}>
                                    <Form class="p-1" model={formModel}>
                                        <div ref={sortContainer}>
                                            {
                                                formModel.value.conditions?.map((item, index) => (
                                                    <div class="columnItem flex items-center gap-1 mb-1" key={item.columnId}>
                                                        <div class="mx-1 sortHandle cursor-grabbing">
                                                            <GripVertical class="" width={'16px'} height={'16px' } />
                                                        </div>

                                                        <div class="conditionFieldWrap flex-1 flex items-center" key={index} ref={conditionFieldWrap}>
                                                            <FormItem>
                                                                <Select
                                                                    value={item.columnId}
                                                                    onChange={(val) => handleSelectColumn(val, item)}
                                                                    style="width: 146px"
                                                                    options={getFieldOptions()}
                                                                    placeholder={i18next.t('collection.filter.fieldPlaceholder')}
                                                                    getPopupContainer={() => conditionFieldWrap.value || document.body}
                                                                />
                                                            </FormItem>
                                                            
                                                            {
                                                                item.columnId ? (
                                                                    <div class="flex items-center flex-1">
                                                                        <FormItem>
                                                                            <Select
                                                                                value={item.operator}
                                                                                onChange={(val) => handleSelectOperator(val, item)}
                                                                                style="width: 120px"
                                                                                options={getOperatorOptions(item.columnId)}
                                                                                getPopupContainer={() => conditionFieldWrap.value || document.body}
                                                                            />
                                                                        </FormItem>

                                                                        {columnMap.value[item.columnId].type === ColumnTypeEnum.TEXT ? (
                                                                            <TextValueField
                                                                                schema={props.schema}
                                                                                item={item}
                                                                                onChange={(val) => {
                                                                                    item.value = val;
                                                                                    update();
                                                                                }}
                                                                            />
                                                                        ) : ''}

                                                                        {[ColumnTypeEnum.NUMBER, ColumnTypeEnum.CURRENCY].includes(columnMap.value[item.columnId].type) ? (
                                                                            <NumberValueField
                                                                                schema={props.schema}
                                                                                item={item}
                                                                                onChange={(val) => {
                                                                                    item.value = val;
                                                                                    update();
                                                                                }}
                                                                            />
                                                                        ) : ''}

                                                                        {columnMap.value[item.columnId].type === ColumnTypeEnum.DATE ? (
                                                                            <DateValueField
                                                                                schema={props.schema}
                                                                                column={columnMap.value[item.columnId] as SelectColumnType}
                                                                                item={item}
                                                                                onChange={(val) => {
                                                                                    item.value = val;
                                                                                    update();
                                                                                }}
                                                                            />
                                                                        ) : ''}

                                                                        {columnMap.value[item.columnId].type === ColumnTypeEnum.SELECT ? (
                                                                            <SelectValueField
                                                                                schema={props.schema}
                                                                                column={columnMap.value[item.columnId] as SelectColumnType}
                                                                                item={item}
                                                                                onChange={(val) => {
                                                                                    item.value = val;
                                                                                    update();
                                                                                }}
                                                                            />
                                                                        ) : ''}
                                                                    </div>
                                                                ) : ''
                                                            }

                                                            
                                                        </div>
                                                        <TextButton onClick={() => handleDeleteRule(index)}>
                                                            <Trash2 width="14px" height="14px" color={themeTokens.lightTextColor()} />
                                                        </TextButton>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <div class="mt-3">
                                            <TextButton type="primary" onClick={handleAddRule}>
                                                <div class="flex items-center gap-1">
                                                    <Plus width="14px" height="14px" color={themeTokens.lightTextColor()} />
                                                    {i18next.t('collection.filter.addCondition')}
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

.conditionFieldWrap {
    border: 1px solid var(--default-border-color);
    border-radius: 6px;
    overflow: hidden;
}

.conditionFieldWrap :deep(.ant-form-item) {
    margin: 0!important;
    border-right: 1px solid var(--default-border-color);
}

.conditionFieldWrap :deep(.ant-select-selector),
.conditionFieldWrap :deep(.ant-input),
.conditionFieldWrap :deep(.ant-input-number),
.conditionFieldWrap :deep(.ant-picker)
{
    border: none!important;
    box-shadow: none!important;
    outline: none!important;
    border-radius: 0!important;
    background: none!important;
}

.conditionFieldWrap :deep(.ant-input-number-handler-wrap) {
    display: none;
}

.conditionFieldWrap :deep(.ant-select-item-option-content),
.conditionFieldWrap :deep(.ant-select-selection-item) {
    display: flex;
    align-items: center;
}

.ghostClass {
    opacity: 0;
}
</style>