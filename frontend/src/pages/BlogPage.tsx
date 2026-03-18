import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
                    <Link to="/blog/admin" className="admin-link chaos-card">
                        {t('blog.adminTitle')}
                    </Link>
                )}
            </header>

            <div className="blog-grid">
                {posts.map((post) => (
                    <article key={post.id} className="blog-card chaos-card">
                        {post.coverImageUrl && (
                            <div className="post-cover">
                                <img src={post.coverImageUrl} alt={post.title} />
                            </div>
                        )}
                        <div className="post-content">
                            <h3>{post.title}</h3>
                            <p className="post-date">
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                            </p>
                            <p className="post-summary">{post.summary}</p>
                            <Link to={`/blog/${post.slug}`} className="read-more">
                                {t('blog.readMore')} →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {posts.length === 0 && <p className="no-data">{t('blog.noPosts')}</p>}
        </div>
    );
};

export default BlogPage;
