import { Ref } from 'vue';
import { useEventListener } from '@vueuse/core';

import { getUndoManager } from '@editor/Editor/plugins/collab/history';

export const useHistory = (fileId?: string, editorRef?: Ref<HTMLElement | null>) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const undoManager = getUndoManager(fileId!);

        // 检测修饰键和具体的字母键
        const hasModifier = event.ctrlKey || event.metaKey;
        const isZKey = event.code === 'KeyZ' || event.key.toLowerCase() === 'z';

        // 检查是否是撤销操作
        if (hasModifier && isZKey && !event.shiftKey) {
            console.log('🔄 全局撤销操作');
            
            if (undoManager.canUndo()) {
                event.preventDefault(); // 阻止浏览器默认撤销
                undoManager.undo();
                console.log('✅ 执行撤销');
            }
            return;
        } else if (hasModifier && isZKey && event.shiftKey) {
            console.log('🔄 全局重做操作');
                
            if (undoManager.canRedo()) {
                event.preventDefault(); // 阻止浏览器默认重做
                undoManager.redo();
                console.log('✅ 执行重做');
            }
            return;
         }
    }

    useEventListener(editorRef, 'keydown', handleKeyDown as EventListener);
}