import { ref, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { useSubscription } from '@vueuse/rxjs';
import { tap, filter } from 'rxjs/operators';

import { database } from '@/database/database';
import { useUserStore } from '@/store/user';
import { useContextStore } from '@/store/ui-states/context';

import { databaseInitPullSuccess$, databaseInitPullFailed$ } from '@/database/events';
import { AppModeEnum } from '../types/setting';

const messageHides: Function[] = [];

export const useBootstrap = () => {
    const ready = ref(false);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const contextStore = useContextStore();
    const { docResLoading } = storeToRefs(contextStore);

    watchEffect(() => {
        if (docResLoading.value) {
            const hide = message.loading('加载中...');
            messageHides.push(hide);
        } else {
            messageHides?.forEach(hide => hide?.());
        }
    });

    watch(user, async (val) => {
        if (location.hash.includes('login')) {
            ready.value = true;
            return;
        }

        if (val) {
            database.init(user.value.id);
        }
        
        if (window.__appMode__ === AppModeEnum.LOCAL) {
            ready.value = true;
        }
    }, {
        immediate: true,
    });

    useSubscription(
        databaseInitPullSuccess$.pipe(
            filter(() => window.__appMode__ === AppModeEnum.SYNC),
            tap(() => {
                ready.value = true;
            })
        ).subscribe()
    );

    useSubscription(
        databaseInitPullFailed$.pipe(
            filter(() => window.__appMode__ === AppModeEnum.SYNC),
            tap(() => {
                message.error('数据库初始化失败， 请刷新重试');

                // 可能是网络连接问题， 直接进入单机模式。
                ready.value = true;
            })
        ).subscribe()
    );

    return {
        ready,
    };
}