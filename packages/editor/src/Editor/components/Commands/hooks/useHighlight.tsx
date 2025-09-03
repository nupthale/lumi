
import { Ref } from 'vue';

import { schema } from '@editor/Editor/plugins/schema';
import { contextStore } from '@editor/Editor/store/context';

import { getNearestAncestor, getRangeByNode } from '@editor/Editor/shared';

import { BaseBlockView } from '@editor/Editor/plugins/nodes/_common/baseBlockView';

export const useHighlight = (nodeViewRef?: Ref<BaseBlockView>) => {
    const updateHighlightTextColor = (color: string) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView || !nodeViewRef?.value?.getPos) return;

        // 在编辑器中应用这个 mark
        const { state, dispatch } = editorView;

        const pos = nodeViewRef.value.getPos();

        if (!pos) return;

        dispatch(
            state.tr.setNodeAttribute(pos, 'color', color),
        );
    }

    const updateHighlightBackgroundColor = (color: string) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView || !nodeViewRef?.value?.getPos) return;

        // 在编辑器中应用这个 mark
        const { state, dispatch } = editorView;

        const pos = nodeViewRef.value.getPos();

        if (!pos) return;

        dispatch(
            state.tr.setNodeAttribute(pos, 'background', color),
        );
    }

    const updateHighlightBorderColor = (color: string) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView || !nodeViewRef?.value?.getPos) return;

        // 在编辑器中应用这个 mark
        const { state, dispatch } = editorView;

        const pos = nodeViewRef.value.getPos();

        if (!pos) return;

        dispatch(
            state.tr.setNodeAttribute(pos, 'border', color),
        );
    }

    const updateHighlightSize = (newval: boolean) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView || !nodeViewRef?.value?.getPos) return;

        // 在编辑器中应用这个 mark
        const { state, dispatch } = editorView;

        const pos = nodeViewRef.value.getPos();

        if (!pos) return;

        dispatch(
            state.tr.setNodeAttribute(pos, 'small', newval),
        );
    }

    return {
        updateHighlightTextColor,
        updateHighlightBackgroundColor,
        updateHighlightBorderColor,
        updateHighlightSize,
    };
}