import { contextStore } from '@editor/Editor/store/context';

import { deleteColumn } from '@editor/Editor/plugins/nodes/columns/commands';
import { ColumnSelection } from '@editor/Editor/plugins/nodes/columns/columnselection';

export const useColumns = () => {

    const handleDeleteColumn = () => {
        const editorView = contextStore.getState().editorView;
        if (!editorView) return;

        const { state, dispatch } = editorView;
        const selection = state.selection;

        if (!(selection instanceof ColumnSelection)) return;

        deleteColumn(state, dispatch);
    }

    return {
        handleDeleteColumn,
    };
}