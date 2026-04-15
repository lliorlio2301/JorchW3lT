import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import galleryService from '../services/galleryService';
import blogService from '../services/blogService';
import { useAuth } from '../hooks/useAuth';
import type { GalleryImage } from '../types/galleryImage';
import '../AdminShared.css';
import './AdminGalleryPage.css';

const AdminGalleryPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    const fetchImages = async () => {
        try {
            const data = await galleryService.getAllImages();
            setImages(data);
        } catch (err) {
            console.error('Failed to fetch gallery images', err);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleCreateNew = () => {
        setEditingImage({
            title: '',
            description: '',
            imageUrl: '',
            imageAlt: '',
            monthlyHighlight: false,
            hasBackground: true
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingImage) return;
        try {
            await galleryService.saveImage(editingImage);
            setEditingImage(null);
            fetchImages();
        } catch (err) {
            console.error('Failed to save gallery image', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('common.confirmDelete'))) return;
        try {
            await galleryService.deleteImage(id);
            fetchImages();
        } catch (err) {
            console.error('Failed to delete image', err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingImage) return;
        try {
            const url = await blogService.uploadImage(file);
            setEditingImage({ ...editingImage, imageUrl: url });
        } catch (err) {
            console.error('Upload failed', err);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="admin-container admin-gallery-container">
            <header className="admin-header">
                <h1>Gallery Admin</h1>
                <Link to="/gallery" className="retro-btn">
                    &larr; Back to Gallery
                </Link>
            </header>
            
            {!editingImage ? (
                <>
                    <button className="create-btn" onClick={handleCreateNew}>
                        + Add New Image
                    </button>
                    <div className="admin-list">
                        {images.map(img => (
                            <div key={img.id} className="admin-item">
                                <div className="gallery-admin-item-main">
                                    <div className="preview-img gallery-admin-preview">
                                        <img src={img.imageUrl} alt={img.imageAlt || img.title || 'Gallery image'} />
                                    </div>
                                    <div>
                                        <h3 className="gallery-admin-item-title">{img.title || 'Untitled'}</h3>
                                        {img.monthlyHighlight && (
                                            <span className="tag gallery-admin-featured-tag">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="admin-actions">
                                    <button onClick={() => setEditingImage(img)}>{t('common.edit')}</button>
                                    <button onClick={() => handleDelete(img.id!)}>{t('common.delete')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <form className="admin-form-card" onSubmit={handleSave}>
                    <h2>{editingImage.id ? 'Edit Image' : 'Add Image'}</h2>
                    
                    <div className="form-group">
                        <label>Title</label>
                        <input value={editingImage.title} onChange={e => setEditingImage({...editingImage, title: e.target.value})} placeholder="Give it a name..." />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={editingImage.description} onChange={e => setEditingImage({...editingImage, description: e.target.value})} rows={3} placeholder="Tell a story..." />
                    </div>

                    <div className="form-group">
                        <label>Alt text</label>
                        <input value={editingImage.imageAlt || ''} onChange={e => setEditingImage({...editingImage, imageAlt: e.target.value})} placeholder="Describe the image for screen readers..." />
                    </div>

                    <div className="form-group">
                        <label className="image-upload-label">
                            {t('blog.uploadImage')}
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {editingImage.imageUrl && (
                            <div className="preview-img">
                                <img src={editingImage.imageUrl} alt={editingImage.imageAlt || editingImage.title || 'Preview'} />
                            </div>
                        )}
                    </div>

                    <div className="form-group gallery-admin-check-row gallery-admin-check-highlight">
                        <input 
                            type="checkbox" 
                            checked={editingImage.monthlyHighlight} 
                            onChange={e => setEditingImage({...editingImage, monthlyHighlight: e.target.checked})} 
                            className="gallery-admin-checkbox"
                        />
                        <div>
                            <label className="gallery-admin-check-label">Show as "Image of the Month" on Homepage</label>
                            <p className="gallery-admin-check-help">Visible on Dashboard after title.</p>
                        </div>
                    </div>

                    <div className="form-group gallery-admin-check-row">
                        <input 
                            type="checkbox" 
                            checked={editingImage.hasBackground} 
                            onChange={e => setEditingImage({...editingImage, hasBackground: e.target.checked})} 
                            className="gallery-admin-checkbox"
                        />
                        <label>Add solid frame border</label>
                    </div>

                    <div className="editor-buttons">
                        <button type="button" onClick={() => setEditingImage(null)}>{t('common.cancel')}</button>
                        <button type="submit">{t('common.save')}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdminGalleryPage;
