import type { Ref } from 'vue';
import { computed } from 'vue';

import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';

export const useWiki = (wikiId: Ref<string>) => {
    // 使用 pouchdb-find 查询 wiki
    const wikis = useLiveQuery(
        ['wikis'],
        async () => {
            const currentWikiId = wikiId.value;
            if (!currentWikiId) return [];
            const result = await database.wikis?.find({
                selector: { _id: currentWikiId, deleted: 0 }
            });
            return result?.docs || [];
        },
        [wikiId]
    );

    return {
        wiki: computed(() => {
            const wikisArray = wikis.value as any[];
            return wikisArray?.[0];
        }),
    };
}