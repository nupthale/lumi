import { MarkSpec } from 'prosemirror-model';

export const background: MarkSpec = {
    attrs: {
      color: { default: '#fff' }
    },
    parseDOM: [{
      style: 'background',
      getAttrs: (value) => {
        return { color: value }
      }
    }],
    toDOM: (mark) => {
      return ['span', { style: `background: ${mark.attrs.color}; padding: 2px 0;` }, 0]
    }
};