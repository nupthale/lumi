import { NodeSpec, DOMOutputSpec, Schema } from 'prosemirror-model';
import { nanoid } from 'nanoid';

import { getDefaultSchema, getDefaultValues } from './defaultConfig';


export const collectionSchema: Record<string, NodeSpec> = {
    collection: {
      group: 'block',
      selectable: true,
      isolating: true,
      atom: true,
      attrs: {
        id: { default: '' },
      },
      parseDOM: [{ 
        tag: "div.doc-collection", 
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id'),
          }
        },
      }],
      toDOM(node): DOMOutputSpec {
        return ["div", {
          class: "doc-collection",
          'data-id': node.attrs.id,
        }]
      },
      create(schema: Schema, attrs) {
        const id = nanoid();
  
        return schema.nodes['collection'].create({
          ...attrs,
          id,
        });
      },
    },
  };