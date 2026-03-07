import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BookCard } from './BookCard'
import type { Book } from '@/domain/entities/Book'

const mockBook: Book = {
  id: '1',
  title: 'Dom Casmurro',
  author: 'Machado de Assis',
  summary: 'Bentinho narra sua história de amor com Capitu.',
  tags: ['romance', 'literatura-brasileira'],
  status: 'finished',
  createdAt: new Date(),
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

  it('renders the summary', () => {
    render(<BookCard book={mockBook} />)
    expect(screen.getByText(/Bentinho narra/)).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<BookCard book={mockBook} />)
    expect(screen.getByText('romance')).toBeInTheDocument()
    expect(screen.getByText('literatura-brasileira')).toBeInTheDocument()
  })

  it('does not render rating stars when rating is not set', () => {
    render(<BookCard book={mockBook} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
