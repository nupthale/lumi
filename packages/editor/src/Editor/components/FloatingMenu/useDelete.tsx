import { BaseBlockView } from '@editor/Editor/plugins/nodes/_common/baseBlockView';

import { contextStore } from '../../store/context';
import { blockMouseLeave$, blockMouseLeaveTop$, hidePopover$ } from '@editor/Editor/event';
import { PopoverTypeEnum } from '@editor/Editor/interface';

export const useDelete = () => {
    const deleteBlock = (nodeView: BaseBlockView) => {
        const view = contextStore.getState().editorView;
        const state = view?.state;

        const pos = nodeView.getPos();
        const node = nodeView.node;
        const nodeTypeName = nodeView.node.type.name;

        if (!pos) return;

        const tr = state?.tr;
        if (!tr) return;

        // 如果在list-head， text-head， 则要删除整个list和textBlock
        const resolvedPos = tr.doc.resolve(pos);

        let start = pos;
        let end = pos + node.nodeSize;

        if ([
            'list_head',
            'textBlock_head',
        ].includes(nodeTypeName)) {
            // 删除list和textBlock
            start = resolvedPos.before();
            end = resolvedPos.after();
        }

        tr.delete(start, end);
        view?.dispatch(tr);

        blockMouseLeave$.next({
            delay: 0,
        });

        blockMouseLeaveTop$.next({
            delay: 0,
        });

        hidePopover$.next({
            type: PopoverTypeEnum.BUBBLE_MENU,
            delay: 0,
        });

        hidePopover$.next({
            type: PopoverTypeEnum.FLOAT_MENU,
            delay: 0,
        });

        hidePopover$.next({
            type: PopoverTypeEnum.MENTION,
            delay: 0,
        });
    }

    return {
        deleteBlock,
    };
}