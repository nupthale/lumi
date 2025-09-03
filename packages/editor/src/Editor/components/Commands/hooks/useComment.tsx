import { nanoid } from 'nanoid';
import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { contextStore } from '@editor/Editor/store/context';
import { commentStore } from '@editor/Editor/store/comment';
import { schema } from '@editor/Editor/plugins/schema';
import { activeComment$, focusCommentInput$, removeCommentTransition$ } from '@editor/Editor/components/Comments/event';


export const useComment = () => {
  const handleComment = () => {
    const editorView = contextStore.getState().editorView;
    const selection = editorView?.state.selection;

    if (!editorView || !selection) return;

    const refId = nanoid(8);

    const commentMark = schema.marks.comment.create({
        id: refId,
        active: true,
    });

    // 在编辑器中应用这个 mark
    const { state, dispatch } = editorView;
    const { from, to } = selection;

    const tr = state.tr;

    // 不支持undo和redo
    tr.setMeta('addToHistory', false);
    tr.addMark(from, to, commentMark)

    dispatch(tr);

    const commentId = nanoid(8);

    removeCommentTransition$.next();
    commentStore.getState().addDocComment(refId, commentId);
    
    setTimeout(() => {
        of({
          refId,
          id: commentId,
        }).pipe(
            tap((data) => activeComment$.next(data)),
            delay(100),
            tap(() => focusCommentInput$.next({ id: commentId })),
        ).subscribe();
    }, 100);
  };

  return {
    handleComment,
  };
}