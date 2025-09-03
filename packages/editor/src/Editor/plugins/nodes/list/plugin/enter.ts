import { nanoid } from 'nanoid';
import { TextSelection } from 'prosemirror-state';

import { schema } from '../../../schema/index';
import { decreaseIndent } from './indent';
import { ListTypeEnum } from '../interface';
import { getRangeByPos } from '@editor/Editor/shared';

export const enter = (state, dispatch, view) => {
    const { $from } = state.selection;
    const tr = state.tr;

    if (
      $from.parent.type.name !== 'list_head'
    ) {
      return false;
    }

    const listNode = $from.node($from.depth - 1);

    if (!listNode) return false;

    const listHeadNode = $from.node();

    if (listHeadNode.textContent === '' && $from.depth - 3 > 0) {
      // doc -> body -> list -> list_head， 所以depth是3
      // if ($from.depth - 3 === 0) {
       
      //   backspace(state, dispatch, view);
      //   return true;
      // }

      return decreaseIndent(state, dispatch, view);
    }

    // split list， 不能用split方法， 因为split后， 第二个list的listHead的index不能和第一个一样。
    // 所以只能手动split

    const listHead1 = listHeadNode.slice(0, $from.parentOffset);
    const listHead2 = listHeadNode.slice($from.parentOffset);
    
    const listBody = listNode.childCount > 1 ? listNode.lastChild : null;

    const newContent = [
      schema.nodes.list_head.create({
        ...listHeadNode.attrs,
        // 这里覆盖为默认值
        index: undefined,
      }, listHead2.content),
    ];

    if (listBody) {
      newContent.push(listBody);
    }

    // 先插入listHead2
    tr.replaceRangeWith(
      $from.before(-1),
      $from.after(-1),
      schema.nodes.list.create(
        {
          id: nanoid(8),
        },
        newContent,
      ),
    );

    const list1 = schema.nodes.list.create({
      id: nanoid(8),
    }, schema.nodes.list_head.create({
      ...listHeadNode.attrs,
    }, listHead1.content));

    // 再插入listHead1
    tr.insert(
      $from.before(-1), 
      list1,
    );

    // 光标放到listHead2的start位置
    tr.setSelection(
      TextSelection.create(
        tr.doc,
        $from.before(-1) + list1.nodeSize + 2,
      )
    );
    // tr.split($from.pos, 2, [{
    //     type: schema.nodes.list,
    //     attrs: {
    //         id: nanoid(8),
    //     },
    // }]).scrollIntoView();

    dispatch?.(tr);

    return true;
}