import { createFileIndex, registerFileEvents } from './file';
import { createSpaceIndex, registerSpaceEvents } from './space';
import { createSpaceAssetsIndex, registerSpaceAssetsEvents } from './spaceAsset';
import { createJournalStatIndex, registerJournalStatsEvents } from './journalStat';
import { createWikiIndex, registerWikiEvents } from './wiki';
import { createWikiTreeIndex, registerWikiTreeEvents } from './wikiTree';

import { Database } from '../database';

export const createIndexes = async (db: Database) => {
    await Promise.all([
        createFileIndex(db),
        createSpaceIndex(db),
        createSpaceAssetsIndex(db),
        createWikiIndex(db),
        createWikiTreeIndex(db),
        createJournalStatIndex(db),
    ]);
}

export const registerEvents = (db: Database) => {
    const fileEvents = registerFileEvents(db);
    const spaceEvents = registerSpaceEvents(db);
    const spaceAssetsEvents = registerSpaceAssetsEvents(db);
    const wikiEvents = registerWikiEvents(db);
    const wikiTreeEvents = registerWikiTreeEvents(db);
    const journalStatEvents = registerJournalStatsEvents(db);
    
    return {
        ...fileEvents,
        ...spaceEvents,
        ...spaceAssetsEvents,
        ...journalStatEvents,
        ...wikiEvents,
        ...wikiTreeEvents,
    };
}