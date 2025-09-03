import { Ref } from 'vue';

import { useEventListener } from '@vueuse/core';

// 在编辑器区域内阻止默认行为
export const useStopTab = (editorRef: Ref<HTMLElement | null>) => {
    const handleStopTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.stopPropagation();
            e.preventDefault();
        }
    };
    
    useEventListener(editorRef, 'keydown', handleStopTab);

    return { handleStopTab };
};