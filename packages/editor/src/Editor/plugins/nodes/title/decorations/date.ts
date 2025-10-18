import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { contextStore } from '../../../../store/context';

export const titleDecorationPlugin = new Plugin({
  key: new PluginKey('titleFormatter'),
  state: {
    init(_, { doc }) {
      return decorateTitleDates(doc);
    },
    apply(tr, oldState) {
      return tr.docChanged ? decorateTitleDates(tr.doc) : oldState;
    }
  },
  props: {
    decorations(state) {
      return this.getState(state);
    }
  }
});

function decorateTitleDates(doc) {
  const decorations: Decoration[] = [];
  
  doc.descendants((node, pos) => {
    // Check if this is a title node with date content
    const titleFormatter = contextStore.getState().titleFormatter;

    if (node.type.name === 'title' && titleFormatter) {
      const rawDate = node.textContent;
      
      const formattedTitle = titleFormatter(rawDate);
        
      // Position calculation:
      // pos = position of the title node
      // pos + 1 = first position inside the title node
      const textStartPos = pos + 1;
      
      // Create a widget element to display the formatted date
      const widget = document.createElement('span');
      widget.textContent = formattedTitle;
      
      // Create a widget decoration at the start of the text content
      const widgetDecoration = Decoration.widget(textStartPos, widget, {
        side: 0, // Place at the beginning
        key: `formatted-title-${pos}`
      });
      
      // Create a decoration to hide the original text
      const textEndPos = textStartPos + rawDate.length;
      const hideDecoration = Decoration.inline(textStartPos, textEndPos, {
        style: 'display: none',
      });
      
      decorations.push(widgetDecoration);
      decorations.push(hideDecoration);
    }
  });
  
  return DecorationSet.create(doc, decorations);
}