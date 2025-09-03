import { computed } from "vue"
import type { Ref } from 'vue';

import { CollectionSchemaType } from "@collection/interface"

export const useSchema = (schemaRef: Ref<CollectionSchemaType | undefined>) => {
    const gridWidth = computed(() => {
        const schema = schemaRef.value;
        const columns = schema?.columns || [];
        const columnsWidth = columns.reduce((acc, cur) => {
            return acc + (cur.width || 0);
        }, 0);

        return columnsWidth;
    });

    return {
        gridWidth,
    };
}