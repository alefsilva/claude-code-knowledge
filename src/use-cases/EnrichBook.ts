import type { Book } from '@/domain/entities/Book'
import { AgentStatus } from '@/domain/entities/Book'

export interface EnrichBookResult {
  book: Book
  finalStatus: AgentStatus.COMPLETED
}

export type StatusCallback = (status: AgentStatus) => void

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Mapa de palavras-chave para enriquecimento simulado
const ENRICHMENT_CATALOG: Record<
  string,
  { author: string; summary: string; tags: string[] }
> = {
  hobbit: {
    author: 'J.R.R. Tolkien',
    summary:
      'A aventura de Bilbo Bolseiro, um hobbit tranquilo arrastado para uma jornada épica para recuperar o tesouro guardado pelo dragão Smaug.',
    tags: ['fantasia', 'aventura', 'classico', 'tolkien'],
  },
  'senhor dos aneis': {
    author: 'J.R.R. Tolkien',
    summary:
      'A épica luta pelo destino da Terra-Média enquanto o hobbit Frodo e seus companheiros carregam o Um Anel até a Montanha da Perdição.',
    tags: ['fantasia', 'epico', 'aventura', 'classico'],
  },
  'dom casmurro': {
    author: 'Machado de Assis',
    summary:
      'Bentinho narra sua história de amor com Capitu, deixando ao leitor o eterno questionamento: Capitu traiu ou não traiu?',
    tags: ['literatura-brasileira', 'realismo', 'romance', 'machado-de-assis'],
  },
  'o aleph': {
    author: 'Jorge Luis Borges',
    summary:
      'Coleção de contos fantásticos onde Borges explora labirintos, infinitos e a natureza da realidade através de narrativas filosóficas e imaginativas.',
    tags: ['fantasia', 'filosofia', 'contos', 'borges'],
  },
  '1984': {
    author: 'George Orwell',
    summary:
      'Em um futuro distópico, Winston Smith luta contra um Estado totalitário onipresente que controla a realidade através da manipulação da linguagem e da história.',
    tags: ['distopia', 'politica', 'classico', 'ficcao-cientifica'],
  },
  'duna': {
    author: 'Frank Herbert',
    summary:
      'No planeta desértico Arrakis, Paul Atreides descobre seu destino como líder de um povo oprimido enquanto controla a especiaria mais valiosa do universo.',
    tags: ['ficcao-cientifica', 'epico', 'politica', 'ecologia'],
  },
}

/** Gera nota de 3 a 5 como "sentimento social" inferido pelo agente */
function inferRating(): number {
  return Math.floor(Math.random() * 3) + 3
}

function inferEnrichment(title: string): {
  author: string
  summary: string
  tags: string[]
} {
  const normalized = title.toLowerCase().trim()

  for (const [key, data] of Object.entries(ENRICHMENT_CATALOG)) {
    if (normalized.includes(key)) return data
  }

  // Fallback genérico baseado no título
  const words = title.split(' ').filter((w) => w.length > 3)
  return {
    author: 'Autor Desconhecido',
    summary: `"${title}" é uma obra que convida o leitor a uma jornada singular, explorando temas universais através de uma narrativa envolvente e personagens memoráveis.`,
    tags: words.slice(0, 3).map((w) => w.toLowerCase()),
  }
}

export async function enrichBook(
  title: string,
  onStatusChange: StatusCallback = () => {}
): Promise<EnrichBookResult> {
  onStatusChange(AgentStatus.ANALYZING)
  await delay(1000)

  onStatusChange(AgentStatus.ENRICHING)
  await delay(1500)

  const { author, summary, tags } = inferEnrichment(title)

  const book: Book = {
    id: globalThis.crypto.randomUUID(),
    title,
    author,
    summary,
    tags,
    rating: inferRating(),
    status: 'to-read',
    createdAt: new Date(),
  }

  onStatusChange(AgentStatus.COMPLETED)

  return { book, finalStatus: AgentStatus.COMPLETED }
}
