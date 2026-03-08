import type { Book } from '@/domain/entities/Book'
import type { BookRepository } from '@/domain/interfaces/BookRepository'
import { randomUUID } from 'crypto'

export interface AddBookInput {
  title: string
  author: string
  isbn?: string
  coverUrl?: string
  pageCount?: number
  tags?: string[]
}

export async function addBook(
  repository: BookRepository,
  input: AddBookInput
): Promise<Book> {
  const book: Book = {
    id: randomUUID(),
    title: input.title.trim(),
    author: input.author.trim(),
    isbn: input.isbn,
    coverUrl: input.coverUrl,
    status: 'to-read',
    pageCount: input.pageCount,
    currentPage: 0,
    addedAt: new Date(),
    tags: input.tags ?? [],
  }
  return repository.save(book)
}
