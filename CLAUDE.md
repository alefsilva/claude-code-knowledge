# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**PersonalLIBXYZK** — Gestor de Biblioteca Pessoal orientado a Agentes de IA.

Stack: Next.js 14 App Router, TypeScript (strict), Tailwind CSS, Vitest + React Testing Library. Arquitetura: Clean Architecture.

## Commands

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Rodar testes (watch mode)
npm test

# Rodar testes (CI / passe único)
npm run test:run

# Abrir Vitest UI
npm run test:ui
```

## Folder Structure

```
src/
├── domain/           # Entidades e interfaces de repositório — sem dependências de outras camadas
│   ├── entities/     # Tipos TypeScript puros (Book, ReadingStatus, etc.)
│   └── interfaces/   # Contratos de repositório (BookRepository, etc.)
├── use-cases/        # Regras de negócio — depende apenas de domain; testes co-localizados
├── data/             # Implementações dos contratos de repositório
│   ├── repositories/ # Implementações de produção (localStorage, API, etc.)
│   └── mocks/        # Implementações in-memory para testes e desenvolvimento
├── presentation/     # Componentes React e composições de página
│   ├── components/   # Componentes reutilizáveis, agrupados por feature (BookCard/, AddBookForm/, etc.)
│   └── pages/        # Composições React de página inteira, importadas por src/app/
├── app/              # Next.js App Router: layout.tsx, page.tsx, segmentos de rota
└── test/             # Setup global de testes (setup.ts)
```

## Naming Conventions

- **Componentes**: PascalCase, um componente por arquivo, pasta com o nome do componente (`BookCard/BookCard.tsx`)
- **Funções e variáveis**: camelCase
- **Interfaces de repositório**: PascalCase sem prefixo (ex: `BookRepository`)
- **Types**: PascalCase (ex: `ReadingStatus`)
- **Arquivos de teste**: co-localizados com o arquivo que testam, sufixo `.test.ts` ou `.test.tsx` (ex: `AddBook.test.ts`)
- **Arquivos de use case**: verbo + substantivo, PascalCase (`AddBook.ts`, `UpdateReadingStatus.ts`)

## Architecture

Direção de dependências (nunca pode ser invertida):

```
domain  ←  use-cases  ←  data
                       ←  presentation
```

- `domain/` tem zero imports de outras camadas src
- `use-cases/` importa apenas de `domain/`
- `data/` implementa contratos de `domain/interfaces/`
- `presentation/` chama funções de `use-cases/`, nunca importa de `data/` diretamente
- `app/` (rotas Next.js) importa de `presentation/` e conecta as dependências

## Testing Strategy

- Testes são **co-localizados** com seus arquivos fonte (mesma pasta, sufixo `.test.ts` / `.test.tsx`)
- Use cases são testados com mocks de repositório in-memory
- Componentes são testados com `@testing-library/react` + `@testing-library/jest-dom`
- Environment: jsdom (configurado em `vitest.config.ts`)
- Sem snapshot tests — prefira assertions de comportamento

## Color Palette

- **Slate** — backgrounds neutros, texto, bordas
- **Indigo** — elementos interativos primários, cor de brand
- **Emerald** — progresso de leitura, estados de sucesso, status "finalizado"

## Path Aliases

`@/*` aponta para `src/*`. Use em todos os imports:

```ts
import { Book } from '@/domain/entities/Book'
import { addBook } from '@/use-cases/AddBook'
```
