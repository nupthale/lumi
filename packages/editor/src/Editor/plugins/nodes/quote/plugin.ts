import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';

import { QuoteView } from './view';

export function quote(_schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('quote'),
      props: {
        nodeViews: {
          quote: (node, view, getPos) => {
            return new QuoteView(node, view, getPos);
          }
        },
      }
    }),
  ];
}