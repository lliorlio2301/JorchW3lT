import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';
import type { BlogPost } from '../types/blogPost';
import { useAuth } from '../hooks/useAuth';
import './BlogAdminPage.css';

const BlogAdminPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const fetchPosts = async () => {
        try {
            const data = await blogService.getAllPosts();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreateNew = () => {
        setEditingPost({
            title: '',
            slug: '',
            content: '',
            summary: '',
            coverImageUrl: ''
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost) return;

        try {
            await blogService.savePost(editingPost);
            setEditingPost(null);
            fetchPosts();
        } catch (err) {
            console.error('Failed to save post', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('common.confirmDelete'))) return;
        try {
            await blogService.deletePost(id);
            fetchPosts();
        } catch (err) {
            console.error('Failed to delete post', err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingPost) return;

        // Check file size (5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert(t('blog.fileTooLarge'));
            return;
        }

        try {
            const url = await blogService.uploadImage(file);
            setEditingPost({ ...editingPost, coverImageUrl: url });
        } catch (err) {
            console.error('Upload failed', err);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="blog-admin-container">
            <h1>{t('blog.adminTitle')}</h1>
            
            {!editingPost ? (
                <>
                    <button className="create-btn chaos-card" onClick={handleCreateNew}>
                        + {t('blog.createPost')}
                    </button>
                    <div className="admin-posts-list">
                        {posts.map(post => (
                            <div key={post.id} className="admin-post-item chaos-card">
                                <div>
                                    <h3>{post.title}</h3>
                                    <p>{post.slug}</p>
                                </div>
                                <div className="admin-actions">
                                    <button onClick={() => setEditingPost(post)}>{t('common.edit')}</button>
                                    <button onClick={() => handleDelete(post.id!)} style={{background: 'var(--color-primary)'}}>{t('common.delete')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <form className="blog-editor-form chaos-card" onSubmit={handleSave}>
                    <h2>{editingPost.id ? t('blog.editPost') : t('blog.createPost')}</h2>
                    
                    <div className="form-group">
                        <input 
                            value={editingPost.title}
                            onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                            placeholder={t('blog.placeholderTitle')}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input 
                            value={editingPost.slug}
                            onChange={e => setEditingPost({...editingPost, slug: e.target.value})}
                            placeholder="slug-url-path"
                        />
                    </div>

                    <div className="form-group">
                        <textarea 
                            value={editingPost.summary}
                            onChange={e => setEditingPost({...editingPost, summary: e.target.value})}
                            placeholder={t('blog.placeholderSummary')}
                        />
                    </div>

                    <div className="form-group">
                        <label className="image-upload-label">
                            {t('blog.uploadImage')}
                            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                        </label>
                        {editingPost.coverImageUrl && (
                            <div className="preview-img">
                                <img src={editingPost.coverImageUrl} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <textarea 
                            className="content-editor"
                            value={editingPost.content}
                            onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                            placeholder={t('blog.placeholderContent')}
                            required
                        />
                    </div>

                    <div className="editor-buttons">
                        <button type="submit">{t('common.save')}</button>
                        <button type="button" onClick={() => setEditingPost(null)} style={{background: 'var(--color-muted)'}}>{t('common.cancel')}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BlogAdminPage;
