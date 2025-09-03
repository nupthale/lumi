import { Plugin, PluginKey, EditorState, NodeSelection, TextSelection } from 'prosemirror-state';
import { Node } from 'prosemirror-model';

import { MultiBlockSelection } from '@editor/Editor/plugins/selection/multiBlock';
import { Decoration, DecorationSet, DecorationSource } from 'prosemirror-view';

export const selectBlockPluginKey = new PluginKey('selectBlockPlugin');

function isNodeFullySelected(state: EditorState, index: number, count: number, from: number, to: number): boolean {
    // 检查节点的父节点是否被完全选中
    const $start = state.doc.resolve(from);
    const $end = state.doc.resolve(to);

    if (index === 0) {
        return $start.parentOffset === 0;
    }
    
    if (index === count - 1) {
        return $end.parentOffset === $end.parent.content.size;
    }
    
    return true;
}

function findBlockNodesInRange(state: EditorState, from: number, to: number): Decoration[] {
    const decos: Decoration[] = [];
    // 区间选择的nodes
    const nodes: { node: Node, pos: number }[] = [];

    state.doc.nodesBetween(from, to, (node, pos) => {
        // 只处理block类型的节点
        if (node.isBlock) {
            // 检查节点的起始位置是否在选择范围内
            const nodeStart = pos;
            const nodeEnd = pos + node.nodeSize;

            // 如果[nodeStart, nodeEnd]与[from,to]有交集
            if (
                (nodeStart >= from && nodeStart <= to) ||
                (nodeEnd >= from && nodeEnd <= to)
            ) {
                nodes.push({
                    node,
                    pos,
                });
            }
        }
    });

    // 只处理跨节点
    
    if (nodes.length > 1) {
        for (let i = 0; i < nodes.length; i++) {
            const { node, pos } = nodes[i];

            // 只有当节点被完全选中时才添加selected类
            if (isNodeFullySelected(state, i, nodes.length, from, to)) {
                decos.push(Decoration.node(pos, pos + node.nodeSize, { class: 'selected' }));
            }
        }
    }

    return decos;
}

export function drawNodeSelection(state: EditorState): DecorationSource | null {
    // 处理NodeSelection
    if (state.selection instanceof NodeSelection) {
        const { from, to } = state.selection;
        const decos: Decoration[] = [
            Decoration.node(from, to, { class: 'selected' }),
        ];
        return DecorationSet.create(state.doc, decos);
    }
    
    // 处理MultiBlockSelection - 当有 MultiBlockSelection 时，不显示 TextSelection 效果
    if (state.selection instanceof MultiBlockSelection) {
        const decos: Decoration[] = [];
        
        // 为 MultiBlockSelection 的每个 range 添加 selected 类
        state.selection.ranges.forEach(range => {
            decos.push(Decoration.node(range.$from.pos, range.$to.pos, { class: 'selected' }));
        });
        
        return DecorationSet.create(state.doc, decos);
    }
    
    // 处理TextSelection - 只有当没有 MultiBlockSelection 时才显示
    // if (state.selection instanceof TextSelection) {
    //     const { from, to } = state.selection;

    //     const decos = findBlockNodesInRange(state, from, to);
    //     return DecorationSet.create(state.doc, decos);
    // }

    return null;
}

export const selectBlockPlugin = () => {
    return [
        new Plugin({
            key: selectBlockPluginKey,
            props: {
               decorations: drawNodeSelection,
            },
        })
    ];
}