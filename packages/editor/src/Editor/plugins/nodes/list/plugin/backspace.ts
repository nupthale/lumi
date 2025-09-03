
import { nanoid } from 'nanoid';
import { Fragment } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';

import { decreaseIndent } from './indent';
import { getListBodyNodes, getRangeByPos, getPrevNodeRange, getDeepestContentEnd, getRangeByNode } from '../../../../shared';
import { schema } from '../../../schema/index';

export const removePseudo = (state, dispatch, _view) => {
  const { $from } = state.selection;
  const tr = state.tr;

  const listNode = $from.node($from.depth - 1);

  // 如果selection不是空的， 则不处理
  if (!state.selection.empty) {
    return false;
  }

  // 当光标位于开始位置
  if (
    $from.parentOffset === 0
  ) {
    const leftNodeContent = $from.node().children;

    // body node
    const bodyNode = listNode.children[1];
    const range = getRangeByNode(state, listNode);

    const newChildren = [schema.nodes.textBlock_head.create({}, leftNodeContent)];

    if (bodyNode?.children?.length) {
      newChildren.push(schema.nodes.textBlock_body.create({}, bodyNode?.children));
    }

    tr.replaceRangeWith(
      range[0],
      range[1],
      schema.nodes.textBlock.create({
        id: nanoid(8),
      }, newChildren),
    );
    
    tr.setSelection(
      TextSelection.create(tr.doc, range[0] + 2),
    );

    dispatch?.(tr);
    return true;
  }

  return false;
}

// 如果选区跨block， 且结束的block是list， 则需要对结束的block特殊处理。
// 把最后一个block先删除， 然后再把slice后的endBlock， 重新insert。
const deleteSelection = (state, dispatch, view) => {
  const { $from, $to} = state.selection;
  const tr = state.tr;

  const endListNode = $to.node($to.depth - 1);

  if ($from.node() !== $to.node()) {
    // 1. 删除从$from到endListNode
    const endListRange = getRangeByNode(state, endListNode);
    tr.deleteRange(
      $from.pos,
      endListRange[1],
    );

    const leftListHead = endListNode.firstChild.cut(
      $to.parentOffset,
      undefined,
    );

    const leftListBody = endListNode.childCount > 1 ? endListNode.child(1) : undefined;

    // 3. 如果endListNode是一个list, 则把leftContent插入到$from的位置
    tr.insert($from.pos, leftListHead.content);
    if (leftListBody) {
      tr.insert($from.pos + leftListHead.content.size + 1, leftListBody);
    }

    tr.setSelection(
      TextSelection.create(tr.doc, $from.pos),
    );

    dispatch(tr);
    return true;
  }

  return false;
}

export const backspace = (state, dispatch, view) => {
    // 如果list-head内容删空了， 就改成textBlock
    const { $from } = state.selection;

    if ($from.parent.type.name !== 'list_head') return false;

    if (
      deleteSelection(state, dispatch, view) ||
      removePseudo(state, dispatch, view)
    ) {
      return true;
    }

    return false;
}