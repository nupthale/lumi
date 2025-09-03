import type { SharableBase } from './_common';
import type { Database } from '../database';

export interface WikiTreeSchema extends SharableBase {
    _id: string; // 由 wiki+file 拼接
    wiki: string;
    file: string;
    orderIndex: number;
    parentFile: string;
}

export const createWikiTreeIndex = async (db: Database) => {
    return db.wikiTrees?.createIndex({
        index: {
            fields: ['_id'],
        }
    });
}

export const registerWikiTreeEvents = (db: Database) => {
    const wikiTreeCreated = async ({
        wiki = '',
        file = '',
        orderIndex = 10,
        parentFile = '',
        creator = '',
    }) => {
        if (!db.wikiTrees) return;
        try {
            const now = new Date().toISOString();
            await db.wikiTrees.put({
                _id: `${wiki}_${file}`,
                wiki,
                file,
                orderIndex,
                parentFile,
                createdAt: now,
                updatedAt: now,
                deleted: 0,

                creator,
                ownerId: creator,
                ownerGroupId: '',
                public: false,
                members: [],
            });
        } catch (e) {
            console.error(e);
        }
    };

    const wikiTreeUpdated = async (record: {
        wiki: string,
        file: string,
    } & Partial<Omit<WikiTreeSchema, '_id' | 'wiki' | 'file' | 'createdAt' | 'deleted'>>) => {
        const { wiki, file, ...params } = record;

        if (!db.wikiTrees) return;
        const id = `${wiki}_${file}`;
        const existing = await db.wikiTrees.get(id);
        if (!existing) return;
        try {
            const now = new Date().toISOString();
            await db.wikiTrees.put({
                ...existing,
                ...params,
                updatedAt: now,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const wikiTreeNodeDeleted = async ({ 
        wiki, 
        fileIds 
    }: {
        wiki: string, 
        fileIds: string[]
    }) => {
        if (!db.wikiTrees) return;
        try {
            const ids = fileIds.map(file => `${wiki}_${file}`);
            const result = await db.wikiTrees.allDocs({ include_docs: true, keys: ids });
            const docsToDelete = result.rows
                .filter(row => 'doc' in row && row.doc)
                .map(row => (row as { doc: unknown }).doc as WikiTreeSchema)
                .filter(doc => doc && doc.deleted !== 1)
                .map(doc => ({
                    ...doc,
                    deleted: 1,
                    updatedAt: new Date().toISOString(),
                }));
            if (docsToDelete.length > 0) {
                await db.wikiTrees.bulkDocs(docsToDelete);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return {
        wikiTreeCreated,
        wikiTreeUpdated,
        wikiTreeNodeDeleted,
    };
}; 