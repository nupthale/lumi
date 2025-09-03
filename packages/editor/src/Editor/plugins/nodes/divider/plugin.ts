import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { DividerView } from './view';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getRangeByNode } from '@editor/Editor/shared/index';

export function divider(schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('divider'),
      props: {
        nodeViews: {
          divider: (node, view, getPos) => {
            return new DividerView(node, view, getPos);
          }
        },
        handleDOMEvents: {
          keydown: (view, event) => {
            const { $from } = view.state.selection;

            const dividerNode = $from.doc.nodeAt($from.pos);
            if (!dividerNode || dividerNode.type.name !== 'divider') {
              return;
            }

            // 如果是在divider上， 只允许按backspace或者方向键， 其他都阻止
            if (['Backspace', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
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
          const dividerNode = $from.doc.nodeAt($from.pos);

          if (!dividerNode || dividerNode.type.name !== 'divider') {
            return DecorationSet.empty;
          }

          const [from, to] = getRangeByNode(newState, dividerNode);

          const shouldHighlight = (
            dividerNode.type === schema.nodes.divider
          );

          const deco = shouldHighlight
            ? [Decoration.node(from, to, {
                class: 'doc-divider--focused'
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