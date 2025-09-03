import { MarkSpec } from 'prosemirror-model';

export const mockSelection: MarkSpec = {
    attrs: {},
    parseDOM: [{
      tag: 'span.doc-mockSelection',
      getAttrs: () => {
        return {}
      }
    }],
    toDOM: () => {
      return ['span', { 
        class: `doc-mockSelection`,
      }, 0]
    }
};