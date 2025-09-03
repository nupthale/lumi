import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';

import { enter, shiftEnter } from './enter';

import { HeaderView } from '../view';

export function header(_schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('header'),
      props: {
        nodeViews: {
          header: (node, view, getPos) => {
            return new HeaderView(node, view, getPos);
          },
        }
      }
    }),
    keymap({
        Enter: (state, dispatch, view) => {
          return enter(state, dispatch, view);
        },
        'Shift-Enter': (state, dispatch, view) => {
          return shiftEnter(state, dispatch, view);
        },
    })
  ];
}