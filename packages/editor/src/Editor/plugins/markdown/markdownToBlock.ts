import { isNil } from "lodash";
import { unified } from "unified";
import remarkParse from "remark-parse";
import {
  remarkProseMirror,
  toPmNode,
  toPmMark,
  type RemarkProseMirrorOptions,
} from "@handlewithcare/remark-prosemirror";
import remarkGfm from 'remark-gfm';

import type { Node, Schema } from "prosemirror-model";

import { schema } from "@editor/Editor/plugins/schema";
import { nanoid } from "nanoid";
import { ListTypeEnum } from "../nodes/list/interface";

export function createProcessor() {
    return unified()
    // Use remarkParse to parse the markdown string
    .use(remarkParse)
    // 支持table、tasklist等。
    .use(remarkGfm)
    // Convert to ProseMirror with the remarkProseMirror plugin.
    // It takes the schema and a set of handlers, each of which
    // maps an mdast node type to a ProseMirror node (or nodes)
    .use(remarkProseMirror, {
      schema,
      /**
       *  blockquote: Blockquote;
       *  break: Break;
       *  code: Code;
       *  definition: Definition;
       *  delete: Delete;
       *  emphasis: Emphasis;
       *  footnoteDefinition: FootnoteDefinition;
       *  footnoteReference: FootnoteReference;
       *  heading: Heading;
       *  html: Html;
       *  image: Image;
       *  imageReference: ImageReference;
       *  inlineCode: InlineCode;
       *  link: Link;
       *  linkReference: LinkReference;
       *  list: List;
       *  listItem: ListItem;
       *  paragraph: Paragraph;
       *  strong: Strong;
       *  table: Table;
       *  tableCell: TableCell;
       *  tableRow: TableRow;
       *  text: Text;
       *  thematicBreak: ThematicBreak;
       *  yaml: Yaml;
       */
      handlers: {
        // 这里要覆盖root， 否则会把textBlock直接放到doc里， doc下面应该是title body， 会报错。
        root(node, _, state) {
            const children = state.all(node);
            return schema.node('doc', {}, [
                schema.node('title', {}, []),
                schema.node('body', {}, children),
            ]);
        },
        blockquote(node, _, state) {
            const children = state.all(node);
            return schema.nodes.quote.spec.create(schema, {}, children);
        },
        break: toPmNode(schema.nodes.hardBreak),
        // code 对应代码块（block-level）
        code(node, _, state) {
            return schema.nodes.coder.spec.create(schema, {}, node.value ? schema.text(node.value || '') : []);
        },
        emphasis: toPmMark(schema.marks.italic),
        strong: toPmMark(schema.marks.strong),
        // inlineCode 对应行内代码（inline-level），应该使用 mark 而不是 node
        inlineCode(node, _, state) {
          // 创建带有code mark的文本节点
          const textNode = schema.text(node.value || 'empty text');
          const codeMark = schema.marks.code.create();
          return textNode.mark([codeMark]);
        },
        paragraph(node, _, state) {
            const children = state.all(node);
            
            // 检查段落是否只包含一个图片节点
            if (children.length === 1 && children[0].type === schema.nodes.image) {
                // 如果段落只包含一个图片，直接返回图片节点
                return children[0];
            }
            
            const isInlineContent = children.every(child => child.isInline);

            const content = [
              schema.nodes.textBlock_head.create({
                id: nanoid(8),
              }, isInlineContent ? children : []),
            ];
          
            if (!isInlineContent) {
              content.push(schema.nodes.textBlock_body.create({
                id: nanoid(8),
              }, children));
            }

            return schema.nodes.textBlock.create(
              {
                id: nanoid(8),
              },
              content,
            );
        },
        heading(node, _, state) {
          const children = state.all(node);
         
          return schema.nodes.header.spec.create(schema, {
            level: node.depth,
          }, children);
        },
        image(node, _, state) {
          return schema.nodes.image.spec.create(schema, {
            src: node.url,
          }, []);
        },
        delete: toPmMark(schema.marks.strikethrough),
        link: toPmMark(schema.marks.link),
        list(node, parent, state) {
          const children = state.all(node);

          return children.map(child => {
            if (child.type === schema.nodes.list) {
              return child;
            }

            return schema.nodes.list.create({
              id: nanoid(8),
            }, child)
          });
        },
        listItem(node, parent, state) {
          const children = state.all(node);

          const parentNode = parent as unknown as {
            ordered: boolean;
            start: number;
          }

          let type = ListTypeEnum.BULLET;
          if (!isNil(node.checked)) {
            type = ListTypeEnum.TODO;
          } else if (parentNode.ordered) {
            type = ListTypeEnum.ORDERED;
          }

          if (children.length > 1) {
            return schema.nodes.list.create({
              id: nanoid(8),
            }, [
              schema.nodes.list_head.create({
                id: nanoid(8),
                type,
                checked: node.checked,
              }, children[0]?.firstChild?.content || []),
              schema.nodes.list_body.create({
                id: nanoid(8),
              }, children.slice(1)),
            ]);
          }

          let index: number | undefined = undefined;
          if (parentNode.ordered) {
            index = parentNode.start + parent.children.indexOf(node);
          }

          return schema.nodes.list_head.create({
            id: nanoid(8),
            type,
            index,
            checked: node.checked,
          }, children[0]?.firstChild?.content || []);
        },
        table(node, _, state) {
          const children = state.all(node);
          return schema.nodes.table.create({
            id: nanoid(8),
          }, children);
        },
        tableRow(node, _, state) { 
          const children = state.all(node);
          return schema.nodes.table_row.create({
            id: nanoid(8),
          }, children);
        },
        tableCell(node, _, state) {
          const children = state.all(node);
          
          return schema.nodes.table_cell.create({
            id: nanoid(8),
          }, schema.nodes.textBlock.spec.create(schema, {}, children));
        },
      },
    } satisfies RemarkProseMirrorOptions);
}

export function markdownToBlock(markdown: string): Node {
    try {
      console.log('Input markdown:', markdown);
    
      const processor = createProcessor();
      const result = processor.processSync(markdown);

      console.log('Parsed result:', result);
      return result.result as Node;
    } catch(e) {
      console.error('Markdown parsing failed:', e);
      throw Error('解析markdown失败');
    }
}