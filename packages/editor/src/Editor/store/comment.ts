import { ref, onUnmounted, computed } from 'vue';
import { createStore } from 'zustand/vanilla';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

import { syncToRemote as syncCommentToRemote } from '../plugins/collab/comment';
import { userStore } from './user';
import { CommentInfoType } from '../interface';

import { commentChanged$, commentsVisibleChange$ } from '../event';

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
    setComment: (comments: Record<string, string[]>, infoMap: Record<string, CommentInfoType>) => void,
    setActiveDocCommentId: (commentId: string | null) => void,
    addDocComment: (refId: string, commentId: string) => void,
    deleteDocComment: (commentId: string) => void,
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
            comments,
        };

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
        for (const refId in docComments) {
            docComments[refId] = docComments[refId].filter(id => id !== commentId);
        }

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

    const unsubscribe = commentStore.subscribe((newState) => {
        state.value = newState;

        commentsVisible.value = newState.commentsVisible;
    });

    onUnmounted(() => {
        unsubscribe();
    });

    return {
        state,
        commentsVisible,
    };
}