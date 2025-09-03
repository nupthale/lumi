import { nanoid } from 'nanoid';
import { NodeSpec, DOMOutputSpec,Schema } from 'prosemirror-model';

import { BaseBlockView } from '@editor/Editor/plugins/nodes/_common/baseBlockView';
import { getTopNodePos } from '@editor/Editor/shared';
import { schema } from '@editor/Editor/plugins/schema/index';

export const quoteSchema: Record<string, NodeSpec> = {
    quote: {
      content: "block+",
      group: 'block',
      attrs: {
        id: { default: '' },
      },
      parseDOM: [{ 
        tag: "div.doc-quote", 
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id'),
          }
        },
      }],
      toDOM(node): DOMOutputSpec {
        return ["div", {
          class: `doc-quote`,
          'data-id': node.attrs.id,
        }, 0]
      },
      create(schema: Schema, attrs, children) {
        const id = nanoid();
  
        return schema.nodes['quote'].create({
          ...attrs,
          id,
        }, children ? children : [
          schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [])
          ]),
        ]);
      },
      // 其他类型转为 quote
      convert(srcNodeView: BaseBlockView, attrs?: Record<string, any>) {
        const node = srcNodeView.node;
        const view = srcNodeView.view;
        const state = view.state;
        const tr = state.tr;
        const doc = state.doc;
        const pos = srcNodeView.getPos();
        const dispatch = view.dispatch;
        
        if (!pos || !node) return;

        const resolvedPos = doc.resolve(pos + 1);

        if (['textBlock_head', 'list_head'].includes(node.type.name)) {
          const topNodeResolvedPos = getTopNodePos(state, resolvedPos);
          const topNode = topNodeResolvedPos.node();

          // 把topNode塞到highlight里
          const range = [topNodeResolvedPos.before(), topNodeResolvedPos.after()];

          // 1. 先删除原来的node
          tr.deleteRange(range[0], range[1]);

          // 2. 把topNode塞到highlight里
          tr.insert(range[0], schema.nodes['quote'].create({
            ...attrs,
            id: nanoid(8),
          }, [
            topNode,
          ]));

          dispatch(tr);

          return;
        }

        const range: [number, number] = [
          resolvedPos.before(),
          resolvedPos.after(),
        ];

        const newNode = schema.nodes['quote'].create({
          ...attrs,
          id: nanoid(8),
        }, [
          node,
        ]);;

        tr.replaceRangeWith(range[0], range[1], newNode);
        dispatch(tr);
      }
    },
  };