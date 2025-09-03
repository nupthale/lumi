import { MarkSpec } from 'prosemirror-model';

export const code: MarkSpec = {
    attrs: {},
    parseDOM: [{
      tag: 'span.doc-codeMark',
      getAttrs: () => {
        return {}
      }
    }],
    toDOM: () => {
      return ['span', { 
        class: `doc-codeMark`,
      }, 0]
    }
};