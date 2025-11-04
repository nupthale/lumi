<script lang="tsx">
import { defineComponent, ref, watch, computed, onMounted, watchEffect } from 'vue';
import { Input, Button, Dropdown, Menu } from 'ant-design-vue';
import { filter, tap, debounceTime } from 'rxjs/operators';
import { useSubscription } from '@vueuse/rxjs';
import { useElementSize } from '@vueuse/core';
import { UserAvatar, TextButton } from '@zsfe/zsui';
import { i18next } from '@editor/i18n';
import { Ellipsis, Trash2, Pencil } from 'lucide-vue-next';

import { 
    activeComment$, 
    updateCommentHeight$, 
    addCommentTransition$, 
    removeCommentTransition$,
} from './event';

import { docChanged$ } from '@editor/Editor/event';
import { useCommentStore } from '../../store/comment';
import { CommentInfoType, CommentItemType } from '../../interface';
import { isElementVisible } from '../../shared';

import CommentInput from './CommentInput.vue';

export default defineComponent({
    props: {
        id: String,
        refId: String,
        top: Number,
        active: Boolean,
    },
    setup(props) {
        const elRef = ref<HTMLElement>();
        const refText = ref();

        const editItemIdRef = ref('');

        const noTransition = ref(false);

        const { height } = useElementSize(elRef);

        const { state: commentState } = useCommentStore();

        const commentItemsRef = computed(() => {
            return commentState.value?.commentInfoMap?.[props.id!]?.comments as CommentItemType[] || [];
        });

        watch(height, (newHeight) => {
            updateCommentHeight$.next({
                id: props.id!,
                height: newHeight,
            });
        });

        useSubscription(
            addCommentTransition$.pipe(
                tap(() => noTransition.value = false),
            ).subscribe()
        );

        useSubscription(
            removeCommentTransition$.pipe(
                tap(() => noTransition.value = true),
            ).subscribe()
        );

        useSubscription(
            docChanged$.pipe(
                debounceTime(300),
                tap(() => {
                    updateRefText();
                }),
            ).subscribe(),
        );

        onMounted(() => {
            updateRefText();
        });

        const updateRefText = () => {
            if (!props.refId) return;
            // 跨段落评论， 有可能comment被切割成多个了， 所以要selectorAll
            const refDoms = document.querySelectorAll(`[data-comment-id="${props.refId}"]`);
            
            if (!refDoms) return;

            let text = '';

            refDoms.forEach(item => {
                text += item.textContent;
            });

            refText.value = text || '';
        }

        const handleCommentClick = () => {
            const refDom = document.querySelector(`[data-comment-id="${props.refId}"]`) as HTMLElement;
            if (!refDom) return;

            if (!isElementVisible(refDom)) {
                refDom.scrollIntoView({
                    block: 'center',
                });
            }
            
            addCommentTransition$.next();

            setTimeout(() => {
                activeComment$.next({
                    refId: props.refId!,
                    id: props.id,
                });
            }, 300);
        };

        const handleCancel = () => {
            commentState.value?.setActiveDocCommentId(null);
        }

        const handleSend = (text: string) => {
            commentState.value?.addCommentInfo(props.id!, text);
        }

        const handleDeleteComment = () => {
            if (!props.id) {
                return;
            }

            commentState.value?.deleteDocComment(props.id!);
        }

        const handleEditCommentItem = (comment: CommentItemType) => {
            editItemIdRef.value = comment.id;
        }

        const handleUpdateCommentItem = (commentItemId: string, content: string) => {
            commentState.value?.updateCommentItemContent(props.id!, commentItemId, content);

            editItemIdRef.value = '';
        }

        const handleDeleteCommentItem = (comment: CommentItemType) => {
            if (!props.id) {
                return;
            }

            commentState.value?.deleteDocCommentItem(props.id!, comment.id);
        }

        return () => (
            <div 
                class={['sider-comment', props.active ? 'active' : '', noTransition.value ? 'noTransition' : '']} 
                ref={elRef} 
                style={{ transform: `translate3d(0, ${props.top || 0}px, 0)`}}
                onClick={handleCommentClick}
            >
                <div class="sider-comment_head justify-between gap-2">
                    <div class="sider-comment_headTitle">
                        <div class="truncate w-[90%]">
                            {refText.value || '-'}
                        </div>
                    </div>
                    <div>
                        <Dropdown placement="bottomRight" trigger="hover">
                            {{
                                overlay: () => (
                                    <div class="container">
                                        <Menu>
                                            <Menu.Item onClick={() => handleDeleteComment()}>
                                                <div class="flex items-center gap-2">
                                                    <Trash2 size={14} />
                                                    {i18next.t('common.delete')}
                                                </div>
                                            </Menu.Item>
                                        </Menu>
                                    </div>
                                ),
                                default: () => (
                                    <TextButton>
                                        <Ellipsis size={14} />
                                    </TextButton>
                                ),
                            }}
                        </Dropdown>
                    </div>
                </div>
                <div class="sider-comment_body">
                    {
                        commentItemsRef.value?.map((comment) => (
                            <div key={comment.id} class="sider-comment-item flex items-start">
                                <UserAvatar class="mt-1.5" showText={false} username={comment.user} size="large" />
                                <div class="ml-3 flex-1">
                                    <div class="w-full flex items-center justify-between">
                                        <div class="text-xs">
                                            {comment.user} <span class="lightText">{comment.createTime}</span>
                                        </div>
                                        <div class="actions">
                                            <Dropdown placement="bottomRight" trigger="hover">
                                                {{
                                                    overlay: () => (
                                                        <div class="container">
                                                            <Menu>
                                                                <Menu.Item key={1} onClick={() => handleEditCommentItem(comment)}>
                                                                    <div class="flex items-center gap-2">
                                                                        <Pencil size={14} />
                                                                        {i18next.t('common.edit')}
                                                                    </div>
                                                                </Menu.Item>
                                                                <Menu.Item key={2} onClick={() => handleDeleteCommentItem(comment)}>
                                                                    <div class="flex items-center gap-2">
                                                                        <Trash2 size={14} />
                                                                        {i18next.t('common.delete')}
                                                                    </div>
                                                                </Menu.Item>
                                                            </Menu>
                                                        </div>
                                                    ),
                                                    default: () => (
                                                        <TextButton>
                                                            <Ellipsis size={14} />
                                                        </TextButton>
                                                    ),
                                                }}
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div class="text-sm break-all">
                                        {
                                            editItemIdRef.value === comment.id ? (
                                                <CommentInput
                                                    defaultVal={comment.content}
                                                    id={props.id}
                                                    onSend={(text) => handleUpdateCommentItem(comment.id, text)}
                                                    onCancel={() => editItemIdRef.value = ''}
                                                />
                                            ) : (<span class="whitespace-pre-wrap">{comment.content ?? '-'}</span>)
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div class="sider-comment_foot">
                    <CommentInput
                        active={props.active && !editItemIdRef.value}
                        id={props.id}
                        onSend={handleSend}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        );
    }
});
</script>

<style scoped>
.sider-comment {
    position: absolute;
    width: 270px;
    top: 0;
    line-height: 1.5;
    border-radius: 6px;
    border: 1px solid var(--float-border-color);
    opacity: 1;

    cursor: pointer;
    transition: transform .05s linear;
}

.sider-comment.noTransition {
    transition: none!important;
}

.sider-comment.active {
    box-shadow: 0 8px 16px #1f23291a;
}

.sider-comment:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -1px;
    right: -1px;
    border-top: 6px solid transparent;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

.sider-comment.active:before {
    border-top-color: #ffc60a;
}

.sider-comment_head {
    position: relative;
    display: flex;
    align-items: center;
    height: 35px;
    padding: 9px 12px 6px;
}

.sider-comment_headTitle:before {
    content: "";
    width: 2px;
    height: 16px;
    margin-right: 6px;
    background-color: #bbbfc4 !important;
    border-radius: 1px;
    flex-shrink: 0;
}

.sider-comment_headTitle {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #646a73;
    line-height: 20px;
    width: 100%;
    overflow: hidden;
}

.sider-comment-item {
    padding: 6px 12px;
    min-height: 55px;
}

.sider-comment-item .actions {
    opacity: 0;
}

.sider-comment-item:hover .actions {
    opacity: 1;
}

.sider-comment_foot {
    padding: 10px 12px 16px;
}

.sider-commentBtn {
    min-width: 48px;
    line-height: 20px;
    height: 28px;
    padding: 3px 7px;
    font-size: 12px;
    border-radius: 6px;
}
</style>