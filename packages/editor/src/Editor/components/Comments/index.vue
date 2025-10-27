<script lang="tsx">
import { defineComponent, watch, computed, ref } from 'vue';
import { i18next } from '@editor/i18n';
import { MessageSquareText } from 'lucide-vue-next';
import { Tooltip } from 'ant-design-vue';
import { AnimatePresence, motion } from 'motion-v';
import { useEventListener } from '@vueuse/core';

import CommentPanel from './CommentPanel.vue';
import { useLayout } from './hooks/useLayout';
import { useActiveComment } from './hooks/useActiveComment';
import { useDocCommentClick } from './hooks/useDocCommentClick';
import { useScroll } from './hooks/useScroll';
import { layoutComments$ } from './event';
import { commentStore, useCommentStore } from '../../store/comment';

import Toolbar from './modules/Toolbar/index.vue';

export default defineComponent({
    setup() {
        const store = useCommentStore();
        const { state, docComments, commentsVisible } = store;

        const containerRef = ref();

        const { transformYMap, docCommentRefMap, totalHeight, layoutReady, filteredDocCommentsRef } = useLayout();
        const { offsetY, updateOffsetY } = useActiveComment(docCommentRefMap, transformYMap);

        useDocCommentClick();

        useScroll(offsetY, updateOffsetY);

        watch(() => docComments.value, () => {
            setTimeout(() => {
                layoutComments$.next();
            }, 10);
        });

        useEventListener(containerRef.value, 'mousedown', (e) => {
            e.stopPropagation();
        });

        const filteredCommentsCount = computed(() => {
            let count = 0;

            Object.keys(docComments.value).map((refId) => {
                if (filteredDocCommentsRef.value[refId]) {
                    count += docComments.value[refId]?.length || 0
                }
            });

            return count;
        });

        return () => {
            if (!commentsVisible.value) {
                return  (
                    <AnimatePresence initial={false}>
                        <motion.div 
                            class="doc-comments-collapseWrap"
                            layout
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 100 }}
                            transition={{ ease: ['linear'] }}
                        >
                            <Tooltip title={i18next.t('editor.comment.unfoldPanel')} placement='left'>
                                <div class="doc-comments-collapse" onClick={() => commentStore.getState().toggleCommentsVisible()}>
                                    <MessageSquareText width={18} />
                                </div>
                            </Tooltip>
                        </motion.div>
                    </AnimatePresence>
                );
            }

            return (
                <motion.div 
                    class="doc-comments"
                    initial={{ opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    transition={{ ease: ['linear'] }}
                    ref={containerRef}
                >
                    <div class="doc-comments_title">
                        <Toolbar fileId={store.state.value?.fileId} />
                        <div class="doc-commentTitleWrap px-3 pt-2">
                            {i18next.t('editor.commentTitle')}（{ filteredCommentsCount.value }）
                        </div>
                    </div>

                    <div 
                        class={['doc-comments_body', layoutReady.value ? 'opacity-1' : 'opacity-0']}
                        style={{
                            minHeight: `${totalHeight.value}px`,
                        }}
                    >
                        {
                            Object.keys(docComments.value).map((refId) => (
                                filteredDocCommentsRef.value[refId] ? (docComments.value[refId].map((commentId) => (
                                    <CommentPanel
                                        active={state.value?.activeDocCommentId === commentId}
                                        key={commentId} 
                                        id={commentId} 
                                        refId={refId} 
                                        top={transformYMap.value?.[commentId] - offsetY.value} 
                                    />
                                ))) : ''
                            ))
                        }
                    </div>
                </motion.div>
            );
        };
    }
});
</script>

<style scoped>
.doc-comments {
    position: absolute;
    top: 0;
    right: 0;
    min-height: 100%;
    /* background: var(--body-bg); */
    background: linear-gradient(180deg, transparent 76px, var(--body-bg) 76px, var(--body-bg) 100%);
    z-index: 10;

    width: 294px;
    padding: 0px 0 96px;
    border-left: 1px solid var(--float-border-color);
    color: var(--text-color);
}

.doc-comments_title {
    padding: 8px 0;
    position: sticky;
    top: calc(64px + 14px);
    border-bottom: 1px solid var(--float-border-color);
    font-weight: 500;
    font-size: 14px;
    background: var(--blur-bg);
    backdrop-filter: blur(4px);
    z-index: 1;
}

.doc-commentTitleWrap {
    border-top: 1px solid var(--float-border-color);
}

.doc-comments_body {
    padding: 0 12px;
}

.doc-comments-collapseWrap {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    height: 100%;
}

.doc-comments-collapse {
    position: sticky;
    top: 0px;
    right: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;

    width: 56px;
    height: 36px;
    border-radius: 18px 0px 0px 18px;
    border: 1px solid var(--table-border-color);
    background: var(--body-bg);
    margin-top: 12px;
    padding-left: 18px;
}

.doc-comments-collapse:hover {
    color: var(--primary-text-color);
    background: var(--float-bg-hover);
}
</style>