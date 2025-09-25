<script lang="tsx">
import { PropType } from 'vue';
import { defineComponent, ref, nextTick, Teleport } from 'vue';
import { tap, filter, debounceTime } from 'rxjs/operators';
import { useSubscription,  } from '@vueuse/rxjs';
import { computePosition, offset, autoUpdate, flip, inline, size, Placement } from '@floating-ui/dom';
import { showPopover$, hidePopover$, docScroll$ } from '../../event';
import { PopoverTypeEnum } from '../../interface';
import { useContextStore } from '../../store/context';

export default defineComponent({
    props: {
        type: String as PropType<PopoverTypeEnum>,
        contentBorder: {
            type: Boolean,
            default: true,
        },
        contentClass: String,
    },
    setup(props, { slots }) {
        const { state, setPopoverVisible } = useContextStore();

        const rangeRef = ref<[number, number] | undefined>(undefined);
        const customTargetRef = ref<HTMLElement | undefined>(undefined);
        const offsetRef = ref<[number | string, number | string]>([0, 0]); // x, y of
        const placementRef = ref<Placement>('top');
        const useMaxHeightRef = ref(true);

        const sourceRef = ref<HTMLElement | null>(null);
        const targetRef = ref<HTMLElement | null>(null);

        const autoUpdateCleanUpRef = ref<() => void | undefined>();

        const hide = (delay = 0) => {
            setTimeout(() => {
                setPopoverVisible(props.type!, false);

                autoUpdateCleanUpRef.value?.();
            }, delay);
        }

        const updatePosition = (source: HTMLElement, target: HTMLElement) => {
            if (!target) return;

            if (autoUpdateCleanUpRef.value) {
                autoUpdateCleanUpRef.value();
            }

            autoUpdateCleanUpRef.value = autoUpdate(target, source, () => {
                computePosition(target, source, {
                    strategy: 'fixed',
                    placement: placementRef.value,
                    middleware: [
                        offset({
                            mainAxis: offsetRef.value[1] as number,
                            crossAxis: offsetRef.value[0] as number,
                        }),
                        flip(),
                        inline(),
                        size({
                            apply({ availableHeight, elements }) {
                                // Change styles, e.g.
                                if (useMaxHeightRef.value) {
                                    Object.assign(elements.floating.style, {
                                        maxHeight: `${Math.max(0, availableHeight)}px`,
                                        overflow: 'hidden',
                                    });
                                }
                            },
                            padding: 10,
                            rootBoundary: {
                                x: 0,
                                y: 0,
                                width: document.documentElement.clientWidth - 100,
                                height: document.documentElement.clientHeight - 100,
                            },
                        }),
                    ],
                }).then(({ x, y }) => {
                    if (!source) return;

                    Object.assign(source.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                    });
                })
            }, {
                ancestorScroll: false,
                ancestorResize: true,
                elementResize: true,
                layoutShift: false,
                animationFrame: false,
            });   
        }

        const layoutByRange = () => {
            const editorView = state.value?.editorView;
            if (!editorView || !rangeRef.value || !targetRef.value) return;

            const [, to] = rangeRef.value;
    
            const endCoords = editorView.coordsAtPos(to);

            // 计算选区边界
            const left = Math.min(endCoords.left, endCoords.left);
            const right = Math.max(endCoords.right, endCoords.right);
            const top = Math.min(endCoords.top, endCoords.top);
            const bottom = Math.max(endCoords.bottom, endCoords.bottom);
            
            // 获取行高
            const domFrom = editorView.domAtPos(to);
            const startNode = domFrom.node.nodeType === Node.TEXT_NODE ? domFrom.node.parentElement : domFrom.node;
            let height = bottom - top;
            
            if (startNode) {
                const computedStyle = window.getComputedStyle(startNode as Element);
                height = parseFloat(computedStyle.lineHeight);
            }
            
            targetRef.value.style.left = `${left}px`;
            targetRef.value.style.top = `${top - ((height - (bottom - top)) / 2)}px`;
            targetRef.value.style.width = `2px`;
            targetRef.value.style.height = `${height}px`;

            nextTick(() => {
                const $source = sourceRef.value;
            
                if (!$source || !targetRef.value) return;
                
                updatePosition($source, targetRef.value);
            });   
        }

        const layoutByTarget = () => {
            const target = customTargetRef.value;
            if (!target) return;

            nextTick(() => {
                const $source = sourceRef.value;
            
                if (!$source) return;
                
                updatePosition($source, target);
            });  
        }

        useSubscription(
            docScroll$.pipe(
                filter(() => state.value?.popovers[props.type!]),
                tap(() => {
                    if (rangeRef.value) {
                        layoutByRange();
                    }

                    if (customTargetRef.value) {
                        layoutByTarget();
                    }
                }),
            ).subscribe()
        );

        useSubscription(
            showPopover$.pipe(
                debounceTime(300),
                filter(({ type }) => type === props.type),
                tap(({ range, target, offset, placement, useMaxHeight }) => {
                    const editorView = state.value?.editorView;
                    if (!editorView) return;

                    setPopoverVisible(props.type!, true);

                    placementRef.value = placement || 'top';
                    useMaxHeightRef.value = useMaxHeight ?? true;
                    rangeRef.value = range;
                    customTargetRef.value = target;
                    offsetRef.value = offset || [0, 4];

                    if (range) {
                        layoutByRange();
                    }

                    if (target) {
                        layoutByTarget();
                    }
                }),
            ).subscribe()
        );

        useSubscription(
            hidePopover$.pipe(
                filter(({ type }) => type === props.type),
                tap(({ delay }) => {
                    hide(delay);
                }),
            ).subscribe(),
        );

        return () => (
            <Teleport to={document.body}>
                <div>
                    <div ref={targetRef} class="fixed"></div>
                    <div ref={sourceRef} class={['content', props.contentClass, props.contentBorder ? 'border' : '', state.value?.popovers[props.type!] ? `visible` : '']}>
                        {state.value?.popovers[props.type!] ? slots.default?.() : ''}
                    </div>
                </div>
            </Teleport>
        );
    }
});
</script>

<style scoped>
.content {
    position: fixed;
    cursor: pointer;
    z-index: 200;
    width: max-content;
    left: -9999px;
    top: -9999px;

    display: flex;
    flex-direction: column;
    background: var(--bg-float-2);
}

.content.border {
    border: 1px solid var(--float-border-color);
    border-radius: 4px;
    box-shadow: var(--overlay-shadow1);
}
</style>