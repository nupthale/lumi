<script lang="tsx">
import { defineComponent, PropType, toRef, inject, watch, ref } from 'vue';
import { Tooltip, Dropdown } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { Plus } from 'lucide-vue-next';

import { i18next } from '@collection/i18next';

import { useSort } from '@collection/hooks/useSort';
import { useFilter } from '@collection/hooks/useFilter';
import { useGroup } from '@collection/hooks/useGroup';

import FieldValue from '@collection/components/FieldValue/index.vue';
import ScrollView from '@collection/components/ScrollView.vue';
import { themeTokens } from '@collection/shared/theme';
import { CollectionSchemaType, ColumnType } from '@collection/interface';

import { addRow$ } from '@collection/events';

import Card from './modules/card/index.vue';

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
        values: Array as PropType<Record<string, any>[]>,
    },
    setup(props) {
        const id = inject<string>('id')!;
        
        const { sort } = useSort(props.schema);
        const { filter } = useFilter(props.schema);
        const { groupValuesRef } = useGroup(toRef(props, 'schema'), toRef(props, 'values'));

        const handleAddRow = () => {
            addRow$.next({
                id,
                direction: 'below',
                count: 1,
            });
        };

        const renderValues = (values: Record<string, any>[]) => {
            return (
                <div class="contentWrap flex flex-wrap">
                    {
                        values?.
                            filter(filter).
                            sort(sort).
                            map((item) => (
                                <Card schema={props.schema} row={item} />
                            ))
                    }
                </div>
            );
        }

        const renderGroups = () => {
            if (!props.schema) return '';

            const view = props.schema.views.find(view => view.id === props.schema?.viewId);
            const columnId = view?.groupBy?.columnId;

            if (!columnId) return '';

            const column = props.schema.columns.find(item => item.id === columnId);

            if (!column) return '';

            // 分组后， undefined会变成字符串的"undefined"， 这里需要注意转换一下。
            return Object.keys(groupValuesRef.value).map((key) => {
                const values = groupValuesRef.value[key];

                return (
                    <div class="group" key={key}>
                        <div class="groupHeader">
                            <div class="groupHeaderTitle h-full flex items-center gap-2 flex-nowrap">
                                <div class="flex-1 flex items-center truncate gap-2 flex-nowrap">
                                    {
                                        (key === 'undefined' || !`${key}`?.length) ? (
                                            <span class="text-xs lightText">{i18next.t('collection.emptyPlaceholder')}</span>
                                        ) : (
                                            <FieldValue value={values[0]?.[columnId]} column={column} />
                                        )
                                    }
                                </div>
                                <div class="text-xs lightText">
                                    {i18next.t('collection.recordsCount', { 
                                        count: `<span style="margin: 0 4px;">${values.length}</span>` 
                                    })}
                                </div>
                            </div>
                        </div>
                        <div class="groupBody">
                            {renderValues(values)}
                        </div>
                    </div>
                );
            });
        }

        return () => {
            const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

            return (
                <div class="container">
                    <ScrollView contentClass="relative">
                        {
                            view?.groupBy ? renderGroups() : (
                                renderValues(props.values || [])
                            )
                        }
                    </ScrollView>
                    
                    <div>
                        <div class="footer">
                            <TextButton class="addRowBtn" onClick={handleAddRow}>
                                <div class="flex items-center gap-1">
                                    <Plus width="16px" height="16px" color={themeTokens.lightTextColor()} />
                                    <span class="addRowBtnText">{i18next.t('collection.addRow')}</span>
                                </div>
                            </TextButton>
                        </div>
                    </div>
                </div>
            );
        };
    }
})
</script>

<style scoped>
.contentWrap {
    min-width: 800px;
    gap: 20px;
}

.footer {
    display: flex;
    align-items: center;
    height: 36px;
    line-height: 36px;
}

.addRowBtnText {
    opacity: 0;
    transition: opacity .1s linear;
}

.addRowBtn:hover .addRowBtnText {
    opacity: 1;
}

.group {
    padding-bottom: 24px;
    border-bottom: 1px solid var(--default-border-color);
}

.groupHeader {
    padding: 24px 0;
}
</style>