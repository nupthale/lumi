import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { docChanged$, docInit$ } from '../../event';

export const docUpdatedPluginKey = new PluginKey('docUpdated');

export const docUpdatedPlugin = () => {
    return [
        new Plugin({
            key: docUpdatedPluginKey,
            view: () => {
                let isInitialized = false;

                return {
                    update: (view: EditorView, prevState) => {
                        // Skip the first change which is initialization
                        if (!isInitialized) {
                            isInitialized = true;
                            
                            docInit$.next({
                                doc: view.state.toJSON().doc,
                                text: view.state.doc.textContent,
                            });

                            return;
                        }

                        if (view.state.doc !== prevState.doc) {
                            docChanged$.next({
                                doc: view.state.toJSON().doc,
                                text: view.state.doc.textContent,
                            });
                        }
                        
                    }
                };
            },
        })
    ];
}