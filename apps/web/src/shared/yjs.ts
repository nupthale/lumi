import * as Y from 'yjs';

import { prosemirrorJSONToYDoc } from 'y-prosemirror';
import { schema } from '@editor/Editor/plugins/schema';
import { getYDoc } from '@editor/Editor/plugins/collab/core';

export const createDoc = async (fileId: string, content: Record<string, any>) => {
    try {
        // 获取完整的Y.Doc
        const ydoc = getYDoc(fileId);

        // 使用y-prosemirror将ProseMirror JSON转换为YJS格式
        const ydocWithContent = prosemirrorJSONToYDoc(schema, content, 'prosemirror');
        
        // 获取更新数据
        const update = Y.encodeStateAsUpdate(ydocWithContent);
        
        // 确保数据写入到 IndexedDB
        // 在事务中应用更新，这样会自动触发 IndexedDB 持久化
        ydoc.transact(() => {
            // 应用更新到 Y.Doc
            Y.applyUpdate(ydoc, update);
        });

        return true;
    } catch (error) {
        console.error('创建文档失败:', error);
        throw error;
    }
};