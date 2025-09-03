import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { IframeView } from './view';

export function iframe(_schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('iframe'),
      props: {
        nodeViews: {
          iframe: (node, view, getPos) => {
            return new IframeView(node, view, getPos);
          }
        }
      }
    })
  ];
}