import { ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';

export const useMainScrollable = () => {
    const isScrollable = ref(false);
    const scrollEl = ref<HTMLElement | null>(null);
    const scrollContentEl = ref<HTMLElement | null>(null);

    const { width, height } = useElementSize(scrollContentEl);

    watch([width, height], (newVal) => {
        if (!scrollEl.value) return;
        
        // 检查是否有垂直滚动条
        isScrollable.value = newVal[1] > scrollEl.value.clientHeight;
    });

    return {
        scrollEl,
        scrollContentEl,
        isScrollable,
    };
}