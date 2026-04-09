import { describe, it, expect, vi, beforeEach } from 'vitest'
import noteService from './noteService'
import api from './api'
import { db } from '../db'
import type { Note } from '../types/note'

// Mock axios/api
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock Dexie DB
vi.mock('../db', () => ({
  db: {
    notes: {
      clear: vi.fn(),
      bulkAdd: vi.fn(),
      toArray: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

describe('NoteService with Offline Persistence', () => {
  const mockNotes: Note[] = [
    { id: 1, title: 'Note 1', content: 'Content 1', createdAt: '2026-03-18T10:00:00Z' },
    { id: 2, title: 'Note 2', content: 'Content 2', createdAt: '2026-03-18T11:00:00Z' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches notes from API and syncs to local DB when online', async () => {
    // Online success
    vi.mocked(api.get).mockResolvedValue({ data: mockNotes })
    
    const result = await noteService.getAllNotes()
    
    expect(api.get).toHaveBeenCalledWith('/notes')
    expect(db.notes.clear).toHaveBeenCalled()
    expect(db.notes.bulkAdd).toHaveBeenCalledWith(mockNotes)
    expect(result).toEqual(mockNotes)
  })

  it('falls back to local DB when API call fails (offline)', async () => {
    // API fails
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'))
    // Local DB has data
    vi.mocked(db.notes.toArray).mockResolvedValue(mockNotes)
    
    const result = await noteService.getAllNotes()
    
    expect(api.get).toHaveBeenCalled()
    expect(db.notes.toArray).toHaveBeenCalled()
    // Sorted by date desc: Note 2 (11:00) before Note 1 (10:00)
    expect(result[0].id).toBe(2)
    expect(result[1].id).toBe(1)
  })
})
