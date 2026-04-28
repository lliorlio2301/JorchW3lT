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
    patch: vi.fn(),
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
    { id: 1, title: 'Note 1', content: 'Content 1', createdAt: '2026-03-18T10:00:00Z', updatedAt: '2026-03-18T10:00:00Z', pinned: false, archived: false },
    { id: 2, title: 'Note 2', content: 'Content 2', createdAt: '2026-03-18T11:00:00Z', updatedAt: '2026-03-18T11:00:00Z', pinned: true, archived: false },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches notes from API and syncs to local DB when online', async () => {
    // Online success
    vi.mocked(api.get).mockResolvedValue({ data: mockNotes })
    
    const result = await noteService.getAllNotes()
    
    expect(api.get).toHaveBeenCalledWith('/notes', {
      params: {
        archived: false,
        query: undefined
      }
    })
    expect(db.notes.clear).toHaveBeenCalled()
    expect(db.notes.bulkAdd).toHaveBeenCalledWith([
      mockNotes[1],
      mockNotes[0]
    ])
    expect(result).toEqual([
      mockNotes[1],
      mockNotes[0]
    ])
  })

  it('falls back to local DB when API call fails (offline)', async () => {
    // API fails
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'))
    // Local DB has data
    vi.mocked(db.notes.toArray).mockResolvedValue(mockNotes)
    
    const result = await noteService.getAllNotes()
    
    expect(api.get).toHaveBeenCalled()
    expect(db.notes.toArray).toHaveBeenCalled()
    // Sorted by pin first: Note 2 before Note 1
    expect(result[0].id).toBe(2)
    expect(result[1].id).toBe(1)
  })

  it('does not use offline fallback for auth errors', async () => {
    vi.mocked(api.get).mockRejectedValue({
      isAxiosError: true,
      response: { status: 403 }
    })

    await expect(noteService.getAllNotes()).rejects.toBeTruthy()
    expect(db.notes.toArray).not.toHaveBeenCalled()
  })

  it('updates pin state via API patch', async () => {
    const patched = { ...mockNotes[0], pinned: true }
    vi.mocked(api.patch).mockResolvedValue({ data: patched })

    const result = await noteService.setPinned(1, true)

    expect(api.patch).toHaveBeenCalledWith('/notes/1/pin', undefined, {
      params: { pinned: true }
    })
    expect(db.notes.put).toHaveBeenCalledWith(patched)
    expect(result.pinned).toBe(true)
  })
})
