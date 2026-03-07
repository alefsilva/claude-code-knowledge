import type { Book } from '@/domain/entities/Book'
import { BookOpen, Star } from 'lucide-react'

interface BookCardProps {
  book: Book
  onSelect?: (book: Book) => void
}

const statusColors: Record<Book['status'], string> = {
  'to-read': 'bg-slate-100 text-slate-600',
  'reading': 'bg-indigo-100 text-indigo-700',
  'finished': 'bg-emerald-100 text-emerald-700',
  'abandoned': 'bg-slate-200 text-slate-500',
}

const statusLabels: Record<Book['status'], string> = {
  'to-read': 'Para ler',
  'reading': 'Lendo',
  'finished': 'Finalizado',
  'abandoned': 'Abandonado',
}

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <article
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(book)}
    >
      <div className="flex gap-3">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded" />
        ) : (
          <div className="w-12 h-16 bg-slate-100 rounded flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-slate-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{book.title}</h3>
          <p className="text-sm text-slate-500">{book.author}</p>
          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[book.status]}`}>
            {statusLabels[book.status]}
          </span>
          {book.rating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-slate-500">{book.rating}/5</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
