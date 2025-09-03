import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const decorationKey = new PluginKey('list-decoration');

export const decorationPlugin = new Plugin({
    key: decorationKey,
    state: {
        init() {
            return DecorationSet.empty;
        },
        apply(tr, old) {
            const meta = tr.getMeta(decorationKey);
            if (!meta) return old;

            const { pos, nodeSize, type, view } = meta;

            if (type === 'indent-max') {
                const decoration = Decoration.node(pos, pos + nodeSize, {
                    class: 'animation-indent--max',
                });

                // 500ms 后移除装饰
                setTimeout(() => {
                    if (view) {
                        view.dispatch(view.state.tr.setMeta(decorationKey, {
                            type: 'clear',
                            pos,
                            nodeSize,
                            view,
                        }));
                    }
                }, 520);
                
                return DecorationSet.create(tr.doc, [decoration]);
            }

            if (type === 'clear') {
                const decoration = Decoration.node(pos, pos + nodeSize, {
                    class: '',
                });

                return DecorationSet.create(tr.doc, [decoration]);
            }

            return old;
        }
    },
    props: {
        decorations(state) {
            return this.getState(state);
        }
    }
});