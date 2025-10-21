import { watch, ref } from 'vue';
import { useOnline } from '@vueuse/core';
import i18next from 'i18next';

import { message } from 'ant-design-vue';

export const useOffline = () => {
    const isOnline = useOnline();
    const hideRef = ref<Function | null>(null);

    watch(isOnline, (val) => {
        if (!val) {
            hideRef.value = message.warning({
                content: i18next.t('common.offlineMessage'),
                duration: 0,
            });
        } else {
            hideRef.value?.();
        }
    }, {
        immediate: true,
    });

}