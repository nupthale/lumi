<script lang="tsx">
import { defineComponent, inject, ref, watch } from 'vue';
import { isNil } from 'lodash-es';
import { useEventListener } from '@vueuse/core';
import { useSubscription } from '@vueuse/rxjs';
import { tap, filter } from 'rxjs/operators';

import { getCellId } from '@collection/shared/cell';
import { activeCell$, collectionSizeUpdate$, updateSelectionValue$ } from '@collection/events';

import { closest } from '@collection/shared/element';

import { useContextStore } from '@collection/store/index';

import { useExpand } from './useExpand';

export default defineComponent({
    setup() {
        const id = inject<string>('id')!;

        const activeCell = ref<{ id: string, groupKey?: string, rowId: string, columnId: string } | null>(null);
        const containerRef = ref();

        const activeRectRef = ref();
        const expandRowRect = ref();
        const selectionRect = ref();
        const expandIndicator = ref();

        const { contextStore } = useContextStore();

        const { clearExpand, endRowId, endGroupKey, direction } = useExpand(
            activeRectRef,
            containerRef, 
            expandIndicator,
            selectionRect,
            expandRowRect,
            () => updateExpandRowRect(),
            (selectedRowIds) => {
                // selectionRect
                updateSelectionRect();

                if (selectedRowIds.length <= 1) {
                    return;
                }
                
                updateSelectionValue$.next({
                    id,
                    rowIds: selectedRowIds,
                    refCell: {
                        columnId: activeCell.value?.columnId!,
                        rowId: activeCell.value?.rowId!,
                    } 
                });
            }
        );

        const updateExpandIndicator = (hasSelection: boolean = false) => {
            if (!expandIndicator.value) return;

            const containerRect = containerRef.value.getBoundingClientRect();
            

            if (!hasSelection) {
                const { top, left, width, height } = activeRectRef.value.getBoundingClientRect();

                // 放到activeRect的右下角
                expandIndicator.value.style.top = top - containerRect.top + height - 6 + 'px';
                expandIndicator.value.style.left = left - containerRect.left + width - 6 + 'px';
            } else {
                const { top, left, width, height } = selectionRect.value.getBoundingClientRect();

                // 放到selectionRect的右下角
                expandIndicator.value.style.top = 
                    direction.value === 'down' ? top - containerRect.top + height - 6 + 'px' : 
                    top - containerRect.top - 6 + 'px';
                expandIndicator.value.style.left = left - containerRect.left + width - 6 + 'px';
            }
        }

        useEventListener(document, 'click', (e) => {
            if (e.target && (e.target as HTMLElement).closest?.('.ant-select-dropdown')) {
                return;
            }

            if (e.target && (e.target as HTMLElement).closest?.('.zsui-collection')) {
                return;
            }

            if (closest(e.target, '.ant-picker-date-panel')) {
                return;
            }

            activeCell$.next(null);
            clearExpand();
        });

        const updateActiveRect = () => {
            if (!activeCell.value) return;

            const cellEl$ = document.getElementById(getCellId(activeCell.value?.id, activeCell.value?.rowId, activeCell.value?.columnId, activeCell.value?.groupKey));

            if (!cellEl$) return;

            const containerRect = containerRef.value.getBoundingClientRect();

            const { top, left, width, height } = cellEl$.getBoundingClientRect();

            activeRectRef.value.style.width = width + 'px';
            // 高度加2是上下的border
            activeRectRef.value.style.height = height + 2 + 'px';
            activeRectRef.value.style.top = top - containerRect.top - 1 + 'px';
            activeRectRef.value.style.left = left - containerRect.left + 'px';
        }

        const updateExpandRowRect = () => {
            if (!activeCell.value || isNil(endRowId.value) || !expandRowRect.value) return;

            const startId = getCellId(id, activeCell.value.rowId, activeCell.value.columnId, activeCell.value?.groupKey);
            const endId = getCellId(id, endRowId.value, activeCell.value.columnId, endGroupKey.value || undefined);

            const startEl = document.getElementById(startId);
            const endEl = document.getElementById(endId);            

            if (!startEl || !endEl) return;

            const containerRect = containerRef.value.getBoundingClientRect();
            const { width: startWidth, height: startHeight, top: startTop, left } = startEl.getBoundingClientRect();
            const { top: endTop, height: endHeight } = endEl.getBoundingClientRect();

            expandRowRect.value.style.display = 'block';
            expandRowRect.value.style.width = startWidth + 'px';
            const selectionHeight = 
                endTop > startTop ? endTop + endHeight - (startTop + startHeight) :
                (startTop - endTop);
            expandRowRect.value.style.height = selectionHeight + 'px';

            const selectionTop = endTop > startTop ? (startTop + startHeight) - containerRect.top : endTop - containerRect.top;
            const selectionLeft = left - containerRect.left;
            expandRowRect.value.style.top = selectionTop + 'px';
            expandRowRect.value.style.left = selectionLeft + 'px';

            expandRowRect.value.style.transformOrigin = endTop > startTop ? 'top left' : 'bottom left';
        }

        const updateSelectionRect = () => {
            if (!activeCell.value || isNil(endRowId.value) || !expandRowRect.value || !selectionRect.value) return;

            selectionRect.value.style.display = 'block';
            selectionRect.value.style.width = expandRowRect.value.style.width;
            // 1是border宽度
            selectionRect.value.style.height = expandRowRect.value.style.height;
            selectionRect.value.style.top = expandRowRect.value.style.top;
            selectionRect.value.style.left = expandRowRect.value.style.left;

            if (direction.value === 'down') {
                selectionRect.value.style.borderTopWidth = 0;
                selectionRect.value.style.borderBottomWidth = '2px';

                updateExpandIndicator(true);
            } else if (direction.value === 'up') {
                selectionRect.value.style.borderTopWidth = '2px';
                selectionRect.value.style.borderBottomWidth = '0';

                updateExpandIndicator(true);
            } else {
                selectionRect.value.style.borderTopWidth = 0;
                selectionRect.value.style.borderBottomWidth = 0;
            }
        }

        useSubscription(
            activeCell$.pipe(
                tap((params) => {
                    contextStore.getState().setActiveCell(params);
                    clearExpand();

                    if (!params) {
                        containerRef.value.style.display = 'none';
                    } else {
                        containerRef.value.style.display = 'block';

                        const { id, rowId, columnId } = params;

                        if (!activeRectRef.value) return;

                        activeCell.value = {
                            id,
                            rowId,
                            columnId,
                            groupKey: params.groupKey,
                        };
                        
                        updateActiveRect();
                        updateExpandIndicator(false);
                    }
                })
            ).subscribe()
        )

        useSubscription(
            collectionSizeUpdate$.pipe(
                filter((params) => params.id === id),
                tap(() => {
                    updateActiveRect();
                    updateExpandRowRect();
                    updateSelectionRect();
                })
            ).subscribe()
        )

        return () => (
            <div class="container absolute top-0 left-0" ref={containerRef}>
                <div class="activeRect" ref={activeRectRef}></div>
                <div class="expandRowRect" ref={expandRowRect}></div>
                <div class="selectionRect" ref={selectionRect}></div>
                <div class="expandIndicator" ref={expandIndicator}></div>
            </div>
        )
    }
})
</script>

<style scoped>
.container {
    display: none;
}

.activeRect {
    position: absolute;
    border: 2px solid var(--selection-border-color);
    user-select: none;
    pointer-events: none;
}

.selectionRect {
    position: absolute;
    user-select: none;
    pointer-events: none;
    background: #215fca2e;
    transition: height .02s;
    border: 2px solid var(--selection-border-color);
}

.expandRowRect {
    position: absolute;
    user-select: none;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.04);
    background: #76a4f22e;
    transition: height .02s;
}

.expandIndicator {
    position: absolute;
    cursor: crosshair;
    width: 10px;
    height: 10px;
    border: 1px solid var(--selection-border-color);
    background: #fff;
    transition: top .02s;
}
</style>