import type { Book } from '@/domain/entities/Book'
import type { BookRepository } from '@/domain/interfaces/BookRepository'

export interface AddBookInput {
  title: string
  author: string
  summary?: string
  tags?: string[]
}

export async function addBook(
  repository: BookRepository,
  input: AddBookInput
): Promise<Book> {
  const book: Book = {
    id: globalThis.crypto.randomUUID(),
    title: input.title.trim(),
    author: input.author.trim(),
    summary: input.summary ?? '',
    status: 'to-read',
    createdAt: new Date(),
    tags: input.tags ?? [],
  }
  return repository.save(book)
}
