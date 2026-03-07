import type { Book } from '@/domain/entities/Book'
import { BookOpen, Star, Tag } from 'lucide-react'

interface BookCardProps {
  book: Book
  onSelect?: (book: Book) => void
}

const statusColors: Record<Book['status'], string> = {
  'to-read': 'bg-slate-100 text-slate-600',
  reading: 'bg-indigo-100 text-indigo-700',
  finished: 'bg-emerald-100 text-emerald-700',
  abandoned: 'bg-slate-200 text-slate-500',
}

const statusLabels: Record<Book['status'], string> = {
  'to-read': 'Para ler',
  reading: 'Lendo',
  finished: 'Finalizado',
  abandoned: 'Abandonado',
}

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <article
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
      onClick={() => onSelect?.(book)}
    >
      <div className="flex gap-4">
        <div className="w-11 h-14 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 leading-tight line-clamp-1">
              {book.title}
            </h3>
            <span
              className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[book.status]}`}
            >
              {statusLabels[book.status]}
            </span>
          </div>

          <p className="text-sm text-indigo-600 font-medium mb-2">{book.author}</p>

          {book.summary && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
              {book.summary}
            </p>
          )}

          <div className="flex items-center justify-between">
            {book.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                {book.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {book.rating && (
              <div className="flex items-center gap-0.5 ml-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < book.rating!
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
