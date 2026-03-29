import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import galleryService from '../services/galleryService';
import blogService from '../services/blogService';
import { useAuth } from '../hooks/useAuth';
import type { GalleryImage } from '../types/galleryImage';
import './BlogAdminPage.css'; // Reusing admin styles

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
        <div className="blog-admin-container">
            <h1>Gallery Admin</h1>
            
            {!editingImage ? (
                <>
                    <button className="create-btn chaos-card" onClick={handleCreateNew}>
                        + Add New Image
                    </button>
                    <div className="admin-posts-list">
                        {images.map(img => (
                            <div key={img.id} className="admin-post-item chaos-card">
                                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                    <img src={img.imageUrl} alt="" style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}} />
                                    <div>
                                        <h3>{img.title || 'Untitled'}</h3>
                                        {img.monthlyHighlight && <span className="tag" style={{background: 'var(--color-primary)', color: 'white'}}>Monthly Highlight</span>}
                                    </div>
                                </div>
                                <div className="admin-actions">
                                    <button onClick={() => setEditingImage(img)}>{t('common.edit')}</button>
                                    <button onClick={() => handleDelete(img.id!)} style={{background: 'var(--color-primary)'}}>{t('common.delete')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <form className="blog-editor-form chaos-card" onSubmit={handleSave}>
                    <h2>{editingImage.id ? 'Edit Image' : 'Add Image'}</h2>
                    
                    <div className="form-group">
                        <label>Title</label>
                        <input value={editingImage.title} onChange={e => setEditingImage({...editingImage, title: e.target.value})} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={editingImage.description} onChange={e => setEditingImage({...editingImage, description: e.target.value})} rows={3} />
                    </div>

                    <div className="form-group">
                        <label className="image-upload-label">
                            {t('blog.uploadImage')}
                            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                        </label>
                        {editingImage.imageUrl && (
                            <div className="preview-img">
                                <img src={editingImage.imageUrl} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '1rem'}}>
                        <input 
                            type="checkbox" 
                            checked={editingImage.monthlyHighlight} 
                            onChange={e => setEditingImage({...editingImage, monthlyHighlight: e.target.checked})} 
                            style={{width: 'auto'}}
                        />
                        <label>Set as Monthly Highlight</label>
                    </div>

                    <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '1rem'}}>
                        <input 
                            type="checkbox" 
                            checked={editingImage.hasBackground} 
                            onChange={e => setEditingImage({...editingImage, hasBackground: e.target.checked})} 
                            style={{width: 'auto'}}
                        />
                        <label>Has Background (Solid Frame)</label>
                    </div>

                    <div className="editor-buttons">
                        <button type="submit">{t('common.save')}</button>
                        <button type="button" onClick={() => setEditingImage(null)} style={{background: 'var(--color-muted)'}}>{t('common.cancel')}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdminGalleryPage;
