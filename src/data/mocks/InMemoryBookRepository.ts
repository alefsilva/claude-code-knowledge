import type { Book, ReadingStatus } from '@/domain/entities/Book'
import type { BookRepository } from '@/domain/interfaces/BookRepository'

export class InMemoryBookRepository implements BookRepository {
  private books: Map<string, Book> = new Map()

  async findAll(): Promise<Book[]> {
    return Array.from(this.books.values())
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.get(id) ?? null
  }

  async findByStatus(status: ReadingStatus): Promise<Book[]> {
    return Array.from(this.books.values()).filter((b) => b.status === status)
  }

  async save(book: Book): Promise<Book> {
    this.books.set(book.id, book)
    return book
  }

  async update(id: string, partial: Partial<Book>): Promise<Book> {
    const existing = this.books.get(id)
    if (!existing) throw new Error(`Book not found: ${id}`)
    const updated = { ...existing, ...partial }
    this.books.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    this.books.delete(id)
  }
}
