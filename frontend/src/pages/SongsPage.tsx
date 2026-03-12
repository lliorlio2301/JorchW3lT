import React, { useEffect, useState } from 'react';
import songService from '../services/songService';
import type { Song } from '../types/song';
import './SongsPage.css';

const SongsPage: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const data = await songService.getAllSongs();
                setSongs(data);
            } catch (err) {
                console.error('Failed to fetch songs:', err);
                setError('Failed to load songs.');
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const getYoutubeEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1];
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return null;
    };

    if (loading) return <div className="songs-status">Loading songs...</div>;
    if (error) return <div className="songs-status error">{error}</div>;

    return (
        <div className="songs-container">
            <h1>Guitar Songbook</h1>
            <div className="songs-grid">
                {songs.map((song) => (
                    <div key={song.id} className="song-card">
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
                                Open on YouTube
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            {songs.length === 0 && <p>No songs found.</p>}
        </div>
    );
};

export default SongsPage;
