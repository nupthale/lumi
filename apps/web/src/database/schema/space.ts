import type { Base } from './_common';
import type { Database } from '../database';

export interface SpaceSchema extends Base {
    _id: string; // id 作为主键
    name: string;
    description: string;
    isDefault: boolean;
    isSystem: boolean;
}

export const createSpaceIndex = async (db: Database) => {
    // db.spaces?.createIndex({
    //     index: {
    //         fields: ['deleted'],
    //     }
    // });
}

export const registerSpaceEvents = (db: Database) => {
    const spaceCreated = async ({ 
        id = '', 
        name = '',
        description = '',
        isDefault = false,
        isSystem = false,
        creator = '',
    }) => {
        if (!db.spaces) return;
        try {
            const now = new Date().toISOString();
            await db.spaces.put({
                _id: id,
                name,
                description,
                isDefault,
                isSystem,
                creator,
                createdAt: now,
                updatedAt: now,
                deleted: 0,
            });
        } catch(e) {
            console.error(e);
        }
    };

    const spaceDefaultReseted = async () => {
        if (!db.spaces) return;
        try {
            const result = await db.spaces.allDocs({ include_docs: true });
            const docs = result.rows
                .map(row => row.doc as unknown as SpaceSchema)
                .filter(doc => doc && doc.isDefault === true && doc.deleted !== 1)
                .map(doc => ({
                    ...doc,
                    isDefault: false,
                    updatedAt: new Date().toISOString(),
                }));
            if (docs.length > 0) {
                await db.spaces.bulkDocs(docs);
            }
        } catch(e) {
            console.error(e);
        }
    };

    const spaceUpdated = async ({
        id,
        name,
        description,
        isDefault = false,
        isSystem = false,
    }: {
        id: string;
        name: string;
        description: string;
        isDefault?: boolean;
        isSystem?: boolean;
    }) => {
        if (!db.spaces) return;
        const existing = await db.spaces.get(id);
        if (!existing) return;
        try {
            await db.spaces.put({
                ...existing,
                name,
                description,
                isDefault,
                isSystem,
                updatedAt: new Date().toISOString(),
            });
        } catch(e) {
            console.error(e);
        }
    };

    const spaceDeleted = async ({ id }: { id: string }) => {
        if (!db.spaces) return;
        try {
            const existing = await db.spaces.get(id);
            if (existing) {
                await db.spaces.put({
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
        spaceCreated,
        spaceDefaultReseted,
        spaceUpdated,
        spaceDeleted,
    };
};