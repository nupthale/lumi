import { nanoid } from 'nanoid';
import { NodeSpec, DOMOutputSpec,Schema } from 'prosemirror-model';

import { BaseBlockView } from '@editor/Editor/plugins/nodes/_common/baseBlockView';
import { getTopNodePos } from '@editor/Editor/shared';
import { schema } from '@editor/Editor/plugins/schema/index';

export const highlightSchema: Record<string, NodeSpec> = {
    highlight: {
      content: "block*",
      group: 'block',
      selectable: true,
      attrs: {
        id: { default: '' },
        small: { default: false },
        emoji: { default: '🎵'},
        color: { default: '' },
        background: { default: 'var(--palette-bg-2)' },
        border: { default: 'var(--palette-border-2)' },
      },
      parseDOM: [{ 
        tag: "div.doc-highlight", 
        priority: 51,  // 提高优先级
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id'),
            color: dom.style.color,
            background: dom.style.backgroundColor,
            border: dom.style.borderColor,
            small: dom.classList.contains('small'),
          }
        },
      }],
      toDOM(node): DOMOutputSpec {
        return ["div", {
          class: `doc-highlight ${node.attrs.small ? 'small' : ''}`,
          'data-id': node.attrs.id,
          style: `background-color: ${node.attrs.background}; border-color: ${node.attrs.border}; color: ${node.attrs.color}`,
        }, 0]
      },
      create(schema: Schema, attrs) {
        const id = nanoid();
  
        return schema.nodes['highlight'].create({
          ...attrs,
          id,
        }, [
          schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [])
          ]),
        ]);
      },
      // 其他类型转为 highlight
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
          tr.insert(range[0], schema.nodes['highlight'].create({
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

        const newNode = schema.nodes['highlight'].create({
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