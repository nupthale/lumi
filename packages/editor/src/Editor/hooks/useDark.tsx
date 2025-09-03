import { ref } from 'vue';
import { useMutationObserver } from '@vueuse/core';

export const useDark = () => {
    const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark');

    useMutationObserver(document.documentElement, () => {
        isDark.value = document.documentElement.getAttribute('data-theme') === 'dark';
    }, {
        attributes: true,
    });

    return isDark;
}