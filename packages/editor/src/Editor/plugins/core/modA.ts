import { SelectionRange, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { contextStore } from '@editor/Editor/store/context';
import { getRangeByNode, getTopNodePos } from '@editor/Editor/shared/index';
import { MultiBlockSelection } from '../selection/multiBlock';

let lastNodeSelection: number[] = [];

document.body.addEventListener('keydown', ((event: Event) => {
  const keyboardEvent = event as KeyboardEvent;
  // 检查是否是 Cmd+A (Mac) 或 Ctrl+A (Windows)
  const isModKey = keyboardEvent.metaKey || keyboardEvent.ctrlKey;
  const isAKey = keyboardEvent.key.toLowerCase() === 'a';
  
  // 如果事件发生在 input 或 textarea 中，不处理
  const target = event.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    return;
  }
  
  if (isModKey && isAKey) {
    // 获取编辑器实例
    const editorElement = document.querySelector('.ProseMirror');
    if (!editorElement) return;

    // 获取编辑器视图
    const view = contextStore.getState().editorView;
    if (!view) return;

    event.preventDefault();
    event.stopPropagation();
    
    // 调用 modA 函数
    modA(view.state, view.dispatch, view, true);
  }
}) as EventListener, false); // 使用捕获阶段，确保在事件冒泡之前处理


// mod + A选中当前node里的所有内容
export const modA = (state, dispatch, view: EditorView, fromDocument: boolean) => {
  const { $from, from, to } = state.selection;
  const tr = state.tr;

  if (state.selection instanceof MultiBlockSelection) {
    return true;
  }

  // 检查编辑器是否获得焦点, 如果没有获得焦点， 则全选body的内容
  if (!view.hasFocus() || (!fromDocument && lastNodeSelection[0] === from && lastNodeSelection[1] === to)) {
    // 如果编辑器没有焦点，则全选body的内容
    const body = state.doc.content.child(1);
    const ranges: SelectionRange[] = [];

    body.children.forEach(child => {
      const [childFrom, childTo] = getRangeByNode(state, child);
      ranges.push(
        new SelectionRange(
          state.doc.resolve(childFrom),
          state.doc.resolve(childTo),
        ),
      );
    })

    tr.setSelection(
      new MultiBlockSelection(ranges),
    );

    dispatch?.(tr);
    view.focus();

    return true;
  }

  // 不能选中title
  const topPos = getTopNodePos(state, $from);
  
  if (topPos.parent.type.name === 'doc') {
    return true;
  }

  lastNodeSelection = [
    topPos.start(),
    topPos.end(),
  ];

  tr.setSelection(
    TextSelection.create(
      state.doc,
      lastNodeSelection[0],
      lastNodeSelection[1],
    ),
  );

  dispatch?.(tr);

  return true;
}