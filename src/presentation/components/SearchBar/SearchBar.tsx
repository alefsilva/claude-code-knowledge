'use client'

import { useState } from 'react'
import { Search, Sparkles, Loader2 } from 'lucide-react'

interface SearchBarProps {
  onSearch: (title: string) => void
  isLoading: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && !isLoading) {
      onSearch(trimmed)
      setValue('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      {/* Label visível — contexto sempre presente, independente do placeholder */}
      <label
        htmlFor="book-search"
        className="block text-sm font-medium text-slate-700 mb-1.5"
      >
        Título do livro
      </label>

      {/* Mobile: coluna (input + botão empilhados) | sm+: linha lado a lado */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            id="book-search"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ex: Dom Casmurro, Duna, 1984..."
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed shadow-sm whitespace-nowrap sm:shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isLoading ? 'Analisando...' : 'Acionar Agente'}
        </button>
      </div>
    </form>
  )
}
