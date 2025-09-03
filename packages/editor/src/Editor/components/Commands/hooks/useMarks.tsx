import { ref } from 'vue';

import { schema } from '@editor/Editor/plugins/schema';
import { contextStore } from '@editor/Editor/store/context';
export const useMarks = () => {
    const marksRef = ref<string[]>([]);

    const updateMarks = () => {
        const editorView = contextStore.getState().editorView;
        const selection = editorView?.state?.selection;

        if (!editorView || !selection) return;
    
        const { state } = editorView;
        const { from, to, empty } = selection;
    
        // 如果是空选区，获取光标位置的 marks
        if (empty || from === to) {
            const marks = state.storedMarks || state.doc.resolve(from).marks();
            marksRef.value = marks.map(mark => mark.type.name);
            return;
        }
    
        // 如果是选区，获取选区内所有位置共有的 marks
        marksRef.value = Object.keys(schema.marks).filter(markName => {
            const markType = schema.marks[markName];
            let hasUnmarked = false;

            state.doc.nodesBetween(from, to, (node) => {
                if (node.isText && !node.marks.some(mark => mark.type === markType)) {
                    hasUnmarked = true;
                }
            });

            return !hasUnmarked;
        });
    }

    return {
        marksRef,
        updateMarks,
    };
}