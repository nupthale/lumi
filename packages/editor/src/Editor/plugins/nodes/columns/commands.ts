import { Transaction, EditorState, Command } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { nanoid } from 'nanoid';

import { ColumnsView } from './view/columns';
import { ColumnsMap } from './map';

import { schema } from '@editor/Editor/plugins/schema/index';

import { ColumnIndexRange } from './map';
import { isInColumns, selectionColumn } from './util';
import { ColumnSelection } from './columnselection';
 
// 在index前插入column
export const addColumn = (tr: Transaction, columnsView: ColumnsView, index: number) => {
    const pos = columnsView.getPos();
    const node = columnsView.node;

    if (!pos || !node) return;

    const map = ColumnsMap.get(node);
    if (!map) return;

    let insertPos = pos + map.map[index] || 1;

    if (index >= map.map.length) {
      const posArr = map.map || [];
      const lastColumnPos = posArr[posArr.length - 1];
      const lastColumn = node.nodeAt(lastColumnPos - 1);

      insertPos = pos + lastColumnPos + (lastColumn?.nodeSize || 0);
    }
    
    tr.insert(insertPos, schema.nodes.column.create(
        {
            id: nanoid(8),
        },
        schema.node('textBlock', { id: nanoid(8) }, [
            schema.node('textBlock_head', {
                id: nanoid(8),
            }, [])
        ]),
    ));

    const colWidths = [...node.attrs.colWidths];
    colWidths.splice(index, 0, 400);

    tr.setNodeMarkup(pos, node.type, {
        ...node.attrs,
        colWidths
    })

    return tr;
}

export function removeColumn(
    tr: Transaction,
    { map, columnsNode, columnsStart }: ColumnIndexRange & { map: ColumnsMap, columnsStart: number, columnsNode: Node },
    col: number,
  ) {
    const mapStart = tr.mapping.maps.length;
    const pos = map.map[col];
    const column = columnsNode.nodeAt(pos - 1)!;

    // If this is part of a col-spanning cell
    const start = tr.mapping.slice(mapStart).map(columnsStart + pos);
    const end = tr.mapping.slice(mapStart).map(columnsStart + pos + column.nodeSize);

    tr.delete(start, end);
  }

export const deleteColumn = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
) => {
    if (!isInColumns(state)) return false;

    if (dispatch) {
        const range = selectedRange(state);
        const { startIndex, endIndex, columnsNode, columnsStart } = range;
        const tr = state.tr;
        const node = columnsNode;

        const colWidths = [...node.attrs.colWidths];
        colWidths.splice(startIndex, endIndex - startIndex + 1);

        // 删除整个columns
        if (colWidths.length === 0) {
          tr.deleteRange(columnsStart, columnsStart + columnsNode.nodeSize);
        } else {
          for (let i = endIndex; i >= startIndex ; i--) {
            removeColumn(tr, range, i);
          }

          tr.setNodeAttribute(columnsStart, 'colWidths', colWidths);
        }
        dispatch(tr);
      }
      return true;
}

export function selectedRange(state: EditorState): ColumnIndexRange & { map: ColumnsMap, columnsStart: number, columnsNode: Node } {
    const sel = state.selection;
    const $pos = selectionColumn(state);
    const columnsNode = $pos.node();
    const columnsStart = $pos.before();
    const map = ColumnsMap.get(columnsNode);
    const rect =
      sel instanceof ColumnSelection
        ? map.rangeBetween(
            sel.$anchorColumn.pos - columnsStart,
            sel.$headColumn.pos - columnsStart,
          )
        : map.findColumn($pos.pos - columnsStart);
    return { ...rect, columnsStart, map, columnsNode };
  }

  export function setColumnAttr(name: string, value: unknown): Command {
    return function (state, dispatch) {
      if (!isInColumns(state)) return false;
      const $cell = selectionColumn(state);
      if ($cell.nodeAfter!.attrs[name] === value) return false;
      if (dispatch) {
        const tr = state.tr;
        if (state.selection instanceof ColumnSelection)
          state.selection.forEachColumn((node, pos) => {
            if (node.attrs[name] !== value)
              tr.setNodeMarkup(pos, null, {
                ...node.attrs,
                [name]: value,
              });
          });
        else
          tr.setNodeMarkup($cell.pos, null, {
            ...$cell.nodeAfter!.attrs,
            [name]: value,
          });
        dispatch(tr);
      }
      return true;
    };
  }
  