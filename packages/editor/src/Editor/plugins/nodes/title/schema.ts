import { NodeSpec, DOMOutputSpec } from 'prosemirror-model';

export const titleSchema: Record<string, NodeSpec> = {
    title: {
      content: "inline*",
      defining: true,
      selectable: false,
      group: "block",
      attrs: {
        id: { default: "" },
        placeholder: { default: "" },
        editable: { default: true },
      },
      parseDOM: [{ 
        tag: "div.doc-title", 
        priority: 1,  // 最低优先级
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id') || '',
            placeholder: dom.getAttribute('data-placeholder') || '',
            editable: dom.getAttribute('data-editable') === 'false' ? false : true,
          };
        }
      }],
      toDOM(node): DOMOutputSpec { 
        return ["div", { 
          'data-id': node.attrs.id,
          'data-placeholder': node.attrs.placeholder,
          'data-editable': node.attrs.editable ? 'true' : 'false',
          class: "doc-title", 
        }, 0] 
      },
    },
  };