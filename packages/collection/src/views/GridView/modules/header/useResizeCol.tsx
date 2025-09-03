

import { ref, inject } from 'vue';
import { isNil } from 'lodash-es';
import { useEventListener } from '@vueuse/core';

import { CollectionSchemaType } from '@collection/interface';
import { updateColumnWidth$ } from '@collection/events';

export const useResizeCol = (
    schema?: CollectionSchemaType,
) => {
    const id = inject<string>('id')!;

    const isResizing = ref(false);

    const resizeColIndex = ref<number | null>(null);

    const lastX = ref<number | null>(null);

    const handleMousedown = (e, index: number) => {
        e.stopPropagation();
        e.preventDefault();

        isResizing.value = true;
        resizeColIndex.value = index;

        lastX.value = e.clientX;
    }

    useEventListener(document.body, 'mousemove', (e) => {
        if (!isResizing.value || isNil(resizeColIndex.value) || isNil(lastX.value) || !schema) return;

        e.stopPropagation();
        e.preventDefault();

        const column = schema.columns[resizeColIndex.value];
        const deltaX = e.clientX - lastX.value;
        const newWidth = column.width + deltaX;

        updateColumnWidth$.next({
            id,
            columnId: column.id,
            // 最小100宽度
            width: Math.max(newWidth, 100),
        })

        lastX.value = e.clientX;

    });

    useEventListener(document.body, 'mouseup', () => {
        isResizing.value = false;
        resizeColIndex.value = null;

        lastX.value = null;
    });


    return {
        resizeColIndex,
        isResizing,
        handleMousedown
    };
}