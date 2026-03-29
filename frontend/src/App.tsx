import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ResumePage from './pages/ResumePage';
import SongsPage from './pages/SongsPage';
import ProjectsPage from './pages/ProjectsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import NotesPage from './pages/NotesPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BlogAdminPage from './pages/BlogAdminPage';
import GalleryPage from './pages/GalleryPage';
import AdminGalleryPage from './pages/AdminGalleryPage';
import ShortStoriesPage from './pages/ShortStoriesPage';
import ShortStoryReaderPage from './pages/ShortStoryReaderPage';
import AdminShortStoriesPage from './pages/AdminShortStoriesPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import './App.css'

function NavContent() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="app-layout">
      {isOffline && (
        <div className="offline-banner">
          {t('common.offlineMode')} - {t('common.offlineDataAvailable')}
        </div>
      )}
      <nav className="main-nav">
        <div className="nav-mobile-header">
           <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
             {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
           </button>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>{t('nav.home')}</Link>
          <Link to="/projects" onClick={closeMenu}>{t('nav.projects')}</Link>
          <Link to="/resume" onClick={closeMenu}>{t('nav.resume')}</Link>
          <Link to="/songs" onClick={closeMenu}>{t('nav.songs')}</Link>
          <Link to="/blog" onClick={closeMenu}>{t('nav.blog')}</Link>
          <Link to="/gallery" onClick={closeMenu}>{t('nav.gallery', 'Gallery')}</Link>
          <Link to="/stories" onClick={closeMenu}>{t('nav.stories', 'Stories')}</Link>
          {isAuthenticated && (
            <>
              <Link to="/shopping" onClick={closeMenu}>{t('nav.shopping')}</Link>
              <Link to="/notes" onClick={closeMenu}>{t('nav.notes')}</Link>
              <Link to="/account" onClick={closeMenu}>Account</Link>
            </>
          )}
        </div>

        <div className={`nav-controls ${isMenuOpen ? 'open' : ''}`}>
          <div className="language-switcher">
            <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => changeLanguage('de')} className={i18n.language === 'de' ? 'active' : ''}>DE</button>
            <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
            <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'active' : ''}>ES</button>
          </div>
          {isAuthenticated ? (
            <button onClick={() => { logout(); closeMenu(); }} className="auth-toggle">Logout</button>
          ) : (
            <button onClick={() => { navigate('/login'); closeMenu(); }} className="auth-toggle">Login</button>
          )}
        </div>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/admin" element={<BlogAdminPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/admin" element={<AdminGalleryPage />} />
          <Route path="/stories" element={<ShortStoriesPage />} />
          <Route path="/stories/:id" element={<ShortStoryReaderPage />} />
          <Route path="/stories/admin" element={<AdminShortStoriesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavContent />
      </AuthProvider>
    </Router>
  )
}

export default App
