import { MarkSpec } from 'prosemirror-model';

export const comment: MarkSpec = {
    attrs: {
      id: { default: '' },
      active: { default: false },
    },
    parseDOM: [{
      tag: 'span.doc-comment',
      getAttrs: (node) => {
        return {
            id: node.getAttribute('data-comment-id'),
            active: node.classList.contains('doc-comment-active'),
        }
      }
    }],
    toDOM: (mark) => {
      return ['span', { 
        class: `doc-comment ${mark.attrs.active ? ' doc-comment-active' : ''}`,
        'data-comment-id': mark.attrs.id,
      }, 0]
    }
};