# PersonalLIBXYZK

**Gestor de Biblioteca Pessoal orientado a Agentes de IA**

> **[Ver projeto em produção](https://alefsilva.github.io/claude-code-knowledge/)**

---

## Sobre o Projeto

PersonalLIBXYZK é uma aplicação web que usa um **Agente de IA simulado** para enriquecer automaticamente os metadados de livros a partir de um simples título. O usuário informa o título, o agente analisa, gera autor, resumo e tags, e persiste o livro na biblioteca pessoal.

O projeto foi concebido como demonstração de **Clean Architecture** aplicada a um frontend moderno com Next.js, priorizando testabilidade, separação de responsabilidades e experiência de usuário de alta performance.

---

## Demo

![Tests](https://img.shields.io/badge/tests-13%20passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-6366f1)

Acesse: **https://alefsilva.github.io/claude-code-knowledge/**

---

## Tech Stack

| Tecnologia | Versão | Papel |
|-----------|--------|-------|
| Next.js | 14 (App Router) | Framework React com static export |
| TypeScript | 5 (strict) | Type safety em todas as camadas |
| Tailwind CSS | 3 | Estilização utilitária — paleta Slate/Indigo/Emerald |
| Framer Motion | 12 | Animações de entrada dos cards e toast do agente |
| Vitest | 1 | Test runner com fake timers e ambiente jsdom |
| React Testing Library | 16 | Testes de componentes orientados a comportamento |
| lucide-react | — | Ícones consistentes e acessíveis |

---

## Arquitetura: Clean Architecture

O projeto segue Clean Architecture com **quatro camadas** e uma regra de ouro: **as dependências sempre apontam para dentro** (em direção ao domínio).

```
src/
├── domain/              ← núcleo — zero dependências externas
│   ├── entities/        Book, ReadingStatus, AgentStatus
│   └── interfaces/      BookRepository (contrato)
│
├── use-cases/           ← regras de negócio — depende só de domain
│   ├── AddBook.ts       criação manual de livro
│   └── EnrichBook.ts    agente de IA — máquina de estados
│
├── data/                ← implementações — depende de domain
│   ├── repositories/    LocalStorageBookRepository (produção)
│   └── mocks/           InMemoryBookRepository (testes)
│
└── presentation/        ← React — depende de use-cases
    ├── components/      BookCard, SearchBar, AgentStatusToast
    ├── hooks/           useLibrary (orquestrador)
    └── pages/           Dashboard (composição de página)
```

### Por que isso torna o app escalável?

- **Substituição de repositório sem tocar em use cases:** trocar `localStorage` por uma API REST requer apenas uma nova classe que implemente `BookRepository`. Nenhum hook ou componente muda.
- **Use cases testáveis de forma isolada:** `EnrichBook.test.ts` roda sem browser, sem Next.js, sem localStorage — apenas TypeScript puro com timers simulados.
- **Presentation é "burra" por design:** o `Dashboard` não sabe nada sobre `localStorage` ou `enrichBook`. Ele só consome o que o `useLibrary` expõe.

---

## O Agente de IA — Máquina de Estados

O `enrichBook` use case simula um processo agêntico real com transições de estado explícitas:

```
IDLE ──► ANALYZING ──► ENRICHING ──► COMPLETED
                                  └──► ERROR
```

| Estado | Duração | O que acontece |
|--------|---------|----------------|
| `IDLE` | — | Estado padrão, aguardando input |
| `ANALYZING` | 1 000 ms | Agente "lê" o título — callback disparado sincronamente |
| `ENRICHING` | 1 500 ms | Agente "gera" metadados — autor, resumo, tags e nota (3–5) inferidos por catálogo ou fallback genérico |
| `COMPLETED` | 2 000 ms | Livro persistido, toast exibido, estado volta a IDLE |
| `ERROR` | 2 000 ms | Falha capturada no `useLibrary`, toast de erro, estado volta a IDLE |

```typescript
// Uso do use case — função pura, sem React
const { book } = await enrichBook('Dom Casmurro', (status) => {
  // status: ANALYZING → ENRICHING → COMPLETED
  setAgentStatus(status)
})
```

O `AgentStatusToast` reage ao estado via `AnimatePresence` do Framer Motion, exibindo barra de progresso e dots pulsantes durante o processamento.

---

## Setup e Desenvolvimento

### Pré-requisitos

- Node.js 20+
- npm 10+

### Instalação

```bash
git clone https://github.com/alefsilva/claude-code-knowledge.git
cd claude-code-knowledge
npm install
```

### Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000`.

> O `basePath` (`/claude-code-knowledge`) é aplicado apenas em CI via variável `GITHUB_ACTIONS`. Em desenvolvimento local, o app roda na raiz sem configuração extra.

### Testes

```bash
# Modo CI — passe único, sem watch
npm run test:run

# Modo watch (desenvolvimento)
npm test

# UI interativa do Vitest
npm run test:ui
```

**Cobertura dos testes (13 casos):**

| Arquivo | Casos |
|---------|-------|
| `AddBook.test.ts` | status inicial, trim, tags padrão |
| `EnrichBook.test.ts` | transições de estado com `vi.useFakeTimers()`, catálogo, fallback, UUIDs únicos |
| `BookCard.test.tsx` | título, autor, resumo, tags, badge de status |

### Build e Deploy

```bash
# Build estático para GitHub Pages (gera pasta out/)
npm run export

# Lint
npm run lint
```

O deploy é automático via **GitHub Actions** ao fazer push na branch `master`.

---

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção padrão |
| `npm run export` | Build estático para CDN / GitHub Pages |
| `npm run start` | Servidor de produção (requer build) |
| `npm run lint` | ESLint com regras Next.js |
| `npm test` | Vitest em modo watch |
| `npm run test:run` | Vitest modo CI (passe único) |
| `npm run test:ui` | Vitest UI interativa |

---

## Paleta de Cores

| Cor | Uso |
|-----|-----|
| **Slate** | Backgrounds, texto e bordas neutras |
| **Indigo** | Brand, botões, estados ativos, nome do autor |
| **Emerald** | Status "Finalizado", barra de progresso completa |
| **Amber** | Estrelas de avaliação — nota de 3–5 gerada pelo agente como "sentimento social" inferido do título |

---

## Licença

ISC — Alef Silva
