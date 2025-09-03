import { Fragment, Node } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';

import { message } from 'ant-design-vue';

import { schema } from '../../../schema/index';
import { decorationKey } from './decoration';

const getListNode = (state) => {
    const { $from } = state.selection;

    if (
      $from.parent.type.name !== 'list_head'
    ) {
      return false;
    }

    return $from.node($from.depth - 1);
}

const getCurrentPos = (state) => {
    const { $from } = state.selection;
    return $from.before($from.depth - 1);
}

// 同一级找到上一个 list
const getPrevListNode = (state) => {
    const { $from } = state.selection;

    // 获取前一个节点的位置
    const currentListPos = getCurrentPos(state);
    const resolvedPrevPos = state.doc.resolve(currentListPos - 1);
    // 当前 list 节点的深度
    const currentDepth = $from.depth - 1;  // list 节点的深度
    const prevPos = resolvedPrevPos.before(resolvedPrevPos.depth);

    if (resolvedPrevPos.depth !== currentDepth) {
        return {
            prevPos,
            prevListNode: null,
        };
    }

    return {
        prevPos,
        prevListNode: resolvedPrevPos.node(),
    };
}

// 找父级的list
const getParentListNode = (state) => {
    const { $from } = state.selection;

    const node = $from.node($from.depth - 3);

    if (!node || node.type.name !== 'list') {
        return null;
    }

    return node;
}

export const increaseIndent = (state, dispatch, view) => {
    const listNode = getListNode(state);

    if (!listNode) return false;

    const currentListPos = getCurrentPos(state);
    const { prevListNode, prevPos } = getPrevListNode(state);

    const { tr } = state;
    const { $from } = state.selection;

    if (
        !prevListNode ||
        prevListNode.type.name !== 'list'
    ) {
        dispatch(tr.setMeta(decorationKey, {
            type: 'indent-max',
            pos: currentListPos,
            nodeSize: listNode.nodeSize,
            view,
        }));

        message.warning('当前块已达到最大层级');

        return true;
    }

    // 计算当前光标相对于 listNode 开始位置的偏移量
    const relativePos = $from.pos - currentListPos;
    if (prevListNode.childCount > 1) {
        // 已有 body，直接移动到 body 末尾
        const bodyPos = prevPos + prevListNode.nodeSize - 2;
        
        tr.delete(currentListPos, currentListPos + listNode.nodeSize)
          .insert(bodyPos, listNode)
          .setSelection(TextSelection.create(tr.doc, bodyPos + relativePos));
    } else {
        // 创建 body 并移动
        const newBody = schema.nodes.list_body.create(null, Fragment.from(listNode));
        const insertPos = prevPos + prevListNode.firstChild.nodeSize;
        
        tr.delete(currentListPos, currentListPos + listNode.nodeSize)
          .insert(insertPos, newBody)
          .setSelection(TextSelection.create(tr.doc, insertPos + relativePos + 2));
    }

    dispatch?.(tr);

    return true;
}

// 找到上一层的list， 从上一层的list的body里移到上一层list后面
export const decreaseIndent = (state, dispatch, _view) => {
    const listNode = getListNode(state);

    if (!listNode) return false;

    const parentListNode = getParentListNode(state);
    const currentListPos = getCurrentPos(state);

    if (!parentListNode) {
        return false;
    }

    const { $from } = state.selection;
    const { tr } = state;
    const parentStart = $from.before($from.depth - 3);

    if (
        parentListNode.childCount === 2 && 
        parentListNode.lastChild.childCount > 1
    ) {
        // 如果还有其他子节点， 后续子节点应该放到当前list里面

        // 获取当前节点在 list_body 中的索引位置
        const currentIndex = parentListNode.lastChild.children.findIndex(
            node => node.eq(listNode)
        );

        // 获取后续的所有兄弟节点
        const remainingNodes: Node[] = [];
        parentListNode.lastChild.forEach((node, _, i) => {
            if (i > currentIndex) {
                remainingNodes.push(node);
            }
        });

        // 创建新的 list_body 包含剩余节点
        const newBody = [
            ...(listNode.childCount > 1 ? listNode.lastChild.children : []),
            ...remainingNodes,
        ];

        // 创建新的 list 结构，包含原有的 list_head 和新的 list_body

        const newListNode = schema.nodes.list.create(
            { ...listNode.attrs },
            newBody.length === 0 ? Fragment.from([
                listNode.firstChild,
            ]) : Fragment.from([
                listNode.firstChild,
                schema.nodes.list_body.create(
                    null,
                    Fragment.from(newBody)
                )
            ])
        );

        const parentStart = $from.before($from.depth - 3);
        const deleteSize = listNode.nodeSize + remainingNodes.reduce((sum, node) => sum + node.nodeSize, 0);

        // 要减去listNode.nodeSize，是因为parent的nodeSize是包含这个子list的nodeSize的。
        const parentEnd = parentStart + parentListNode.nodeSize - deleteSize;

        const insertPos = parentEnd;
        // 计算当前光标相对于 listNode 开始位置的偏移量
        const relativePos = $from.pos - currentListPos;

        // 删除范围需要包含当前节点到最后的所有节点
        const deleteEnd = currentListPos + deleteSize;

        tr.delete(currentListPos - 1, deleteEnd)
          .insert(parentEnd - (currentIndex === 0 ? 2 : 0), newListNode)
          .setSelection(TextSelection.create(tr.doc, insertPos + relativePos));
    } else {
        const parentEnd = parentStart + parentListNode.nodeSize;

        // 要减去listNode.nodeSize，是因为parent的nodeSize是包含这个子list的nodeSize的。
        const insertPos = parentEnd - listNode.nodeSize;
        // 计算当前光标相对于 listNode 开始位置的偏移量
        const relativePos = $from.pos - currentListPos;
    
        tr.insert(parentEnd, listNode);

        if (parentListNode.childCount === 2 && parentListNode.lastChild.childCount === 1) {
            // parent_list_body已经空了， 就把parent_list_body删除， 后光标定位到新的listNode的位置
            tr.delete(currentListPos - 1, currentListPos + listNode.nodeSize);
        } else {
            tr.delete(currentListPos, currentListPos + listNode.nodeSize);
            tr.setSelection(TextSelection.create(tr.doc, insertPos + relativePos));
        }
    }

    dispatch?.(tr);

    return true;
}