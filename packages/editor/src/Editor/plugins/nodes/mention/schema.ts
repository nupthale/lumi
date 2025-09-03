import { NodeSpec, DOMOutputSpec } from 'prosemirror-model';

import { MentionTypeEnum } from '../../../interface';

export const mentionSchema: Record<string, NodeSpec> = {
    mention: {
      inline: true,
      group: "inline",
      attrs: {
        type: { default: MentionTypeEnum.USER },
        name: { default: '' },
        id: { default: '' },
      },
      parseDOM: [{ 
        tag: "span.doc-mention", 
        getAttrs(dom) {
          if (!(dom instanceof HTMLElement)) return {};

          return {
            type: dom.getAttribute('type'),
            name: dom.getAttribute('name'),
            id: dom.getAttribute('data-id'),
          };
        }
      }],
      toDOM(node): DOMOutputSpec {
        const { name } = node.attrs;

        return ['span', {
          class: "doc-mention",
          type: node.attrs.type,
          name: node.attrs.name,
          'data-id': node.attrs.id,
        }, `@${name || ''}`];
      },
    },
  };