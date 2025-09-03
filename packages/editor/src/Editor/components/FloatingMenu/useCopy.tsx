import { BaseBlockView } from '@editor/Editor/plugins/nodes/_common/baseBlockView';

import { Fragment, DOMSerializer } from 'prosemirror-model';

import { contextStore } from '../../store/context';
import { blockMouseLeave$, blockMouseLeaveTop$ } from '@editor/Editor/event';

export const useCopy = () => {
    // 复制当选的prosemirror node到剪贴板
    const copy = (nodeView: BaseBlockView) => {
        const view = contextStore.getState().editorView;
        const state = view?.state;
        const doc = state?.doc;

        const clipboard = window.navigator.clipboard
        if (!clipboard) {
            return
        }

        let copyNode = nodeView.node; 

        if ([
            'textBlock_head',
            'list_head',
        ].includes(copyNode.type.name)) {
            const pos = nodeView.getPos();

            if (!pos || !doc) return;

            const resolvePos = doc.resolve(pos);
            copyNode = resolvePos.parent;
        }

        const dom = document.createElement('div');
        
        // 使用DOMSerializer将Fragment转换为DOM
        const serializer = DOMSerializer.fromSchema(copyNode.type.schema);
        const fragmentDOM = serializer.serializeFragment(Fragment.from(copyNode));
       
        dom.appendChild(fragmentDOM);
        
        // 将DOM内容写入剪贴板
        // 使用clipboard API
        const html = dom.innerHTML;
        const text = dom.textContent || '';
        
        // 使用现代Clipboard API
        clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' })
            })
        ]).catch(err => {
            console.error('复制失败:', err);
        });

        blockMouseLeave$.next({
            delay: 0,
        });

        blockMouseLeaveTop$.next({
            delay: 0,
        });
    }

    return {
        copy,
    };
}