import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { CollectionView } from './view.tsx';

export function collection(_schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('collection'),
      props: {
        nodeViews: {
          collection: (node, view, getPos) => {
            return new CollectionView(node, view, getPos);
          }
        }
      }
    }),
  ];
}