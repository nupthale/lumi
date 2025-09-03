import { ColumnSelection } from '@editor/Editor/plugins/nodes/columns/columnselection';
import { schema } from '@editor/Editor/plugins/schema';
import { contextStore } from '@editor/Editor/store/context';

import { CellSelection } from '@editor/Editor/plugins/nodes/table/cellselection';

import { setCellAttr } from '@editor/Editor/plugins/nodes/table/commands';
import { setColumnAttr } from '@editor/Editor/plugins/nodes/columns/commands';
import { runCommand } from '@editor/Editor/shared/command';

export const useColor = () => {
    const updateTextColor = (color: string) => {
        const editorView = contextStore.getState().editorView;
        const selection = editorView?.state.selection;

        if (!editorView || !selection) return;

        const colorMark = schema.marks.color.create({ color });

        // 在编辑器中应用这个 mark
        const { state, dispatch } = editorView;
        const { from, to } = selection;

        if (from !== to) {
            dispatch(
                state.tr.addMark(from, to, colorMark)
            );
        }
    }

    const updateBackgroundColor = (color: string) => {
        const editorView = contextStore.getState().editorView;
        const selection = editorView?.state.selection;

        if (!editorView || !selection) return;

        const backgroundMark = schema.marks.background.create({ color });

        // 在编辑器中应用这个 mark
        const { state, dispatch } = editorView;
        const { from, to } = selection;

        if (from !== to) {
            dispatch(
                state.tr.addMark(from, to, backgroundMark)
            );
        }
    }

    const updateCellBackgroundColor = (color: string) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView) return;

        const { state } = editorView;
        const { selection } = state;

        // table修改背景色
        if (!(selection instanceof CellSelection)) {
            return;
        }

        runCommand(editorView, setCellAttr('background', color));
    }

    const updateColumnBackgroundColor = (color: string) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView) return;

        const { state } = editorView;
        const { selection } = state;

        // table修改背景色
        if (!(selection instanceof ColumnSelection)) {
            return;
        }

        runCommand(editorView, setColumnAttr('background', color));
    }

    return {
        updateTextColor,
        updateBackgroundColor,
        updateCellBackgroundColor,
        updateColumnBackgroundColor,
    };
}