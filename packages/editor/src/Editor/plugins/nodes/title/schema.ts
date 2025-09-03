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
      },
      parseDOM: [{ 
        tag: "div.doc-title", 
        priority: 1,  // 最低优先级
        getAttrs(dom: any) {
          return {
            id: dom.getAttribute('data-id') || '',
            placeholder: dom.getAttribute('data-placeholder') || '',
          };
        }
      }],
      toDOM(node): DOMOutputSpec { 
        return ["div", { 
          'data-id': node.attrs.id,
          'data-placeholder': node.attrs.placeholder,
          class: "doc-title", 
        }, 0] 
      },
    },
  };