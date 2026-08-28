# Editor GoDocs Docs — Baseline técnico do Lote E0

> **Data da coleta:** 28/08/2026 (America/Sao_Paulo)
> **Branch:** `main`
> **HEAD inicial:** `be68e6341f8d7e1905be5cf77dc3a384d9562e05` (`Refinamento visual`)
> **Relação remota observada:** `HEAD = origin/main` no início do lote.
> **Escopo:** fotografia técnica anterior a qualquer implementação do Editor.

## 1. Stack observada

- Next.js `16.2.11`;
- React/React DOM `19.2.8`;
- TypeScript `6.0.3`, `strict: true`;
- Zod `4.4.3`;
- `next-mdx-remote` `6.0.0`;
- MDX `3.1.1`, Remark/Unified, `rehype-slug` e `github-slugger`;
- conteúdo local em `content/docs/**/*.mdx`;
- sem Supabase, autenticação, banco, Tiptap, CMS ou rotas `/admin`;
- sem feature flags ou variáveis de ambiente do Editor.

## 2. Fonte e normalização

`lib/docs/source.ts` descobre `.md`/`.mdx` recursivamente, lê frontmatter com `gray-matter`, valida com `docFrontmatterSchema`, extrai texto/headings/seções e produz `DocRecord`.

Coleções:

- `getAllContentDocs()`: publicados e drafts, usada pela home antes do filtro explícito;
- `getAllDocs()`: somente `status: published`, usada pelas superfícies de leitura atuais;
- `getDocBySlug()`: lookup na coleção publicada;
- o cache é o `cache()` do React e o conteúdo é lido do filesystem no processo de render/build.

Todos os 21 documentos atuais estão `published` e `available`.

## 3. Contrato de frontmatter real

Campos aceitos:

| Campo | Regra/uso atual | Presença na coleção |
|---|---|---:|
| `title` | obrigatório; H1, SEO e títulos | 21/21 |
| `description` | obrigatório; SEO, busca e cards | 21/21 |
| `cardDescription` | opcional; cards/navegação | 16/21 |
| `slug` | obrigatório, canônico e único | 21/21 |
| `pageType` | `hub`, `task`, `reference` | 21/21 |
| `section` | id, label, description, entrySlug, order | 21/21 |
| `navTitle` | título curto de navegação | 21/21 |
| `ancestors` | até dois níveis, coerentes com os segmentos | 18/21 |
| `order` | inteiro não negativo | 21/21 |
| `keywords` | array; busca | 21/21 |
| `status` | `published` ou `draft`; filtro da coleção de leitura atual | 21/21 |
| `availability` | default `available`; opcional no YAML | 0/21 explícito |
| `updatedAt` | data editorial opcional | 0/21 |
| `version` | versão editorial opcional | 0/21 |
| `permission` | contexto de permissão opcional | 0/21 |
| `related` | até quatro destinos, com validação contextual | 3/21 |

Defaults aplicados pelo schema também fazem parte do contrato e precisam ser distinguidos de valores explicitamente escritos ao serializar.

## 4. Coleção e hierarquia

```text
Comece por aqui (2)
├── o-que-e-o-godocs [reference]
└── primeiro-acesso [task]

Funcionalidades (19, incluindo o hub de seção)
├── funcionalidades [hub]
├── visao-geral [reference]
├── busca-inteligente [task]
├── documentos [hub]
│   ├── pastas [task]
│   ├── adicionar-documentos [task]
│   ├── filtros-e-metadados [task]
│   ├── gerenciar-documentos [reference]
│   └── logs-e-acoes [reference]
├── favoritos [task]
├── workflows [hub]
│   ├── cards-kanban-e-lista [task]
│   ├── automacoes [task]
│   ├── criar-e-configurar [task]
│   ├── fases-e-transicoes [task]
│   ├── formularios-e-campos [task]
│   ├── membros-e-papeis [task]
│   └── formulario-publico [task]
└── relatorios [reference]
```

Distribuição: 3 hubs, 13 tasks e 5 references.

Related atual:

- `o-que-e-o-godocs` → `funcionalidades/visao-geral`;
- `funcionalidades/visao-geral` → `funcionalidades/documentos`, `funcionalidades/favoritos`;
- `funcionalidades/documentos/logs-e-acoes` → `funcionalidades/favoritos`.

## 5. Dependências de `content/docs/`

| Superfície | Caminho principal | Dependência |
|---|---|---|
| Loader | `lib/docs/source.ts` | descoberta, parse, filtro publicado e ordenação |
| Schema | `lib/docs/schema.ts` | frontmatter, tipos e `DocRecord` |
| Texto/anchors | `lib/docs/headings.ts` | AST, texto pesquisável, H2/H3/H4 e `Step` |
| Validação | `lib/docs/validation.ts` | compile MDX, componentes, links, fragments, assets, taxonomia, Related e aliases |
| Navegação | `lib/docs/navigation.ts` | grupos, árvore, hubs, breadcrumbs e domínios de paginação |
| Compatibilidade | `lib/docs/compatibility.ts` | manifesto independente de 79 aliases de hash |
| Layout global | `app/layout.tsx` | lê docs e injeta navegação no header/drawer |
| Home/cards | `app/page.tsx`, `components/home-intro.tsx` | grupos, Comece por aqui e filhos diretos de Funcionalidades |
| Rotas | `app/docs/[...slug]/page.tsx` | params estáticos, lookup, metadata, MDX, hubs, Related e paginação |
| Renderer | `next-mdx-remote/rsc`, `mdx-components.tsx` | corpo MDX e componentes React permitidos |
| Sidebar/drawer | `docs-sidebar.tsx`, `mobile-nav-drawer.tsx`, `navigation-tree.tsx` | mesma árvore canônica |
| Breadcrumbs | `buildBreadcrumbs()` | seção, entry hub, ancestors e página atual |
| TOC | `parseDocumentText()`, `table-of-contents.tsx` | H2/H3; H4 fica em seções/compatibilidade, não no TOC visual |
| Paginação | `getAdjacentDocs()` | domínios hierárquicos; não é lista global plana |
| Related | frontmatter + `ArticleShell` | navegação contextual manual após o artigo |
| Busca | `app/search-index.json/route.ts`, `lib/docs/search.ts` | páginas e seções publicadas, índice estático v2 |
| Sitemap | `app/sitemap.ts` | home + uma URL por documento publicado |
| Robots | `app/robots.ts` | baseline atual público; E1 deverá adequá-lo à decisão de acesso autenticado |
| Share images | `app/share-image/[...slug]/route.tsx` | params, título, descrição e seção |
| Build | `generateStaticParams()` | páginas docs e imagens sociais estáticas |
| Scripts | `content-validate.ts`, `search-benchmark.ts` | gates editoriais e baseline determinístico |
| Testes | `lib/docs/*.test.ts`, rota/componentes/SEO | contratos publicados e regressões da coleção |

Dependências adicionais que não podem ser reconstruídas somente pelo banco proposto:

- `lib/docs/compatibility.ts` é fonte separada dos aliases;
- `components/home-intro.tsx` possui mapeamento de ícones por slug para os destinos atuais e fallback genérico;
- `app/page.tsx` reconhece especificamente `section.id === "funcionalidades"` para o diretório da home;
- assets de `Figure` vivem em `public/docs/` e são validados por caminho/dimensões;
- `Step` produz heading estrutural por atributos explícitos `title`, `id` e `headingLevel`.

## 6. Inventário MDX atual

Estrutura AST agregada:

```text
21 arquivos
48 H2
56 H3
12 H4
125 seções pesquisáveis (H2/H3/H4 e Step estrutural)
49 listas / 207 itens
9 links
3 inline-code
451 parágrafos
362 strong
0 imagens Markdown
0 tabelas
```

Componentes efetivamente usados:

| Componente | Ocorrências |
|---|---:|
| `Callout` | 2 |
| `Info` | 2 |
| `Warning` | 3 |
| `Steps` | 2 |
| `Step` | 9 |
| `Permissions` | 3 |
| `ExpectedResult` | 1 |
| `Figure` | 3 |

Permitidos e renderizáveis, mas sem ocorrência publicada no baseline: `CodeBlock`, `Tip`, `Requirements`, `KeyboardShortcut` e `RelatedLinks`.

`mdxComponents` também substitui elementos nativos `a`, `table` e `pre`. O importador não deve tratar ausência atual de tabela/pre em documentos como autorização para remover o suporte.

## 7. Contratos de navegação e descoberta

- a seção usa `entrySlug` explícito; não se escolhe o primeiro item por ordem;
- hub de seção pode ser link de título do grupo;
- hubs aninhados e filhas são derivados por segmentos e ancestors;
- sidebar e drawer reutilizam a mesma árvore;
- breadcrumbs apontam somente para ancestrais reais publicados;
- paginação é particionada por domínio hierárquico;
- Related é manual, factual e não repete previous/next;
- home possui regras editoriais específicas para Comece por aqui e Funcionalidades;
- busca usa somente publicados e produz página + seção;
- aliases não geram resultados duplicados.

## 8. Baseline de compatibilidade

- Documentos: 30/30 aliases;
- Workflows: 49/49 aliases;
- total: 79/79 entradas no manifesto;
- origem histórica e destino publicado são validados;
- destino deve conter fragment H2/H3/H4 ou `Step` estrutural existente;
- resolução entre URL/hash antigos e destino atual ocorre client-side.

## 9. Baseline de busca coletado no E0

```text
documents: 21
entries: 146
pages: 21
sections: 125
rawBytes: 248918
gzipBytes: 29229
resultLimit: 12
snippetCharacters: 220
```

Este snapshot substitui apenas a afirmação operacional corrente. Os números 147/126 do Lote 5 permanecem históricos. A mudança está no estado atual pós-Lote 6 e não altera, por si só, o algoritmo de busca.

## 10. Riscos e ajustes antes de código

| Prioridade | Risco/ajuste | Consequência |
|---|---|---|
| Decisão E0 | acesso autenticado para toda a documentação | E1 adequará rotas, SEO, sitemap, robots, metadata e cache |
| Decisão E0 | convite em vez de cadastro público | E1 não criará registro aberto |
| Decisão E0 | owner bootstrapado durante implantação | fluxo server-side único, auditável e sem endpoint público |
| Crítico E3/E6 | modelo proposto omitia metadados e aliases | perda de navegação, SEO ou compatibilidade |
| Crítico E6 | componentes/figuras não cabem no editor textual | exigir legacy blocks e round-trip |
| Alto E3 | `status` de publicação confundido com lixeira | separar lifecycle, draft e materialização pública |
| Alto E3/E5 | ordem não é lista global | preservar domínios, parent e entry page |
| Alto E9 | Editor pode sobrescrever Git/Codex | hash-base, expected HEAD e conflito explícito |
| Alto E9 | publicação parcial | change set, validação e um commit lógico |
| Alto / baseline | auditoria de produção encontrou duas vulnerabilidades high | avaliar atualização transitiva antes de ampliar a superfície autenticada |
| Moderado / baseline | auditoria encontrou uma vulnerabilidade moderate | incluir na correção focal de dependências |
| Médio E4 | home tem regras/ícones específicos | novos cards exigem fallback e regra editorial explícita |
| Médio E7 | bundle do editor em leitores | lazy/capability loading |
| Médio E10 | commit e deploy são estados distintos | feedback e recuperação separados |

## 11. Validações do E0

Resultados finais:

- `content:validate`: 21 documentos válidos;
- `search:benchmark`: baseline da seção 9, reproduzido sem variação;
- `lint`: aprovado, 0 erros e 0 warnings;
- `typecheck`: aprovado;
- `test`: 21 arquivos, 268/268 testes aprovados;
- `build`: aprovado, 50 páginas estáticas;
- `audit:prod`: reprovado pelo threshold configurado, com 3 vulnerabilidades transitivas: 2 high e 1 moderate;
  - `gray-matter > js-yaml 3.15.0` (high; versão corrigida indicada pela auditoria: `>=3.15.1`);
  - `next > postcss > nanoid 3.3.16` (high; versão corrigida indicada: `>=3.3.18`);
  - `next > postcss 8.5.21/8.5.22` (moderate; versão corrigida indicada: `>=8.5.23`);
- `git diff --check` dos artefatos novos: aprovado após remoção de whitespace final;
- escopo final esperado: somente os oito arquivos documentais do E0;
- Git inicial: árvore limpa, `main`, `HEAD = origin/main = be68e63`.

Os avisos JSDOM sobre `HTMLCanvasElement.getContext()` e navegação não implementada foram não bloqueantes; a suíte encerrou com todas as asserções aprovadas. A auditoria de dependências é uma falha real e preexistente ao E0; nenhuma dependência foi alterada porque correção de pacotes não pertence a este lote.
