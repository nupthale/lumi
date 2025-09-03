<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs';

import { databaseSyncError$ } from '@/database/events';

export default defineComponent({
    setup() {
        const message = ref('');

        useSubscription(
            databaseSyncError$.pipe(
                tap(() => {
                    message.value = '数据同步失败，请重试';
                })
            ).subscribe()
        );

        return () => message.value ? (
            <div class="notice">
                {message.value}
            </div>
        ) : ''
    }
});
</script>