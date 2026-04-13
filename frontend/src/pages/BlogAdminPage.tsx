import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
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
    const [loading, setLoading] = useState(true);
    const [newTag, setNewTag] = useState('');

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
            coverImageUrl: '',
            coverImageAlt: '',
            tags: []
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
            alert(t('blog.saveError', 'Fehler beim Speichern des Beitrags. Bitte versuche es erneut.'));
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

    const addTag = () => {
        if (!editingPost) return;
        if (newTag.trim() && !(editingPost.tags || []).includes(newTag.trim())) {
            setEditingPost({
                ...editingPost,
                tags: [...(editingPost.tags || []), newTag.trim()]
            });
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        if (!editingPost) return;
        setEditingPost({
            ...editingPost,
            tags: (editingPost.tags || []).filter(t => t !== tagToRemove)
        });
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
    if (loading && posts.length === 0) return <div className="blog-status">{t('blog.loading')}</div>;

    return (
        <div className={`blog-admin-container ${editingPost ? 'is-editing' : ''}`}>
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
                <div className="blog-editor-view">
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
                            <div className="tag-input-group">
                                <input 
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    placeholder="Add tag..."
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <button type="button" onClick={addTag} className="add-tag-btn">Add</button>
                            </div>
                            <div className="admin-tags-list">
                                {(editingPost.tags || []).map(tag => (
                                    <span key={tag} className="admin-tag-chip">
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(tag)}>&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <textarea 
                                value={editingPost.summary || ''}
                                onChange={e => setEditingPost({...editingPost, summary: e.target.value})}
                                placeholder={t('blog.placeholderSummary')}
                                rows={2}
                            />
                        </div>

                        <div className="form-group">
                            <label className="image-upload-label">
                                {t('blog.uploadImage')}
                                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                            </label>
                            <input
                                value={editingPost.coverImageAlt || ''}
                                onChange={e => setEditingPost({ ...editingPost, coverImageAlt: e.target.value })}
                                placeholder={t('blog.coverImageAlt', 'Bildbeschreibung (Alt-Text)')}
                            />
                            {editingPost.coverImageUrl && (
                                <div className="preview-img">
                                    <img src={editingPost.coverImageUrl} alt={editingPost.coverImageAlt || editingPost.title || 'Preview'} />
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

                    <div className="blog-preview-panel chaos-card">
                        <div className="preview-label">Live Preview</div>
                        <div className="article-content preview-content">
                            <header className="article-header">
                                <h1 className="preview-title">{editingPost.title || 'Post Title'}</h1>
                            </header>
                            <div className="markdown-body">
                                <ReactMarkdown>{editingPost.content || '*No content yet...*'}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogAdminPage;
