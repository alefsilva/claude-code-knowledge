'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Book } from '@/domain/entities/Book'
import { AgentStatus } from '@/domain/entities/Book'
import { enrichBook } from '@/use-cases/EnrichBook'
import { LocalStorageBookRepository } from '@/data/repositories/LocalStorageBookRepository'

const repository = new LocalStorageBookRepository()

export interface UseLibraryReturn {
  books: Book[]
  agentStatus: AgentStatus
  isLoading: boolean
  addBook: (title: string) => Promise<void>
}

export function useLibrary(): UseLibraryReturn {
  const [books, setBooks] = useState<Book[]>([])
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(AgentStatus.IDLE)

  const isLoading =
    agentStatus === AgentStatus.ANALYZING || agentStatus === AgentStatus.ENRICHING

  useEffect(() => {
    repository.findAll().then(setBooks)
  }, [])

  // Reset to IDLE after COMPLETED or ERROR so the toast disappears
  useEffect(() => {
    if (agentStatus === AgentStatus.COMPLETED || agentStatus === AgentStatus.ERROR) {
      const timer = setTimeout(() => setAgentStatus(AgentStatus.IDLE), 2000)
      return () => clearTimeout(timer)
    }
  }, [agentStatus])

  const addBook = useCallback(async (title: string) => {
    try {
      const { book } = await enrichBook(title, setAgentStatus)
      await repository.save(book)
      setBooks((prev) => [book, ...prev])
    } catch (err) {
      console.error('[useLibrary] Falha ao enriquecer livro:', err)
      setAgentStatus(AgentStatus.ERROR)
    }
  }, [])

  return { books, agentStatus, isLoading, addBook }
}
