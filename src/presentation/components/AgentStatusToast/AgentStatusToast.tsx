'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AgentStatus } from '@/domain/entities/Book'
import { Brain, Sparkles, CheckCircle2, XCircle } from 'lucide-react'

interface AgentStatusToastProps {
  status: AgentStatus
}

const config: Record<
  AgentStatus,
  { label: string; icon: React.ReactNode; glow: string; bar: string } | null
> = {
  [AgentStatus.IDLE]: null,
  [AgentStatus.ANALYZING]: {
    label: 'Analisando título...',
    icon: <Brain className="w-4 h-4" />,
    glow: 'shadow-indigo-200',
    bar: 'bg-indigo-500 w-1/3',
  },
  [AgentStatus.ENRICHING]: {
    label: 'Gerando metadados...',
    icon: <Sparkles className="w-4 h-4" />,
    glow: 'shadow-indigo-300',
    bar: 'bg-indigo-500 w-2/3',
  },
  [AgentStatus.COMPLETED]: {
    label: 'Livro adicionado!',
    icon: <CheckCircle2 className="w-4 h-4" />,
    glow: 'shadow-emerald-200',
    bar: 'bg-emerald-500 w-full',
  },
  [AgentStatus.ERROR]: {
    label: 'Algo deu errado.',
    icon: <XCircle className="w-4 h-4" />,
    glow: 'shadow-red-200',
    bar: 'bg-red-400 w-full',
  },
}

const iconColors: Record<AgentStatus, string> = {
  [AgentStatus.IDLE]: '',
  [AgentStatus.ANALYZING]: 'text-indigo-500',
  [AgentStatus.ENRICHING]: 'text-indigo-500',
  [AgentStatus.COMPLETED]: 'text-emerald-500',
  [AgentStatus.ERROR]: 'text-red-400',
}

export function AgentStatusToast({ status }: AgentStatusToastProps) {
  const current = config[status]

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`bg-white border border-slate-200 rounded-xl p-4 shadow-lg ${current.glow} w-full`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className={`${iconColors[status]}`}>{current.icon}</span>
            <span className="text-sm font-medium text-slate-700">{current.label}</span>

            {(status === AgentStatus.ANALYZING || status === AgentStatus.ENRICHING) && (
              <span className="ml-auto flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </span>
            )}
          </div>

          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${current.bar}`}
              initial={{ width: '0%' }}
              animate={{ width: current.bar.includes('w-1/3') ? '33%' : current.bar.includes('w-2/3') ? '66%' : '100%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
