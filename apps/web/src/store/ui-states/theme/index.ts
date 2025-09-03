import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', () => {
    // state
    const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark');

    // 监听 data-theme 属性变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                isDark.value = document.documentElement.getAttribute('data-theme') === 'dark';
            }
        });
    });

    // 开始监听
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    return {
        isDark,
    };
}); 