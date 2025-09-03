import { UndoManager } from 'yjs';
import { ySyncPluginKey } from 'y-prosemirror';

import { getSharedDoc } from './core';
import { getCollectionsDoc } from './collection';

let undoManager: UndoManager;
let globalFileId = '';

export const getUndoManager = (fileId: string) => {
    if (globalFileId === fileId && undoManager) {
        return undoManager;
    }

    undoManager?.destroy();

    const sharedDoc = getSharedDoc(fileId);
    const collectionsDoc = getCollectionsDoc(fileId);

    // 创建撤销插件
    undoManager = new UndoManager([sharedDoc, collectionsDoc], {
        // 这里必须设置origin， 因为yjs里处理transaction的时候，如果用了ySyncPlugin， 那么它内部的origin是ySyncPluginKey， 如果不设置， 默认
        // 只有null, undefined, 'user', 'input'， 所以会导致无法撤销
        trackedOrigins: new Set([ySyncPluginKey, null, undefined, 'user', 'input']),
        captureTimeout: 500 // 设置捕获超时
    });

    // 添加调试监听器
    undoManager.on('stack-item-added', (event) => {
        console.log('撤销项已添加:', event, event.origin, undoManager.undoStack);
    });

    undoManager.on('stack-item-popped', (event) => {
        console.log('撤销项已弹出:', undoManager.undoStack);
    });

    globalFileId = fileId;

    return undoManager;
};
