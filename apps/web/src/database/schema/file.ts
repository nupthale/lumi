import type { SharableBase } from './_common';
import type { Database } from '../database';

export interface FileSchema extends SharableBase {
    _id: string; // id 作为主键
    type: string; // type是为了后续扩展，比如以后pdf等格式。
    wiki: string;
    title: string;
    tags: string[];
    desc: string;
    emoji: string;
    cover: string;
    favorite: boolean;
}

export const createFileIndex = async (db: Database) => {
    // db.files?.createIndex({
    //     index: {
    //         fields: ['_id', 'deleted'],
    //     }
    // });

    return db.files?.createIndex({
        index: {
            fields: ['updatedAt'],
        }
    });
}

export const registerFileEvents = (db: Database) => {
    const fileCreated = async ({
        id = '',
        type = '',
        wiki = '',
        title = '',
        tags = [],
        desc = '',
        emoji = '',
        cover = '',
        favorite = false,
        creator = '',
    }) => {
        if (!db.files) return;
        try {
            const now = new Date().toISOString();
            await db.files.put({
                _id: id,
                type,
                wiki,
                title,
                tags,
                desc,
                emoji,
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

    const fileUpdated = async (record: {
        params: Partial<Omit<FileSchema, '_id' | 'createdAt' | 'deleted' | 'creator'>>;
    } & { id: string }) => {
        const { id, ...params } = record;

        if (!db.files) return;
        const existing = await db.files.get(id);
        if (!existing) return;
        try {
            const now = new Date().toISOString();
            await db.files.put({
                ...existing,
                ...params,
                updatedAt: now,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const fileDeleted = async ({
        id,
    }: { id: string }) => {
        if (!db.files) return;
        try {
            const existing = await db.files.get(id);
            debugger;
            if (existing) {
                await db.files.put({
                    ...existing,
                    deleted: 1,
                    updatedAt: new Date().toISOString(),
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const wikiFilesDeleted = async (wiki: string) => {
        if (!db.files) return;
        try {
            // 这里需要批量查找所有属于该 wiki 的文件
            const result = await db.files.allDocs({ include_docs: true });
            const filesToDelete = result.rows
                .map(row => row.doc as unknown as FileSchema)
                .filter(doc => doc && doc.wiki === wiki && doc.deleted !== 1);

            const docsToUpdate = filesToDelete.map(file => ({
                ...file,
                deleted: 1,
                updatedAt: new Date().toISOString(),
            }));

            await db.files.bulkDocs(docsToUpdate);
        } catch (e) {
            console.error(e);
        }
    };

    return {
        fileCreated,
        fileUpdated,
        fileDeleted,
        wikiFilesDeleted,
    };
}; 