
import { Fragment, Node, NodeType } from 'prosemirror-model';
import { nanoid } from 'nanoid';

// 保存原始方法的引用
const originalCreateAndFill = NodeType.prototype.createAndFill;

// 覆盖原始方法, 覆盖后， yjs会报错， 先去掉
// NodeType.prototype.createAndFill = function(attrs = {}, content, marks) {
//   const textBlock = this.schema.node('textBlock', { id: nanoid(8) }, [
//     this.schema.node('textBlock_head', {
//         id: nanoid(8),
//     }, [])
//   ]);

//   let result: Node | null = null;

//   // title node这类inlinecontent， 就不能填入textBlock
//   if (this.inlineContent) {
//     result = originalCreateAndFill.call(this, attrs, content || Fragment.empty, marks);
//   } else {
//      // 对于非表格单元格，使用原始方法
//     result = originalCreateAndFill.call(this, attrs, textBlock, marks);
//   }


//   return result;
// };