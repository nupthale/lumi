import { nanoid } from 'nanoid';
import { isNil } from 'lodash-es';
import { TextSelection } from 'prosemirror-state';

import { schema } from '../../../schema/index';
import { getRangeByPos } from '../../../../shared/index';
import { ListTypeEnum } from '../interface';

// 如果前面是数字. 就把当前paragarph 转换为 list
export const whitespace = (state, dispatch, _view) => {
    const { $from } = state.selection;
    const tr = state.tr;

    if (
      $from.parent.type.name !== 'textBlock_head'
    ) {
      return false;
    }

    const textBlock = $from.node();
    const content = textBlock.textContent;

    // content startWith 是数字. 就把当前paragarph 转换为 list
    if (/^\d+\.(.*)$/.test(content)) {
      const range = getRangeByPos($from);
      
      const matchResult = content.match(/^(\d+)\.(.*)$/);
      const index = matchResult?.[1];
      const newText = matchResult?.[2];
      const newTextNode = newText?.trim() ? [schema.text(newText)] : [];

      const listHead = schema.nodes.list_head.create({
          id: nanoid(8),
          type: ListTypeEnum.ORDERED,
          index: isNil(index) ? undefined : Number(index),
      }, newTextNode);

      tr.replaceRangeWith(
        range[0], 
        range[1], 
        schema.nodes.list.create(
            {
                id: nanoid(8),
            },
            listHead,
        )
      );

      tr.setSelection(TextSelection.create(tr.doc, range[0] + 1));

      dispatch?.(tr);
      return true;
    }

    return false;
}