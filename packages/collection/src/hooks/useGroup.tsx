
import { ref, watchEffect, Ref } from 'vue';
import { groupBy } from 'lodash-es';

import { CollectionSchemaType, ColumnTypeEnum, FileType } from '@collection/interface';

export const useGroup = (schema: Ref<CollectionSchemaType | undefined>, values: Ref<Record<string, any>[] | undefined>) => {
    const groupValuesRef = ref<Record<string, any[]>>({});

    const getGroupValues = () => {
        const view = schema.value?.views.find(view => view.id === schema.value?.viewId);

        if (!view?.groupBy) return {};

        const groupColumnId = view.groupBy.columnId;
        const groupColumn = schema.value?.columns.find(item => item.id === groupColumnId);

        if (!groupColumn) {
            return {
                'undefined': values.value || [],
            };
        }

        if (groupColumn.type === ColumnTypeEnum.IMAGE) {
            return groupBy(values.value, (row) => {
                const val = row[groupColumnId];
                if (!val?.length) return 'undefined';

                // 按照文件名数组拼接字符串分组
                return val.map((item: FileType) => item.name).join(',');
            });
        }

        return groupBy(values.value, view?.groupBy.columnId);
    };

    watchEffect(() => {
        groupValuesRef.value = getGroupValues();
    });

    return {
        groupValuesRef,
    };
}