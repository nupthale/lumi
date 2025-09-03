import { useEventListener } from '@vueuse/core';
import { throttle } from 'lodash-es';

import type { Ref } from 'vue';
import { ref } from 'vue';

export const useExpand = (
    activeRectRef: Ref<HTMLElement>,
    containerRef: Ref<HTMLElement>,
    expandIndicator: Ref<HTMLElement>,
    selectionRect: Ref<HTMLElement>,
    expandRowRect: Ref<HTMLElement>,
    onUpdate: () => void,
    onEnd: (selectedRowIds: string[]) => void,
) => {
    const isExpanding = ref(false);

    const startTop = ref();
    const selectedRowIds = ref<string[]>([])

    const endGroupKey = ref<string | null>(null);
    const endRowId = ref<string | null>(null);
    const direction = ref<'up' | 'down' | undefined>();

    useEventListener(expandIndicator, 'mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();

        // 如果已经存在selection， 不再处理， 必须再点击其他cell， 触发clear后，再选择
        if (direction.value) {
            isExpanding.value = false;
            return;
        }

        isExpanding.value = true;
        startTop.value = e.clientY;
    });

    const handleMousemove = (e) => {
        if (!isExpanding.value || !containerRef.value) return;

        // 根据endY找endIndex
        const parent = containerRef.value.parentElement;
        const rows = parent?.querySelectorAll('.row')!;

        if (!rows?.length) return;

        direction.value = e.clientY > startTop.value ? 'down' : 'up';

        let endId;
        let groupKey;
        let endRowTop = 0;
        const { top: activeRectTop } = activeRectRef.value.getBoundingClientRect();
        
        for (let i = 0; i < rows?.length; i++) {
            const row = rows[i];
            const { top } = row.getBoundingClientRect();
            
            if (top < e.clientY) {
                groupKey = row.getAttribute('data-group');
                endId = row.getAttribute('data-id');
                endRowTop = top;
            } else {
                break;
            }
        }

        let rowIds = [];
        let startY = Math.min(endRowTop, activeRectTop);
        let endY = Math.max(endRowTop, activeRectTop);

        for (let i = 0; i < rows?.length; i++) {
            const row = rows[i];
            const { top } = row.getBoundingClientRect();

            if (top <= endY && top >= startY) {
                rowIds.push(row.getAttribute('data-id') as string);
            }
        }
 
        selectedRowIds.value = rowIds || [];
        endGroupKey.value = groupKey ?? null;
        endRowId.value = endId ?? null;

        onUpdate();
    };

    useEventListener(document.body, 'mousemove', throttle(handleMousemove, 100));

    useEventListener(document.body, 'mouseup', (e) => {
        e.preventDefault();
        e.stopPropagation();

        isExpanding.value = false;

        onEnd(selectedRowIds.value);
    });

    const clearExpand = () => {
        isExpanding.value = false;
        endGroupKey.value = null;
        endRowId.value = null;
        direction.value = undefined;
        selectedRowIds.value = [];

        if (selectionRect.value) {
            selectionRect.value.style.width = '0';
            selectionRect.value.style.height = '0';
            selectionRect.value.style.display = 'none';
        }

        if (expandRowRect.value) {
            expandRowRect.value.style.display = 'none';
        }
    }

    return {
        endRowId,
        endGroupKey,
        direction,
        isExpanding,
        clearExpand,
    };
}