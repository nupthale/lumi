import { ResolvedPos } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { ColumnSelection } from './columnselection';

export function pointsAtColumn($pos: ResolvedPos): boolean {
    return $pos.parent.type.name == 'columns' && !!$pos.nodeAfter;
}

export function inSameColumns($columnA: ResolvedPos, $columnB: ResolvedPos): boolean {
    return (
      $columnA.depth == $columnB.depth &&
      $columnA.pos >= $columnB.start(-1) &&
      $columnA.pos <= $columnB.end(-1)
    );
  }

export function isInColumns(state: EditorState): boolean {
    const $head = state.selection.$head;
    for (let d = $head.depth; d > 0; d--)
      if ($head.node(d).type.name == 'column') return true;
    return false;
  }

export function selectionColumn(state: EditorState): ResolvedPos {
    const sel = state.selection as ColumnSelection | NodeSelection;
    if ('$anchorColumn' in sel && sel.$anchorColumn) {
      return sel.$anchorColumn.pos > sel.$headColumn.pos
        ? sel.$anchorColumn
        : sel.$headColumn;
    } else if (
      'node' in sel &&
      sel.node &&
      sel.node.type.name == 'column'
    ) {
      return sel.$anchor;
    }
    const $column = columnAround(sel.$head) || columnNear(sel.$head);
    if ($column) {
      return $column;
    }
    throw new RangeError(`No column found around position ${sel.head}`);
  }  

  export function columnAround($pos: ResolvedPos): ResolvedPos | null {
    for (let d = $pos.depth - 1; d > 0; d--)
      if ($pos.node(d).type.name == 'columns')
        return $pos.node(0).resolve($pos.before(d + 1));
    return null;
  }

  export function columnNear($pos: ResolvedPos): ResolvedPos | undefined {
    for (
      let after = $pos.nodeAfter, pos = $pos.pos;
      after;
      after = after.firstChild, pos++
    ) {
      const typeName = after.type.name;
      if (typeName == 'column') return $pos.doc.resolve(pos);
    }
    for (
      let before = $pos.nodeBefore, pos = $pos.pos;
      before;
      before = before.lastChild, pos--
    ) {
      const typeName = before.type.name;
      if (typeName == 'column')
        return $pos.doc.resolve(pos - before.nodeSize);
    }
  }