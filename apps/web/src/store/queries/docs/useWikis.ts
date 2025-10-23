import type { Ref } from 'vue';

import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';
import { SpaceAssetType } from '@/database/schema/spaceAsset';

export const useWikis = (spaceId: Ref<string>) => {

    // 使用 pouchdb-find 查询 files
    const wikis = useLiveQuery(
        ['files', 'docs', 'wikis'],
        async () => {
            const currentSpaceId = spaceId.value;
            if (!currentSpaceId) return [];
            const spaceAssets = await database.spaceAssets?.find({
                selector: { space: currentSpaceId, deleted: 0, type: SpaceAssetType.WIKI },
            });

            const wikiIds = spaceAssets?.docs.map(doc => doc.asset);

            // 查询指定space下未删除的文件，按updatedAt倒序
            const result = await database.wikis?.find({
                selector: { 
                    _id: { $in: wikiIds }, 
                    deleted: 0,
                    updatedAt: { $exists: true },
                },
                sort: [{ updatedAt: 'desc' }]
            });
            
            return result?.docs || [];
        },
        [spaceId],
    );

    return {
        wikis,
    };
}