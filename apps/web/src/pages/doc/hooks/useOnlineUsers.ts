import { ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { onlineUsersChange$ } from '@editor/Editor/event';
import type { UserType } from '@editor/Editor/interface';

export const useOnlineUsers = () => {
    const onlineUsers = ref<UserType[]>([])

    useSubscription(
        onlineUsersChange$.pipe(
            tap((users) => {
                onlineUsers.value = users || [];
            })
        ).subscribe()
    );

    return {
        onlineUsers,
    };
}