import type { Book, ReadingStatus } from '@/domain/entities/Book'
import type { BookRepository } from '@/domain/interfaces/BookRepository'

const STORAGE_KEY = 'personal-lib-xyzk:books'

function deserialize(raw: string): Book[] {
  const parsed = JSON.parse(raw) as Array<Omit<Book, 'createdAt'> & { createdAt: string }>
  return parsed.map((b) => ({ ...b, createdAt: new Date(b.createdAt) }))
}

export class LocalStorageBookRepository implements BookRepository {
  private load(): Book[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? deserialize(raw) : []
    } catch (err) {
      console.error('[LocalStorageBookRepository] Dados corrompidos, limpando storage.', err)
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
  }

  private persist(books: Book[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }

  async findAll(): Promise<Book[]> {
    return this.load()
  }

  async findById(id: string): Promise<Book | null> {
    return this.load().find((b) => b.id === id) ?? null
  }

  async findByStatus(status: ReadingStatus): Promise<Book[]> {
    return this.load().filter((b) => b.status === status)
  }

  async save(book: Book): Promise<Book> {
    const books = this.load()
    books.push(book)
    this.persist(books)
    return book
  }

  async update(id: string, partial: Partial<Book>): Promise<Book> {
    const books = this.load()
    const index = books.findIndex((b) => b.id === id)
    if (index === -1) throw new Error(`Book not found: ${id}`)
    books[index] = { ...books[index], ...partial }
    this.persist(books)
    return books[index]
  }

  async delete(id: string): Promise<void> {
    const books = this.load().filter((b) => b.id !== id)
    this.persist(books)
  }
}
