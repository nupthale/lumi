import { nanoid } from 'nanoid';

import { schema } from '../../../schema/index';

export const enter = (state, dispatch, _view) => {
    const { $from } = state.selection;
    const tr = state.tr;
    
    if (
      $from.parent.type.name !== 'textBlock_head'
    ) {
      return false;
    }

    const textBlockNode = $from.node($from.depth - 1);

    if (!textBlockNode) return false;

    tr.split($from.pos, 2, [{
        type: schema.nodes.textBlock,
        attrs: {
            id: nanoid(8),
        },
    }]).scrollIntoView();

    dispatch?.(tr);

    return true;
}

export const shiftEnter = (state, dispatch, _view) => {
  const { $from } = state.selection;
  const tr = state.tr;
  
  if (
    $from.parent.type.name !== 'textBlock_head'
  ) {
    return false;
  }

  tr.insertText('\n');

  dispatch?.(tr);

  return true;
}