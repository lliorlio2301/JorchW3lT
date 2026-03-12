import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResumePage from './pages/ResumePage';
import SongsPage from './pages/SongsPage';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-layout">
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/resume">Resume</Link>
          <Link to="/songs">Songs</Link>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={
              <div className="home-welcome">
                <h1>Welcome to Jorch's Portfolio</h1>
                <p>Select a section from the navigation above.</p>
              </div>
            } />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/songs" element={<SongsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
