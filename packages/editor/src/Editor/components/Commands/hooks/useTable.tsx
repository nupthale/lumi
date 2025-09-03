import { contextStore } from '@editor/Editor/store/context';

import { CellSelection } from '@editor/Editor/plugins/nodes/table/cellselection';
import { deleteRow, deleteColumn, deleteTable } from '@editor/Editor/plugins/nodes/table/commands';
import { TableMap } from '@editor/Editor/plugins/nodes/table/tablemap';

import { mergeCells } from '@editor/Editor/plugins/nodes/table/commands';

export const useTable = () => {

    // 整行、整列删除
    const handleDeleteRows = () => {
        const editorView = contextStore.getState().editorView;
        if (!editorView) return;
        const { state, dispatch } = editorView;
        const selection = state.selection;

        if (!(selection instanceof CellSelection)) return;

        const table = selection.$anchorCell.node(-1);
        const rowCount = table.childCount;

        if (rowCount <= 1) {
            deleteTable(state, dispatch);
            return;
        }

        deleteRow(state, dispatch);
    }

    const handleDeleteCols = () => {
        const editorView = contextStore.getState().editorView;
        if (!editorView) return;
        const { state, dispatch } = editorView;
        const selection = state.selection;

        if (!(selection instanceof CellSelection)) return;

        const table = selection.$anchorCell.node(-1);
        const map = TableMap.get(table);
        const colCount = map.width || 0;

        if (colCount <= 1) {
            deleteTable(state, dispatch);
            return;
        }

        deleteColumn(state, dispatch);
    }

    const handleMergeSelectedCells = () => {
        const editorView = contextStore.getState().editorView;
        if (!editorView) return;

        const { state, dispatch } = editorView;
        
        mergeCells(state, dispatch);
    };

    return {
        handleDeleteRows,
        handleDeleteCols,
        handleMergeSelectedCells,
    };
}