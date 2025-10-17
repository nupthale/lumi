import type { Ref } from 'vue';
import { ref } from 'vue';

import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';
import { SpaceAssetType } from '@/database/schema/spaceAsset';


export const useJournals = (spaceId: Ref<string>) => {
    const isLoading = ref(true);

    // 使用 pouchdb-find 查询 files
    const journals = useLiveQuery(
        ['spaceassets'],
        async () => {
            const currentSpaceId = spaceId.value;

            if (!currentSpaceId) return [];
            
            const spaceAssets = await database.spaceAssets?.find({
                selector: { space: currentSpaceId, deleted: 0, type: SpaceAssetType.JOURNAL },
            });

            const fileIds = spaceAssets?.docs.map(doc => doc.asset);

            // 查询指定space下未删除的文件，按updatedAt倒序
            const result = await database.files?.find({
                selector: { 
                    _id: { $in: fileIds }, 
                    deleted: 0,
                    updatedAt: { $exists: true },
                },
                sort: [{ updatedAt: 'desc' }]
            });

            isLoading.value = false;

            return result?.docs || [];
        },
        [spaceId],
    );

    return {
        journals,
        isLoading,
    };
}