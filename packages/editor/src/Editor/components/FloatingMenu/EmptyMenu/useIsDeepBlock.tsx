
import { computed, Ref } from 'vue';
import { contextStore } from '@editor/Editor/store/context';

import { BaseBlockView } from '../../../plugins/nodes/_common/baseBlockView';

export const useIsDeepBlock = (nodeViewRef: Ref<BaseBlockView | null | undefined>) => {
    // 如果已经在column或者table里， 不允许再添加table和column
    const isDeepBlock = computed(() => {
        const editorView = contextStore.getState().editorView;

        if (!editorView) {
            return;
        }
        const { state } = editorView;
        
        const pos = nodeViewRef.value?.getPos();

        if (!pos) return false;

        const resolvedPos = state.doc.resolve(pos);

        let depth = resolvedPos.depth;
        while (depth > 0) {
            const node = resolvedPos.node(depth);
            if (node.type.name === 'column' || node.type.name === 'table') {
                return true;
            }
            depth--;
        }

        return false;
    });

    return {
        isDeepBlock,
    };
}