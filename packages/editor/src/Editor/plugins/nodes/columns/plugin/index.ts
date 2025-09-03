import { Plugin, PluginKey } from 'prosemirror-state';

import { getNearestAncestor } from '@editor/Editor/shared/index';

import { ColumnsView } from '../view/columns';
import { ColumnView } from '../view/column';

import { focusColumns$ } from '../event';

import { drawColumnSelection, normalizeSelection } from '../columnselection';

const pluginKey = new PluginKey('columns');

export const columns = () => {
  return [
    new Plugin({
      key: pluginKey,
      
      props: {
        decorations: drawColumnSelection,

        nodeViews: {
          columns: (node, view, getPos) => {
            return new ColumnsView(node, view, getPos);
          },
          column: (node, view, getPos) => {
            return new ColumnView(node, view, getPos);
          },
        },
      },

      view: (_editorView) => {
        return {
            update(view, prevState) {
                if (view.state.selection === prevState.selection) {
                    // 文档未发生变化
                    return;
                }

                // 如果光标位于columns内部， 则columns的dom加一个focused类
                const { from } = view.state.selection;
                const $from = view.state.doc.resolve(from);
                const parentColumnsNode = getNearestAncestor($from, 'columns');

                focusColumns$.next({ id: parentColumnsNode?.attrs?.id });
            },
        };
      },

      appendTransaction(_, _oldState, state) {
        return normalizeSelection(
          state,
          state.tr,
        );
      },
    }),
  ];
};