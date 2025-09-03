import { computed, Ref } from 'vue';

import { CollectionSchemaType, ColumnTypeEnum } from '@collection/interface';

export const useCard = (schemaRef: Ref<CollectionSchemaType | undefined>) => {
    const titleColumnId = computed(() => {
        if (!schemaRef.value) {
            return;
        }

        const view = schemaRef.value?.views.find(view => view.id === schemaRef.value?.viewId);
        if (view?.cardConfig?.titleColumnId) {
            return view.cardConfig.titleColumnId;
        }

        const columns = schemaRef.value?.columns || [];
        // 如果没设置， 就默认取第一个text
        const titleColumn = columns.find((column) => column.type === ColumnTypeEnum.TEXT);
         
        if (!titleColumn) return '';

        return titleColumn.id;
    });

    const coverColumnId = computed(() => {
        if (!schemaRef.value) {
            return;
        }

        const view = schemaRef.value?.views.find(view => view.id === schemaRef.value?.viewId);
        if (view?.cardConfig?.coverColumnId) {
            return view.cardConfig.coverColumnId;
        }

        const columns = schemaRef.value?.columns || [];
        const coverColumn = columns.find((column) => column.type === ColumnTypeEnum.IMAGE);
         
        if (!coverColumn) return '';

        return coverColumn.id;
    });

    const tagColumn = computed(() => {
        if (!schemaRef.value) {
            return;
        }

        const columns = schemaRef.value?.columns || [];
        const view = schemaRef.value?.views.find(view => view.id === schemaRef.value?.viewId);
        if (view?.cardConfig?.tagColumnId) {
            const columnId = view.cardConfig.tagColumnId;

            return columns.find((column) => column.id === columnId);
        }

       
        return columns.find((column) => column.type === ColumnTypeEnum.SELECT);
    });

    return {
        coverColumnId,
        titleColumnId,
        tagColumn,
    };
}