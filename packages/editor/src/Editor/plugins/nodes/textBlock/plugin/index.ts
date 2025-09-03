import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';

import { backspace } from './backspace';
import { enter, shiftEnter } from './enter';
import { insertTab } from './tab';
import { fixTextBlock } from './fix';

import { TextBlockView } from '../view/index';
import { TextBlockHeadView } from '../view/head';
import { TextBlockBodyView } from '../view/body';

export function textBlock(_schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('text'),
      props: {
        nodeViews: {
          textBlock_head: (node, view, getPos) => {
            return new TextBlockHeadView(node, view, getPos);
          },
          textBlock_body: (node, view, getPos) => {
            return new TextBlockBodyView(node, view, getPos);
          },
          textBlock: (node, view, getPos) => {
            return new TextBlockView(node, view, getPos);
          }
        }
      },
      appendTransaction(_trs, oldState, state) {
        // 只在文档真正改变时才进行修复
        if (oldState && oldState.doc === state.doc) {
          return undefined;
        }
        
        let tr = state.tr;
        return fixTextBlock(state, tr);
      },
    }),
    keymap({
        Backspace: (state, dispatch, view) => {
          return backspace(state, dispatch, view);
        },
        Enter: (state, dispatch, view) => {
          return enter(state, dispatch, view);
        },
        'Shift-Enter': (state, dispatch, view) => {
          return shiftEnter(state, dispatch, view);
        },
        'Tab': (state, dispatch, view) => {
          return insertTab(state, dispatch, view);
        },
    }),
  ];
}