import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import noteService from '../services/noteService';
import { useAuth } from '../hooks/useAuth';
import type { Note, NoteItem } from '../types/note';
import './NotesPage.css';

const NotesPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const fetchNotes = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await noteService.getAllNotes();
            setNotes(data);
            if (data.length > 0 && !selectedNote) {
                setSelectedNote(data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch notes', err);
            setError(t('notes.error'));
        } finally {
            setLoading(false);
        }
    }, [t, isAuthenticated, selectedNote]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleAddNote = () => {
        const newNote: Note = {
            title: '',
            noteItems: [{ text: '', completed: false, isChecklist: true }]
        };
        setSelectedNote(newNote);
    };

    const handleSaveNote = async () => {
        if (!selectedNote) return;
        
        const noteToSave = {
            ...selectedNote,
            noteItems: selectedNote.noteItems.filter(item => item.text.trim() !== '')
        };

        if (noteToSave.noteItems.length === 0 && !noteToSave.title) {
            return;
        }

        try {
            const saved = await noteService.saveNote(noteToSave);
            setNotes(prevNotes => {
                const index = prevNotes.findIndex(n => n.id === saved.id);
                if (index !== -1) {
                    const updated = [...prevNotes];
                    updated[index] = saved;
                    return updated;
                } else {
                    return [saved, ...prevNotes];
                }
            });
            setSelectedNote(saved);
        } catch (err) {
            console.error('Failed to save note', err);
        }
    };

    const handleDeleteNote = async (id?: number) => {
        if (!id) {
            setSelectedNote(notes.length > 0 ? notes[0] : null);
            return;
        }
        if (!window.confirm(t('common.confirmDelete'))) return;

        try {
            await noteService.deleteNote(id);
            const updatedNotes = notes.filter(n => n.id !== id);
            setNotes(updatedNotes);
            setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
        } catch (err) {
            console.error('Failed to delete note', err);
        }
    };

    const updateNoteItem = (index: number, updates: Partial<NoteItem>) => {
        if (!selectedNote) return;
        const newItems = [...selectedNote.noteItems];
        newItems[index] = { ...newItems[index], ...updates };
        setSelectedNote({ ...selectedNote, noteItems: newItems });
    };

    const toggleMode = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        if (!selectedNote) return;
        const current = selectedNote.noteItems[index].isChecklist;
        updateNoteItem(index, { isChecklist: !current, completed: false });
    };

    const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentItem = selectedNote?.noteItems[index];
            const newItems = [...(selectedNote?.noteItems || [])];
            newItems.splice(index + 1, 0, { 
                text: '', 
                completed: false, 
                isChecklist: currentItem?.isChecklist ?? true 
            });
            setSelectedNote({ ...selectedNote!, noteItems: newItems });
            
            setTimeout(() => {
                const inputs = document.querySelectorAll('.note-item-input');
                (inputs[index + 1] as HTMLInputElement)?.focus();
            }, 0);
        } else if (e.key === 'Backspace' && selectedNote?.noteItems[index].text === '' && selectedNote.noteItems.length > 1) {
            e.preventDefault();
            const newItems = [...selectedNote.noteItems];
            newItems.splice(index, 1);
            setSelectedNote({ ...selectedNote, noteItems: newItems });
            
            setTimeout(() => {
                const inputs = document.querySelectorAll('.note-item-input');
                (inputs[index - 1] as HTMLInputElement)?.focus();
            }, 0);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="notes-container">
            <div className="notes-sidebar">
                <button className="add-note-btn chaos-card" onClick={handleAddNote}>
                    + {t('notes.add')}
                </button>
                {notes.map(note => (
                    <div 
                        key={note.id} 
                        className={`note-summary-card chaos-card ${selectedNote?.id === note.id ? 'active' : ''}`}
                        onClick={() => setSelectedNote(note)}
                    >
                        <h3>{note.title || t('notes.newItem')}</h3>
                        <p>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}</p>
                    </div>
                ))}
                {notes.length === 0 && !loading && <p className="no-data">{t('notes.noData')}</p>}
            </div>

            <div className="notes-editor chaos-card">
                {selectedNote ? (
                    <>
                        <div className="editor-header">
                            <input 
                                className="editor-title-input"
                                value={selectedNote.title}
                                onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
                                placeholder={t('notes.placeholderTitle')}
                            />
                        </div>
                        <div className="editor-content">
                            {selectedNote.noteItems.map((item, index) => (
                                <div key={index} className="note-item-row">
                                    <div 
                                        className={`note-item-checkbox ${item.completed ? 'completed' : ''} ${!item.isChecklist ? 'hidden' : ''}`}
                                        onClick={() => item.isChecklist && updateNoteItem(index, { completed: !item.completed })}
                                        onContextMenu={(e) => toggleMode(e, index)}
                                        title="Click to toggle check, Right-click to toggle mode"
                                    >
                                        {item.isChecklist ? (item.completed ? '✓' : '') : '•'}
                                    </div>
                                    <input 
                                        className={`note-item-input ${item.completed ? 'completed' : ''} ${!item.isChecklist ? 'paragraph' : ''}`}
                                        value={item.text}
                                        onChange={(e) => updateNoteItem(index, { text: e.target.value })}
                                        onKeyDown={(e) => handleItemKeyDown(e, index)}
                                        placeholder={t('notes.placeholderItem')}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="editor-actions">
                            <button onClick={handleSaveNote}>{t('common.save')}</button>
                            <button 
                                onClick={() => handleDeleteNote(selectedNote.id)} 
                                style={{ background: 'var(--color-primary)' }}
                            >
                                {t('common.delete')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-selection">
                        <h2>{t('notes.title')}</h2>
                        <p>{t('notes.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesPage;
