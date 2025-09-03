import { getNearestAncestor, getRangeByNode } from '@editor/Editor/shared/index';
import { NodeSelection } from 'prosemirror-state';

export const isAtStart = (state, nodeName) => {
    const { $from } = state.selection;
  
    // 找到$from上层最近的nodeName， 选中node
    const nearestAncestor = getNearestAncestor($from, nodeName);

    if (!nearestAncestor) return false;

    const [from] = getRangeByNode(state, nearestAncestor);
    const nodePos = state.doc.resolve(from + 1);

    return $from.parentOffset === 0 && (
        $from.before() === nodePos.start() || 
        $from.before() === nodePos.before()
    );
}

export const selectBlock = (state, dispatch, nodeName) => {
  const { $from } = state.selection;
  const tr = state.tr;

  // 找到$from上层最近的nodeName， 选中node
  const nearestAncestor = getNearestAncestor($from, nodeName);
  if (!nearestAncestor) return false;

  const [from] = getRangeByNode(state, nearestAncestor)

  tr.setSelection(NodeSelection.create(tr.doc, from));

  dispatch(tr);

  return true;
}