import { describe, it, expect, vi } from 'vitest'
import { addBook } from './AddBook'
import type { BookRepository } from '@/domain/interfaces/BookRepository'

const makeRepository = (): BookRepository => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  findByStatus: vi.fn(),
  save: vi.fn(async (book) => book),
  update: vi.fn(),
  delete: vi.fn(),
})

describe('addBook use case', () => {
  it('should create a book with status "to-read"', async () => {
    const repo = makeRepository()
    const result = await addBook(repo, { title: 'Dom Casmurro', author: 'Machado de Assis' })
    expect(result.status).toBe('to-read')
    expect(result.title).toBe('Dom Casmurro')
    expect(repo.save).toHaveBeenCalledOnce()
  })

  it('should trim whitespace from title and author', async () => {
    const repo = makeRepository()
    const result = await addBook(repo, { title: '  O Aleph  ', author: '  Borges  ' })
    expect(result.title).toBe('O Aleph')
    expect(result.author).toBe('Borges')
  })

  it('should assign empty tags array when none provided', async () => {
    const repo = makeRepository()
    const result = await addBook(repo, { title: 'Test', author: 'Author' })
    expect(result.tags).toEqual([])
  })
})
