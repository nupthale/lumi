import { ref } from 'vue';
import { nanoid } from 'nanoid';
import { useEventListener } from '@vueuse/core';
import { Selection } from 'prosemirror-state';

import { contextStore } from '../store/context';
import { schema } from '../plugins/schema/index';

export const useAddEmptyBlock = () => {
  const editorDomRef = ref<HTMLElement | null>(null);

  const handleEditorBottomClick = (event) => {
    if (!editorDomRef.value) return;

    const container = editorDomRef.value as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const contentRect = container.firstElementChild?.getBoundingClientRect();
        
    const editorView = contextStore.getState().editorView;

    if (!contentRect || !editorView) return;

    // 判断点击位置是否在内容区域下方的 padding 区域
    if (event.clientY > contentRect.bottom && event.clientY <= containerRect.bottom) {
        event.preventDefault();
        event.stopPropagation();

        const { state } = editorView;
        const tr = state.tr;
        const docSize = state.doc.content.size;  // 获取文档末尾位置

        // 获取 body 节点的最后一个子节点
        const lastNode = state.doc.lastChild?.lastChild;
        if (
            lastNode?.type !== schema.nodes.textBlock ||
            lastNode?.content.size !== 0
        ) {
            // 在当前位置插入空段落
            tr.insert(
                docSize - 1,
                schema.nodes.textBlock.create({
                  id: nanoid(8),
                }, [
                  schema.nodes.textBlock_head.create({}, [])
                ])
            );
        }

        // 光标定位到最后面
        tr.setSelection(
            Selection.atEnd(tr.doc)
        );
        
        editorView.dispatch(
            tr,
        );

        editorView.focus();
    }
  };

  useEventListener(editorDomRef, 'click', handleEditorBottomClick);

  return {
    editorDomRef,
  };
};