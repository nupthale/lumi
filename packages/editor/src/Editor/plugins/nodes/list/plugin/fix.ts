import { EditorState, Transaction } from "prosemirror-state";
import { nanoid } from 'nanoid';
import { Node } from "prosemirror-model";

// list_head必须在list内， 全局检查list_head是否在list内， 如果不在， 就创建一个list，然后放进去。
export const fixListBlock = (state: EditorState, tr: Transaction): Transaction => {
    const { doc } = tr;

    const fixes: Array<{ pos: number; node: Node }> = [];

    doc.descendants((node, pos) => {
        const resolvedPos = tr.doc.resolve(pos);

        if (
            node.type.name === 'list_head' &&
            resolvedPos.parent?.type?.name !== 'list'
        ) {

            fixes.push({ pos, node });
        }
    });

    // 按位置从后往前排序，避免位置变化影响
    fixes.sort((a, b) => b.pos - a.pos);

    fixes.forEach(({ pos, node }) => {
        const listBlock = state.schema.nodes.list.create({
            id: nanoid(8),
        }, [
            node,
        ]);

        // 使用映射后的位置，因为前面的替换可能已经改变了位置
        const mappedPos = tr.mapping.map(pos);
        tr.replaceRangeWith(mappedPos, mappedPos + node.nodeSize, listBlock);
    });

    return tr;
}