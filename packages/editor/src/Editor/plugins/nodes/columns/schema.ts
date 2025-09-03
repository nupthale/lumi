import { NodeSpec, Schema, Node } from 'prosemirror-model';
import { nanoid } from 'nanoid';

export const columnsSchema: Record<string, NodeSpec> = {
  columns: {
    content: "column+",
    group: "block",
    isolating: true,
    selectable: false,
    attrs: {
      id: { default: '' },
      colWidths: { default: [] },
    },
    parseDOM: [{
      tag: "div.doc-columns",
      getAttrs(dom) {
        return {
          id: dom.getAttribute('data-id') || '',
          colWidths: (dom.getAttribute('data-col-widths') || '').split(','),
        };
      }
    }],
    toDOM(node) {

      return ["div", {
        class: "doc-columns",
        'data-id': node.attrs.id,
        'data-col-widths': node.attrs.colWidths.join(',') || ''
      }, 0];
    },
    create(schema: Schema, attrs) {
      const id = nanoid();

      const count = attrs.count || 2;
      const content: Node[] = [];
      const colWidths: number[] = [];

      for (let i = 0; i < count; i++) {
        content.push(schema.node('column', { id: nanoid(8) }, [
          schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [])
          ]),
        ]));

        colWidths.push(400);
      }

      return schema.nodes['columns'].create({
        ...attrs,
        id,
        colWidths,
      }, content);
    }
  },

  column: {
    content: "block*",
    group: "block",
    isolating: true,
    selectable: false,
    attrs: {
      id: { default: '' },
      background: { default: '' },
    },
    parseDOM: [{
      tag: "div.doc-column",
      getAttrs(dom) {

        return {
          id: dom.getAttribute('data-id') || '',
          background: dom.style.background || '',
        };
      }
    }],
    toDOM(node) {
      return ["div", {
        class: 'doc-column',
        'data-id': node.attrs.id,
        style: 'background: ' + node.attrs.background || '',
      }, 0];
    }
  },
};