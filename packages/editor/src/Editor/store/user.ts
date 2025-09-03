import { ref, onUnmounted } from 'vue';
import { createStore } from 'zustand/vanilla';

import { UserType } from '../interface';

export const userStore = createStore<{
    user: UserType | null,
    setUser: (user: UserType) => void,
}>((set) => ({
    user: null,
    setUser: (user: UserType) => {
        // 注意：这里需要传入 fileId，但 userStore 没有 fileId 信息
        // 需要在调用 setUser 的地方传入 fileId
        set({ user });
    },
}))

export function useUserStore() {
    const user = ref<UserType | null>(null);

    const unsubscribe = userStore.subscribe((newState) => {
        if (newState.user !== user.value) {
            user.value = newState.user;
        }
    });

    onUnmounted(() => {
        unsubscribe();
    });

    return {
        user,
    };
}