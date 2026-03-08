import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { enrichBook } from './EnrichBook'
import { AgentStatus } from '@/domain/entities/Book'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('enrichBook use case', () => {
  it('transitions through ANALYZING → ENRICHING → COMPLETED in order', async () => {
    const statuses: AgentStatus[] = []
    const promise = enrichBook('Dom Casmurro', (s) => statuses.push(s))

    // ANALYZING é chamado sincronamente antes do primeiro await/delay
    expect(statuses).toEqual([AgentStatus.ANALYZING])

    // Avança 1000ms → termina o delay de ANALYZING, dispara ENRICHING
    await vi.advanceTimersByTimeAsync(1000)
    expect(statuses).toEqual([AgentStatus.ANALYZING, AgentStatus.ENRICHING])

    // Avança mais 1500ms → termina o delay de ENRICHING, dispara COMPLETED
    await vi.advanceTimersByTimeAsync(1500)
    const result = await promise
    expect(statuses).toEqual([
      AgentStatus.ANALYZING,
      AgentStatus.ENRICHING,
      AgentStatus.COMPLETED,
    ])
    expect(result.finalStatus).toBe(AgentStatus.COMPLETED)
  })

  it('returns a complete Book for a known title', async () => {
    const promise = enrichBook('Dom Casmurro')
    await vi.runAllTimersAsync()
    const { book } = await promise

    expect(book.title).toBe('Dom Casmurro')
    expect(book.author).toBe('Machado de Assis')
    expect(book.summary).toContain('Capitu')
    expect(book.tags).toContain('romance')
    expect(book.status).toBe('to-read')
    expect(book.createdAt).toBeInstanceOf(Date)
    expect(book.id).toBeTruthy()
  })

  it('returns a fallback Book for an unknown title', async () => {
    const promise = enrichBook('Livro Desconhecido')
    await vi.runAllTimersAsync()
    const { book } = await promise

    expect(book.title).toBe('Livro Desconhecido')
    expect(book.author).toBe('Autor Desconhecido')
    expect(book.summary).toContain('Livro Desconhecido')
    expect(book.tags.length).toBeGreaterThan(0)
  })

  it('works without a status callback (no crash)', async () => {
    const promise = enrichBook('1984')
    await vi.runAllTimersAsync()
    const { book } = await promise

    expect(book.author).toBe('George Orwell')
    expect(book.tags).toContain('distopia')
  })

  it('returns a Book with a unique id on each call', async () => {
    const p1 = enrichBook('Duna')
    const p2 = enrichBook('Duna')
    await vi.runAllTimersAsync()
    const [r1, r2] = await Promise.all([p1, p2])

    expect(r1.book.id).not.toBe(r2.book.id)
  })
})
