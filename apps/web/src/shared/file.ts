
import { createDoc, deleteDoc } from '@/shared/yjs';
import { events } from '@/database/index';
import { SpaceAssetType } from '@/database/schema/spaceAsset';
import { insertColllection } from '@editor/Editor/plugins/collab/collection';

import { uniqueId } from './id';

export const createDocFile = async ({
    title, 
    content, 
    collectionMap,
    userId,
    spaceId,
    type = SpaceAssetType.FILE,
}: {
    title: string,
    content: Object,
    collectionMap: Record<string, {
        schema: any,
        values: Record<string, any>,
    }>,
    userId: string,
    spaceId: string,
    type: SpaceAssetType,
}) => {
    const fileId = uniqueId();

    await createDoc(fileId, content);
    
    events.fileCreated({
        id: fileId,
        type: 'Doc',
        title,
        cover: '',
        creator: userId,
    });

    events.spaceAssetsCreated({
        id: uniqueId(),
        space: spaceId,
        asset: fileId,
        type,
    });

    // 如果有数据库表， 需要初始化yjs
    if (collectionMap) {
        Object.keys(collectionMap).forEach(key => {
            const { schema, values } = collectionMap[key];
            
            insertColllection(fileId, key, schema, values);
        });
    };

    return {
        fileId,
    };
}

export const createJournal = async ({
    title, 
    content, 
    collectionMap,
    userId,
    spaceId,
}: {
    title: string,
    content: Object,
    collectionMap: Record<string, {
        schema: any,
        values: Record<string, any>,
    }>,
    userId: string,
    spaceId: string,
}) => {
    return createDocFile({
        title,
        content,
        collectionMap,
        userId,
        spaceId,
        type: SpaceAssetType.JOURNAL,
    })
}

export const deleteJournal = async (fileId: string) => {
    deleteDoc(fileId);
    
    events.fileDeleted({
        id: fileId,
    });

    events.spaceAssetsDeleted({
        asset: fileId,
    });
}