import { MarkSpec } from 'prosemirror-model';

export const color: MarkSpec = {
    attrs: {
      color: { default: '#1f2329' }
    },
    parseDOM: [{
      style: 'color',
      getAttrs: (value) => {
        return { color: value }
      }
    }],
    toDOM: (mark) => {
      return ['span', { style: `color: ${mark.attrs.color}` }, 0]
    }
};