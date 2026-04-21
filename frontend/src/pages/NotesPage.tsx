import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import noteService from '../services/noteService';
import { useAuth } from '../hooks/useAuth';
import type { Note } from '../types/note';
import { MarkdownEditor } from '../components/notes/MarkdownEditor';
import type { MarkdownEditorHandle } from '../components/notes/MarkdownEditor';
import './NotesPage.css';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const AUTO_SAVE_DELAY_MS = 1000;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const NotesPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMobileEditor, setShowMobileEditor] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const autoSaveTimeoutRef = useRef<number | null>(null);
    const lastSavedSnapshotRef = useRef<string>('');
    const editorRef = useRef<MarkdownEditorHandle | null>(null);

    const snapshot = useCallback((note: Note): string => {
        return JSON.stringify({
            id: note.id ?? null,
            title: note.title,
            content: note.content,
            pinned: note.pinned ?? false,
            archived: note.archived ?? false
        });
    }, []);

    const updateNoteInState = useCallback((updatedNote: Note) => {
        setNotes(prev => {
            const index = prev.findIndex(note => note.id === updatedNote.id);
            if (index === -1) {
                return [updatedNote, ...prev];
            }
            const next = [...prev];
            next[index] = updatedNote;
            return next;
        });
        setSelectedNote(updatedNote);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const fetchNotes = useCallback(async () => {
        if (!isAuthenticated) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await noteService.getAllNotes({
                archived: showArchived,
                query: searchQuery
            });
            setNotes(data);
            setSelectedNote(prevSelected => {
                if (!prevSelected) {
                    return data[0] ?? null;
                }
                if (!prevSelected.id) {
                    return prevSelected;
                }
                return data.find(item => item.id === prevSelected.id) ?? data[0] ?? null;
            });
        } catch (err) {
            console.error('Failed to fetch notes', err);
            setError(t('notes.error'));
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, searchQuery, showArchived, t]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    useEffect(() => {
        return () => {
            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, []);

    const persistNote = useCallback(async (noteToSave: Note, silent = false) => {
        if (!noteToSave.content.trim() && !noteToSave.title.trim()) {
            return null;
        }

        if (!silent) {
            setSaveStatus('saving');
        }
        const savedNote = await noteService.saveNote(noteToSave);
        updateNoteInState(savedNote);
        lastSavedSnapshotRef.current = snapshot(savedNote);
        setSaveStatus('saved');
        return savedNote;
    }, [snapshot, updateNoteInState]);

    useEffect(() => {
        if (!selectedNote) {
            return;
        }

        const currentSnapshot = snapshot(selectedNote);
        if (currentSnapshot === lastSavedSnapshotRef.current) {
            return;
        }

        if (autoSaveTimeoutRef.current) {
            window.clearTimeout(autoSaveTimeoutRef.current);
        }
        setSaveStatus('saving');

        const noteToSave = { ...selectedNote };
        autoSaveTimeoutRef.current = window.setTimeout(async () => {
            try {
                await persistNote(noteToSave, true);
            } catch (err) {
                console.error('Auto-save failed', err);
                setSaveStatus('error');
            }
        }, AUTO_SAVE_DELAY_MS);
    }, [persistNote, selectedNote, snapshot]);

    const saveStatusLabel = useMemo(() => {
        if (saveStatus === 'saving') return t('notes.saving');
        if (saveStatus === 'saved') return t('notes.saved');
        if (saveStatus === 'error') return t('notes.saveError');
        return '';
    }, [saveStatus, t]);

    const handleAddNote = () => {
        const newNote: Note = {
            title: '',
            content: '',
            pinned: false,
            archived: showArchived
        };
        setSelectedNote(newNote);
        setShowMobileEditor(true);
        setSaveStatus('idle');
        lastSavedSnapshotRef.current = snapshot(newNote);
    };

    const handleSaveNote = async () => {
        if (!selectedNote) {
            return;
        }
        if (autoSaveTimeoutRef.current) {
            window.clearTimeout(autoSaveTimeoutRef.current);
        }

        try {
            await persistNote(selectedNote);
        } catch (err) {
            console.error('Failed to save note', err);
            setSaveStatus('error');
        }
    };

    const handleDeleteNote = async (id?: number) => {
        if (!id) {
            setSelectedNote(notes.length > 0 ? notes[0] : null);
            setShowMobileEditor(false);
            return;
        }
        if (!window.confirm(t('common.confirmDelete'))) {
            return;
        }

        try {
            await noteService.deleteNote(id);
            const updatedNotes = notes.filter(note => note.id !== id);
            setNotes(updatedNotes);
            setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
            setShowMobileEditor(false);
            setSaveStatus('idle');
        } catch (err) {
            console.error('Failed to delete note', err);
        }
    };

    const handlePinnedToggle = async () => {
        if (!selectedNote?.id) {
            setSelectedNote(prev => prev ? { ...prev, pinned: !(prev.pinned ?? false) } : prev);
            return;
        }
        try {
            const updated = await noteService.setPinned(selectedNote.id, !(selectedNote.pinned ?? false));
            updateNoteInState(updated);
        } catch (err) {
            console.error('Failed to update pin state', err);
        }
    };

    const handleArchivedToggle = async () => {
        if (!selectedNote) {
            return;
        }
        const nextArchived = !(selectedNote.archived ?? false);
        if (!selectedNote.id) {
            setSelectedNote({ ...selectedNote, archived: nextArchived, pinned: nextArchived ? false : selectedNote.pinned });
            return;
        }

        try {
            const updated = await noteService.setArchived(selectedNote.id, nextArchived);
            if (updated.archived !== showArchived) {
                await fetchNotes();
                setShowMobileEditor(false);
                return;
            }
            updateNoteInState(updated);
        } catch (err) {
            console.error('Failed to update archive state', err);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedNote) {
            return;
        }

        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
            setError(t('notes.fileTooLarge'));
            event.target.value = '';
            return;
        }

        try {
            const url = await noteService.uploadImage(file);
            const markdown = `\n![${file.name}](${url})\n`;
            if (editorRef.current) {
                editorRef.current.insertMarkdownAtCursor(markdown);
            } else {
                setSelectedNote({ ...selectedNote, content: `${selectedNote.content}${markdown}` });
            }
            setError(null);
        } catch (err) {
            console.error('Failed to upload image for note', err);
            setError(t('notes.imageUploadError'));
        } finally {
            event.target.value = '';
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className={`notes-container ${showMobileEditor ? 'mobile-editor-active' : ''}`}>
            <div className="notes-sidebar">
                <button className="add-note-btn chaos-card" onClick={handleAddNote}>
                    + {t('notes.add')}
                </button>
                <div className="notes-filter-panel chaos-card">
                    <input
                        className="notes-search-input"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={t('notes.searchPlaceholder')}
                    />
                    <button
                        className={`archive-toggle-btn ${showArchived ? 'active' : ''}`}
                        onClick={() => setShowArchived(value => !value)}
                    >
                        {showArchived ? t('notes.showActive') : t('notes.showArchived')}
                    </button>
                </div>
                <div className="notes-list">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`note-summary-card chaos-card ${selectedNote?.id === note.id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedNote(note);
                                setShowMobileEditor(true);
                                lastSavedSnapshotRef.current = snapshot(note);
                            }}
                        >
                            <h3>{note.pinned ? '📌 ' : ''}{note.title || t('notes.newItem')}</h3>
                            <p className="note-date">
                                {t('notes.lastEdited')}: {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : ''}
                            </p>
                        </div>
                    ))}
                </div>
                {notes.length === 0 && !loading && <p className="no-data">{t('notes.noData')}</p>}
                {error && <p className="notes-error">{error}</p>}
            </div>

            <div className="notes-editor chaos-card">
                {selectedNote ? (
                    <>
                        <div className="editor-header">
                            <button className="mobile-back-btn" onClick={() => setShowMobileEditor(false)}>
                                ←
                            </button>
                            <input
                                className="editor-title-input"
                                value={selectedNote.title}
                                onChange={(event) => {
                                    setSelectedNote({ ...selectedNote, title: event.target.value });
                                }}
                                placeholder={t('notes.placeholderTitle')}
                            />
                        </div>

                        <div className="editor-content">
                            <MarkdownEditor
                                ref={editorRef}
                                value={selectedNote.content}
                                onChange={(nextMarkdown) => {
                                    setSelectedNote({ ...selectedNote, content: nextMarkdown });
                                }}
                                placeholder={t('notes.placeholderItem')}
                            />
                        </div>

                        <div className="editor-actions">
                            <span className={`save-status ${saveStatus}`}>
                                {saveStatusLabel}
                            </span>
                            <button className="save-btn" onClick={handleSaveNote}>{t('common.save')}</button>
                            <button className="secondary-btn" onClick={handlePinnedToggle}>
                                {selectedNote.pinned ? t('notes.unpin') : t('notes.pin')}
                            </button>
                            <button className="secondary-btn" onClick={handleArchivedToggle}>
                                {selectedNote.archived ? t('notes.unarchive') : t('notes.archive')}
                            </button>
                            <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
                                {t('notes.insertImage')}
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => handleDeleteNote(selectedNote.id)}
                            >
                                {t('common.delete')}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden-image-input"
                            />
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
