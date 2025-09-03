import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { ImageView } from './view';
import { Decoration, DecorationSet } from 'prosemirror-view';
export function image(schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('image'),
      props: {
        nodeViews: {
          image: (node, view, getPos) => {
            return new ImageView(node, view, getPos);
          }
        }
      }
    }),
     // 新增装饰器插件
     new Plugin({
      state: {
        init: () => DecorationSet.empty,
        apply: (tr, prev, oldState, newState) => {
          const { $from } = newState.selection;
          const shouldHighlight = (
            $from.parent.type === schema.nodes.image &&
            $from.parentOffset === 0
          );

          const deco = shouldHighlight
            ? [Decoration.node($from.before(), $from.after(), {
                class: 'doc-image--focused'
              })]
            : [];

          return DecorationSet.create(newState.doc, deco);
        }
      },
      props: {
        decorations(state) {
          return this.getState(state);
        }
      }
    })
  ];
}