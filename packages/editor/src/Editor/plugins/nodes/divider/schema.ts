import { NodeSpec } from 'prosemirror-model';
import { nanoid } from 'nanoid';

export const dividerSchema: Record<string, NodeSpec> = {
    divider: {
      group: 'block',
      content: '', // 不允许有内容
      selectable: true,
      attrs: {
        id: { default: '' },
      },
      parseDOM: [{
        tag: 'div.doc-divider',
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id'),
          }
        },
      }],
      toDOM(node) { return ['div', {
        class: 'doc-divider',
        'data-id': node.attrs.id,
      }, '']},
      create(schema) {
        return schema.nodes['divider'].create({
          id: nanoid(8),
        }, []);
      },
    },
  };