import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import shortStoryService from '../services/shortStoryService';
import blogService from '../services/blogService';
import { useAuth } from '../hooks/useAuth';
import type { ShortStory } from '../types/shortStory';
import './BlogAdminPage.css'; // Reusing admin styles

const AdminShortStoriesPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [stories, setStories] = useState<ShortStory[]>([]);
    const [editingStory, setEditingStory] = useState<ShortStory | null>(null);

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    const fetchStories = async () => {
        try {
            const data = await shortStoryService.getAllStories();
            setStories(data);
        } catch (err) {
            console.error('Failed to fetch stories', err);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const handleCreateNew = () => {
        setEditingStory({
            title: '',
            content: '',
            summary: '',
            coverImageUrl: ''
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStory) return;
        try {
            await shortStoryService.saveStory(editingStory);
            setEditingStory(null);
            fetchStories();
        } catch (err) {
            console.error('Failed to save story', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('common.confirmDelete'))) return;
        try {
            await shortStoryService.deleteStory(id);
            fetchStories();
        } catch (err) {
            console.error('Failed to delete story', err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingStory) return;
        try {
            const url = await blogService.uploadImage(file);
            setEditingStory({ ...editingStory, coverImageUrl: url });
        } catch (err) {
            console.error('Upload failed', err);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="blog-admin-container">
            <h1>Short Stories Admin</h1>
            
            {!editingStory ? (
                <>
                    <button className="create-btn chaos-card" onClick={handleCreateNew}>
                        + Write New Story
                    </button>
                    <div className="admin-posts-list">
                        {stories.map(story => (
                            <div key={story.id} className="admin-post-item chaos-card">
                                <div>
                                    <h3>{story.title}</h3>
                                    <p>{story.summary?.substring(0, 50)}...</p>
                                </div>
                                <div className="admin-actions">
                                    <button onClick={() => setEditingStory(story)}>{t('common.edit')}</button>
                                    <button onClick={() => handleDelete(story.id!)} style={{background: 'var(--color-primary)'}}>{t('common.delete')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <form className="blog-editor-form chaos-card" onSubmit={handleSave} style={{maxWidth: '100%', gridTemplateColumns: '1fr'}}>
                    <h2>{editingStory.id ? 'Edit Story' : 'New Story'}</h2>
                    
                    <div className="form-group">
                        <label>Title</label>
                        <input value={editingStory.title} onChange={e => setEditingStory({...editingStory, title: e.target.value})} required />
                    </div>

                    <div className="form-group">
                        <label>Summary</label>
                        <textarea value={editingStory.summary} onChange={e => setEditingStory({...editingStory, summary: e.target.value})} rows={3} />
                    </div>

                    <div className="form-group">
                        <label className="image-upload-label">
                            {t('blog.uploadImage')}
                            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                        </label>
                        {editingStory.coverImageUrl && (
                            <div className="preview-img">
                                <img src={editingStory.coverImageUrl} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Content (Markdown)</label>
                        <textarea 
                            className="content-editor"
                            value={editingStory.content} 
                            onChange={e => setEditingStory({...editingStory, content: e.target.value})} 
                            required 
                            rows={15}
                        />
                    </div>

                    <div className="editor-buttons">
                        <button type="submit">{t('common.save')}</button>
                        <button type="button" onClick={() => setEditingStory(null)} style={{background: 'var(--color-muted)'}}>{t('common.cancel')}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdminShortStoriesPage;
