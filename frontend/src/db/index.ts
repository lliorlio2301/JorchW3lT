import Dexie, { type Table } from 'dexie';
import type { ListItem } from '../types/listItem';
import type { Note } from '../types/note';

export class LocalDB extends Dexie {
    listItems!: Table<ListItem>;
    notes!: Table<Note>;

    constructor() {
        super('JorchOS_LocalDB');
        this.version(1).stores({
            listItems: '++id, name, completed',
            notes: '++id, title, createdAt'
        });
    }
}

export const db = new LocalDB();
