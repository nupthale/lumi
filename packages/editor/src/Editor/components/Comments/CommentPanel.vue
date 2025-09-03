<script lang="tsx">
import { defineComponent, ref, watch, computed, onMounted } from 'vue';
import { Input, Button } from 'ant-design-vue';
import { filter, tap, debounceTime } from 'rxjs/operators';
import { useSubscription } from '@vueuse/rxjs';
import { useElementSize } from '@vueuse/core';
import { UserAvatar } from '@zsfe/zsui';
import { i18next } from '@editor/i18n';

import { 
    activeComment$, 
    updateCommentHeight$, 
    focusCommentInput$, 
    addCommentTransition$, 
    removeCommentTransition$,
} from './event';

import { docChanged$ } from '@editor/Editor/event';
import { useCommentStore } from '../../store/comment';
import { CommentInfoType } from '../../interface';
import { isElementVisible } from '../../shared';

export default defineComponent({
    props: {
        id: String,
        refId: String,
        top: Number,
        active: Boolean,
    },
    setup(props) {
        const inputVal = ref<string | undefined>();
        const elRef = ref<HTMLElement>();
        const inputRef = ref<HTMLElement>();
        const refNodeObserver = ref();
        const refText = ref();

        const noTransition = ref(false);

        const { height } = useElementSize(elRef);

        const { state: commentState } = useCommentStore();

        const commentInfo = computed(() => {
            return commentState.value?.commentInfoMap?.[props.id!] as CommentInfoType || {};
        });

        watch(height, (newHeight) => {
            updateCommentHeight$.next({
                id: props.id!,
                height: newHeight,
            });
        });

        useSubscription(
            focusCommentInput$.pipe(
                filter(({ id }) => id === props.id && !!inputRef.value),
                tap(() => {
                    inputRef.value?.focus();
                }),
            ).subscribe(),
        );

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
            const refDom = document.querySelector(`[data-comment-id="${props.refId}"]`) as HTMLElement;
            
            if (!refDom) return;
            refText.value = refDom.textContent || '';
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
            inputVal.value = '';
            commentState.value?.setActiveDocCommentId(null);
        }

        const handleSend = () => {
            if (!props.id || !inputVal.value?.length) {
                return;
            }

            commentState.value?.addCommentInfo(props.id, inputVal.value);

            inputVal.value = '';
            inputRef.value?.focus();
        }

        return () => (
            <div 
                class={['sider-comment', props.active ? 'active' : '', noTransition.value ? 'noTransition' : '']} 
                ref={elRef} 
                style={{ transform: `translate3d(0, ${props.top || 0}px, 0)`}}
                onClick={handleCommentClick}
            >
                <div class="sider-comment_head">
                    <div class="sider-comment_headTitle truncate">
                        {refText.value || '-'}
                    </div>
                </div>
                <div class="sider-comment_body">
                    {
                        commentInfo.value?.comments?.map((comment) => (
                            <div key={comment.id} class="sider-comment-item flex items-start">
                                <UserAvatar class="mt-1.5" showText={false} username={comment.user} size="large" />
                                <div class="ml-3">
                                    <div class="text-xs">{comment.user} <span class="lightText">{comment.createTime}</span></div>
                                    <div class="mt-1 text-sm break-all">
                                        {comment.content || '-'}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div class="sider-comment_foot">
                    {
                        (props.active || inputVal.value?.length) ? (
                            <div>
                                <Input.TextArea
                                    ref={inputRef}
                                    autoSize={{ minRows: 1 }}
                                    placeholder={i18next.t('editor.comment.placeholder')}
                                    value={inputVal.value}
                                    onChange={(e) => {
                                        inputVal.value = e.target.value;
                                    }}
                                    onPressEnter={(e) => {
                                        e.preventDefault();
                                        handleSend();
                                    }}
                                />

                                {
                                    inputVal.value?.length? (
                                        <div class="flex items-center justify-end mt-3" onClick={e => e.stopPropagation()}>
                                            <Button class="sider-commentBtn" size="small" onClick={handleCancel}>{i18next.t('editor.comment.cancel')}</Button>
                                            <Button type="primary" size="small" class="sider-commentBtn ml-2" onClick={handleSend}>{i18next.t('editor.comment.send')}</Button>
                                        </div>
                                    ) : ''
                                }
                            </div>
                        ) : ''
                    }
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
    transition: transform .2s ease;
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

.sider-comment_head:before {
    content: "";
    width: 2px;
    height: 16px;
    margin-right: 6px;
    background-color: #bbbfc4 !important;
    border-radius: 1px;
}

.sider-comment_headTitle {
    font-size: 12px;
    color: #646a73;
    line-height: 20px;
}

.sider-comment-item {
    padding: 6px 12px;
    min-height: 55px;
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