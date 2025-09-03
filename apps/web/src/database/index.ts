import { registerEvents } from './schema/index';
import { database } from './database';

export const events = registerEvents(database);
