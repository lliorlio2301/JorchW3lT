import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import noteService from '../services/noteService';
import { useAuth } from '../hooks/useAuth';
import type { Note } from '../types/note';
import './NotesPage.css';

const NotesPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(true);
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
                setIsEditing(false); // Start in view mode for existing notes
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
            content: ''
        };
        setSelectedNote(newNote);
        setIsEditing(true);
    };

    const handleSaveNote = async () => {
        if (!selectedNote) return;
        
        if (!selectedNote.content.trim() && !selectedNote.title.trim()) {
            return;
        }

        try {
            const saved = await noteService.saveNote(selectedNote);
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
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save note', err);
        }
    };

    const handleDeleteNote = async (id?: number) => {
        if (!id) {
            setSelectedNote(notes.length > 0 ? notes[0] : null);
            setIsEditing(false);
            return;
        }
        if (!window.confirm(t('common.confirmDelete'))) return;

        try {
            await noteService.deleteNote(id);
            const updatedNotes = notes.filter(n => n.id !== id);
            setNotes(updatedNotes);
            setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to delete note', err);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="notes-container">
            <div className="notes-sidebar">
                <button className="add-note-btn chaos-card" onClick={handleAddNote}>
                    + {t('notes.add')}
                </button>
                <div className="notes-list">
                    {notes.map(note => (
                        <div 
                            key={note.id} 
                            className={`note-summary-card chaos-card ${selectedNote?.id === note.id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedNote(note);
                                setIsEditing(false);
                            }}
                        >
                            <h3>{note.title || t('notes.newItem')}</h3>
                            <p className="note-date">{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}</p>
                        </div>
                    ))}
                </div>
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
                            <div className="editor-mode-toggle">
                                <button 
                                    className={isEditing ? 'active' : ''} 
                                    onClick={() => setIsEditing(true)}
                                >
                                    {t('common.edit')}
                                </button>
                                <button 
                                    className={!isEditing ? 'active' : ''} 
                                    onClick={() => setIsEditing(false)}
                                >
                                    {t('common.view')}
                                </button>
                            </div>
                        </div>
                        
                        <div className="editor-content">
                            {isEditing ? (
                                <textarea 
                                    className="note-textarea"
                                    value={selectedNote.content}
                                    onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})}
                                    placeholder={t('notes.placeholderItem')}
                                    autoFocus
                                />
                            ) : (
                                <div className="note-preview markdown-body">
                                    {selectedNote.content ? (
                                        <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                                    ) : (
                                        <p className="empty-content">{t('notes.noData')}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="editor-actions">
                            <button className="save-btn" onClick={handleSaveNote}>{t('common.save')}</button>
                            <button 
                                className="delete-btn"
                                onClick={() => handleDeleteNote(selectedNote.id)} 
                            >
                                {t('common.delete')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-selection">
                        <div className="no-selection-content">
                            <h2>{t('notes.title')}</h2>
                            <p>{t('notes.noData')}</p>
                            <button className="add-note-btn-large" onClick={handleAddNote}>
                                {t('notes.add')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesPage;
