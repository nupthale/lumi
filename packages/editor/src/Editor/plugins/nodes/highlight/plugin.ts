import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';

import { selectBlock, isAtStart } from '@editor/Editor/plugins/commands/selectBlock';

import { HighlightView } from './view';

export function highlight(_schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('highlight'),
      props: {
        nodeViews: {
          highlight: (node, view, getPos) => {
            return new HighlightView(node, view, getPos);
          }
        },
      }
    }),
    keymap({
      Backspace: (state, dispatch, _view) => {
        // 如果$from在highlight的最开始位置， 则selectBlock
        if (isAtStart(state, 'highlight')) {
          return selectBlock(state, dispatch, 'highlight');
        }

        return false;
      },
    })
  ];
}