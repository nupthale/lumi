import { createFileIndex, registerFileEvents } from './file';
import { createSpaceIndex, registerSpaceEvents } from './space';
import { registerSpaceAssetsEvents } from './spaceAsset';
import { createWikiIndex, registerWikiEvents } from './wiki';
import { createWikiTreeIndex, registerWikiTreeEvents } from './wikiTree';

import { Database } from '../database';

export const createIndexes = async (db: Database) => {
    await Promise.all([
        createFileIndex(db),
        createSpaceIndex(db),
        createWikiIndex(db),
        createWikiTreeIndex(db),
    ]);
}

export const registerEvents = (db: Database) => {
    const fileEvents = registerFileEvents(db);
    const spaceEvents = registerSpaceEvents(db);
    const spaceAssetsEvents = registerSpaceAssetsEvents(db);
    const wikiEvents = registerWikiEvents(db);
    const wikiTreeEvents = registerWikiTreeEvents(db);

    return {
        ...fileEvents,
        ...spaceEvents,
        ...spaceAssetsEvents,
        ...wikiEvents,
        ...wikiTreeEvents,
    };
}