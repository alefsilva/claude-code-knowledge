import type { Book, ReadingStatus } from '../entities/Book'

export interface BookRepository {
  findAll(): Promise<Book[]>
  findById(id: string): Promise<Book | null>
  findByStatus(status: ReadingStatus): Promise<Book[]>
  save(book: Book): Promise<Book>
  update(id: string, partial: Partial<Book>): Promise<Book>
  delete(id: string): Promise<void>
}
