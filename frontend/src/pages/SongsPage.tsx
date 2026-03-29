import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import songService from '../services/songService';
import { useAuth } from '../hooks/useAuth';
import type { Song } from '../types/song';
import './SongsPage.css';

const SongsPage: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSong, setEditingSong] = useState<Song | null>(null);
    const [formData, setFormData] = useState<Omit<Song, 'id'>>({
        title: '',
        artist: '',
        youtubeUrl: '',
        category: '',
        chords: '',
        tuning: '',
        capo: 0,
        musicKey: ''
    });

    const fetchSongs = useCallback(async () => {
        try {
            const data = await songService.getAllSongs();
            setSongs(data);
        } catch (err) {
            console.error('Failed to fetch songs:', err);
            setError(t('songs.error'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    const handleEdit = (song: Song) => {
        setEditingSong(song);
        setFormData({
            title: song.title,
            artist: song.artist,
            youtubeUrl: song.youtubeUrl || '',
            category: song.category || '',
            chords: song.chords || '',
            tuning: song.tuning || '',
            capo: song.capo || 0,
            musicKey: song.musicKey || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('common.confirmDelete') || 'Are you sure?')) {
            try {
                await songService.deleteSong(id);
                setSongs(songs.filter(s => s.id !== id));
                if (selectedSong?.id === id) setSelectedSong(null);
            } catch {
                alert('Failed to delete song');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSong && editingSong.id !== undefined) {
                await songService.updateSong(editingSong.id, formData);
            } else if (!editingSong) {
                await songService.saveSong(formData);
            }
            setIsFormOpen(false);
            setEditingSong(null);
            setFormData({ title: '', artist: '', youtubeUrl: '', category: '', chords: '', tuning: '', capo: 0, musicKey: '' });
            fetchSongs();
        } catch {
            alert('Failed to save song');
        }
    };

    if (loading) return <div className="songs-status">{t('songs.loading')}</div>;
    if (error) return <div className="songs-status error">{error}</div>;

    return (
        <div className="songs-container">
            <div className="page-header">
                <h1>{t('songs.title')}</h1>
                {isAuthenticated && (
                    <button 
                        className="btn-add" 
                        onClick={() => {
                            setIsFormOpen(!isFormOpen);
                            setEditingSong(null);
                            setFormData({ title: '', artist: '', youtubeUrl: '', category: '', chords: '', tuning: '', capo: 0, musicKey: '' });
                        }}
                    >
                        {isFormOpen ? t('common.cancel') : t('songs.addSong') || '+ Add Song'}
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="chaos-card admin-form-card">
                    <h3>{editingSong ? t('songs.editSong') || 'Edit Song' : t('songs.addSong') || 'Add New Song'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-grid">
                            <input 
                                type="text" 
                                placeholder={t('songs.placeholderTitle') || 'Title'}
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <input 
                                type="text" 
                                placeholder={t('songs.placeholderArtist') || 'Artist'}
                                value={formData.artist}
                                onChange={e => setFormData({...formData, artist: e.target.value})}
                                required
                            />
                            <input 
                                type="text" 
                                placeholder={t('songs.placeholderYoutube') || 'YouTube URL'}
                                value={formData.youtubeUrl}
                                onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
                            />
                            <input 
                                type="text" 
                                placeholder={t('songs.placeholderCategory') || 'Category'}
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                required
                            />
                            <input 
                                type="text" 
                                placeholder="Tuning"
                                value={formData.tuning}
                                onChange={e => setFormData({...formData, tuning: e.target.value})}
                            />
                            <input 
                                type="number" 
                                placeholder="Capo"
                                value={formData.capo}
                                onChange={e => setFormData({...formData, capo: parseInt(e.target.value) || 0})}
                            />
                            <input 
                                type="text" 
                                placeholder="Key"
                                value={formData.musicKey}
                                onChange={e => setFormData({...formData, musicKey: e.target.value})}
                            />
                        </div>
                        <div className="form-group" style={{marginTop: '1rem'}}>
                            <textarea 
                                placeholder="Chords & Lyrics"
                                value={formData.chords}
                                onChange={e => setFormData({...formData, chords: e.target.value})}
                                rows={10}
                                style={{fontFamily: 'monospace'}}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-save">{t('common.save') || 'Save'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="songs-layout">
                <div className="songs-sidebar">
                    <div className="songs-grid">
                        {songs.map((song) => (
                            <div 
                                key={song.id} 
                                className={`song-card chaos-card ${selectedSong?.id === song.id ? 'active' : ''}`}
                                onClick={() => setSelectedSong(song)}
                            >
                                <div className="song-info">
                                    <h3>{song.title}</h3>
                                    <p className="artist">{song.artist}</p>
                                    <span className="category-tag">{song.category}</span>
                                </div>
                                {isAuthenticated && (
                                    <div className="admin-quick-actions">
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(song); }}>{t('common.edit')}</button>
                                        <button onClick={(e) => { e.stopPropagation(); song.id !== undefined && handleDelete(song.id); }} className="btn-delete">X</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="song-viewer">
                    {selectedSong ? (
                        <div className="song-details-card chaos-card">
                            <header className="viewer-header">
                                <h2>{selectedSong.title}</h2>
                                <p className="viewer-artist">{selectedSong.artist}</p>
                                <div className="viewer-meta">
                                    {selectedSong.tuning && <span><b>Tuning:</b> {selectedSong.tuning}</span>}
                                    {selectedSong.capo !== undefined && selectedSong.capo > 0 && <span><b>Capo:</b> {selectedSong.capo}</span>}
                                    {selectedSong.musicKey && <span><b>Key:</b> {selectedSong.musicKey}</span>}
                                </div>
                            </header>

                            {selectedSong.youtubeUrl && (
                                <div className="viewer-video">
                                    <a href={selectedSong.youtubeUrl} target="_blank" rel="noopener noreferrer" className="retro-btn">
                                        Listen on YouTube
                                    </a>
                                </div>
                            )}

                            {selectedSong.chords ? (
                                <div className="viewer-chords">
                                    <pre>{selectedSong.chords}</pre>
                                </div>
                            ) : (
                                <p className="no-chords">No chords available yet.</p>
                            )}
                        </div>
                    ) : (
                        <div className="viewer-placeholder chaos-card">
                            <p>Select a song from the list to view its chords and details.</p>
                        </div>
                    )}
                </div>
            </div>
            {songs.length === 0 && <p>{t('songs.noData')}</p>}
        </div>
    );
};

export default SongsPage;
