import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import songService from '../services/songService';
import projectService from '../services/projectService';
import galleryService from '../services/galleryService';
import shortStoryService from '../services/shortStoryService';
import type { BlogPost } from '../types/blogPost';
import type { Song } from '../types/song';
import type { Project } from '../types/project';
import type { GalleryImage } from '../types/galleryImage';
import type { ShortStory } from '../types/shortStory';
import './HomePage.css';

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [recentSongs, setRecentSongs] = useState<Song[]>([]);
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [recentStories, setRecentStories] = useState<ShortStory[]>([]);
    const [highlight, setHighlight] = useState<GalleryImage | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [posts, songs, projects, highlightImg, stories] = await Promise.all([
                    blogService.getAllPosts(),
                    songService.getAllSongs(),
                    projectService.getAllProjects(),
                    galleryService.getMonthlyHighlight(),
                    shortStoryService.getAllStories()
                ]);

                console.log("Geladene Blog-Posts:", posts.length);

                setRecentPosts(posts.slice(0, 15)); // Zeige bis zu 15 Blogs
                setRecentSongs(songs.slice(0, 8));
                setRecentProjects(projects.slice(0, 3));
                setRecentStories(stories.slice(0, 3));
                setHighlight(highlightImg);
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            }
        };
        loadData();
    }, []);

    // Generate stable random styles for the chaotic pile
    const chaoticStyles = React.useMemo(() => {
        return recentPosts.map((_, index) => ({
            '--rand-deg': `${(Math.random() - 0.5) * 20}deg`,
            '--rand-x': `${(Math.random() - 0.5) * 60}vw`, // Breite Streuung
            '--rand-y': `${(Math.random() - 0.5) * 250}px`, // Vertikale Streuung
            '--z-index': recentPosts.length - index
        } as React.CSSProperties));
    }, [recentPosts]);

    return (
        <div className="home-container">
            {/* HERO SECTION */}
            <header className="hero-section">
                <h1 className="hero-title">{t('welcome.title')}</h1>
                {/* {<p className="hero-subtitle">{t('welcome.resumeDesc')}</p>} */}
            </header>

            {/* MONTHLY HIGHLIGHT */}
            {highlight && (
                <section className="monthly-highlight-section">
                   {/*  <div className={`highlight-container ${highlight.hasBackground ? 'with-bg' : 'no-bg'}`}> */}
                        <img src={highlight.imageUrl} alt={highlight.title || 'Highlight of the month'} className="highlight-image" />
{/*                         {highlight.title && <h2 className="highlight-title">{highlight.title}</h2>}
                        {highlight.description && <p className="highlight-description">{highlight.description}</p>} */}
{/*                         <Link to="/gallery" className="gallery-link">{t('nav.gallery', 'Gallery Archive')}</Link> */}
                    {/* </div> */}
                </section>
            )}

            {/* SONGS SECTION */}
            <section className="home-section songs-section">
                <h2 className="section-label">{t('nav.songs')}</h2>
                <div className="project-card module-panel songs-list-card">
                    <div className="project-info">
                        <h3>Jorch's Songbook</h3>
                        <div className="card-body">
                            <table className="songs-table">
                                <thead>
                                    <tr>
                                        <th>{t('songs.title', 'Titel')}</th>
                                        <th>{t('songs.artist', 'Artist')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSongs.map(song => (
                                        <tr key={song.id}>
                                            <td>{song.title}</td>
                                            <td>{song.artist}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="section-footer">
                    <Link to="/songs" className="retro-btn">{t('common.viewAll')}</Link>
                </div>
            </section>

            {/* BLOG SECTION */}
            <section className="home-section blog-section">
                <div className='blog-protected-header'>
                    <h2 className="section-label">{t('nav.blog')}</h2>
                </div>
                <div className="blog-pile-container">
                    <div className="blog-pile">
                        {recentPosts.map((post, index) => (
                            <Link 
                                to={`/blog/${post.slug}`} 
                                key={post.id} 
                                className="project-card module-panel blog-post-card chaotic-pile-item" 
                                style={chaoticStyles[index]}
                            >
                                <div className="project-info">
                                    <h3>{post.title}</h3>
                                    <span className="post-date">{new Date(post.createdAt!).toLocaleDateString()}</span>
                                    <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="blog-protected-footer">
                    <Link to="/blog" className="retro-btn">{t('common.viewAll')}</Link>
                </div>
            </section>

            {/* STORIES SECTION */}
            <section className="home-section stories-section">
                <h2 className="section-label">{t('nav.stories')}</h2>
                <div className="projects-grid">
                    {recentStories.map((story) => (
                        <Link to={`/stories/${story.id}`} key={story.id} className="project-card module-panel" style={{textDecoration: 'none'}}>
                            {story.coverImageUrl && (
                                <div className="project-image">
                                    <img src={story.coverImageUrl} alt={story.title} />
                                </div>
                            )}
                            <div className="project-info">
                                <h3>{story.title}</h3>
                                <p>{story.summary}</p>
                                <span className="post-date">{new Date(story.createdAt!).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="section-footer">
                    <Link to="/stories" className="retro-btn">{t('common.viewAll')}</Link>
                </div>
            </section>

            {/* PROJECTS SECTION */}
            <section className="home-section projects-section">
                <h2 className="section-label">{t('nav.projects')}</h2>
                <div className="projects-grid">
                    {recentProjects.map((project) => (
                        <div key={project.id} className="project-card module-panel">
                            {project.imageUrl && (
                                <div className="project-image">
                                    <img src={project.imageUrl} alt={project.title} />
                                </div>
                            )}
                            <div className="project-info">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="tech-tags">
                                    {project.techTags?.map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="section-footer">
                    <Link to="/projects" className="retro-btn">{t('common.viewAll')}</Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
