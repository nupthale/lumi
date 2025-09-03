import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { VideoView } from './view';

import { Decoration, DecorationSet } from 'prosemirror-view';

export function video(schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('video'),
      props: {
        nodeViews: {
          video: (node, view, getPos) => {
            return new VideoView(node, view, getPos);
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
            $from.parent.type === schema.nodes.video &&
            $from.parentOffset === 0
          );

          const deco = shouldHighlight
            ? [Decoration.node($from.before(), $from.after(), {
                class: 'doc-video--focused'
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