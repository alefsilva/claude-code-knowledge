export type ReadingStatus = 'to-read' | 'reading' | 'finished' | 'abandoned'

export interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  coverUrl?: string
  status: ReadingStatus
  rating?: number
  notes?: string
  pageCount?: number
  currentPage?: number
  addedAt: Date
  finishedAt?: Date
  tags: string[]
}
