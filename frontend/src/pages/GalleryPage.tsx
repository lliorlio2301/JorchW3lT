import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import galleryService from '../services/galleryService';
import { useAuth } from '../hooks/useAuth';
import type { GalleryImage } from '../types/galleryImage';
import './GalleryPage.css';

const GalleryPage: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await galleryService.getAllImages();
                // Sort by date descending
                setImages(data.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()));
            } catch (err) {
                console.error('Failed to fetch gallery images', err);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading) return <div className="gallery-status">{t('common.loading', 'Loading gallery...')}</div>;

    return (
        <div className="gallery-container">
            <header className="gallery-header">
                <div className="header-with-action">
                    <h1>{t('nav.gallery', 'Gallery')}</h1>
                    {isAuthenticated && (
                        <Link to="/gallery/admin" className="admin-link">
                            {t('common.edit', 'Manage')}
                        </Link>
                    )}
                </div>
                <p>{t('gallery.subtitle', 'A collection of monthly highlights and visual snippets.')}</p>
            </header>

            <div className="gallery-grid">
                {images.map((image) => (
                    <div key={image.id} className={`gallery-item chaos-card ${image.hasBackground ? 'with-bg' : 'no-bg'}`}>
                        <div className="gallery-image-wrapper">
                            <img src={image.imageUrl} alt={image.imageAlt || image.title || 'Gallery image'} />
                        </div>
                        <div className="gallery-info">
                            <h3>{image.title}</h3>
                            {image.description && <p>{image.description}</p>}
                            <span className="gallery-date">
                                {new Date(image.createdAt!).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && <p className="no-data">{t('gallery.empty', 'The gallery is currently empty.')}</p>}
        </div>
    );
};

export default GalleryPage;
