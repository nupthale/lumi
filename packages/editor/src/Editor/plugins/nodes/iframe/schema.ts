import { NodeSpec, DOMOutputSpec, Schema } from 'prosemirror-model';
import { nanoid } from 'nanoid';

export const iframeSchema: Record<string, NodeSpec> = {
    iframe: {
      group: 'block',
      content: '', // 不允许有内容
      selectable: true,
      attrs: {
        id: { default: '' },
        src: { default: '' },
        width: { default: '100%' },
      },
      parseDOM: [{ 
        tag: "div.doc-iframe", 
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id'),
            width: dom.getAttribute('data-width'),
            src: dom.getAttribute('data-src'),
          }
        },
      }],
      toDOM(node): DOMOutputSpec {
        return ["div", {
          class: "doc-iframe",
          'data-id': node.attrs.id,
          'data-width': node.attrs.width,
          'data-src': node.attrs.src,
        }, '']
      },
      create(schema: Schema, attrs) {
        const id = nanoid();
  
        return schema.nodes['iframe'].create({
          ...attrs,
          id,
        }, []);
      },
    },
  };