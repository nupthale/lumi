// import { Ref } from 'vue';
// import { nanoid } from 'nanoid';
// import { TextSelection, Transaction } from 'prosemirror-state';
// import { Attrs, Fragment } from 'prosemirror-model';
// import { BaseBlockView } from '../../plugins/nodes/_common/baseBlockView';

// import { getParentNode } from '../../shared';
// import { contextStore } from '../../store/context';
// import { blockMouseLeave$ } from '../../event';

// const updateHeadBodyNodeType = (schema, tr: Transaction, srcNodeView: BaseBlockView, attrs?: Attrs | null) => {
//     const { from } = srcNodeView.range;
//     const srcNode = srcNodeView.node;
//     const marks = srcNode.marks;

//     const blockNode = getParentNode(tr.doc.resolve(from), 0);
//     const head = srcNode;
//     const body = blockNode.children[1];

//     // 创建新的 header 节点
//     const headerNode = schema.nodes.header.create(
//         { ...attrs, id: nanoid(8) }, 
//         head.content, 
//         marks || []
//     );

//     const blockResolvedPos = tr.doc.resolve(from);
//     const start = blockResolvedPos.before();
//     const end = blockResolvedPos.after();

//     // 先删除原有内容
//     tr.deleteRange(start, end);
    
//     // 插入 header 和 body 内容
//     tr.insert(
//         start,
//         headerNode,
//     );

//     if (body?.content) {
//         tr.insert(
//             start + headerNode.nodeSize,
//             Fragment.from(body.content),
//         );
//     }
// };

// const defaultUpdater = (schema, tr: Transaction, srcNodeView: BaseBlockView, targetType: string, attrs?: Attrs | null) => {
//     const targetTypeSchema = schema.nodes[targetType];
//     const { customTargetNode, customStartOffset = 0 } = targetTypeSchema.spec;

//     const { from, to } = srcNodeView.range;

//     const targetNode = customTargetNode ? 
//         customTargetNode(schema, attrs, srcNodeView.node.content, srcNodeView.node.marks) : 
//         targetTypeSchema.create(attrs, srcNodeView.node.content, srcNodeView.node.marks);
        
//     // 确保目标节点有效
//     if (!targetNode) {
//         console.error('Failed to create target node');
//         return;
//     }

//     tr.replaceRangeWith(
//         from, 
//         to, 
//         targetNode,
//     );

//     tr.setSelection(
//         TextSelection.create(tr.doc, from + customStartOffset),
//     );
// }

// export const useUpdateBlockNodeType = (
//     crtNodeViewRef: Ref<BaseBlockView | null>,
// ) => {
//     const handleSelectType = (targetType: string, attrs?: Record<string, any>) => {
//         const view = contextStore.getState().editorView;
//         const state = view?.state;
//         const srcNodeView = crtNodeViewRef.value;
        
//         if (!view || !state || !srcNodeView) return;
        
//         const schema = state.schema;

//         const tr = state.tr;
//         const newAttrs = {
//             ...srcNodeView.node.attrs, 
//             ...attrs, 
//         }

//         try {
//             if ('textBlock_head' === srcNodeView.node.type.name) {
//                 if (!srcNodeView.isEmpty) {
//                     updateHeadBodyNodeType(schema, tr, srcNodeView, newAttrs);
//                 } else {
//                     defaultUpdater(schema, tr, srcNodeView, targetType, newAttrs);
//                 }
//             } else if (['list_head'].includes(srcNodeView.node.type.name)) {
//                 updateHeadBodyNodeType(schema, tr, srcNodeView, newAttrs);
//             } else {
//                 defaultUpdater(schema, tr, srcNodeView, targetType, newAttrs);
//             }
    
//             view.dispatch(tr);
    
//             view.focus();
//         } catch(e) {
//             console.error(e);
//         }

//         // 直接隐藏actionDrag, 要不然定位不准确
//         blockMouseLeave$.next({ delay: 0 });
//     }

//     return {
//         handleSelectType,
//     };
// }