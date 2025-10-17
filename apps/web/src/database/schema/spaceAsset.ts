import type { Base } from './_common';
import type { Database } from '../database';

export enum SpaceAssetType {
    FILE = 'file',
    WIKI = 'wiki',
    JOURNAL = 'journal',
}

export interface SpaceAssetsSchema extends Base {
    _id: string; // id 作为主键
    space: string;
    asset: string;
    type: SpaceAssetType;
}

export const registerSpaceAssetsEvents = (db: Database) => {
    const spaceAssetsCreated = async ({ 
        id = '', 
        space = '',
        asset = '',
        type = SpaceAssetType.FILE,
        creator = '',
    }) => {
        if (!db.spaceAssets) return;
        try {
            const now = new Date().toISOString();
            await db.spaceAssets.put({
                _id: id,
                space,
                asset,
                type,
                creator,
                createdAt: now,
                updatedAt: now,
                deleted: 0,
            } as SpaceAssetsSchema);
        } catch(e) {
            console.error(e);
        }
    };

    const spaceAssetsDeleted = async ({
        asset,
    }: {
        asset: string;
    }) => {
        if (!db.spaceAssets) return;
        try {
            const result = await db.spaceAssets.find({
                selector: {
                  asset,
                  deleted: 0, // 可选
                }
            });

            const existing = result.docs?.[0]; // 如果只要第一个
            if (existing) {
                await db.spaceAssets.put({
                    ...existing,
                    deleted: 1,
                    updatedAt: new Date().toISOString(),
                });
            }
        } catch(e) {
            console.error(e);
        }
    };

    return {
        spaceAssetsCreated,
        spaceAssetsDeleted,
    };
};