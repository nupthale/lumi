
import { Fragment } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';

import { getPrevNodeRange, getDeepestContentEnd, getRangeByNode } from '../../../../shared';

export const removeText = (state, dispatch, _view) => {
  const { $from } = state.selection;
  const tr = state.tr;

  const textNode = $from.node($from.depth - 1);

  // 当光标位于head start，则去除text节点， 把head的文本放到上一个node的末尾， body的内容提升一层
  if (
    $from.parentOffset === 0
  ) {
      // head的文本内容
      const leftNodeContent = $from.node().children;
      // body node
      const bodyNode = textNode.children[1];
      
      const range = getRangeByNode(state, textNode);

      if (bodyNode?.children?.length) {
        tr.replaceRangeWith(
          range[0],
          range[1],
          bodyNode?.children,
        );
      } else {
        tr.deleteRange(
          range[0],
          range[1],
        );
      }
      
      const startResolvedPos = state.doc.resolve($from.before());
      const prevNodeEnd = TextSelection.near(startResolvedPos, -1);
      tr.insert(prevNodeEnd.from, Fragment.from(leftNodeContent));

      tr.setSelection(
        TextSelection.create(tr.doc, prevNodeEnd.from),
      );

      dispatch?.(tr);
      return true;
  }

  return false;
}

export const backspace = (state, dispatch, view) => {
    const { $from, empty } = state.selection;

    if ($from.parent.type.name !== 'textBlock_head') return false;

    if (
      empty &&
      // 当光标位于head start，则去除text节点， 把head的文本放到上一个node的末尾， body的内容提升一层
      removeText(state, dispatch, view)
    ) {
      return true;
    }

    return false;
}