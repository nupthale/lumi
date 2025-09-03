import { inputRules, InputRule } from 'prosemirror-inputrules';
import { EditorState } from 'prosemirror-state';
import { Fragment, Schema } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { nanoid } from 'nanoid';

import { getTopNodePos } from '@editor/Editor/shared/index';
import { ListTypeEnum } from '@editor/Editor/plugins/nodes/list/interface';

// 创建Markdown输入规则
/**
 * 
 * h1  -  # 空格
 * h2  -  ## 空格
 * h3  -  ### 空格
 * h4  -  #### 空格
 * h5  -  ##### 空格
 * h6  -  ###### 空格
 * 
 * coder  -  ``` 空格
 * code   - `代码`
 * 
 * bold      -  **加粗** 空格
 * italic    -  *斜体* 空格
 * underline -  ~文字~ 空格 
 * delete    -  ~~文字~~ 空格 
 * divider   -  --- 或 *** 
 * quote     -  > 空格
 * 
 * 有序列表  -  1. 空格(在列表内已经实现)
 * 无序列表  -  - 空格 或 * 空格
 * 待办列表  -  [] 空格
 */
export function createMarkdownInputRules(schema: Schema) {
  const headerRule = (level: number, state: EditorState, start: number, end: number) => {
    const { tr } = state;
    const resolvedPos = tr.doc.resolve(start);
    const topPos = getTopNodePos(state, resolvedPos);
    const node = resolvedPos.node();

    // 获取当前块的内容
    const blockStart = topPos.before();
    const blockEnd = topPos.after();
    
    // 使用InputRule提供的start和end计算需要切割的长度
    const hashLength = end - start;
    
    // 创建新的header节点，包含原有的内容结构（去掉开头的#空格）
    const headerNode = schema.nodes.header.create(
      { level, id: nanoid(8) },
      node.content.cut(hashLength)
    );
    
    tr.delete(blockStart, blockEnd);
    tr.insert(blockStart, headerNode);

    // 光标定位到开始位置
    tr.setSelection(TextSelection.create(tr.doc, blockStart));
    
    return tr;
  }

  const listRule = (type: ListTypeEnum, state: EditorState, start: number, end: number) => {
    const { tr } = state;
    const resolvedPos = tr.doc.resolve(start);
    const topPos = getTopNodePos(state, resolvedPos);
    const node = resolvedPos.node();

    // 获取当前块的内容
    const blockStart = topPos.before();
    const blockEnd = topPos.after();
    
    // 使用InputRule提供的start和end计算需要切割的长度
    const hashLength = end - start;
    
    // 创建新的header节点，包含原有的内容结构（去掉开头的#空格）
    const listNode = schema.nodes.list.spec.create(
      schema,
      { type },
      node.content.cut(hashLength),
    );
    
    tr.delete(blockStart, blockEnd);
    tr.insert(blockStart, listNode);

    // 光标定位到开始位置
    tr.setSelection(TextSelection.create(tr.doc, blockStart));
    
    return tr;
  }

  return inputRules({
    rules: [
      // 标题规则 - 处理 # 空格 后面可能有内容的情况
      new InputRule(/^#{1}\s/, (state, _match, start, end) => {
        return headerRule(1, state, start, end);
      }),
      
      new InputRule(/^#{2}\s/, (state, _match, start, end) => {
        return headerRule(2, state, start, end);
      }),
      
      new InputRule(/^#{3}\s/, (state, _match, start, end) => {
        return headerRule(3, state, start, end);
      }),
      
      new InputRule(/^#{4}\s/, (state, _match, start, end) => {
        return headerRule(4, state, start, end);
      }),
      
      new InputRule(/^#{5}\s/, (state, _match, start, end) => {
        return headerRule(5, state, start, end);
      }),
      
      new InputRule(/^#{6}\s/, (state, _match, start, end) => {
        return headerRule(6, state, start, end);
      }),
      
      // 引用规则 - 使用你的quote节点
      new InputRule(/^>\s$/, (state, _match, start, end) => {
        const { tr } = state;
        const resolvedPos = tr.doc.resolve(start);
        const topPos = getTopNodePos(state, resolvedPos);
        const node = resolvedPos.node();

        // 获取当前块的内容
        const blockStart = topPos.before();
        const blockEnd = topPos.after();
        
        // 使用InputRule提供的start和end计算需要切割的长度
        const hashLength = end - start;
        const content = node.content.cut(hashLength);
      
        let contentNode = content;

        if (content.size === 0) {
          // 插入一个空的textBlock
          const textBlockNode = schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [])
          ]);
          contentNode = Fragment.from([textBlockNode]);
        }

        // 创建新的header节点，包含原有的内容结构（去掉开头的#空格）
        const quoteNode = schema.nodes.quote.create(
          { id: nanoid(8) },
          contentNode,
        );
        
        tr.delete(blockStart, blockEnd);
        tr.insert(blockStart, quoteNode);

        // 光标定位到开始位置
        tr.setSelection(TextSelection.create(tr.doc, blockStart));
        
        return tr;
      }),
      
      // 代码块规则 - 使用你的coder节点
      new InputRule(/^```\s$/, (state, _match, start, end) => {
        const { tr } = state;
        const resolvedPos = tr.doc.resolve(start);
        const topPos = getTopNodePos(state, resolvedPos);
        const node = resolvedPos.node();

        // 获取当前块的内容
        const blockStart = topPos.before();
        const blockEnd = topPos.after();
        
        // 使用InputRule提供的start和end计算需要切割的长度
        const hashLength = end - start;
        const content = node.content.cut(hashLength);
      
        let contentNode = content;

        // 创建新的header节点，包含原有的内容结构（去掉开头的#空格）
        const quoteNode = schema.nodes.coder.spec.create(
          schema,
          { language: 'javascript' },
          contentNode,
        );
        
        tr.delete(blockStart, blockEnd);
        tr.insert(blockStart, quoteNode);

        return tr;
      }),
      // divider
      new InputRule(/^(---|\*\*\*)\s$/, (state, _match, start, end) => {
        const { tr } = state;
        const resolvedPos = tr.doc.resolve(start);
        const topPos = getTopNodePos(state, resolvedPos);
        
        // 获取当前块的内容
        const blockStart = topPos.before();

        // 创建新的header节点，包含原有的内容结构（去掉开头的#空格）
        const quoteNode = schema.nodes.divider.spec.create(
          schema,
          {},
        );
        
        tr.delete(start, end);
        tr.insert(blockStart, quoteNode);

        return tr;
      }),

      // code mark
      new InputRule(/`([^`]+)`/, (state, match, start, end) => {
        const { tr } = state;

        tr.delete(start, start + 1);
        tr.addMark(start, end - 1, schema.marks.code.create({}));

        return tr;
      }),

      new InputRule(/\*\*([^*]+)\*\*\s/, (state, match, start, end) => {
        const { tr } = state;

        tr.delete(end - 2, end);
        tr.delete(start, start + 2);
  
        tr.addMark(start, end - 4, schema.marks.strong.create({}));

        return tr;
      }),

      // 斜体
      new InputRule(/\*([^*]+)\*\s/, (state, match, start, end) => {
        const { tr } = state;

        tr.delete(end - 1, end);
        tr.delete(start, start + 1);
  
        tr.addMark(start, end - 2, schema.marks.italic.create({}));

        return tr;
      }),

      // 下划线
      new InputRule(/~([^~]+)~\s/, (state, match, start, end) => {
        const { tr } = state;

        tr.delete(end - 1, end);
        tr.delete(start, start + 1);
  
        tr.addMark(start, end - 2, schema.marks.underline.create({}));

        return tr;
      }),

      // 删除线
      new InputRule(/~~([^~]+)~~\s/, (state, match, start, end) => {
        const { tr } = state;

        tr.delete(end - 2, end);
        tr.delete(start, start + 2);
  
        tr.addMark(start, end - 4, schema.marks.strikethrough.create({}));

        return tr;
      }),

      // 无序列表
      new InputRule(/^(-|\*)\s/, (state, match, start, end) => {
        return listRule(ListTypeEnum.BULLET, state, start, end);
      }),

      // todo列表
      new InputRule(/^\[\]\s/, (state, match, start, end) => {
        return listRule(ListTypeEnum.TODO, state, start, end);
      }),
    ]
  });
} 