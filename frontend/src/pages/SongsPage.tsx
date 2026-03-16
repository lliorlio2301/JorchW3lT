import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import songService from '../services/songService';
import { useAuth } from '../context/AuthContext';
import type { Song } from '../types/song';
import './SongsPage.css';

const SongsPage: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSong, setEditingSong] = useState<Song | null>(null);
    const [formData, setFormData] = useState<Omit<Song, 'id'>>({
        title: '',
        artist: '',
        youtubeUrl: '',
        category: ''
    });

    const fetchSongs = async () => {
        try {
            const data = await songService.getAllSongs();
            setSongs(data);
        } catch (err) {
            console.error('Failed to fetch songs:', err);
            setError(t('songs.error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, [t]);

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return null;
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('be/')[1];
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return null;
    };

    const handleEdit = (song: Song) => {
        setEditingSong(song);
        setFormData({
            title: song.title,
            artist: song.artist,
            youtubeUrl: song.youtubeUrl,
            category: song.category
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('common.confirmDelete') || 'Are you sure?')) {
            try {
                await songService.deleteSong(id);
                setSongs(songs.filter(s => s.id !== id));
            } catch (err) {
                alert('Failed to delete song');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSong) {
                await songService.updateSong(editingSong.id, formData);
            } else {
                await songService.saveSong(formData);
            }
            setIsFormOpen(false);
            setEditingSong(null);
            setFormData({ title: '', artist: '', youtubeUrl: '', category: '' });
            fetchSongs();
        } catch (err) {
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
                            setFormData({ title: '', artist: '', youtubeUrl: '', category: '' });
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
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-save">{t('common.save') || 'Save'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="songs-grid">
                {songs.map((song) => (
                    <div key={song.id} className="song-card chaos-card">
                        <div className="song-info">
                            <h3>{song.title}</h3>
                            <p className="artist">{song.artist}</p>
                            <span className="category-tag">{song.category}</span>
                        </div>
                        {song.youtubeUrl && getYoutubeEmbedUrl(song.youtubeUrl) && (
                            <div className="video-responsive">
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={getYoutubeEmbedUrl(song.youtubeUrl)!}
                                    title={song.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        <div className="song-actions">
                            <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                                {t('songs.youtube')}
                            </a>
                            {isAuthenticated && (
                                <div className="admin-actions">
                                    <button onClick={() => handleEdit(song)} className="btn-edit">✏️</button>
                                    <button onClick={() => handleDelete(song.id)} className="btn-delete">🗑️</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {songs.length === 0 && <p>{t('songs.noData')}</p>}
        </div>
    );
};

export default SongsPage;
