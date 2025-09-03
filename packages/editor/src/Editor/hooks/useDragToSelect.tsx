import { SelectionRange } from 'prosemirror-state';
import { ref, onMounted, onUnmounted, Ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';
import { getRangeByNode } from '../shared';

import { contextStore } from '@editor/Editor/store/context';
import { MultiBlockSelection } from '../plugins/selection/multiBlock';
import { docScroll$ } from '../event';

import { isInIgnoreEventList } from '@editor/Editor/shared/event';

export const useDragToSelect = (editorDomRef: Ref<HTMLElement | null>) => {
    const scrollTopRef = ref(0);
    const lastScrollTopRef = ref(0);

    const selectionRectRef = ref<HTMLElement | null>(null);

    const isSelecting = ref(false);
    const lastPos = ref<{ x: number, y: number }>({ x: 0, y: 0 });
    const startXRef = ref(0);
    const startYRef = ref(0);
    const startScrollTop = ref(0);

    const hasSelectRanges = ref(false);

    const selectBlock = (yRange: [number, number]) => {
        const view = contextStore.getState().editorView;
        
        if (!view) {
            return;
        }

        const state = view.state;
        const tr = state.tr;
        const doc = state.doc;
        const body = doc.lastChild;

        if (!body) return;

        let ranges: SelectionRange[] = [];

        body.children.forEach(node => {
            const [from, to] = getRangeByNode(state, node);

            const el = document.querySelector(`[data-id="${node.attrs.id}"]`) as HTMLElement;

            if (!el) {
                return;
            }

            const rect = el.getBoundingClientRect();
            const threshold = 2;

            if (rect.top + scrollTopRef.value >= yRange[0] - threshold && rect.top + scrollTopRef.value + rect.height <= yRange[1] + threshold) {
                console.info('#nodes', node.type.name, from, to);
                ranges.push(
                    new SelectionRange(
                        doc.resolve(from),
                        doc.resolve(to)
                    )
                );
            }
        });

        hasSelectRanges.value = Boolean(ranges?.length);

        if (!ranges?.length) {
            return;
        }

        tr.setSelection(
            new MultiBlockSelection(ranges),
        );
        view.dispatch(tr);
        view.focus();
    }

    const resetSelectionEl = (e) => {
        if (!selectionRectRef.value) {
            return;
        }

        const el = selectionRectRef.value;
        el.style.zIndex = '1000';
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.width = '0px';
        el.style.height = '0px';
        el.style.opacity = '0';
        el.style.backgroundColor = 'var(--selection-bg)';
        el.style.border = '1px solid var(--selection-border-color)';
        el.style.borderRadius = '4px';
        el.style.pointerEvents = 'none';
        el.style.userSelect = 'none';
    }

    const handleMousedown = (e) => {
        if (!selectionRectRef.value) {
            return;
        }

        // 只有e.clientX在[0, editorDomRef.clientX]的范围内才有效
        const { left } = editorDomRef.value?.getBoundingClientRect() || {};
        if (e.clientX < 0 || e.clientX > (left || 0)) {
            return;
        }

        // 如果在编辑器内部， 忽略
        if (isInIgnoreEventList(e)) {
            return;
        }

        const view = contextStore.getState().editorView;
        
        if (!view) {
            return;
        }

        // 设置所有node的样式userSelect none
        // 利用 CSS 继承特性，只需要在 body 上设置
        document.body.classList.add('blockSelecting');

        // 失去焦点
        view.dom.blur();

        resetSelectionEl(e);

        hasSelectRanges.value = false;
        isSelecting.value = true;

        lastPos.value = {
            x: e.clientX,
            y: e.clientY,
        };

        startXRef.value = e.clientX;
        startYRef.value = e.clientY;
        startScrollTop.value = scrollTopRef.value
    }

    const handleMousemove = (e) => {
        if (!selectionRectRef.value || !isSelecting.value) {
            return;
        }

        e.stopPropagation();

        const el = selectionRectRef.value;

        el.style.opacity = '1';
        el.style.width = `${e.clientX - startXRef.value}px`;
        el.style.height = `${(e.clientY + scrollTopRef.value) - (startYRef.value + startScrollTop.value)}px`;

        lastPos.value = {
            x: e.clientX,
            y: e.clientY,
        };

        const startY = Math.min(startYRef.value + startScrollTop.value, e.clientY + scrollTopRef.value);
        const endY = Math.max(startYRef.value + startScrollTop.value, e.clientY + scrollTopRef.value);

        selectBlock([startY, endY]);

        const scrollEl = contextStore.getState().scrollEl;
        // 如果触到屏幕底部， 需要滚动
        if (endY + 10 >= scrollTopRef.value + window.innerHeight && scrollEl) {
            scrollEl.scrollTop = scrollTopRef.value + 10;
        }
    }

    const handleMouseup = (e) => {
        if (isSelecting.value && hasSelectRanges.value) {
            e.stopPropagation();
        }
        
        // 恢复 body 的 userSelect 样式，子元素会自动继承
        document.body.classList.remove('blockSelecting');

        resetSelectionEl(e);
        isSelecting.value = false;
    }

    useSubscription(
        docScroll$.pipe(
            tap(({ e }) => {
                if (e.target) {
                    scrollTopRef.value = (e.target as HTMLElement).scrollTop || 0;

                    if (!selectionRectRef.value) {
                        return;
                    }
            
                    const el = selectionRectRef.value;     

                    const delta = scrollTopRef.value - lastScrollTopRef.value;
                    el.style.top = Number(el.style.top.replace('px', '')) - delta + 'px'; 
                    
                    lastScrollTopRef.value = scrollTopRef.value;
                }
            })
        ).subscribe(),
    );

    onMounted(() => {
        document.addEventListener('mousedown', handleMousedown);
        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup, true);         
    });

    onUnmounted(() => {
        document.removeEventListener('mousedown', handleMousedown);
        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup, true);
    });

    return {
        selectionRectRef,
    };
}
