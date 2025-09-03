import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { docChanged$ } from '../../event';


export const docUpdatedPluginKey = new PluginKey('docUpdated');

export const docUpdatedPlugin = () => {
    return [
        new Plugin({
            key: docUpdatedPluginKey,
            view: () => {
                return {
                    update: (view: EditorView, prevState) => {
                        if (view.state.doc !== prevState.doc) {
                            docChanged$.next({
                                doc: view.state.toJSON().doc,
                            });
                        }
                        
                    }
                };
            },
        })
    ];
}