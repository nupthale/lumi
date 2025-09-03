import { EditorState, Transaction } from "prosemirror-state";
import { nanoid } from 'nanoid';
import { Node } from "prosemirror-model";

// textBlock_head必须在textBlock内， 全局检查textBlock_head是否在textBlock内， 如果不在， 就创建一个textBlock，然后放进去。
export const fixTextBlock = (state: EditorState, tr: Transaction): Transaction => {
    const { doc } = tr;

    const fixes: Array<{ pos: number; node: Node }> = [];

    doc.descendants((node, pos) => {
        const resolvedPos = tr.doc.resolve(pos);

        if (
            node.type.name === 'textBlock_head' &&
            resolvedPos.parent?.type?.name !== 'textBlock'
        ) {

            fixes.push({ pos, node });
        }
    });

    // 按位置从后往前排序，避免位置变化影响
    fixes.sort((a, b) => b.pos - a.pos);

    fixes.forEach(({ pos, node }) => {
        const textBlock = state.schema.nodes.textBlock.create({
            id: nanoid(8),
        }, [
            node,
        ]);

        // 使用映射后的位置，因为前面的替换可能已经改变了位置
        const mappedPos = tr.mapping.map(pos);
        tr.replaceRangeWith(mappedPos, mappedPos + node.nodeSize, textBlock);
    });

    return tr;
}