import type { Ref } from 'vue';
import { ref } from 'vue';

import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';

export const useJournalStats = (spaceId: Ref<string>) => {
    const isLoading = ref(true);

    // 使用 pouchdb-find 查询 files
    const journalStats = useLiveQuery(
        ['journalStats'],
        async () => {
            const currentSpaceId = spaceId.value;

            if (!currentSpaceId) return [];
            
            const result = await database.journalStats?.find({
                selector: { space: currentSpaceId, deleted: 0 },
            });

            isLoading.value = false;

            return result?.docs || [];
        },
        [spaceId],
    );

    return {
        journalStats,
        isLoading,
    };
}