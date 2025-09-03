import { NodeSpec, DOMOutputSpec, Schema } from 'prosemirror-model';
import { nanoid } from 'nanoid';

import { BaseBlockView } from '@editor/Editor/plugins/nodes/_common/baseBlockView';
import { getTopNodePos } from '@editor/Editor/shared';
import { schema } from '@editor/Editor/plugins/schema/index';

export const textBlockSchema: Record<string, NodeSpec> = {
    textBlock: {
      content: "textBlock_head textBlock_body?",
      group: 'block',
      selectable: true,
      draggable: true,
      attrs: {
        id: { default: '' },
      },
      parseDOM: [{ 
        tag: "div.doc-textBlock", 
        priority: 60,  // 提高优先级
        getAttrs(dom) {
          return {
            id: dom.getAttribute('data-id'),
          };
        },
      }, { 
        tag: "p", 
        priority: 60,  // 提高优先级
        getAttrs(dom) {
          return {
            id: dom.getAttribute('data-id'),
          };
        },
      }],
      toDOM(node): DOMOutputSpec {
        return ["div", {
          'data-id': node.attrs.id,
          class: "doc-textBlock",
        }, 0]
      },
      create(schema: Schema, attrs, children) {
        const id = nanoid();

        return schema.nodes['textBlock'].create({
          ...attrs,
          id,
        }, [
          schema.nodes['textBlock_head'].create({
            id: nanoid(8),
          }, children ? children : [])
        ]);
      },
     // 其他类型转为 textBlock
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

          // 把head转为header， 然后把body保留原来格式，提升一层。
          const head = topNode.firstChild;
          const body = topNode.childCount > 1 ? topNode.lastChild : null;

          const range = [topNodeResolvedPos.before(), topNodeResolvedPos.after()];

          // 1. 先删除原来的node
          tr.deleteRange(range[0], range[1]);

          // 2. 用body替换整个topNode
          if (body) {
            tr.insert(range[0], body.content);
          }

          // 3. 再在range[0]的位置插入一个新的textBlock
          tr.insert(range[0], schema.nodes['textBlock'].create({
            ...attrs,
            id: nanoid(8),
          }, [
            schema.nodes['textBlock_head'].create({
              id: nanoid(),
            }, head.content)
          ]));

          dispatch(tr);

          return;
        }

        const range: [number, number] = [
          resolvedPos.before(),
          resolvedPos.after(),
        ];

        const newNode = schema.nodes['textBlock'].create({
          ...attrs,
          id: nanoid(8),
        }, [
          schema.nodes['textBlock_head'].create({
            id: nanoid(),
          }, node.content)
        ]);

        tr.replaceRangeWith(range[0], range[1], newNode);
        dispatch(tr);
      }
    },  
    textBlock_head: {
        content: "inline*",
        group: "block",
        selectable: false,
        attrs: {
            id: { default: '' },
        },
        parseDOM: [{
            tag: "div.doc-textBlock-head",
            priority: 55,  // 提高优先级
            getAttrs(dom) {
                return {
                    id: dom.getAttribute('data-id') || '',
                };
            }
        }],
        toDOM(node) {
            return ["div", {
                class: "doc-textBlock-head",
                'data-id': node.attrs.id,
            }, 0];
        }
    },
    textBlock_body: {
        content: 'block*',
        group: 'block',
        selectable: false,
        attrs: {
            id: { default: '' },
        },
        parseDOM: [{
          tag: "div.doc-textBlock-body",
          getAttrs(dom) {
            return {
              id: dom.getAttribute('data-id') || '',
            };
          }
        }],
        toDOM(node) {
          return ["div", {
            class: "doc-textBlock-body",
            'data-id': node.attrs.id,
          }, 0];
        }
    },
  };