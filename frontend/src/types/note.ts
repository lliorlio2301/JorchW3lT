export interface NoteItem {
    id?: number;
    text: string;
    completed: boolean;
}

export interface Note {
    id?: number;
    title: string;
    createdAt?: string;
    noteItems: NoteItem[];
}
