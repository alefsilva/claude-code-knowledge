export type ReadingStatus = 'to-read' | 'reading' | 'finished' | 'abandoned'

export interface Book {
  id: string
  title: string
  author: string
  summary: string
  tags: string[]
  status: ReadingStatus
  rating?: number
  createdAt: Date
}

export enum AgentStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  ENRICHING = 'ENRICHING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}
