
import { MarkSpec } from 'prosemirror-model';
import { marks as basicMarks } from 'prosemirror-schema-basic';

import { color } from '../marks/color';
import { background } from '../marks/background';
import { code } from '../marks/code';
import { link } from '../marks/link';
import { mockSelection } from '../marks/mockSelection';
import { comment } from '../marks/comment';

export const marks: Record<string, MarkSpec> = {
  // 使用基础标记
  ...basicMarks,
  
  // 自定义标记
  // 例如，可以添加下划线标记
  underline: {
    parseDOM: [{tag: "u"}, {style: "text-decoration=underline"}],
    toDOM() { return ["u", 0] }
  },
  
  strikethrough: {
    parseDOM: [
      { tag: "s" },
      { tag: "strike" },
      { style: "text-decoration=line-through" }
    ],
    toDOM() { return ["s", 0] }
  },

  italic: {
    parseDOM: [
      { tag: "i" },
      { tag: "em" },
      { style: "font-style=italic" }
    ],
    toDOM() { return ["em", 0] }
  },

  // 添加更多自定义标记...
  color,
  background,
  code,
  comment,
  link,
  mockSelection,
}; 