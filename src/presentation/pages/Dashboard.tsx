'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Library, BookMarked } from 'lucide-react'
import { useLibrary } from '@/presentation/hooks/useLibrary'
import { SearchBar } from '@/presentation/components/SearchBar/SearchBar'
import { BookCard } from '@/presentation/components/BookCard/BookCard'
import { AgentStatusToast } from '@/presentation/components/AgentStatusToast/AgentStatusToast'
import { AgentStatus } from '@/domain/entities/Book'

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
        <BookMarked className="w-10 h-10 text-indigo-300" />
      </div>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">
        Sua biblioteca está vazia
      </h2>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
        Acione o Agente acima com o título de um livro e ele irá analisar e enriquecer os metadados automaticamente.
      </p>
    </motion.div>
  )
}

export function Dashboard() {
  const { books, agentStatus, isLoading, addBook } = useLibrary()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Library className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-serif font-bold text-lg text-slate-900">PersonalLIBXYZK</h1>
          {books.length > 0 && (
            <span className="ml-auto text-xs text-slate-400 font-medium">
              {books.length} {books.length === 1 ? 'livro' : 'livros'}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Two-column layout: sidebar (agent panel) + book grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">

          {/* Left — Agent Panel */}
          <aside className="lg:sticky lg:top-24 flex flex-col gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Acionar Agente
              </h2>
              <SearchBar onSearch={addBook} isLoading={isLoading} />
            </div>

            <AgentStatusToast status={agentStatus} />

            {agentStatus === AgentStatus.IDLE && (
              <p className="text-xs text-slate-400 leading-relaxed">
                O agente analisa o título, infere autor, gera um resumo e sugere tags automaticamente.
              </p>
            )}
          </aside>

          {/* Right — Book Grid */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Biblioteca
            </h2>

            {books.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.ul
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                layout
              >
                <AnimatePresence initial={false}>
                  {books.map((book) => (
                    <motion.li
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <BookCard book={book} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
