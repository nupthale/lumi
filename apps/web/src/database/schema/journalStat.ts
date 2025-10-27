import type { Base } from './_common';
import type { Database } from '../database';

export interface JournalStatSchema extends Base {
    _id: string; // id 作为主键, 值为日期
    space: string;
    wordsCount: number; // 字数
    charCount: number; // 字符数
}

export const createJournalStatIndex = async (db: Database) => {
    db.journalStats?.createIndex({
        index: {
            fields: ['_id'],
        }
    });
}

export const registerJournalStatsEvents = (db: Database) => {
    const journalStatCreated = async ({ 
        id = '', 
        space = '',
        wordsCount = 0,
        charCount = 0,
        creator = '',
    }) => {
        if (!db.journalStats) return;
        try {
            const now = new Date().toISOString();
            await db.journalStats.put({
                _id: id,
                space,
                wordsCount,
                charCount,
                creator,
                createdAt: now,
                updatedAt: now,
                deleted: 0,
            });
        } catch(e) {
            console.error(e);
        }
    };

    const journalStatUpdated = async ({
        id,
        wordsCount,
        charCount,
    }: {
        id: string;
        wordsCount: number;
        charCount: number;
    }) => {
        if (!db.journalStats) return;
        const existing = await db.journalStats.get(id);
        if (!existing) return;
        try {
            await db.journalStats.put({
                ...existing,
                wordsCount,
                charCount,
                updatedAt: new Date().toISOString(),
            });
        } catch(e) {
            console.error(e);
        }
    };

    const journalStatDeleted = async ({ id }: { id: string }) => {
        if (!db.journalStats) return;
        try {
            const existing = await db.journalStats.get(id);
            if (existing) {
                await db.journalStats.put({
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
        journalStatCreated,
        journalStatUpdated,
        journalStatDeleted,
    };
};