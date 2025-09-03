import { Node, ResolvedPos } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { BaseBlockView } from '../plugins/nodes/_common/baseBlockView';

export const getRangeByNode = (state, node: Node) => {
    // 根据node获取node的range
    let from = 0;
    let to = 0;

    state.doc.descendants((childNode, pos) => {
        if (childNode.eq(node)) {
            from = pos;
            to = pos + childNode.nodeSize;
            return false;
        }
    });
    
    return [from, to];
}

export const getRangeByPos = ($pos: ResolvedPos, depthOffset = 0) => {
    // 根据pos获取node的range
    const start = $pos.before($pos.depth - depthOffset);
    const end = $pos.after($pos.depth - depthOffset);
    return [start, end];
}

export const getContentRangeByPos = ($pos: ResolvedPos, depthOffset = 0) => {
    // 根据pos获取node的range
    const start = $pos.start($pos.depth - depthOffset);
    const end = $pos.end($pos.depth - depthOffset);
    return [start, end];
}

export const getListBodyNodes = (list: Node) => {
    // 根据list， 获取list的body里的子list

    if (
        list.type.name !== 'list' ||
        list.childCount !== 2
    ) return null;

    const listBody = list.child(1);

    return listBody.children || [];
}

// 同一级的前一个节点， 如果没有前一个节点， 再判断， 是不是在list_body里， 如果在list_body里， 则返回对应的list_head
export const getPrevNode = ($pos: ResolvedPos) => {
    // 获取当前节点
    const node = $pos.node();
    // 获取父节点 - 使用正确的深度
    let parent = $pos.node($pos.depth - 1);

    // 遍历父节点的所有子节点，找到当前节点的索引
    let currentIndex = -1;
    for (let i = 0; i < parent.childCount; i++) {
        if (parent.child(i) === node) {
            currentIndex = i;
            break;
        }
    }
    
    if (currentIndex <= 0) {
        // 没找到的话， 再判断是不是在body里？
        if (['list_body', 'textBlock_body'].includes(parent.type.name)) {
            parent = $pos.node($pos.depth - 2);
            return parent.firstChild;
        }

        return null;
    }; 
    
    // 返回前一个同级节点
    return parent.child(currentIndex - 1);
}

export const getPrevNodeResolvedPos = ($pos: ResolvedPos) => {
    const prevNode = getPrevNode($pos);

    if (!prevNode) return null;

    const depth = $pos.depth;
    const prevNodeStart = $pos.before(depth) - prevNode.nodeSize;
    
    return $pos.doc.resolve(prevNodeStart + 1);
}

export const getPrevNodeRange = ($pos: ResolvedPos) => {
    const resolvedPrevPos = getPrevNodeResolvedPos($pos);

    if (!resolvedPrevPos) return null;

    return [resolvedPrevPos.before(), resolvedPrevPos.after()];
}

export const getDeepestContentEnd = ($pos: ResolvedPos) => {
     // 使用迭代而非递归，避免栈溢出
     let currentPos = $pos;
     let currentNode = currentPos.node();
     let depth = currentPos.depth;
     
     // 循环查找最深层级的节点
     while (!currentNode.isText && currentNode.content.size > 0) {
         const lastChild = currentNode.lastChild;
         if (!lastChild) break;
         
         // 计算最后一个子节点的位置
         const childStart = currentPos.end(depth) - lastChild.nodeSize + 1;
         
         try {
             // 更新当前位置到子节点
             currentPos = $pos.doc.resolve(childStart);
             currentNode = lastChild;
             depth = currentPos.depth;
         } catch (e) {
             // 如果解析位置出错，直接返回当前位置的结束位置
             break;
         }
     }
     
     // 返回找到的最深层节点的内容结束位置
     return currentPos.end(depth);
}

export const getParentNode = ($pos: ResolvedPos, depthOffset = 1) => {
    return $pos.node($pos.depth - depthOffset);
}

export const getParentNodeByPos = (view: EditorView, pos: number, depthOffset = 1) => {
    const $pos = view.state.doc.resolve(pos);
        
    return getParentNode($pos, depthOffset);  // 获取父节点（list）
}

export const isElementVisible = (element: Element) => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 判断两个node的祖先关系, 所有节点都必须有id属性
export const isAncestor = (node?: Node, ancestor?: Node) => {
    if (!node || !ancestor) return false;
    if (node === ancestor) return false;

    let found = false;
    ancestor.descendants((child) => {
        if (child.attrs?.id === node.attrs?.id) {  // 使用eq()方法比较
            found = true;
            return true;
        }
    });

    return found;
}

export const getNearestAncestor = ($from: ResolvedPos, ancestorName: string) => {

    let found: Node | null = null;
    let depth = $from.depth;
                
    // 从当前节点向上遍历所有祖先节点
    while (depth > 0) {
        const node = $from.node(depth);
        if (node.type.name === ancestorName) {
            found = node;
            break;
        }
        depth--;
    }

    return found;
}

export const isInNestedBlock = ($from: ResolvedPos) => {

    let found: Node | null = null;
    let depth = $from.depth;
                
    // 从当前节点向上遍历所有祖先节点
    while (depth > 0) {
        const node = $from.node(depth);
        
        if (['quote', 'highlight', 'table', 'column'].includes(node.type.name)) {
            found = node;
            break;
        }
        depth--;
    }

    return found;
}

export const getElementResolvedPos = (view: EditorView, element: HTMLElement) => {
    try {
      // 获取单元格在文档中的位置
      const pos = view.posAtDOM(element, 0);
      
      if (pos !== null && pos !== undefined) {
        return view.state.doc.resolve(pos);
      }
      
      return null;
    } catch (e) {
      console.error('获取元素位置时出错:', e);
      return null;
    }
}

export const getTopNode = (pos: ResolvedPos) => {
    const node = pos.node();

    if (['textBlock_head', 'list_head'].includes(node.type.name)) {
        return pos.node(-1);
    }

    return node;
}

export const getTopNodePos = (state, pos: ResolvedPos) => {
    const node = pos.node();

    if (['textBlock_head', 'list_head'].includes(node.type.name)) {
        return state.doc.resolve(
            pos.before(pos.depth - 1) + 1
        );
    }

    return pos;
}

export const isSameNode = ($from: ResolvedPos, $to: ResolvedPos) => {
    return $from.node($from.depth).eq($to.node($to.depth));
}