import { ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { activeComment$ } from '../event';
import { contextStore } from '../../../store/context';
import { useCommentStore } from '../../../store/comment';

export const useActiveComment = (docCommentRefMap, transformYMap) => {

    const { state: commentState } = useCommentStore();

    const offsetY = ref(0);

    const updateOffsetY = (val) => {
        offsetY.value = Math.max(val, 0);
    }

    useSubscription(
        activeComment$.pipe(
            tap(({ refId }) => {
                // 更新commentMark 为active
                const editorView = contextStore.getState().editorView;
                const state = editorView?.state;
                const dispatch = editorView?.dispatch;

                if (!editorView || !state) return;

                const tr = state.tr!;

                state?.doc.descendants((node, pos) => {
                    node.marks.forEach(mark => {
                        if (mark.type.name !== 'comment') return;

                        // 创建新的 mark 属性
                        const newAttrs = {
                            ...mark.attrs,
                            active: mark.attrs.id === refId,
                        };
                        
                        // 先移除旧的 mark
                        tr.removeMark(pos, pos + node.nodeSize, mark.type);

                        // 在当前位置添加新的 mark
                        tr.addMark(
                            pos,
                            pos + node.nodeSize,
                            mark.type.create(newAttrs),
                        );
                    });
                });

                dispatch?.(tr);
            }),
            tap(({ refId, id }) => {
                // 找到refId的第一个comment
                const ref = docCommentRefMap.value[refId];

                if (!ref) {
                    return;
                };

                const commentIds = ref.comments;
                const commentId = id ? id : commentIds[0];

                if (!commentId) return;    
                commentState.value?.setActiveDocCommentId(commentId);
                // 等动画结束， 再开始定位， 否则不准确。
                setTimeout(() => {
                    offsetY.value = transformYMap.value[commentId] - (ref?.refTop || 0);
                }, 50);
            }),
        ).subscribe(),
    );

    return {
        offsetY,
        updateOffsetY,
    };

}