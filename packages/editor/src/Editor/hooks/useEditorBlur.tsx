import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';
import { TextSelection } from 'prosemirror-state';

import { contextStore } from '@editor/Editor/store/context';
import { editorBlur$ } from '@editor/Editor/event';

import { getProvider } from '@editor/Editor/plugins/collab/core';

export const useEditorBlur = (fileId: string) => {
    useSubscription(
        editorBlur$.pipe(
            tap(() => {
                const view = contextStore.getState().editorView;
                if (view) {
                    // // // 清除选择
                    // const { state } = view;
                    // const tr = state.tr;
                    // tr.setSelection(TextSelection.create(tr.doc, 0, 0));
                    // view.dispatch(tr);

                    view.dom.blur();

                    // 去除y-cursor的光标
                    const provider = getProvider(fileId);
                    if (provider) {
                        provider.awareness.setLocalStateField('cursor', null);
                    }
                }
            })
        ).subscribe()
    );
}