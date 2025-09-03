<script lang="tsx">
import { defineComponent, PropType, ref, computed, toRef, watchEffect } from 'vue';
import { useEventListener } from '@vueuse/core';
import { groupBy } from 'lodash-es';
import { Triangle } from 'lucide-vue-next';

import { i18next } from '@collection/i18next';

import FieldValue from '@collection/components/FieldValue/index.vue';
import { CollectionSchemaType, ColumnTypeEnum, FileType } from '@collection/interface';
import { useGroup } from '@collection/hooks/useGroup';

import Values from './Values.vue';
import { themeTokens } from '@collection/shared/theme';

export default defineComponent({
    props: {
        schema: Object as PropType<CollectionSchemaType>,
        values: Array as PropType<Record<string, any>[]>,
    },
    setup(props) {
        const bodyRef = ref();

        useEventListener(bodyRef, 'click', (e) => {
            e.stopPropagation();
        });

        const { groupValuesRef } = useGroup(toRef(props, 'schema'), toRef(props, 'values'));

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
                                    <Triangle width={8} height={8} fill={themeTokens.lightTextColor()} strokeWidth={0} class="rotate-180 flex-shrink-0" />
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
                            <Values schema={props.schema} values={values} groupKey={key} />
                        </div>
                    </div>
                );
            });
        }

        return () => {
            if (!props.schema) return '';

            const view = props.schema.views.find(view => view.id === props.schema?.viewId);

            return (
                <div class="body" ref={bodyRef}>
                    {
                        view?.groupBy ? renderGroups() : (
                            <Values schema={props.schema} values={props.values || []} />
                        )
                    }
                </div>
            )
        };
    }
})
</script>

<style scoped>
.groupHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    min-height: 36px;
    padding: 6px 12px;

    border-bottom: 1px solid var(--table-border-color);
    background: var(--table-operation-line);
}

.groupHeaderTitle {
    width: 100%;
    font-size: 14px;
}

.groupHeaderTitle :deep(.text-right) {
    text-align: left!important;
}

.groupHeaderTitle :deep(.flex-wrap) {
    flex-wrap: nowrap;
}
</style>