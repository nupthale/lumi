import { TextSelection, Selection, SelectionRange, Transaction } from 'prosemirror-state';
import { Slice, Fragment, ResolvedPos, Node } from 'prosemirror-model';
import { Mappable } from 'prosemirror-transform';
import { nanoid } from 'nanoid';

import { schema } from '@editor/Editor/plugins/schema/index';

export interface MultiBlockSelectionJSON {
    type: string;
    ranges: { from: number, to: number }[];
  }

// 辅助函数：检查位置是否指向 第一层的 block 节点的开始
function pointsAtBlockStart($pos: ResolvedPos): boolean {
  // 检查父节点是否是 block 类型
  const parent = $pos.parent;
  if (!parent.isBlock) return false;
  
  // 检查是否在 block 的开始位置
  return $pos.parentOffset === 0 && $pos.depth === 2;
}

export class MultiBlockSelection extends Selection {
    // A resolved position pointing _in front of_ the anchor block (the one
    // that doesn't move when extending the selection).
    public $ranges: SelectionRange[] = [];
    
    constructor(ranges: SelectionRange[] = []) {
      
      super(
        ranges[0]?.$from,
        ranges[ranges.length - 1]?.$to, 
        ranges,
      );
      
      this.$ranges = ranges;
    }
    
    // 必须实现的方法
    public map(doc: Node, mapping: Mappable): MultiBlockSelection | Selection {
        const $anchorBlock = doc.resolve(mapping.map(this.$ranges[0].$from.pos));
        const $headBlock = doc.resolve(mapping.map(this.$ranges[this.$ranges.length - 1].$to.pos));
        
        const body = doc.lastChild;

        if (
          pointsAtBlockStart($anchorBlock) &&
          pointsAtBlockStart($headBlock) &&
          body?.children?.length
        ) {
            const ranges: SelectionRange[] = [];

            doc.nodesBetween($anchorBlock.pos, $headBlock.pos, (node, pos) => {
                ranges.push(
                    new SelectionRange(
                        doc.resolve(pos),
                        doc.resolve(pos + node.nodeSize),
                    ),
                )
            });

            return new MultiBlockSelection(
                ranges,
            );
        }

        return TextSelection.between($anchorBlock, $headBlock);
    }
    
    public content(): Slice {
      const nodes: Node[] = [];

      this.ranges.forEach(range => {
        // 使用 nodeAfter 来获取当前位置之后的节点（即 textBlock）
        // 而不是当前位置的父节点（body）
        const node = range.$from.nodeAfter;
        if (node) {
          nodes.push(node);
        }
      })
      
      return new Slice(Fragment.from(nodes), 0, 0);
    }
    
    public replace(tr: Transaction, content: Slice = Slice.empty): void {
      const mapFrom = tr.steps.length;

      const ranges = this.ranges;
      const startPos = ranges[0].$from.pos;
      const endPos = ranges[ranges.length - 1].$to.pos;

      const mapping = tr.mapping.slice(mapFrom);
      const mappedStartPos = mapping.map(startPos);
      const mappedEndPos = mapping.map(endPos);
    
      if (content.size) {
        tr.replace(
          mappedStartPos,
          mappedEndPos,
          content,
        );
      } else {
        const textBlock = schema.nodes['textBlock'].create({
          id: nanoid(8),
        }, [
          schema.nodes['textBlock_head'].create({
            id: nanoid(),
          })
        ]);;

        tr.replaceRangeWith(
          mappedStartPos,
          mappedEndPos,
          textBlock,
        );
      }
      
      // 设置新的选择位置
      const newPos = tr.mapping.slice(mapFrom).map(this.to);
      const sel = Selection.findFrom(tr.doc.resolve(newPos), -1);
      if (sel) tr.setSelection(sel);
    }
    
    public eq(other: unknown): boolean {
      return (
        other instanceof MultiBlockSelection &&
        other.$ranges.length === this.$ranges.length &&
        other.$ranges[0].$from.pos === this.$ranges[0].$from.pos &&
        other.$ranges[other.$ranges.length - 1].$to.pos === this.$ranges[this.$ranges.length - 1].$to.pos
      );
    }
    
    // 静态工厂方法
    static fromJSON(doc: Node, json: MultiBlockSelectionJSON): MultiBlockSelection {
        const ranges: SelectionRange[] = [];
      
        json.ranges.forEach(range => {
            ranges.push(
                new SelectionRange(
                    doc.resolve(range.from),
                    doc.resolve(range.to),
                )
            )
        })

        return new MultiBlockSelection(ranges);
    }

    public toJSON(): MultiBlockSelectionJSON {
        return {
          type: 'multiBlock',
          ranges: this.ranges.map(range => ({
            from: range.$from.pos,
            to: range.$to.pos,
          })),
        };
    }
}

MultiBlockSelection.prototype.visible = false;

Selection.jsonID('multiBlock', MultiBlockSelection);

