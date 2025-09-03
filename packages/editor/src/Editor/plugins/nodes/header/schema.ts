import { NodeSpec, DOMOutputSpec, Schema, Node } from 'prosemirror-model';

import { nanoid } from 'nanoid';
import { getTopNodePos } from '@editor/Editor/shared';

import { BaseBlockView } from '@editor/Editor/plugins/nodes/_common/baseBlockView';
import { schema } from '@editor/Editor/plugins/schema/index';

export const headerSchema: Record<string, NodeSpec> = {
    header: {
      content: "inline*",
      group: 'block',
      attrs: {
        level: { default: 1 },
        id: { default: '' },
      },
      parseDOM: [{ 
        tag: "h1",
        getAttrs(dom: any) {
          return {
            level: 1,
            id: dom.getAttribute('data-id'),
          }
        }
      }, { 
        tag: "h2", 
        getAttrs(dom: any) {
          return {
            level: 2,
            id: dom.getAttribute('data-id'),
          }
        }
      }, { 
        tag: "h3",
        getAttrs(dom: any) {
          return {
            level: 3,
            id: dom.getAttribute('data-id'),
          }
        }
      }, { 
        tag: "h4", 
        getAttrs(dom: any) {
          return {
            level: 4,
            id: dom.getAttribute('data-id'),
          }
        }
      }, { 
        tag: "h5",
        getAttrs(dom: any) {
          return {
            level: 5,
            id: dom.getAttribute('data-id'),
          }
        }
      }, { 
        tag: "h6",
        getAttrs(dom: any) {
          return {
            level: 6,
            id: dom.getAttribute('data-id'),
          }
        }
      }],
      toDOM(node): DOMOutputSpec {
        return [`h${node.attrs.level}`, {
          class: "doc-header",
          'data-id': node.attrs.id,
        }, 0]
      },
      create(schema: Schema, attrs, content = []) {
        const id = nanoid();

        return schema.nodes['header'].create({
          ...attrs,
          id,
        }, content);
      },
      // 其他类型转为 header
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

          // 3. 再在range[0]的位置插入一个新的header
          tr.insert(range[0], schema.nodes['header'].create({
            ...(attrs || {}),
            id: nanoid(8),
           }, head.content));

          dispatch(tr);

          return;
        }

        const range: [number, number] = [
          resolvedPos.before(),
          resolvedPos.after(),
        ];

        const newNode = schema.nodes['header'].create({
          ...(attrs || {}),
          id: nanoid(8),
        }, node.content);

        tr.replaceRangeWith(range[0], range[1], newNode);
        dispatch(tr);
      }
    },
  };