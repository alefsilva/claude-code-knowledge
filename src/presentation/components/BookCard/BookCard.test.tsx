import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BookCard } from './BookCard'
import type { Book } from '@/domain/entities/Book'

const mockBook: Book = {
  id: '1',
  title: 'Dom Casmurro',
  author: 'Machado de Assis',
  status: 'finished',
  addedAt: new Date(),
  tags: [],
}

describe('BookCard', () => {
  it('renders title and author', () => {
    render(<BookCard book={mockBook} />)
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument()
    expect(screen.getByText('Machado de Assis')).toBeInTheDocument()
  })

  it('shows status badge', () => {
    render(<BookCard book={mockBook} />)
    expect(screen.getByText('Finalizado')).toBeInTheDocument()
  })

  it('renders placeholder icon when no coverUrl', () => {
    render(<BookCard book={mockBook} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
