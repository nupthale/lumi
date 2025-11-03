import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { contextStore  } from '../store/context';
import { commentDeleted$ } from '@editor/Editor/event';
import { EditorView } from 'prosemirror-view';

export const removeCommentMark = (view: EditorView, refId: string) => {
    const state = view.state;
    const tr = state.tr;
    const dispatch = view.dispatch;

    state.doc.descendants((childNode, pos) => {
        const commentMark = childNode.marks.find(mark => mark.type.name === 'comment' && mark.attrs.id === refId);
        if (commentMark) {
            tr.setMeta('addToHistory', false);
            tr.removeMark(pos, pos + childNode.nodeSize, commentMark.type);
        }
    });

    dispatch(tr);
}

export const useCommentMark = () => {
    useSubscription(
        commentDeleted$.pipe(
            tap(({ refId }) => {
                const editorView = contextStore.getState().editorView;
                
                if (!editorView) return;

                removeCommentMark(editorView, refId);          
            }),
        ).subscribe(),
    )
};