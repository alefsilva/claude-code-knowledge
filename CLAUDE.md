# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**PersonalLIBXYZK** — Gestor de Biblioteca Pessoal orientado a Agentes de IA.

Stack: Next.js 14 App Router, TypeScript (strict), Tailwind CSS, Vitest + React Testing Library, Framer Motion. Arquitetura: Clean Architecture.

Deploy: GitHub Pages via GitHub Actions — https://alefsilva.github.io/claude-code-knowledge/

## Commands

```bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Build estático para GitHub Pages
npm run export

# Lint
npm run lint

# Testes (watch)
npm test

# Testes (CI)
npm run test:run

# Testes (UI interativa)
npm run test:ui
```

## Folder Structure

```
src/
├── domain/           # Entidades e interfaces — sem dependências de outras camadas
│   ├── entities/     # Book, ReadingStatus, AgentStatus
│   └── interfaces/   # BookRepository (contrato)
├── use-cases/        # Regras de negócio — depende apenas de domain; testes co-localizados
├── data/             # Implementações dos contratos
│   ├── repositories/ # LocalStorageBookRepository (produção)
│   └── mocks/        # InMemoryBookRepository (testes)
├── presentation/     # Componentes React e composições de página
│   ├── components/   # BookCard/, SearchBar/, AgentStatusToast/
│   ├── hooks/        # useLibrary (orquestrador)
│   └── pages/        # Dashboard (composição importada por src/app/)
├── app/              # Next.js App Router: layout.tsx, page.tsx
└── test/             # setup.ts — @testing-library/jest-dom
```

## Naming Conventions

- **Componentes**: PascalCase, pasta com o nome do componente (`BookCard/BookCard.tsx`)
- **Funções e variáveis**: camelCase
- **Interfaces**: PascalCase sem prefixo (ex: `BookRepository`)
- **Types**: PascalCase (ex: `ReadingStatus`)
- **Testes**: co-localizados com o arquivo fonte, sufixo `.test.ts` / `.test.tsx`
- **Use cases**: verbo + substantivo, PascalCase (`AddBook.ts`, `EnrichBook.ts`)

## Architecture

Direção de dependências (nunca pode ser invertida):

```
domain  ←  use-cases  ←  data
                       ←  presentation
```

- `domain/` tem zero imports de outras camadas
- `use-cases/` importa apenas de `domain/`
- `data/` implementa contratos de `domain/interfaces/`
- `presentation/` chama `use-cases/`, nunca importa `data/` diretamente
- `app/` (rotas Next.js) importa de `presentation/` e conecta as dependências

## Testing Strategy

- Testes co-localizados com seus arquivos fonte (`.test.ts` / `.test.tsx`)
- Use cases testados com repositórios in-memory via mock
- Componentes testados com `@testing-library/react` + `@testing-library/jest-dom`
- `vi.useFakeTimers()` para testar delays assíncronos sem esperar tempo real
- Environment: jsdom. Sem snapshot tests — prefira assertions de comportamento

## Color Palette

- **Slate** — backgrounds neutros, texto, bordas
- **Indigo** — brand, botões, estados ativos
- **Emerald** — sucesso, status "Finalizado", progresso completo
- **Amber** — estrelas de avaliação

## Path Aliases

`@/*` aponta para `src/*`. Use em todos os imports:

```ts
import { Book } from '@/domain/entities/Book'
import { enrichBook } from '@/use-cases/EnrichBook'
```

---

## Histórico de Decisões Técnicas

### `next.config.mjs` em vez de `next.config.ts`

Next.js 14 não suporta configuração em TypeScript — apenas `.js` e `.mjs`. O suporte a `.ts` foi adicionado apenas no Next.js 15. A tentativa de usar `.ts` causava o erro:

```
Error: Configuring Next.js via 'next.config.ts' is not supported.
Please replace the file with 'next.config.js' or 'next.config.mjs'.
```

**Solução:** renomear para `.mjs` e usar JSDoc `@type` para manter intellisense.

### `basePath` condicional via `GITHUB_ACTIONS`

GitHub Pages serve a aplicação em `/claude-code-knowledge/` (subpath do repositório). `basePath` e `assetPrefix` precisam refletir isso em produção, mas em desenvolvimento local o servidor roda na raiz `/`.

Usar `NODE_ENV=production` inline não funciona no Windows (sem shell POSIX). A solução foi detectar o ambiente via `process.env.GITHUB_ACTIONS`, que é setado automaticamente pelo runner do GitHub Actions em qualquer OS:

```js
const isCI = Boolean(process.env.GITHUB_ACTIONS)
basePath: isCI ? '/claude-code-knowledge' : ''
```

Isso elimina a necessidade de `cross-env` ou scripts diferentes por OS.

### `globalThis.crypto.randomUUID()` em vez de `import { randomUUID } from 'crypto'`

O módulo `crypto` do Node.js não existe no browser. Importá-lo causava falha silenciosa no cliente Next.js, capturada pelo `catch` do `useLibrary` como `AgentStatus.ERROR`.

**Solução:** `globalThis.crypto.randomUUID()` usa a Web Crypto API, disponível em browsers modernos, Node.js 19+, e no ambiente jsdom do Vitest.

### `vitest.config.ts` excluído do `tsconfig.json`

O type checker do Next.js (via `tsc`) incluía `vitest.config.ts` no escopo, causando conflito entre as definições de tipo de Vite bundled pelo Vitest e as do `@vitejs/plugin-react`:

```
Type error: No overload matches this call.
  Type 'Plugin<any>[]' is not assignable to type 'PluginOption'.
```

**Solução:** adicionar `"vitest.config.ts"` ao array `exclude` do `tsconfig.json`. O Vitest usa seu próprio sistema de resolução de tipos e não é afetado.

### Fluxo de Deploy — GitHub Actions

O workflow em `.github/workflows/deploy.yml`:
1. Trigger: push na branch `master`
2. `npm ci` — instalação determinística
3. `npm run export` — gera pasta `out/` com HTML/CSS/JS estático
4. `touch out/.nojekyll` — evita que o Jekyll do GitHub Pages ignore arquivos/pastas com `_` (como `_next/`)
5. `actions/upload-pages-artifact` → `actions/deploy-pages`

### `AddBook.ts` — Alinhamento com schema de `Book`

O use case `AddBook` foi criado com o schema original (`isbn`, `coverUrl`, `addedAt`). Quando o `Book` foi atualizado para o schema atual (`summary`, `createdAt`), o `AddBook` não foi atualizado imediatamente — o erro só apareceu na primeira execução do `next build` com type checking completo. Corrigido alinhando os campos e removendo o import `crypto`.

### `SearchBar` — Layout responsivo sem sobreposição

A primeira implementação usava `position: absolute` para o botão sobre o input com `padding-right` fixo (`pr-36`). O problema: o texto do botão muda dinamicamente ("Acionar Agente" / "Analisando..."), causando overlap variável do placeholder.

**Solução:** `flex-col` (mobile) → `flex-row` (sm+) com input `flex-1` e botão `shrink-0`, completamente separados. Adicionada Label visível acima do input para acessibilidade.
