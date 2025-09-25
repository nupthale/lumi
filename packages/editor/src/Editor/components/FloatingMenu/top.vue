<!-- 在table、columns场景下， 如果hover到table、columns的时候， 始终显示的floatingmenu， 与block的floating menu不共用，会出现同时显示的情况 -->
<script lang="tsx">
import { defineComponent, Teleport, ref, shallowRef, watchEffect, nextTick, computed } from 'vue';
import { switchMap, tap, filter } from 'rxjs/operators';
import { useSubscription } from '@vueuse/rxjs';
import domAlign from 'dom-align';
import { GripVertical, Plus } from 'lucide';
import { Popover } from 'ant-design-vue';

import { BaseBlockView } from '../../plugins/nodes/_common/baseBlockView';
import LucideIcon from '../LucideIcon/index.vue';

import Menu from './Menu/index.vue';
import EmptyMenu from './EmptyMenu/index.vue';
import { CommandEnum } from '../../interface';
import { blockMouseEnterTop$, blockMouseLeaveTop$, docScroll$, updateBlockDrag$ } from '../../event';
import { getNodeViewIcon } from '../../shared/icon';
import { isAncestor } from '../../shared/index';

import { renderCommand } from '../Commands/index';

export default defineComponent({
    setup() {
        const visibleRef = ref(false);
        const targetRef = ref<HTMLElement | null>(null);
        const offsetYRef = ref(0);
        const crtNodeViewRef = shallowRef<BaseBlockView | null>(null);

        const cancelTimerIds = ref<number[]>([]);
        const sourceRef = ref<HTMLElement | null>(null);

        const commandsRef = ref<CommandEnum>([]);

        const nodeIconRef = computed(() => {
            const nodeView = crtNodeViewRef.value;
            
            if (nodeView?.isEmpty) {
                return Plus;
            }

            return getNodeViewIcon(nodeView as BaseBlockView);
        });

        const hide = (delay: number = 400) => {
            const timerId = setTimeout(() => {
                visibleRef.value = false;
            }, delay);

            cancelTimerIds.value.push(timerId);
        }

        const cancelHide = () => {
            if (!cancelTimerIds.value?.length) return;

            cancelTimerIds.value.forEach(timerId => {
                clearTimeout(timerId);
            });

            cancelTimerIds.value = [];
        }

        const layout = (isInit = true) => {
            const $source = sourceRef.value;

            if (!$source || !targetRef.value) return;

            // 只有显示的时候， 才添加 transition
            if (!isInit) {
                $source.classList.add('overlay-transition');
            }
            
            domAlign(
                $source,
                targetRef.value,
                {
                    points: ['tl', 'tl'], 
                    offset: [-48, offsetYRef.value], 
                    overflow: { adjustX: false, adjustY: false }, 
                    useCssTransform: true,
                }
            );

            updateDrag();
        }

        useSubscription(
            blockMouseEnterTop$.pipe(
                tap(({ nodeView, offsetY, commands }) => {
                    crtNodeViewRef.value = nodeView;

                    targetRef.value = nodeView.dom as HTMLElement;
                    offsetYRef.value = offsetY || 0;

                    commandsRef.value = commands || [];

                    cancelHide();
                }),
                switchMap(async () => {
                    const isVisible = visibleRef.value;
                    
                    // 没展示到展示的话， 通过handleShow处理
                    if (!isVisible) {
                        visibleRef.value = true;
                        return;
                    }

                    // 展示的话， 这里处理
                    visibleRef.value = true;
                    layout(false);
                }),
            ).subscribe()
        );

        useSubscription(
            blockMouseLeaveTop$.pipe(
                switchMap(async ({ delay }) => {
                    hide(delay);
                }),
            ).subscribe(),
        );

        useSubscription(
            docScroll$.pipe(
                filter(() => visibleRef.value),
                switchMap(async () => {
                    layout();
                }),
            ).subscribe(),
        );

        watchEffect(() => {
            if (visibleRef.value) {
                nextTick(() => {
                    // DOM已经挂载，执行需要的操作
                    layout(true);
                });
            }
        });

        const updateDrag = () => {
            setTimeout(() => {
                if (crtNodeViewRef.value && sourceRef.value) {
                    updateBlockDrag$.next({
                        nodeView: crtNodeViewRef.value,
                        drag: sourceRef.value,
                    });
                }
            }, 200);
        }

        const handleMounseenter = () => {
            updateDrag();

            cancelHide();
        }

        const handleTransitionEnd = () => {
            sourceRef.value?.classList.remove('overlay-transition');
        };

        const renderContent = () => {
            const nodeView = crtNodeViewRef.value as BaseBlockView;

            if (!nodeView) return '';
            const type = nodeView.node.type.name;

            return (<Menu nodeView={nodeView} />);
        }

        return () => visibleRef.value ? (
            <Teleport to={document.body}>
                <div ref={sourceRef} class="topFloatingMenu fixed flex items-center" onTransitionend={handleTransitionEnd} onMouseenter={handleMounseenter}>
                    <Popover title="" placement="left" overlayClassName="actionDragTop-popover" onOpenChange={() => cancelHide()}>
                        {{
                            default: () => (
                                <div class={['actionDragTop', 'flex', 'items-center', 'justify-between']}>
                                    <LucideIcon icon={GripVertical} width={14} color="#8f959e"></LucideIcon>
                                    <span class="inline-flex items-center justify-center w-[24px] h-[24px]">
                                        <LucideIcon icon={nodeIconRef.value} width={14} color="#336FFF"></LucideIcon>
                                    </span>
                                </div>
                            ),
                            content: () => renderContent(),
                        }}
                    </Popover>

                    {
                        commandsRef.value?.length ? (
                            <div class="ml-1.5 commands">
                                {
                                    commandsRef.value.map(command => {
                                        return renderCommand({
                                            showText: true,
                                            command,
                                            iconSize: 16,
                                            crtNodeViewRef,
                                        });
                                    })
                                }
                            </div>
                        ) : ''
                    }
                </div>
                
                
            </Teleport>
        ) : '';
    }
});
</script>

<style>
.actionDragTop-popover .ant-popover-arrow {
    display: none !important;
}
</style>

<style scoped>
.topFloatingMenu {
    position: fixed;
    z-index: 100;
    user-select: none;
}

.actionDragTop {
    width: 42px;
    height: 26px;
    padding: 1px;
    border-radius: 6px;
    background: var(--bg-float-2);
    border: 1px solid var(--float-border-color);
}

.actionDragTop:hover {
    background: var(--float-bg-hover);
}

.commands {
    display: flex;
    align-items: center;

    height: 26px;
    padding: 1px 8px;
    border-radius: 6px;
    background: var(--bg-float-2);
    border: 1px solid var(--float-border-color);
}

.menuItem {
    cursor: pointer;
    user-select: none;

    display: flex;
    align-items: center;
    justify-content: center;
    /* width: 16px; */
    height: 16px;
    border-radius: 4px;
    color: var(--text-color);

    margin-left: 12px;
}

.menuItem:first-of-type {
    margin-left: 0;
}

.menuItem:hover {
    color: #336FFF;
}
</style>