import type { SharableBase } from './_common';
import type { Database } from '../database';

export interface WikiSchema extends SharableBase {
    _id: string; // id 作为主键
    title: string;
    desc: string;
    cover: string;
    favorite: boolean;
    creator: string;
    createdAt: string;
    updatedAt: string;
    deleted: number;
}

export const createWikiIndex = async (db: Database) => {
    return db.wikis?.createIndex({
        index: {
            fields: ['updatedAt'],
        }
    });
}

export const registerWikiEvents = (db: Database) => {
    const wikiCreated = async ({
        id = '',
        title = '',
        desc = '',
        cover = '',
        favorite = false,
        creator = '',
    }) => {
        if (!db.wikis) return;
        try {
            const now = new Date().toISOString();
            await db.wikis.put({
                _id: id,
                title,
                desc,
                cover,
                favorite,
                creator,
                createdAt: now,
                updatedAt: now,
                deleted: 0,

                public: false,
                ownerId: creator,
                ownerGroupId: '',
                members: [],
            });
        } catch (e) {
            console.error(e);
        }
    };

    const wikiUpdated = async (record: Partial<Omit<WikiSchema, '_id' | 'createdAt' | 'deleted' | 'creator'>> & { id: string }) => {
        const { id, ...params } = record;

        if (!db.wikis) return;
        const existing = await db.wikis.get(id);
        if (!existing) return;
        try {
            const now = new Date().toISOString();
            await db.wikis.put({
                ...existing,
                ...params,
                updatedAt: now,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const wikiDeleted = async ({ id }: { id: string }) => {
        if (!db.wikis) return;
        try {
            const existing = await db.wikis.get(id);
            if (existing) {
                await db.wikis.put({
                    ...existing,
                    deleted: 1,
                    updatedAt: new Date().toISOString(),
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return {
        wikiCreated,
        wikiUpdated,
        wikiDeleted,
    };
}; 