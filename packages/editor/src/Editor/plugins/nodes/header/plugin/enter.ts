import { nanoid } from 'nanoid';
import { Fragment } from 'prosemirror-model';

import { schema } from '../../../schema/index';
import { TextSelection } from 'prosemirror-state';

export const enter = (state, dispatch, _view) => {
    const { $from } = state.selection;
    const tr = state.tr;
    
    if (
      $from.parent.type.name !== 'header'
    ) {
      return false;
    }

    const headerNode = $from.node();

    if (!headerNode) return false;

    // 如果在header起始位置, 在上方插入空textBlock
    if ($from.parentOffset === 0) {
      tr.insert($from.before(), schema.nodes.textBlock.create({ id: nanoid(8) }, [
        schema.nodes.textBlock_head.create({}, [])
      ]));

      dispatch?.(tr);
      return true;
    }

    const preserveContent = headerNode.slice(
      0,
      $from.parentOffset,
    )?.content;

    // 把后半段， 放到哦一个新的textBlock里
    const newTextNodeContent = headerNode.slice(
      $from.parentOffset,
      headerNode.content.size,
    )?.content;

    const newHeader = schema.nodes.header.create(
      { id: headerNode.attrs.id, level: headerNode.attrs.level },
      Fragment.from(preserveContent),
    );

    // 把后半段， 放到哦一个新的textBlock里
    const newTextBlock = schema.nodes.textBlock.create({
      id: `text_${nanoid(8)}`,
    }, [
      schema.nodes.textBlock_head.create({}, Fragment.from(newTextNodeContent))
    ]);

    // 替换原有内容
    const pos = $from.before();
    tr.delete(pos, pos + headerNode.nodeSize);
    
    tr.insert(pos, newHeader);
    tr.insert(pos + newHeader.nodeSize, newTextBlock);

    const isAtEnd = $from.end() === $from.pos;
    tr.setSelection(TextSelection.create(tr.doc, $from.after() + (isAtEnd ? 1 : 0))).scrollIntoView();

    dispatch?.(tr);

    return true;
}

export const shiftEnter = (state, dispatch, _view) => {
  const { $from } = state.selection;
  const tr = state.tr;
  
  if (
    $from.parent.type.name !== 'header'
  ) {
    return false;
  }

  tr.insertText('\n');

  dispatch?.(tr);

  return true;
}