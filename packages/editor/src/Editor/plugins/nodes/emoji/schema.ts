import { NodeSpec, DOMOutputSpec } from 'prosemirror-model';

export const emojiSchema: Record<string, NodeSpec> = {
     // 不允许光标进入内部
    emoji: {
      inline: true,
      group: 'inline',
      selectable: false,
      content: 'text*',  // 允许包含文本内容
      parseDOM: [{tag: 'span.emoji'}],
      toDOM(node) { return ['span', {
        class: 'emoji',
      }, node.textContent]}
    },
  };