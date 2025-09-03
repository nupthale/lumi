// This file defines a ProseMirror selection subclass that models
// table cell selections. The table plugin needs to be active to wire
// in the user interaction part of table selections (so that you
// actually get such selections when you select across cells).

import { Fragment, Node, ResolvedPos, Slice } from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  Selection,
  SelectionRange,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { Decoration, DecorationSet, DecorationSource } from 'prosemirror-view';

import { Mappable } from 'prosemirror-transform';
import { inSameColumns, pointsAtColumn } from './util';

import { ColumnsMap } from './map';

/**
 * @public
 */
export interface ColumnSelectionJSON {
  type: string;
  anchor: number;
  head: number;
}

/**
 * A [`Selection`](http://prosemirror.net/docs/ref/#state.Selection)
 * subclass that represents a cell selection spanning part of a table.
 * With the plugin enabled, these will be created when the user
 * selects across cells, and will be drawn by giving selected cells a
 * `selectedCell` CSS class.
 *
 * @public
 */
export class ColumnSelection extends Selection {
  // A resolved position pointing _in front of_ the anchor cell (the one
  // that doesn't move when extending the selection).
  public $anchorColumn: ResolvedPos;

  // A resolved position pointing in front of the head cell (the one
  // moves when extending the selection).
  public $headColumn: ResolvedPos;

  constructor($anchorColumn: ResolvedPos, $headColumn: ResolvedPos = $anchorColumn) {
    const columns = $anchorColumn.node();
    const columnsStart = $anchorColumn.start();

    const doc = $anchorColumn.node(0);

    let ranges: SelectionRange[] = [];
    let offset = 1;

    const startPos = $anchorColumn.before();
    const endPos = $headColumn.after();

    for (let i = 0; i < columns.childCount; i++) {
      const child = columns.child(i);

      if (columnsStart + offset >= startPos && columnsStart + offset <= endPos) {
        ranges.push(
          new SelectionRange(
            doc.resolve(columnsStart + offset),
            doc.resolve(columnsStart + offset + child.nodeSize),
          ),
        );
      }

      offset += child.nodeSize;
    }

    super(ranges[0].$from, ranges[0].$to, ranges);

    this.$anchorColumn = $anchorColumn;
    this.$headColumn = $headColumn;
  }

  public map(doc: Node, mapping: Mappable): ColumnSelection | Selection {
    const $anchorColumn = doc.resolve(mapping.map(this.$anchorColumn.pos));
    const $headColumn = doc.resolve(mapping.map(this.$headColumn.pos));
    if (
      pointsAtColumn($anchorColumn) &&
      pointsAtColumn($headColumn) &&
      inSameColumns($anchorColumn, $headColumn)
    ) {
      return new ColumnSelection(
        $anchorColumn,
        $headColumn,
      );
    }
    return TextSelection.between($anchorColumn, $headColumn);
  }

  // Returns a rectangular slice of table rows containing the selected
  // cells.
  public content(): Slice {
    const columns = this.$anchorColumn.node();
    const map = ColumnsMap.get(columns);

    if (!map) {
      return Slice.empty;
    }

    const { startIndex, endIndex } = map.rangeBetween(this.$anchorColumn.pos, this.$headColumn.pos);
    
    const nodes: Node[] = [];
    let offset = 1;

    for (let i = 0; i < columns.childCount; i++) {
      const column = columns.child(i);
      if (i >= startIndex && i <= endIndex) {
        nodes.push(...column.content.content);
      }
      offset += column.nodeSize;
    }

    return new Slice(Fragment.from(nodes), 0, 0);
  }

  public replace(tr: Transaction, content: Slice = Slice.empty): void {
    const mapFrom = tr.steps.length,
      ranges = this.ranges;
    for (let i = 0; i < ranges.length; i++) {
      const { $from, $to } = ranges[i],
        mapping = tr.mapping.slice(mapFrom);
      tr.replace(
        mapping.map($from.pos),
        mapping.map($to.pos),
        i ? Slice.empty : content,
      );
    }
    const sel = Selection.findFrom(
      tr.doc.resolve(tr.mapping.slice(mapFrom).map(this.to)),
      -1,
    );
    if (sel) tr.setSelection(sel);
  }

  public replaceWith(tr: Transaction, node: Node): void {
    this.replace(tr, new Slice(Fragment.from(node), 0, 0));
  }

  public forEachColumn(f: (node: Node, pos: number) => void): void {
    const columnsNode = this.$anchorColumn.node();
    const columnsStart = this.$anchorColumn.before();

    const map = ColumnsMap.get(columnsNode);

    const columns = map.columnsInRange(
      map.rangeBetween(
        this.$anchorColumn.pos - columnsStart,
        this.$headColumn.pos - columnsStart,
      ),
    );

    columns.forEach((columnPos) => {
      f(columnsNode.nodeAt(columnPos - 1)!, columnsStart + columnPos);
    });
  }

  public eq(other: unknown): boolean {
    return (
      other instanceof ColumnSelection &&
      other.$anchorColumn.pos == this.$anchorColumn.pos &&
      other.$headColumn.pos == this.$headColumn.pos
    );
  }

  public toJSON(): ColumnSelectionJSON {
    return {
      type: 'column',
      anchor: this.$anchorColumn.pos,
      head: this.$headColumn.pos,
    };
  }

  static fromJSON(doc: Node, json: ColumnSelectionJSON): ColumnSelection {
    return new ColumnSelection(doc.resolve(json.anchor), doc.resolve(json.head));
  }

  static create(
    doc: Node,
    anchorColumn: number,
    headColumn: number = anchorColumn,
  ): ColumnSelection {
    return new ColumnSelection(doc.resolve(anchorColumn), doc.resolve(headColumn));
  }

  getBookmark(): CellBookmark {
    return new CellBookmark(this.$anchorColumn.pos, this.$headColumn.pos);
  }
}

ColumnSelection.prototype.visible = false;

Selection.jsonID('column', ColumnSelection);

/**
 * @public
 */
export class CellBookmark {
  constructor(
    public anchor: number,
    public head: number,
  ) {}

  map(mapping: Mappable): CellBookmark {
    return new CellBookmark(mapping.map(this.anchor), mapping.map(this.head));
  }

  resolve(doc: Node): ColumnSelection | Selection {
    const $anchorColumn = doc.resolve(this.anchor),
      $headColumn = doc.resolve(this.head);
    if (
      $anchorColumn.parent.type.name == 'columns' &&
      $headColumn.parent.type.name == 'columns' &&
      $anchorColumn.index() < $anchorColumn.parent.childCount &&
      $headColumn.index() < $headColumn.parent.childCount &&
      inSameColumns($anchorColumn, $headColumn)
    )
      return new ColumnSelection($anchorColumn, $headColumn);
    else return Selection.near($headColumn, 1);
  }
}

export function drawColumnSelection(state: EditorState): DecorationSource | null {
  if (!(state.selection instanceof ColumnSelection)) return null;
  const cells: Decoration[] = [];
  state.selection.forEachColumn((node, pos) => {
    cells.push(
      Decoration.node(pos, pos + node.nodeSize, { class: 'selected' }),
    );
  });
  return DecorationSet.create(state.doc, cells);
}

function isColumnBoundarySelection({ $from, $to }: TextSelection) {
  if ($from.pos == $to.pos || $from.pos < $to.pos - 6) return false; // Cheap elimination
  let afterFrom = $from.pos;
  let beforeTo = $to.pos;
  let depth = $from.depth;
  for (; depth >= 0; depth--, afterFrom++)
    if ($from.after(depth + 1) < $from.end(depth)) break;
  for (let d = $to.depth; d >= 0; d--, beforeTo--)
    if ($to.before(d + 1) > $to.start(d)) break;
  return (
    afterFrom == beforeTo &&
    /columns/.test($from.node(depth).type.name)
  );
}

function isTextSelectionAcrossColumns({ $from, $to }: TextSelection) {
  let fromColumnBoundaryNode: Node | undefined;
  let toColumnBoundaryNode: Node | undefined;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (
      node.type.name === 'column'
    ) {
      fromColumnBoundaryNode = node;
      break;
    }
  }

  for (let i = $to.depth; i > 0; i--) {
    const node = $to.node(i);
    if (
      node.type.name === 'column'
    ) {
      toColumnBoundaryNode = node;
      break;
    }
  }

  return fromColumnBoundaryNode !== toColumnBoundaryNode && $to.parentOffset === 0;
}

export function normalizeSelection(
  state: EditorState,
  tr: Transaction | undefined,
): Transaction | undefined {
  const sel = (tr || state).selection;
  const doc = (tr || state).doc;
  let normalize: Selection | undefined;
  if (sel instanceof NodeSelection) {
    const typeName = sel.node.type.name;

    if (typeName === 'column') {
      normalize = ColumnSelection.create(doc, sel.from, sel.to);
    }
  } else if (sel instanceof TextSelection && isColumnBoundarySelection(sel)) {
    normalize = TextSelection.create(doc, sel.from);
  } else if (sel instanceof TextSelection && isTextSelectionAcrossColumns(sel)) {
    normalize = TextSelection.create(doc, sel.$from.start(), sel.$from.end());
  }
  if (normalize) (tr || (tr = state.tr)).setSelection(normalize);
  return tr;
}
