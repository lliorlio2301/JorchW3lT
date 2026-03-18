import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import blogService from '../services/blogService';
import type { BlogPost } from '../types/blogPost';
import './BlogPostPage.css';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useTranslation();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                const data = await blogService.getPostBySlug(slug);
                setPost(data);
            } catch (err) {
                console.error('Failed to fetch post', err);
                setError(t('blog.error'));
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug, t]);

    if (loading) return <div className="blog-status">{t('blog.loading')}</div>;
    if (error || !post) return <div className="blog-status error">{error || 'Post not found'}</div>;

    return (
        <div className="blog-post-container">
            <Link to="/blog" className="back-link">← {t('blog.backToList')}</Link>
            
            <article className="blog-article chaos-card">
                {post.coverImageUrl && (
                    <div className="article-cover">
                        <img src={post.coverImageUrl} alt={post.title} />
                    </div>
                )}
                <div className="article-header">
                    <h1>{post.title}</h1>
                    <p className="article-date">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                    </p>
                </div>
                <div className="article-content">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default BlogPostPage;
