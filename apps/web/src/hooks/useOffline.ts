import { watch } from 'vue';
import { useOnline } from '@vueuse/core';

import { message } from 'ant-design-vue';

export const useOffline = () => {
    const isOnline = useOnline();

    watch(isOnline, (val) => {
        if (!val) {
            message.warning({
                content: '进入离线编辑模式',
                duration: 0,
            });
        }
    }, {
        immediate: true,
    });

}