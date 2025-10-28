import { ref } from 'vue';

import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';

import { useSpaces } from './useSpaces';

export const useAllFiles = () => {
    const isLoading = ref(true);

    const { spaces } = useSpaces();

    // 使用 pouchdb-find 查询 files
    const files = useLiveQuery(
        ['files', 'spaceassets', 'wikis'],
        async () => {
            try {
                // 查询指定space下未删除的文件，按updatedAt倒序
                const result = await database.files?.find({
                    selector: {
                        deleted: 0,
                        updatedAt: { $exists: true },
                    },
                    sort: [{ updatedAt: 'desc' }]
                });

                const docs = [...(result.docs || [])];

                const docFiles = docs.filter(doc => !doc.wiki);
                const wikiFiles = docs.filter(doc => !!doc.wiki);

                const filesResult = [];
                const wikisResult = [];

                for (let i = 0; i < docFiles.length; i++) {
                    const file = {
                        ...(docFiles[i] || {})
                    };
                    const fileId = file._id;

                    const spaceAsset = await database.spaceAssets?.find({
                        selector: { asset: fileId, deleted: 0 },
                    });

                    const asset = spaceAsset?.docs[0];
                    
                    file.space = spaces.value.find(space => space._id === asset?.space);
                    file.spaceId = asset?.space;
                    file.assetType = asset?.type;

                    filesResult.push(file);
                }

                for (let i = 0; i < wikiFiles.length; i++) {
                    const wikiFile = wikiFiles[i];
                    const wikiId = wikiFile.wiki;

                    const spaceAsset = await database.spaceAssets?.find({
                        selector: { asset: wikiId, deleted: 0 },
                    });

                    const wikiResult = await database.wikis?.find({
                        selector: { 
                            _id: wikiId, 
                            deleted: 0,
                            updatedAt: { $exists: true },
                        },
                        sort: [{ updatedAt: 'desc' }]
                    });

                    const asset = spaceAsset?.docs[0];
                    const wiki = {
                        ...(wikiResult.docs[0] || {}),
                    };
                    wiki.wiki = wiki._id;

                    wiki.space = spaces.value.find(space => space._id === asset?.space);
                    wiki.spaceId = asset?.space;
                    wiki.fileId = wikiFile._id;
                    wiki.fileTitle = wikiFile.title;

                    wikisResult.push(wiki);
                }
                
                isLoading.value = false;

                return [
                    ...filesResult,
                    ...wikisResult,
                ];
            } catch(e) {
                console.error(e);

                return [];
            }
        },
        [spaces],
    );

    return {
        files,
        isLoading,
    };
}