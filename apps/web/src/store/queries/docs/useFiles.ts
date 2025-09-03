import type { Ref } from 'vue';
import { computed, ref } from 'vue';

import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';
import { SpaceAssetType } from '@/database/schema/spaceAsset';
import type { FileSchema } from '@/database/schema/file';


export const useFiles = (spaceId: Ref<string>) => {
    const isLoading = ref(true);

    // 使用 pouchdb-find 查询 files
    const files = useLiveQuery(
        ['files', 'docs', 'spaceassets'],
        async () => {
            const currentSpaceId = spaceId.value;

            if (!currentSpaceId) return [];
            const spaceAssets = await database.spaceAssets?.find({
                selector: { space: currentSpaceId, deleted: 0, type: SpaceAssetType.FILE },
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
        files,
        isLoading,
        tags: computed(() => {
            const tags = new Set<string>();
            files.value?.forEach((file: FileSchema) => {
                file.tags?.forEach((tag: string) => {
                    tags.add(tag);
                });
            });
            return Array.from(tags);
        }),
    };
}