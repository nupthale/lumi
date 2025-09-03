
import { ref, watchEffect, Ref } from 'vue';
import { useEventListener } from '@vueuse/core';

import { useContextStore } from '../../store/context';
import { PopoverTypeEnum } from '../../interface';

export const useNavigate = (
    allItems: Ref<Record<string, any>[]>,
    onOk: (item: Record<string, any>) => void,
) => {
    const crtItem = ref<Record<string, any> | null>(null);

    const { state } = useContextStore();

    watchEffect(() => {
        crtItem.value = allItems.value?.[0];
    });

    const handleKeyDown = (e) => {
        if (!state.value?.popovers[PopoverTypeEnum.MENTION]) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        const index = allItems.value.findIndex(item => crtItem.value === item);

        switch(e.key) {
            case 'ArrowUp':
                crtItem.value = allItems.value[(index - 1) % allItems.value.length];
                break;
            case 'ArrowDown':
                crtItem.value = allItems.value[(index + 1) % allItems.value.length];
                break;    
            case 'Enter':
                e.preventDefault();
                e.stopPropagation();

                onOk?.(crtItem.value!);
                break;    
        }    
    }

    useEventListener(document.body, 'keydown', handleKeyDown, {
        capture: true,
    });

    return {
        crtItem,
    };
}