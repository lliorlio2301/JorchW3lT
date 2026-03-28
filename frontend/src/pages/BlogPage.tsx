import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import blogService from '../services/blogService';
import type { BlogPost } from '../types/blogPost';
import { useAuth } from '../hooks/useAuth';
import './BlogPage.css';

const BlogPage: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (err) {
                console.error('Failed to fetch posts', err);
                setError(t('blog.error'));
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [t]);

    if (loading) return <div className="blog-status">{t('blog.loading')}</div>;
    if (error) return <div className="blog-status error">{error}</div>;

    return (
        <div className="blog-container">
            <header className="blog-header">
                <h1>{t('blog.title')}</h1>
                {isAuthenticated && (
                    <Link to="/blog/admin" className="admin-link">
                        {t('blog.adminTitle')}
                    </Link>
                )}
            </header>

            <div className="blog-list">
                {posts.map((post) => (
                    <article key={post.id} className="blog-entry">
                        <div className="entry-meta">
                            <span className="entry-date">
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                            </span>
                        </div>
                        <Link to={`/blog/${post.slug}`} className="entry-title-link">
                            <h2 className="entry-title">{post.title}</h2>
                        </Link>
                        {post.summary && (
                            <div className="entry-summary">
                                <ReactMarkdown>{post.summary}</ReactMarkdown>
                            </div>
                        )}
                        <div className="entry-preview">
                            <ReactMarkdown>
                                {post.content.length > 160 ? post.content.substring(0, 160) + '...' : post.content}
                            </ReactMarkdown>
                        </div>
                        <Link to={`/blog/${post.slug}`} className="read-more">
                            {t('blog.readMore')} →
                        </Link>
                    </article>
                ))}
            </div>

            {posts.length === 0 && <p className="no-data">{t('blog.noPosts')}</p>}
        </div>
    );
};

export default BlogPage;
