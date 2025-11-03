import { ref, onUnmounted, computed } from 'vue';
import { createStore } from 'zustand/vanilla';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

import { syncToRemote as syncCommentToRemote } from '../plugins/collab/comment';
import { userStore } from './user';
import { CommentInfoType } from '../interface';

import { commentChanged$, commentDeleted$, commentsVisibleChange$ } from '../event';

export const commentStore = createStore<{
    fileId: string,
    // 左侧文档评论信息
    docComments: Record<string, string[]>,
    activeDocCommentId: string | null,
    // 右侧评论具体信息
    commentInfoMap: Record<string, CommentInfoType>,
    commentsVisible: boolean,
    setFileId: (fileId: string) => void,
    addCommentInfo: (id: string, content: string) => void,
    updateCommentItemContent: (commentId: string, commentItemId: string, content: string) => void,
    setComment: (comments: Record<string, string[]>, infoMap: Record<string, CommentInfoType>) => void,
    setActiveDocCommentId: (commentId: string | null) => void,
    addDocComment: (refId: string, commentId: string) => void,
    deleteDocComment: (commentId: string) => void,
    deleteDocCommentItem: (commentId: string, commentItemId: string) => void,
    toggleCommentsVisible: () => void,
}>((set) => ({
    fileId: '',
    docComments: {},
    activeDocCommentId: null,
    commentInfoMap: {},
    commentsVisible: localStorage.getItem('commentsVisible') === 'false' ? false : true,
    setActiveDocCommentId: (activeDocCommentId) => set(() => {
        return {
            activeDocCommentId,
        };
    }),
    setFileId: (fileId) => set(() => {
        return {
            fileId,
        };
    }),
    setComment: (docComments: Record<string, string[]> = {}, commentInfoMap: Record<string, CommentInfoType> = {}) => set(() => {       
        return {
            docComments,
            commentInfoMap,
        };
    }),
    addCommentInfo: (id, content) => set((state) => {
        const map = {...state.commentInfoMap }
        const comments = map[id]?.comments || [];

        const user = userStore.getState().user;

        comments.push({
            id: nanoid(8),
            content,
            user: user!.name,
            createTime: dayjs().format('YYYY-MM-DD'),
        });

        map[id] = {
            ...(map[id]),
            comments: [...comments],
        };

        syncCommentToRemote(state.fileId, state.docComments, map);

        return {
            commentInfoMap: map,
        };
    }),
    updateCommentItemContent: (commentId, commentItemId, content) => set(state => {
        const commentInfoMap = {...state.commentInfoMap};

        if (!commentItemId || !commentId) return;

        const comments = commentInfoMap[commentId].comments || [];
        comments.forEach(comment => {
            if (comment.id === commentItemId) {
                comment.content = content;
            }
        })
        commentInfoMap[commentId] = {
            ...commentInfoMap[commentId],
            comments: [...comments],
        };

        syncCommentToRemote(state.fileId, state.docComments, commentInfoMap);

        return {
            commentInfoMap,
        };
    }),
    setCommentInfo: (id, info) => set((state) => {
        const map = { ...state.commentInfoMap}

        map[id] = info;

        syncCommentToRemote(state.fileId, state.docComments, map);

        commentChanged$.next({
            fileId: state.fileId,
            comment: {
                docComments: state.docComments,
                commentInfoMap: map,
            }
        });

        return {
            commentInfoMap: map,
        };
    }),
    addDocComment: (refId, commentId) => set((state) => {
        const docComments = { ...state.docComments };
        docComments[refId] = docComments[refId] || [];
        docComments[refId].push(commentId);

        syncCommentToRemote(state.fileId, docComments, state.commentInfoMap);

        commentChanged$.next({
            fileId: state.fileId,
            comment: {
                docComments,
                commentInfoMap: state.commentInfoMap,
            }
        });

        return {
            docComments,
        };
    }),
    deleteDocComment: (commentId) => set((state) => {
        const docComments = { ... state.docComments };

        let targetRefId = '';
        for (const refId in docComments) {
            if (docComments[refId].some(id => id === commentId)) {
                targetRefId = refId;
            }
        }

        if (!targetRefId) return;
            
        docComments[targetRefId] = docComments[targetRefId].filter(id => id !== commentId);

        syncCommentToRemote(state.fileId, docComments, state.commentInfoMap);

        commentDeleted$.next({
            fileId: state.fileId,
            refId: targetRefId,
        });

        return {
            docComments,
        };
    }),
    deleteDocCommentItem: (commentId, commentItemId) => set((state) => {
        const docComments = { ... state.docComments };
        const commentInfoMap = {...state.commentInfoMap};

        let targetRefId = '';
        for (const refId in docComments) {
            if (docComments[refId].some(id => id === commentId)) {
                targetRefId = refId;
            }
        }

        if (!targetRefId) return;

        const newComments = commentInfoMap[commentId].comments?.filter(comment => comment.id !== commentItemId) || [];
        commentInfoMap[commentId].comments = newComments;    

        if (!newComments?.length) {
            docComments[targetRefId] = docComments[targetRefId].filter(id => id !== commentId);

            commentDeleted$.next({
                fileId: state.fileId,
                refId: targetRefId,
            });
        }

        syncCommentToRemote(state.fileId, docComments, state.commentInfoMap);

        return {
            docComments,
            commentInfoMap,
        };
    }),
    toggleCommentsVisible: () => set((state) => {
        const newVisible = !state.commentsVisible;

        commentsVisibleChange$.next(newVisible);

        localStorage.setItem('commentsVisible', `${newVisible}`);

        return {
            commentsVisible: newVisible,
        };
    }),
}))

export function useCommentStore() {
    const state = ref(commentStore.getState());

    const commentsVisible = ref(localStorage.getItem('commentsVisible') === 'false' ? false : true);

    const docComments = ref<Record<string, string[]>>({});

    const unsubscribe = commentStore.subscribe((newState) => {
        state.value = newState;

        docComments.value = newState.docComments;
        commentsVisible.value = newState.commentsVisible;
    });

    onUnmounted(() => {
        unsubscribe();
    });

    return {
        state,
        docComments,
        commentsVisible,
    };
}
