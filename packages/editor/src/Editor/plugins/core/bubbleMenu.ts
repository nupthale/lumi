import { Plugin, PluginKey, NodeSelection, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { showPopover$, hidePopover$ } from '../../event';
import { PopoverTypeEnum } from '../../interface';
import { defaultCommands } from '../../shared/bubbleMenu';
import { CellSelection } from '../nodes/table/cellselection';
import { MultiBlockSelection } from '../selection/multiBlock';

export const bubbleMenuPluginKey = new PluginKey('bubbleMenu');

export const bubbleMenuPlugin = () => {
    return [
        new Plugin({
            key: bubbleMenuPluginKey,
            props: {
                handleDOMEvents: {
                    mousedown: (_view: EditorView, _event) => {
                        // 先隐藏
                        hidePopover$.next({ type: PopoverTypeEnum.BUBBLE_MENU });
                        hidePopover$.next({ type: PopoverTypeEnum.MENTION });
                        hidePopover$.next({ type: PopoverTypeEnum.FLOAT_MENU });
                    },
                    keydown: () => {
                        // 先隐藏
                        // hidePopover$.next({ type: PopoverTypeEnum.BUBBLE_MENU });
                        hidePopover$.next({ type: PopoverTypeEnum.FLOAT_MENU });
                    },
                }
            },
            view: (editorView: EditorView) => {
                return {
                    update: (view: EditorView, prevState) => {
                        const { state } = view;
                        const { selection } = state;
                        const { empty, from, to, anchor, head } = selection;

                        // 如果选区为空，隐藏菜单
                        // Windows 上输入标点符号时可能会产生一个单字符的选区，这种情况也应该隐藏菜单
                        const isSpuriousSelection = !empty && (to - from === 1) && 
                            prevState && prevState.selection.empty && prevState.selection.from === from;
                        
                        if (selection instanceof TextSelection && (empty || from === to || isSpuriousSelection)) {
                            hidePopover$.next({ type: PopoverTypeEnum.BUBBLE_MENU });
                            return;
                        }

                        // 如果是 CellSelection，不处理（由 table 自己处理）
                        if (selection instanceof CellSelection || selection instanceof MultiBlockSelection) {
                            return;
                        }

                        // 如果是 NodeSelection，隐藏菜单
                        if (selection instanceof NodeSelection) {
                            hidePopover$.next({ type: PopoverTypeEnum.BUBBLE_MENU });
                            return;
                        }

                        // 如果在 title 节点内，则隐藏菜单
                        const node = state.doc.resolve(from).node();
                        if (node.type.name === 'title') {
                            hidePopover$.next({ type: PopoverTypeEnum.BUBBLE_MENU });
                            return;
                        }

                        const dest = anchor < head ? to : from;
                        // 触发显示气泡菜单
                        showPopover$.next({
                            type: PopoverTypeEnum.BUBBLE_MENU,
                            range: [dest, dest],
                            placement: anchor < head ? 'bottom' : 'top',
                            useMaxHeight: false,
                            params: {
                                commands: defaultCommands
                            },
                        });
                    }
                };
            },
        })
    ];
}