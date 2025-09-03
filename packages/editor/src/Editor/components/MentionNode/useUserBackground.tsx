import { onMounted, nextTick, ref } from 'vue';

export const useUserBackground = () => {
    const containerRef = ref<HTMLElement | null>(null);

    const updateBackground = () => {
        nextTick(() => {
            const container = containerRef.value;
            if (!container) return;

            const srcElement = container?.querySelector('.zsui-user__avatar');
            
            if (!srcElement) return;

            const computedStyle = window.getComputedStyle(srcElement);
            const background = computedStyle.background;
            
            container.style.background = background;
        });
    }
    
    onMounted(() => {
        updateBackground();
    });
    
    return {
        containerRef,
    };
}