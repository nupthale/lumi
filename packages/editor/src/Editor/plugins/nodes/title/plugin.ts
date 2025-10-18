import { Fragment, Schema } from 'prosemirror-model';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { nanoid } from 'nanoid';
import { TitleView } from './view';

import { schema } from '@editor/Editor/plugins/schema/index';

import { titleDecorationPlugin } from './decorations/date';

export function title(_schema: Schema): Plugin[] {
  return [
    titleDecorationPlugin,
    new Plugin({
      key: new PluginKey('title'),
      props: {
        nodeViews: {
          title: (node, view) => {
            return new TitleView(node, view);
          }
        }
      }
    }),
    keymap({
      Enter: (state, dispatch, view) => {
        const { $from } = state.selection;
        const tr = state.tr;
        
        if (
          $from.parent.type.name !== 'title'
        ) {
          return false;
        }
    
        const titleNode = $from.node();
    
        if (!titleNode) return false;
    
        const leftContent = titleNode.slice($from.pos - 1);
       
        // 在doc-body下插入一个textBlock， 并且把leftContent的文本插入到textBlock中
        tr.insert(
          $from.after() + 1, 
          schema.nodes.textBlock.create({
            id: nanoid(8),
          }, [
            schema.nodes['textBlock_head'].create({
              id: nanoid(8),
            }, Fragment.from(leftContent.content))
          ]),
        );

        // 先插入， 再删除， 否则位置变化。 起始位置是1
        tr.deleteRange($from.pos, 1 + titleNode.content.size);
    
        // 定位到body起始为止
        tr.setSelection(
          TextSelection.create(
            tr.doc,
            $from.after() + 1,
          )
        );

        dispatch?.(tr);
    
        return true;
      },
  })
  ];
}