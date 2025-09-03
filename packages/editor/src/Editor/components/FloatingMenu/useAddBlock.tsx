import { NodeType, Schema } from "prosemirror-model"

import { contextStore } from '@editor/Editor/store/context';
import { TextSelection } from 'prosemirror-state';

export const useAddBlock = () => {
    const createBlock = (schema: Schema, type: NodeType, attrs: any) => {
        return type.spec.create(schema, attrs)
    }

    // 在下方插入
    const insertAfter = (pos: number | undefined, schema: Schema, type: NodeType, attrs: any) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView || !pos) {
            return;
        }
        
        if (type.name === 'divider') {
            insertAfterDivider(pos, schema, type, attrs);
            return;
        }

        const view = editorView;
        const resolvedPos = view.state.doc.resolve(pos + 1);
        const tr = view.state.tr;
        const dispatch = view.dispatch;

        const textBlockEnd = resolvedPos.after();

        tr.insert(textBlockEnd, createBlock(schema, type, attrs));

        // 映射旧位置到新文档位置
        const mappedPos = tr.mapping.map(textBlockEnd);
        const $mappedPos = tr.doc.resolve(mappedPos);

        const newSelection = TextSelection.near(
            $mappedPos,
            -1,
        );

        tr.setSelection(newSelection);

        dispatch(tr);
    
        view.focus();
    }

    // 如果是divider，直接保留当前textBlock， 然后在textBlock上方新增一个divider， 然后focus到当前textBlock
    const addDivider = (pos: number | undefined, schema: Schema, type: NodeType, attrs: any) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView || !pos) {
            return;
        }

        const view = editorView;
        const resolvedPos = view.state.doc.resolve(pos);
        const tr = view.state.tr;
        const dispatch = view.dispatch;

        const textBlockBefore = resolvedPos.before();
        
        tr.insert(textBlockBefore, createBlock(schema, type, attrs));

        const newPos = tr.mapping.map(textBlockBefore);
        tr.setSelection(
            TextSelection.create(
                tr.doc, 
                newPos,
            )
        );

        dispatch(tr);

        view.focus?.();
    }

    // insert divider后， 还要插入一个textBlock， 并focus到那里
    const insertAfterDivider = (pos: number | undefined, schema: Schema, type: NodeType, attrs: any) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView || !pos) {
            return;
        }
        
        const view = editorView;
        const resolvedPos = view.state.doc.resolve(pos + 1);
        const tr = view.state.tr;
        const dispatch = view.dispatch;

        const textBlockEnd = resolvedPos.after();

        const divider = createBlock(schema, type, attrs);
        tr.insert(textBlockEnd, createBlock(schema, schema.nodes['textBlock'], {}));
        tr.insert(textBlockEnd, divider);

        // 加上divider的长度
        const newPos = textBlockEnd + divider.nodeSize;

        tr.setSelection(
            TextSelection.create(
                tr.doc, 
                newPos + 1,
            )
        );

        dispatch(tr);

        view.focus?.();
    }

    // 替换当前textBlock
    const addBlock = (pos: number | undefined, schema: Schema, type: NodeType, attrs: any) => {
        const editorView = contextStore.getState().editorView;

        if (!editorView || !pos) {
            return;
        }

        if (type.name === 'divider') {
            addDivider(pos, schema, type, attrs);
            return;
        }

        const view = editorView;
        const resolvedPos = view.state.doc.resolve(pos);
        const tr = view.state.tr;
        const dispatch = view.dispatch;

        const textBlockBefore = resolvedPos.before(); 
        const textBlockAfter = resolvedPos.after(); 

        tr.replaceRangeWith(textBlockBefore, textBlockAfter, createBlock(schema, type, attrs));

        const newBlockStart = tr.mapping.map(textBlockBefore);
        const $newPos = tr.doc.resolve(newBlockStart + 1);

        // focus到新的block
        tr.setSelection(
            TextSelection.create(
                tr.doc, 
                $newPos.start(),
            )
        );

        dispatch(tr);

        view.focus?.();
    }

    return {
        addBlock,
        insertAfter,
    };
    
}