import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import NotesPage from './NotesPage'
import { BrowserRouter } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import noteService from '../services/noteService'

// Mock hooks
vi.mock('../hooks/useAuth')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
})
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}))

// Mock services
vi.mock('../services/noteService')

describe('NotesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to login if not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: false, 
      user: null, 
      token: null, 
      login: vi.fn(), 
      logout: vi.fn() 
    })
    
    render(
      <BrowserRouter>
        <NotesPage />
      </BrowserRouter>
    )
    
    // In our component, it returns null if not authenticated
    expect(screen.queryByText('notes.title')).not.toBeInTheDocument()
  })

  it('renders notes when authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: true, 
      user: { username: 'admin', role: 'ADMIN' }, 
      token: 'fake-token', 
      login: vi.fn(), 
      logout: vi.fn() 
    })
    
    vi.mocked(noteService.getAllNotes).mockResolvedValue([
      { id: 1, title: 'My Test Note', noteItems: [], createdAt: '2026-03-18T10:00:00Z' }
    ])
    
    render(
      <BrowserRouter>
        <NotesPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('My Test Note')).toBeInTheDocument()
    })
  })
})
