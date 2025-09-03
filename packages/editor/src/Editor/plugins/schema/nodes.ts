
import { NodeSpec, DOMOutputSpec } from 'prosemirror-model';

import { titleSchema } from '../nodes/title/schema';
import { collectionSchema } from '../nodes/collection/schema';
import { textBlockSchema } from '../nodes/textBlock/schema';
import { headerSchema } from '../nodes/header/schema';
import { mentionSchema } from '../nodes/mention/schema';
import { emojiSchema } from '../nodes/emoji/schema';
import { highlightSchema } from '../nodes/highlight/schema';
import { quoteSchema } from '../nodes/quote/schema';
import { listSchema } from '../nodes/list/schema';
import { tableSchema } from '../nodes/table/schema';
import { imageSchema } from '../nodes/image/schema';
import { videoSchema } from '../nodes/video/schema';
import { coderSchema } from '../nodes/coder/schema';
import { columnsSchema } from '../nodes/columns/schema';
import { iframeSchema } from '../nodes/iframe/schema';
import { dividerSchema } from '../nodes/divider/schema';

export const nodes: Record<string, NodeSpec> = {
  // 使用基础节点
  // ...basicNodes,
  
  doc: {
    content: "title body"
  },

  body: {
    content: 'block+',
    parseDOM: [{ 
      tag: "div.doc-body",
    }],
    toDOM(): DOMOutputSpec { 
      return ["div", { 
        class: "doc-body",
      }, 0] 
    }
  },

  // 文本节点
  text: {
    group: 'inline'
  },
  
  // 添加硬换行节点定义
  hardBreak: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{tag: 'br'}],
    toDOM() { return ['br'] }
  },

  ...textBlockSchema,
  ...headerSchema,
  ...mentionSchema,
  ...emojiSchema,
  ...highlightSchema,
  ...quoteSchema,
  ...listSchema,
  ...tableSchema,
  ...imageSchema,
  ...videoSchema,
  ...coderSchema,
  ...columnsSchema,
  ...iframeSchema,
  ...collectionSchema,
  ...dividerSchema,

  // 最低优先级
  ...titleSchema,

  // 添加更多自定义节点...
};