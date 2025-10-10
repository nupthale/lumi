import { ref, computed, watch } from 'vue';
import type { Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useEventListener } from '@vueuse/core';
import { useRouter } from 'vue-router';

import { useContextStore } from '@/store/ui-states/context';

export const useEvent = (matchedFiles: Ref<any[]>) => {
    const router = useRouter();

    const crtItemIndex = ref(0);

    const scrollContainer = ref();

    const contextStore = useContextStore();
    const { searchModalVisible } = storeToRefs(contextStore);

    const crtItem = computed(() => matchedFiles.value[crtItemIndex.value || 0]);

    watch(matchedFiles, () => {
        crtItemIndex.value = 0;
    });

    const handleClickItem = (file) => {
        if (file.wiki) {
            router.replace(`/wikis/wiki/${file.wiki}/doc/${file.fileId}`);
        } else {
            router.replace(`/files/doc/${file._id}`);
        }

        handleClose();
    }

    const handleClose = () => {
        contextStore.setSearchModalVisible(false);
    }

    const handleHoverItem = (index) => {
        crtItemIndex.value = index;
    }

    // 判断元素是否在可视区域内
    const isElementInViewport = (element: HTMLElement, container: HTMLElement) => {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        return (
            elementRect.top >= containerRect.top &&
            elementRect.bottom <= containerRect.bottom &&
            elementRect.left >= containerRect.left &&
            elementRect.right <= containerRect.right
        );
    };

    const scrollToView = (direction: 'up' | 'down') => {
        const index = crtItemIndex.value;
        const crtItemId = matchedFiles.value?.[index]?._id;

        if (!scrollContainer.value) {
            return;
        }

        const container = scrollContainer.value;
        const itemEl = container.querySelector(`[data-id="${crtItemId}"]`);

        if (!itemEl) {
            return;
        }

        // 检查元素是否在可视区域内
        const isInViewport = isElementInViewport(itemEl as HTMLElement, container);
        
        if (!isInViewport) {
            if (direction === 'down') {
                const itemElTop = itemEl.getBoundingClientRect().top;
                const containerTop = container.getBoundingClientRect().top;

                container.scrollTop = itemEl.offsetTop - (itemElTop - (containerTop + 56));
            } else {
                // 向上滚动时，将元素滚动到容器顶部
                container.scrollTop = itemEl.offsetTop - container.offsetTop;
            }
        }
    };

    useEventListener(document.body, 'keydown', (e) => {
        if (!searchModalVisible.value) {
            return;
        }

        switch(e.key) {
            case 'ArrowUp':
                crtItemIndex.value = Math.max(0, crtItemIndex.value - 1);

                scrollToView('up');
                break;
            case 'ArrowDown':
                crtItemIndex.value = Math.min(matchedFiles.value?.length - 1, crtItemIndex.value + 1);

                scrollToView('down');
                break;    
            case 'Enter':
                handleClickItem(crtItem.value);
                break; 
            case 'Escape':
                handleClose();
                break;       
        }    
    }, true);
    
    return {
        scrollContainer,
        crtItemIndex,
        crtItem,
        handleClose,
        handleClickItem,
        handleHoverItem,
    };
}