import { MarkSpec } from 'prosemirror-model';

export const link: MarkSpec = {
    attrs: {
        href: { default: '' }
    },
    parseDOM: [{
      tag: 'a.doc-link',
      getAttrs: (node) => {
        return {
            href: node.getAttribute('href'),
        }
      }
    }],
    toDOM: (mark) => {
      return ['a', { 
        class: `doc-link`,
        href: mark.attrs.href,
        target: '_blank',
      }, 0]
    }
};