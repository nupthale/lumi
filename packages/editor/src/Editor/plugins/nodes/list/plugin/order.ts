import { Plugin, PluginKey } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { isNumber } from 'lodash-es';

import { listStore } from '../../../../store/list';
import { contextStore } from '../../../../store/context';
import { ListTypeEnum } from '../interface';

export const listOrderKey = new PluginKey('list-order');

export type ListTreeType = {
    node: Node,
    children: ListTreeType[],
};

export type IndexMapType = {
    [key: string]: number[],
};

// 因为前一步已经找到了全部contextNode， 所以这里不需要深度遍历， 只需要找一层
const getOrderListTree = (node) => {
    let lists: ListTreeType[] = [];
    
    node.children.forEach(child => {
        const childName = child.type.name;

        if (
            childName === 'list' && 
            child.firstChild?.attrs?.type === ListTypeEnum.ORDERED
        ) {
            lists.push({
                node: child,
                children: child.childCount > 1 ? getOrderListTree(child.lastChild) : [],
            });
        }
    });

    return lists;
}

const appendIndex = (listTree: ListTreeType[], indexes: number[], indexMap: IndexMapType) => {
    let prevIndex: number = 0;
    listTree.forEach((item, index) => {
        const { node, children } = item;

        // 如果listHeadNode的index有值， 则优先用index的值，否则自动+1编号
        const listHead = node.firstChild;
        let indexValue = prevIndex + 1;

        if (isNumber(listHead?.attrs?.index)) {
            indexValue = Number(listHead.attrs?.index);  
        } 
        prevIndex = indexValue;

        indexMap[node.attrs.id] = [...indexes, indexValue];

        appendIndex(children, [...indexes, indexValue], indexMap);
    });
}

const getListContextNodes = (doc) => {
    const nodes: Node[] = [];

    doc.descendants(node => {
        if (['body', 'column', 'highlight', 'quote', 'table_cell'].includes(node.type.name)) {
            nodes.push(node);
        }
    });

    return nodes;
}

/**
 * doc是prosemirror的文档对象，根据文档的内容
 * 1. 过滤掉除了node名为list， 且attrs里包含ordered=true的所有节点， 并且保持原有的树形结构
 */
const updateOrderedListIndex = () => {
    const view = contextStore.getState().editorView;
    const doc = view?.state.doc;

    if (!doc || doc?.childCount !== 2) return;

    const indexMap: IndexMapType = {};

    // 找到全部的body、column、highlight、quote、table_cell， 这些都是独立的context。
    const listContextNodes = getListContextNodes(doc);
    listContextNodes.forEach(contextNode => {
        const lists = getOrderListTree(contextNode);
        appendIndex(lists, [], indexMap);
    });

    listStore.getState().setOrderedListMap(indexMap);
    listStore.getState().setOrderedListMapInit(true);
}

export const listOrderPlugin = new Plugin({
    key: listOrderKey,
    view: (_editorView) => {
        return {
            update(view, prevState) {
                const orderedListMapInit = listStore.getState().orderedListMapInit;

                if (view.state.doc === prevState.doc && orderedListMapInit) {
                    // 文档未发生变化
                    return;
                }

                updateOrderedListIndex();
            },
            destroy() {
                console.log('destroy');
            }
        };
    }
});