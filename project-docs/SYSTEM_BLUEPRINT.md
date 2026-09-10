# GoDocs Docs — Blueprint técnico e estrutural

> **Papel deste arquivo:** registrar a arquitetura técnica e estrutural complementar do GoDocs Docs.
>
> **Estado de referência:** arquitetura consolidada após os Lotes 0–5 e evolução técnica/visual do Lote 6 registrada até 09/09/2026.
>
> Este documento descreve contratos técnicos, fluxo de conteúdo, componentes estruturais, integração do Design System, responsividade, acessibilidade, SEO e limites do baseline atual. Estado operacional, branch, HEAD, deploy e próxima tarefa pertencem a `project-docs/daily_stats.md`.

## 1. Finalidade deste documento

O `SYSTEM_BLUEPRINT.md` é o **blueprint técnico e estrutural complementar** do GoDocs Docs.

Ele não é a fonte universal de verdade do projeto e não deve competir com documentos especializados.

Responsabilidades:

| Fonte | Responsabilidade principal |
|---|---|
| `AGENTS.md` | regras operacionais e de execução |
| `PRODUCT.md` | produto, público, propósito, capacidades e restrições |
| `DESIGN.md` | sistema visual, UX, interação e tokens canônicos |
| `project-docs/REDESIGN_ARCHITECTURE.md` | arquitetura editorial, hubs, navegação, URLs e contratos do redesign |
| `project-docs/SYSTEM_BLUEPRINT.md` | arquitetura técnica/estrutural e integração entre essas camadas |
| `README.md` | execução prática, comandos e criação de conteúdo |
| `content/docs/` | conteúdo publicado e fatos funcionais documentados |
| implementação atual | estado factual do código |
| `project-docs/Memória.md` | contexto universal e histórico consolidado |
| `project-docs/daily_stats.md` | estado operacional e próxima tarefa |

Este arquivo deve explicar:

- como o conteúdo entra no sistema;
- como é validado e normalizado;
- como gera rotas, navegação, busca, TOC, paginação e Related;
- quais componentes estruturam a experiência;
- quais contratos técnicos devem sobreviver a evoluções visuais;
- como temas, responsividade, acessibilidade, SEO e assets são integrados;
- quais frentes futuras continuam fora do baseline principal.

### 1.1 Regra de conflito

A implementação atual comprova **como o código está**, mas não redefine automaticamente produto, design ou arquitetura.

Se este arquivo divergir de `PRODUCT.md`, `DESIGN.md`, `REDESIGN_ARCHITECTURE.md` ou da implementação:

1. identificar o domínio da divergência;
2. verificar se este blueprint ficou desatualizado;
3. não escolher silenciosamente uma interpretação;
4. não transformar drift de código em nova regra;
5. atualizar a fonte correta quando a decisão estiver confirmada.

### 1.2 Evolução em relação ao blueprint inicial

O blueprint original descrevia um MVP ainda quase vazio, com artigos e vários componentes tratados como futuros.

Esse cenário foi superado.

O baseline atual já possui:

- coleção real de documentação;
- Home derivada do conteúdo;
- hubs editoriais;
- páginas `hub`, `task` e `reference`;
- navegação hierárquica;
- sidebar e drawer;
- TOC progressivo;
- busca local determinística;
- paginação hierárquica por domínio;
- Related manual;
- compatibilidade de URLs/anchors;
- imagens instrutivas;
- metadata, sitemap e imagens sociais;
- temas claro e escuro;
- suíte automatizada e validação de conteúdo.

Por isso, este arquivo passa a documentar **o sistema existente e seus contratos**, e não uma implementação futura hipotética.

---

## 2. Princípios do produto

Os princípios abaixo são relevantes para a arquitetura técnica. Definições completas de produto pertencem ao `PRODUCT.md`.

1. **Documentação antes de promoção:** a interface existe para encontrar, compreender e aplicar informação.
2. **Conteúdo como fonte versionada:** Markdown/MDX publicado no repositório continua sendo a fonte pública da documentação.
3. **Uma coleção canônica:** rotas, Home, hubs, navegação, busca, TOC, paginação, Related, sitemap e metadata devem derivar do mesmo conteúdo normalizado sempre que aplicável.
4. **Sem cadastros paralelos:** não criar listas manuais concorrentes para representar documentos já disponíveis na coleção.
5. **Git-native:** mudanças públicas devem permanecer versionáveis, revisáveis e reproduzíveis pelo repositório.
6. **Progressão estrutural:** adicionar ou reorganizar conteúdo deve utilizar taxonomia e metadados, não exigir hardcodes por página.
7. **Verdade antes de completude:** lacunas de informação devem permanecer lacunas; não inventar comportamento do GoDocs.
8. **Identidade própria:** referências como Mintlify servem para benchmark de experiência, não para cópia de implementação ou marca.
9. **Acessibilidade nativa:** teclado, foco, semântica, contraste e movimento reduzido fazem parte do contrato dos componentes.
10. **Responsividade estrutural:** desktop, notebook, tablet e mobile devem compartilhar conteúdo e navegação, adaptando apenas a apresentação.
11. **Evolução sem regressão pública:** URLs, anchors e comportamentos estabilizados devem ser preservados durante redesigns.
12. **Separação de responsabilidades:** conteúdo público versionado, código da plataforma e futuras estruturas de autoria não devem se tornar fontes concorrentes.

---

## 3. Leitura das referências

As referências visuais servem como evidência e inspiração. Elas são **somente leitura**.

A autoridade visual canônica é `DESIGN.md`.

### 3.1 GoDocs — fonte de identidade

Diretório:

```text
project-docs/references/GoDocs/
```

Características relevantes:

- identidade laranja do GoDocs;
- neutros grafite;
- contraste entre fundo, navegação e superfícies;
- ícones lineares;
- bordas e radius controlados;
- aparência corporativa e funcional;
- relação entre wordmark, branco e laranja.

O que deve ser adaptado para documentação:

- menor densidade que um dashboard;
- maior conforto de leitura;
- laranja como sinal de atenção e estado, não como grande superfície persistente;
- hierarquia editorial acima de elementos administrativos.

### 3.2 Mintlify / AbacatePay — fonte de experiência

Diretório:

```text
project-docs/references/AbacatePay - Mintlify/
```

Padrões úteis:

- busca central e fácil de acionar;
- navegação persistente;
- conteúdo com largura de leitura controlada;
- hierarquia tipográfica clara;
- cards simples;
- bordas e superfícies discretas;
- ritmo vertical confortável;
- descoberta contextual.

Não transportar:

- marca;
- verde;
- textos;
- CTAs;
- links;
- conteúdo;
- categorias;
- componentes copiados literalmente;
- estrutura comercial específica.

### 3.3 Síntese atual

```text
maturidade de documentação moderna
            +
identidade visual GoDocs
            +
arquitetura editorial própria
            +
conteúdo versionado
            ↓
        GoDocs Docs
```

Direção consolidada:

> **robusto na estrutura e clean na apresentação.**

---

## 4. Arquitetura de informação

A arquitetura editorial detalhada pertence ao `REDESIGN_ARCHITECTURE.md`. Esta seção registra como ela se manifesta tecnicamente.

### 4.1 Rotas atuais

| Rota | Estado | Função |
|---|---:|---|
| `/` | Implementada | Home derivada da coleção publicada |
| `/docs/[...slug]` | Implementada | renderização de documentos por slug |
| `/search-index.json` | Implementada | índice estático da busca local |
| `/sitemap.xml` | Implementada | sitemap derivado dos documentos publicados |
| `/robots.txt` | Implementada | regras atuais de crawling |
| `/opengraph-image` | Implementada | imagem social padrão |
| `/share-image/[...slug]` | Implementada | imagem social por documento |
| `not-found` | Implementada | página inexistente |

A rota de documento utiliza `generateStaticParams()` para os slugs publicados conhecidos e mantém `dynamicParams = true`.

O índice de busca usa route handler com:

```ts
export const dynamic = "force-static";
```

Não existe rota pública dedicada de busca; a experiência permanece em diálogo/modal.

### 4.2 Arquitetura editorial atual

```text
Home
├── Comece por aqui
│   ├── O que é o GoDocs?
│   └── Primeiro Acesso
│
└── Funcionalidades
    ├── Visão Geral
    ├── Busca Inteligente
    ├── Documentos
    │   ├── Organizar pastas e subpastas
    │   ├── Adicionar documentos
    │   ├── Localizar, filtrar e consultar metadados
    │   ├── Visualizar e gerenciar documentos
    │   └── Logs e ações
    ├── Favoritos
    ├── Workflows
    │   ├── Cards, Kanban e Lista
    │   ├── Automações
    │   ├── Criar e configurar
    │   ├── Fases e transições
    │   ├── Formulários e campos
    │   ├── Membros e papéis
    │   └── Formulário público e acompanhamento
    └── Relatórios
```

Modelo editorial:

```text
Home
→ hub de domínio
→ página de tarefa ou referência
→ Related / próximos passos
```

### 4.3 Função editorial por página

O schema aceita:

```yaml
pageType: hub
pageType: task
pageType: reference
```

- `hub`: organiza um domínio e pode possuir filhos diretos;
- `task`: orienta uso ou execução de uma atividade;
- `reference`: explica informação de consulta/referência.

`pageType` é explícito. Não inferir `hub` somente porque existem páginas-filhas.

### 4.4 Hubs

Hubs de domínio com filhos diretos seguem:

```text
H1 + resumo
→ conteúdo geral/conceitual
→ informações ou requisitos relevantes
→ Conceitos importantes, quando existir
→ cards compactos das páginas-filhas
→ paginação
```

O `DocPage` deriva os filhos do hub pela coleção canônica:

- prefixo de segmentos;
- profundidade imediatamente inferior;
- `order`.

Não criar hardcode específico para Documentos, Workflows ou futuros hubs equivalentes.

### 4.5 Estados de conteúdo

O schema distingue:

```yaml
status: published | draft
availability: available | coming-soon
```

Regras:

- somente `published` entra na experiência pública;
- drafts não entram na navegação pública;
- uma página publicada não deve apontar para draft;
- `coming-soon` representa uma página publicada e navegável em preparação;
- disponibilidade não substitui status de publicação.

---

## 5. Wireframes

Os wireframes abaixo representam a **estrutura**, não medidas visuais canônicas. Valores exatos devem seguir `DESIGN.md` e `app/globals.css`.

### 5.1 Home desktop

```text
┌────────────────────────────────────────────────────────────────────────┐
│ GoDocs Docs               [ Pesquisar...  Ctrl/Cmd K ]          tema  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                         Hero / introdução                              │
│                    background oficial da Home                          │
│                                                                        │
│                  Comece por aqui / descoberta                          │
│                                                                        │
│                    Funcionalidades                                     │
│               cards derivados do conteúdo                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

A Home não usa uma lista manual independente para as funcionalidades. Os cards são derivados dos documentos publicados da seção `funcionalidades`.

### 5.2 Artigo desktop — sidebar expandida

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Header                                                                 │
├───────────────┬──────────────────────────────────────┬─────────────────┤
│ Sidebar       │ Conteúdo                             │ Nesta página     │
│ 240px         │ breadcrumb                           │ TOC              │
│               │ H1 + descrição                       │                  │
│ árvore        │ artigo MD/MDX                        │                  │
│ canônica      │ hub cards quando aplicável           │                  │
│               │ Related                              │                  │
│               │ anterior / próxima                   │                  │
└───────────────┴──────────────────────────────────────┴─────────────────┘
```

### 5.3 Artigo desktop — sidebar recolhida / preview

Baseline estabilizado da Sidebar V2.5:

```text
expanded: 240px
collapsed: 48px
preview: 240px
left: 0
```

O rail recolhido preserva a área estrutural do layout. O preview é temporário e não deve:

- deslocar o artigo;
- alterar a centralização do conteúdo;
- deslocar o TOC;
- virar uma segunda árvore de navegação.

### 5.4 Mobile

```text
┌──────────────────────────────────────┐
│ menu   marca        busca      tema  │
├──────────────────────────────────────┤
│                                      │
│ breadcrumb                           │
│ título                               │
│ conteúdo                             │
│                                      │
│ Nesta página / controle adaptado     │
│ Related / paginação                  │
│                                      │
└──────────────────────────────────────┘

menu → abre drawer com a mesma árvore da sidebar
busca → abre diálogo adaptado ao viewport
```

---

## 6. Sistema visual

O sistema visual canônico é definido em `DESIGN.md`.

Esta seção registra apenas os **contratos técnicos de integração** e um snapshot dos tokens estruturais implementados. Uma divergência futura entre esta seção e `DESIGN.md` deve ser tratada como necessidade de sincronização, não como precedência deste arquivo.

### 6.1 Cores semânticas implementadas

#### Tema escuro (`:root`)

| Token | Valor atual |
|---|---:|
| `--brand-logo` | `#ff8c42` |
| `--accent-primary` | `#ff7a1a` |
| `--accent-text` | `#ff7600` |
| `--background` | `#151515` |
| `--navigation-surface` | `#1a1a1a` |
| `--surface` | `#202020` |
| `--surface-interactive` | `#262626` |
| `--surface-elevated` | `#2c2c2c` |
| `--surface-border` | `#4b4b4b` |
| `--text-primary` | `#ffffff` |
| `--text-secondary` | `#c4c4c4` |
| `--text-muted` | `#a1a1a1` |
| `--focus-ring` | `#ff8a3d` |

#### Tema claro (`html[data-theme="light"]`)

| Token | Valor atual |
|---|---:|
| `--accent-primary` | `#ff7600` |
| `--accent-text` | `#a84b00` |
| `--background` | `#f6f7f9` |
| `--navigation-surface` | `#f1f3f5` |
| `--surface` | `#ffffff` |
| `--surface-interactive` | `#e9edf1` |
| `--surface-elevated` | `#ffffff` |
| `--surface-border` | `#bec7d1` |
| `--text-primary` | `#17202a` |
| `--text-secondary` | `#435160` |
| `--text-muted` | `#66717d` |
| `--focus-ring` | `#a84b00` |

Cores funcionais de sucesso, aviso, perigo e informação não substituem o laranja como identidade.

### 6.2 Tipografia implementada

Fonte principal:

```text
Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif
```

Tokens tipográficos estruturais atuais:

```text
--type-home-title
--type-article-title
--type-lead
--type-h2
--type-h3
--type-home-section
--type-body
--type-card-title
--type-card-description
--type-ui
--type-navigation
```

O corpo usa base de `16px`.

O Design System deve controlar hierarquia e escala; componentes não devem espalhar tamanhos arbitrários quando um token semântico já existir.

### 6.3 Espaçamento e layout

Tokens estruturais relevantes:

```text
--header-height: 64px
--page-max: 1440px
--content-width: 44rem
--home-content-width: 1120px

--page-padding-desktop: 32px
--page-padding-tablet: 24px
--page-padding-mobile: 20px
```

Sidebar V2.5:

```text
expanded: 240px
collapsed: 48px
preview: 240px
```

A geometria da sidebar não deve ser alterada durante ajustes puramente de motion/interaction polish sem nova decisão arquitetural.

### 6.4 Radius, bordas e sombra

Tokens atuais:

```text
--radius-compact: 6px
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 20px
```

Princípio:

- bordas e variações de superfície estruturam primeiro;
- sombras são reservadas a elevação real;
- não usar glassmorphism ou profundidade ornamental como padrão.

### 6.5 Movimento

Tokens globais atuais:

```text
--duration-fast: 120ms
--duration-base: 180ms
--duration-interaction: 200ms
--ease: cubic-bezier(0.2, 0.8, 0.2, 1)
```

Motion deve:

- explicar transição ou relação espacial;
- evitar mudança de layout desnecessária;
- respeitar `prefers-reduced-motion`;
- permanecer curto e funcional.

A Sidebar V2.5 possui parâmetros próprios auditados de hover/preview/reveal. Esses valores pertencem ao componente e não devem virar tokens globais automaticamente.

---

## 7. Componentes principais

Esta seção substitui a antiga lista de “componentes futuros”. Os componentes abaixo existem ou representam contratos estruturais já implementados.

### 7.1 `BrandLogo` / `Brand`

- usam os ativos oficiais disponíveis;
- mantêm nome acessível;
- preservam identidade GoDocs;
- não redesenham a marca por inferência de screenshot.

### 7.2 `DocsHeader`

- cabeçalho global;
- combina marca, busca, navegação mobile quando aplicável e alternância de tema;
- recebe navegação derivada da coleção publicada;
- não mantém taxonomia paralela.

### 7.3 `SearchDialog`

- interface da busca local;
- consome `/search-index.json`;
- mantém semântica de combobox/listbox;
- suporta teclado;
- `Ctrl/Cmd + K` abre a busca;
- `Escape` fecha;
- consultas sem termos úteis não geram ranking arbitrário;
- resultados distinguem Página e Seção.

### 7.4 `ThemeToggle`

- alterna `light` / `dark`;
- grava preferência em `localStorage` sob `godocs-theme`;
- sem preferência, acompanha `prefers-color-scheme`;
- atualiza `data-theme` e `colorScheme`;
- possui nome acessível da ação.

A inicialização anterior à interação é feita por `/theme-initialization.js` para reduzir flash de tema incorreto.

### 7.5 `HomeIntro`

- estrutura a Home;
- recebe grupos da navegação canônica;
- recebe cards de funcionalidades derivados da coleção;
- utiliza `cardDescription` quando disponível;
- deve continuar funcionando sem cadastro manual de cards.

Background e logos atuais foram estabilizados no Lote 6 e não devem ser reconstruídos sem um novo problema visual comprovado.

### 7.6 `DocCard`

- representa destinos documentais na Home e superfícies equivalentes;
- usa metadados da coleção;
- respeita `availability`;
- possui foco visível;
- interações não devem provocar salto de layout.

### 7.7 `NavigationTree`

É a árvore compartilhada pela navegação desktop e mobile.

Contrato:

- uma árvore, múltiplas apresentações;
- hubs clicáveis quando possuem destino;
- expansão controlada separadamente do link;
- estado ativo separado do estado aberto;
- descendentes derivados da taxonomia;
- não criar menu paralelo.

### 7.8 `DocsSidebar`

Baseline V2.5:

```text
expanded: 240px
collapsed: 48px
preview: 240px
```

Requisitos:

- recolhimento por ação do usuário;
- estado ativo independente de ramo expandido;
- preview temporário no modo collapsed;
- preview não move nem cobre o artigo;
- geometria do shell editorial permanece estável;
- acessibilidade e reduced motion permanecem obrigatórios.

### 7.9 `MobileNavDrawer`

- usa a mesma `NavigationTree`;
- não duplica dados;
- fecha com `Escape`;
- gerencia foco;
- devolve foco ao acionador;
- fecha após navegação quando apropriado;
- mantém touch targets adequados.

### 7.10 `ArticleShell`

Integra:

- sidebar;
- breadcrumbs;
- título e descrição;
- metadados editoriais aplicáveis;
- conteúdo MDX;
- TOC;
- Related;
- paginação;
- compatibilidade de anchors.

O shell deve manter o conteúdo central estável mesmo quando sidebar/TOC mudam de apresentação.

### 7.11 `TableOfContents`

- deriva de headings;
- usa H2/H3 para navegação visual;
- H4 permanece disponível para seções/busca/compatibilidade, mas não deve dominar o TOC;
- acompanha seção ativa;
- usa divulgação progressiva em páginas densas;
- mantém versão adaptada/recolhível no mobile.

### 7.12 `HubNavigation`

- renderiza filhos diretos de páginas `hub`;
- itens derivados da coleção;
- usa `navTitle` e `cardDescription` quando disponíveis;
- não hardcode domínios;
- cards aparecem ao final do conteúdo do hub.

### 7.13 Paginação

`getAdjacentDocs()` utiliza domínios derivados da árvore.

Regras:

- paginação não é lista global plana;
- hub e filhos formam domínio editorial;
- não saltar automaticamente para outro domínio;
- o fim do domínio pode encerrar anterior/próxima.

### 7.14 Related

- deriva de `metadata.related`;
- é manual e opcional;
- máximo de 4 destinos;
- não usa IA ou similaridade automática;
- não aceita autorreferência;
- não deve repetir previous/next;
- não lista automaticamente todos os filhos de um hub.

### 7.15 `Figure` / `DocumentFigure`

Contrato obrigatório:

```text
src
alt
width
height
```

Opções implementadas incluem:

```text
caption
loading
size: default | instructional
zoom
```

- `zoom` é habilitado por padrão;
- `instructional` limita a apresentação para imagens de tutorial;
- lightbox usa diálogo acessível;
- foco retorna ao acionador;
- imagens publicáveis ficam em `public/docs/`.

### 7.16 Componentes MDX

Componentes permitidos atualmente:

```text
Callout
CodeBlock
ExpectedResult
Figure
Info
KeyboardShortcut
Permissions
RelatedLinks
Requirements
Step
Steps
Tip
Warning
```

Imports e exports arbitrários dentro de documentos MDX não são permitidos.

`Step` pode participar da estrutura documental quando recebe:

```text
title
id
headingLevel
```

`headingLevel` aceita 2, 3 ou 4.

---

## 8. Funcionalidades e contratos atuais

| Funcionalidade | Estado atual | Contrato |
|---|---:|---|
| Home | Implementada | derivada da coleção publicada |
| Tema claro/escuro | Implementado | sistema + persistência local |
| Busca local | Implementada | determinística, índice local |
| Atalho `Ctrl/Cmd + K` | Implementado | abre busca |
| Markdown/MDX | Implementado | fonte documental versionada |
| Navegação hierárquica | Implementada | coleção/taxonomia canônica |
| Hubs | Implementados | `pageType: hub`, filhos derivados |
| Rota de artigo | Implementada | `/docs/[...slug]` |
| TOC | Implementado | H2/H3 + progressão para páginas densas |
| Paginação | Implementada | hierárquica por domínio |
| Related | Implementado | manual, opcional, máximo 4 |
| Compatibilidade histórica | Implementada | manifesto + resolução de aliases |
| Imagens de documentação | Implementadas | `Figure`, zoom e modo instructional |
| SEO/metadata | Implementado | canonical, OG, Twitter, sitemap |
| Busca externa/semântica/IA | Não | fora da arquitetura atual da busca do Docs |
| CMS runtime | Não | fora do baseline principal |
| Banco de dados runtime | Não | fora do baseline principal |
| Editor próprio | Pausado | frente isolada, não integrada ao baseline |
| Supabase | Pausado | associado ao Editor futuro |
| Autenticação própria | Fora do baseline atual | evolução futura ligada ao Editor/proteção da documentação |
| Analytics de produto | Não confirmado no baseline | não assumir |
| Comentários/feedback de artigo | Não implementado | não assumir |

### 8.1 Busca do Docs × Busca Inteligente

São sistemas diferentes.

```text
Busca do GoDocs Docs
→ pesquisa dentro da documentação
→ local
→ determinística
→ sem IA

Busca Inteligente
→ funcionalidade documentada do GoDocs
→ pode utilizar IA/contexto
→ serviço adicional quando contratado
```

Nunca compartilhar arquitetura ou comportamento por inferência entre as duas.

---

## 9. Arquitetura técnica

### 9.1 Stack atual confirmada

```text
Next.js 16.2.11
React 19.2.8
React DOM 19.2.8
TypeScript 6.0.3
Tailwind CSS 4.3.3
pnpm 11.9.0
Vitest 4.1.10
Zod 4.4.3
next-mdx-remote 6.0.0
Lucide React 1.25.0
Inter Variable
```

Bibliotecas do pipeline documental incluem também:

```text
gray-matter
github-slugger
remark-parse
remark-mdx
remark-gfm
rehype-slug
unified
mdast-util-to-string
unist-util-visit
```

Package manager obrigatório:

```text
pnpm@11.9.0
```

### 9.2 Estrutura atual de alto nível

```text
godocs-docs/
├── app/
│   ├── docs/
│   │   └── [...slug]/
│   │       └── page.tsx
│   ├── search-index.json/
│   │   └── route.ts
│   ├── share-image/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── brand-logo.tsx
│   ├── brand.tsx
│   ├── doc-card.tsx
│   ├── docs-header.tsx
│   ├── home-intro.tsx
│   ├── navigation-tree.tsx
│   ├── search-dialog.tsx
│   ├── theme-toggle.tsx
│   ├── use-modal-behavior.ts
│   └── docs/
│       ├── anchor-compatibility.tsx
│       ├── article-shell.tsx
│       ├── breadcrumbs.tsx
│       ├── code-block.tsx
│       ├── docs-sidebar-state.tsx
│       ├── docs-sidebar.tsx
│       ├── document-figure.tsx
│       ├── hub-navigation.tsx
│       ├── mdx-components.tsx
│       ├── mobile-nav-drawer.tsx
│       ├── pagination.tsx
│       └── table-of-contents.tsx
│
├── content/
│   └── docs/
│
├── lib/
│   └── docs/
│       ├── compatibility.ts
│       ├── headings.ts
│       ├── navigation.ts
│       ├── schema.ts
│       ├── search.ts
│       ├── source.ts
│       └── validation.ts
│
├── public/
│   ├── brand/
│   └── docs/
│
├── project-docs/
│   ├── Memória.md
│   ├── daily_stats.md
│   ├── REDESIGN_ARCHITECTURE.md
│   ├── SYSTEM_BLUEPRINT.md
│   ├── PROJECT_PROMPT.md
│   └── references/
│
├── scripts/
├── tests/
├── AGENTS.md
├── DESIGN.md
├── PRODUCT.md
├── README.md
├── next.config.ts
├── package.json
└── pnpm-lock.yaml
```

A estrutura acima registra os elementos estruturais relevantes; não pretende listar todo arquivo de teste ou configuração.

### 9.3 Fonte de conteúdo

`lib/docs/source.ts` procura recursivamente:

```text
content/docs/**/*.md
content/docs/**/*.mdx
```

Fluxo de cada arquivo:

```text
arquivo
→ gray-matter
→ frontmatter
→ parseDocFrontmatter()
→ parseDocumentText()
→ DocRecord
```

`DocRecord` concentra:

```text
metadata
slug
segments
href
source
searchableText
headings
sections
readingMinutes
filePath
```

A estimativa de leitura usa o texto pesquisável e base aproximada de 200 palavras por minuto, com mínimo de 1 minuto.

Documentos são ordenados por:

1. `section.order`;
2. `section.label`;
3. `order`;
4. `title`.

Slugs duplicados causam erro explícito.

### 9.4 Contrato de frontmatter

Schema atual:

```yaml
---
title: Título da página
description: Descrição curta.
cardDescription: Descrição opcional para cards.
slug: funcionalidades/exemplo
pageType: task
section:
  id: funcionalidades
  label: Funcionalidades
  description: Recursos documentados do GoDocs.
  entrySlug: funcionalidades
  order: 20
navTitle: Título curto
ancestors:
  - segment: funcionalidades
    label: Funcionalidades
    order: 20
order: 10
keywords:
  - termo
status: published
availability: available
updatedAt: 2026-09-09
version: GoDocs 4
permission: Informação opcional de permissão
related:
  - funcionalidades/visao-geral
---
```

Regras:

- `title`, `description`, `slug`, `pageType` e `order` são obrigatórios;
- `cardDescription` é opcional;
- `section` é opcional no schema, mas deve ser coerente quando utilizada;
- `navTitle` é opcional;
- `ancestors` aceita no máximo dois níveis no schema atual;
- quantidade e segmentos de `ancestors` devem corresponder ao slug;
- `keywords` padrão `[]`;
- `status` padrão `published`;
- `availability` padrão `available`;
- `updatedAt` usa `YYYY-MM-DD`;
- `related` padrão `[]`, máximo 4;
- `related` não pode repetir destino nem apontar para a própria página;
- `order` e ordens de section/ancestors são inteiros não negativos;
- slug usa segmentos minúsculos, números e hífens.

### 9.5 Pipeline documental

```text
content/docs/**/*.md|mdx
          ↓
descoberta recursiva
          ↓
gray-matter
          ↓
Zod / frontmatter
          ↓
parser estrutural MD/MDX
          ↓
DocRecord[]
          ↓
coleção normalizada/publicada
          ├── Home
          ├── /docs/[...slug]
          ├── HubNavigation
          ├── NavigationTree
          ├── sidebar
          ├── drawer
          ├── breadcrumbs
          ├── paginação
          ├── Related
          ├── TOC
          ├── search-index.json
          ├── sitemap
          └── metadata/social
```

A mesma coleção deve continuar sendo o centro do sistema.

### 9.6 Taxonomia e navegação

`buildNavigation()` agrupa documentos por `section`.

`section` define:

```text
id
label
description
entrySlug
order
```

Regras:

- documentos de uma mesma section devem repetir os mesmos dados estruturais;
- `entrySlug` precisa apontar para documento publicado;
- quando o `entrySlug` representa um `hub`, ele funciona como destino explícito da seção;
- ramos são derivados de segmentos de slug e `ancestors`;
- labels e ordens divergentes para o mesmo ancestral são inválidos;
- ancestors devem corresponder a páginas reais/publicadas.

`cardDescription` é preferida sobre `description` em superfícies compactas de navegação quando disponível.

### 9.7 Headings, seções e TOC

`parseDocumentText()` analisa o AST do Markdown/MDX.

Contratos:

- H1 no corpo é inválido;
- o H1 vem do frontmatter;
- H2/H3 entram no TOC visual;
- H2/H3/H4 entram na estrutura de seções pesquisáveis;
- IDs são gerados com `github-slugger`;
- IDs duplicados geram erro;
- `<Step>` pode criar heading estrutural explícito;
- listas e conteúdo MDX relevante entram no texto pesquisável.

Essa separação permite:

```text
TOC visual mais controlado
+
busca/compatibilidade com maior profundidade
```

### 9.8 Paginação

`getAdjacentDocs()` deriva domínios da árvore de navegação.

O algoritmo preserva:

- hubs de entrada;
- filhos aninhados;
- sequência por domínio;
- término de domínio sem salto arbitrário.

Não substituir por uma ordenação global simples de todos os documentos.

### 9.9 Related

O frontmatter `related` é resolvido contra a coleção publicada.

A validação garante:

- destino existente;
- destino publicado;
- não repetido;
- diferente da própria página;
- máximo de 4;
- não duplicação de previous/next.

A ordem declarada pelo autor é preservada.

### 9.10 Compatibilidade de URLs e anchors

O redesign preserva um manifesto explícito em:

```text
lib/docs/compatibility.ts
```

Baseline contratual:

```text
Documentos: 30
Workflows: 49
Total: 79
```

Objetivos:

- deep links antigos continuam resolvendo;
- aliases não criam resultados duplicados;
- mudança de página canônica pode ser resolvida no cliente quando o fragment original precisa migrar;
- H2/H3/H4 e aliases participam da validação.

Não remover uma entrada de compatibilidade apenas porque o heading antigo desapareceu do conteúdo atual. A decisão depende do contrato público.

### 9.11 Busca

Arquitetura atual:

```text
DocRecord[]
→ createSearchIndex()
→ /search-index.json
→ SearchDialog
→ searchDocuments()
```

Características:

- índice versão 2;
- local;
- determinístico;
- normalização de acentos;
- lowercase pt-BR;
- matching por palavras exatas e prefixos;
- bônus por frase;
- todos os termos úteis precisam ter match;
- score completo calculado antes da diversidade;
- ordenação por score e título;
- diversidade aplicada por documento canônico.

Pesos atuais priorizam:

```text
title
→ keywords
→ description
→ section
→ content
```

Contratos:

```text
SEARCH_RESULT_LIMIT = 12
SEARCH_RESULTS_PER_DOCUMENT = 3
SEARCH_SNIPPET_LENGTH = 220
```

`sem` não é tratado como stopword.

Consultas compostas apenas por termos considerados ruído retornam zero resultados.

A busca não possui:

- IA;
- embeddings;
- NLP externo;
- autocomplete complexo;
- chamadas a terceiros.

### 9.12 Validação de conteúdo

`lib/docs/validation.ts` e os scripts do repositório validam:

- frontmatter;
- slug;
- compilação MDX;
- componentes permitidos;
- imports/exports indevidos;
- links internos;
- status do destino;
- fragments;
- assets;
- taxonomia;
- Related;
- compatibilidade de anchors.

Assets locais não podem apontar para fora do workspace.

Formatos locais reconhecidos pela validação incluem:

```text
avif
gif
jpg/jpeg
png
svg
webp
ico
pdf
mp4
webm
```

### 9.13 Tema

Tema atual:

```text
dark
light
```

Implementação:

- `data-theme` no elemento `html`;
- `localStorage` com chave `godocs-theme`;
- fallback para preferência do sistema;
- `colorScheme` sincronizado;
- inicialização beforeInteractive por script próprio;
- mesmos nomes de tokens semânticos entre temas.

Tema claro e escuro são variações completas do mesmo sistema, não simples inversão de cores.

### 9.14 Server e Client Components

Princípio técnico:

- renderização de conteúdo e composição estática/server-side por padrão;
- Client Components somente onde existe estado ou interação de navegador.

Exemplos de interações client-side:

- alternância de tema;
- busca;
- sidebar/drawer;
- TOC ativo;
- lightbox;
- compatibilidade de anchor quando necessário.

### 9.15 Relação futura com Editor e persistência

A arquitetura pública deve continuar Git-native.

Princípio já aprovado para a evolução futura:

```text
Editor
→ interface de autoria
→ conteúdo versionável
→ repositório oficial
→ validação/preview
→ publicação
```

O Editor não deve criar uma segunda fonte pública concorrente ao Markdown/MDX.

Enquanto estiver pausado:

- nenhuma dependência de Supabase é requisito do baseline principal;
- não executar migrations;
- não alterar autenticação;
- não alterar pipeline público por causa do Editor.

Na arquitetura futura discutida, dados como usuários, permissões e estados temporários podem pertencer a persistência própria do Editor, enquanto o conteúdo publicado permanece versionado. Essa divisão só deve ser materializada nos lotes específicos do Editor.

---

## 10. Responsividade

A autoridade final está na implementação e no `DESIGN.md`.

Breakpoints relevantes já usados/testados incluem adaptações em:

```text
1023px
767px
```

O sistema também possui tratamento de telas compactas menores.

### Desktop amplo

- sidebar persistente;
- conteúdo central;
- TOC quando houver espaço;
- busca completa no header.

### Notebook / largura intermediária

- preservar leitura antes de colunas auxiliares;
- TOC pode compactar/ocultar conforme implementação;
- sidebar continua respeitando sua geometria.

### Tablet

- conteúdo ganha prioridade;
- navegação migra para drawer quando o layout exigir;
- cards reduzem colunas;
- TOC adapta densidade.

### Mobile

- uma coluna;
- drawer para navegação;
- busca adaptada ao viewport;
- header compacto;
- TOC recolhível;
- cards em uma coluna;
- imagens responsivas.

Requisitos universais:

- sem overflow horizontal;
- imagens responsivas;
- tabelas com rolagem própria quando necessário;
- touch targets adequados;
- sticky elements sem cobrir conteúdo;
- foco não pode desaparecer por clipping;
- conteúdo principal não deve mudar de posição de forma inesperada durante preview da sidebar.

---

## 11. Estados e microinterações

Os estados textuais específicos da documentação pertencem ao conteúdo/produto quando tiverem implicação editorial. Esta seção registra padrões técnicos.

### 11.1 Busca sem consulta útil

Não abrir listbox arbitrário.

O diálogo deve orientar a pesquisa sem sugerir conteúdo falso.

### 11.2 Busca sem resultados

Exibir estado vazio claro e permitir nova tentativa.

Não usar resultados fallback sem relação com a consulta.

### 11.3 Página inexistente

- mensagem clara;
- retorno real para a Home;
- sem CTA promocional;
- sem conteúdo fictício.

### 11.4 Conteúdo `coming-soon`

- permanece publicado/navegável;
- deve comunicar indisponibilidade/preparação pela interface adequada;
- não deve ser confundido com draft.

### 11.5 Sidebar

Estados conceitualmente separados:

```text
active
open/expanded branch
sidebar expanded/collapsed
preview
hover intent
```

Um estado não deve forçar indevidamente outro.

### 11.6 Feedback de interação

- hover discreto;
- pressed sem deslocamento;
- foco visível;
- motion funcional;
- skeleton somente quando existir carregamento real;
- sem animação ornamental como resposta padrão.

### 11.7 Reduced motion

Quando `prefers-reduced-motion` estiver ativo:

- remover ou reduzir movimento não essencial;
- não remover informação ou estado;
- manter affordance e foco.

---

## 12. Acessibilidade

Contratos mínimos:

- um único `h1` por página;
- corpo MDX não contém H1;
- `html lang="pt-BR"`;
- `header`, `nav`, `main`, `aside` e demais landmarks semanticamente adequados;
- link **Pular para o conteúdo** disponível ao foco;
- WCAG AA como referência de contraste;
- teclado funcional em toda interação;
- foco visível;
- ícones decorativos com `aria-hidden`;
- botões de ícone com nome acessível;
- `Escape` fecha overlays quando aplicável;
- foco retorna ao acionador;
- dialog/drawer gerenciam foco;
- sem significado comunicado apenas por cor;
- reduced motion respeitado.

### Busca

Preservar:

- combobox;
- listbox;
- estados ARIA coerentes;
- navegação por setas;
- Enter;
- Escape;
- `Ctrl/Cmd + K`;
- foco inicial e retorno apropriado.

### Sidebar / drawer

- link do hub e controle de expansão não devem virar uma ação ambígua;
- estado ativo é comunicado semanticamente;
- chevrons decorativos não substituem labels;
- drawer reutiliza estrutura lógica da sidebar.

### TOC

- `aria-current` acompanha seção ativa;
- scroll e IntersectionObserver podem cooperar para manter estado correto;
- divulgação progressiva deve permanecer operável por teclado.

### Figure / lightbox

- `alt` obrigatório;
- trigger possui nome acessível;
- diálogo possui título acessível;
- botão de fechar identificado;
- foco retorna ao trigger.

---

## 13. Performance e SEO básico

### 13.1 Performance

Princípios:

- Server Components por padrão;
- JavaScript cliente somente para interações;
- conteúdo carregado do filesystem no servidor;
- leitura de documentos memoizada com `cache()` do React;
- índice de busca gerado localmente;
- sem chamadas externas necessárias para pesquisar;
- dependências novas somente quando justificadas.

Não afirmar static export puro: o `next.config.ts` atual não configura `output: "export"`.

### 13.2 Imagens

- `next/image` é utilizado em `DocumentFigure`;
- dimensões explícitas são obrigatórias;
- tamanhos responsivos variam entre `default` e `instructional`;
- screenshots devem preservar legibilidade;
- assets públicos devem existir e passar pela validação.

### 13.3 Metadata

O layout global define:

- `metadataBase`;
- título padrão/template;
- description;
- application name;
- canonical;
- Open Graph;
- Twitter card.

Artigos geram:

- title;
- description;
- canonical individual;
- Open Graph do artigo;
- imagem social por slug;
- Twitter metadata.

### 13.4 Sitemap e robots

O sitemap deriva dos documentos publicados.

O baseline público atual usa:

```text
robots: allow /
sitemap: /sitemap.xml
```

Se autenticação da documentação for introduzida no futuro, essa política deverá ser revisada no lote correspondente; não antecipar essa alteração no baseline atual.

### 13.5 Rede e terceiros

A leitura e busca da documentação não devem depender de serviços de terceiros para funcionar.

O build deve permanecer previsível após dependências instaladas e não deve introduzir chamadas externas desnecessárias.

---

## 14. Critérios de aceite visual e estrutural

Os critérios visuais detalhados pertencem ao `DESIGN.md`. Para o blueprint técnico, uma mudança de interface deve preservar:

- identidade GoDocs;
- caráter de documentação;
- temas claro e escuro;
- hierarquia de leitura;
- busca como controle principal de descoberta;
- arquitetura de Home e hubs;
- sidebar/drawer derivados da mesma árvore;
- TOC funcional;
- foco e teclado;
- responsividade;
- ausência de overflow;
- ausência de salto de layout indevido;
- conteúdo factual inalterado em tarefas puramente visuais.

Para mudanças na Sidebar V2.5, preservar especialmente:

```text
expanded = 240px
collapsed = 48px
preview = 240px
left = 0
```

e a estabilidade do artigo/TOC.

Home, Background e Logos estabilizados no Lote 6 não devem ser reabertos durante ajustes focais de Sidebar sem um novo problema comprovado ou novo escopo aprovado.

---

## 15. Fora do baseline atual

Os itens abaixo podem fazer parte da evolução do produto, mas **não pertencem à arquitetura principal atualmente integrada**.

### 15.1 Editor próprio

Estado:

```text
preservado
pausado
```

Não retomar automaticamente.

### 15.2 Supabase

Relacionado à frente futura do Editor.

Não é requisito da aplicação pública atual.

### 15.3 Autenticação própria

Existe direção de produto para uma experiência autenticada futura, associada à evolução do Editor/proteção da documentação, mas ela não está integrada ao baseline público atual.

Não adicionar login, sessão ou proteção de rota fora do lote autorizado.

### 15.4 Chat/assistente da documentação

Ideia futura aprovada para exploração, mas não faz parte da arquitetura atual.

Não confundir com a busca local.

### 15.5 GoPractice

Microssimulações interativas foram aprovadas como ideia futura, mas explicitamente não são prioridade atual.

### 15.6 IA na busca do Docs

Não faz parte da busca atual.

A busca permanece local/determinística até nova decisão arquitetural.

### 15.7 CMS runtime como fonte pública

Não existe no baseline.

Mesmo com Editor futuro, o princípio aprovado é preservar conteúdo publicado versionado no repositório, evitando uma fonte pública paralela.

### 15.8 Outros itens não confirmados

Não assumir implementação de:

- analytics;
- comentários;
- feedback por artigo;
- internacionalização;
- versionamento público de documentação;
- integrações privadas do GoDocs;
- APIs privadas;
- cadastro público irrestrito.

---

## 16. Checklist de conclusão

Use este checklist como referência arquitetural. Os comandos executáveis e regras operacionais completas pertencem ao `AGENTS.md` e `README.md`.

### Produto e conteúdo

- [ ] Conteúdo permanece em Markdown/MDX versionado.
- [ ] Nenhum comportamento do GoDocs foi inventado.
- [ ] White-label foi preservado.
- [ ] Permissões e serviços condicionais não foram generalizados.
- [ ] Mudança visual não alterou fatos sem autorização editorial.

### Arquitetura documental

- [ ] Rotas continuam derivadas da coleção.
- [ ] `pageType` permanece explícito.
- [ ] Taxonomia continua coerente.
- [ ] Hubs derivam filhos da coleção.
- [ ] Cards de hub permanecem no final do conteúdo.
- [ ] Sidebar e drawer reutilizam a mesma árvore.
- [ ] Breadcrumbs representam ancestrais reais.
- [ ] Paginação continua limitada ao domínio.
- [ ] Related continua manual e válido.
- [ ] Compatibilidade histórica foi preservada.

### Busca e TOC

- [ ] Busca permanece determinística.
- [ ] Limite de 12 resultados preservado.
- [ ] Máximo de 3 resultados por documento preservado.
- [ ] Snippet de 220 caracteres preservado.
- [ ] Aliases não duplicam resultados.
- [ ] TOC deriva de headings.
- [ ] H2/H3 permanecem a hierarquia visual principal.
- [ ] H4 continua disponível para estrutura/busca/compatibilidade.

### Engenharia

- [ ] `pnpm` continua sendo o package manager.
- [ ] TypeScript permanece estrito.
- [ ] Não foi criada fonte paralela de conteúdo.
- [ ] Dependências novas são necessárias e justificadas.
- [ ] Client Components foram limitados a interações necessárias.
- [ ] Erros não foram silenciados.
- [ ] Assets permanecem dentro do repositório.

### Design e responsividade

- [ ] `DESIGN.md` foi respeitado.
- [ ] Tokens semânticos foram reutilizados.
- [ ] Tema claro e escuro funcionam.
- [ ] Desktop, notebook, tablet e mobile foram considerados.
- [ ] Não há overflow horizontal introduzido.
- [ ] Sidebar/TOC não sofreram deslocamento indevido.
- [ ] `prefers-reduced-motion` foi respeitado.

### Acessibilidade

- [ ] Fluxo principal funciona por teclado.
- [ ] Foco é visível.
- [ ] Hierarquia de headings é válida.
- [ ] Dialogs/drawers gerenciam foco.
- [ ] `Escape` funciona onde aplicável.
- [ ] Foco retorna ao acionador.
- [ ] Ícones e estados possuem semântica adequada.
- [ ] Contraste permanece compatível com os critérios adotados.

### SEO e publicação técnica

- [ ] Metadata continua coerente.
- [ ] Canonical continua correto.
- [ ] Sitemap usa documentos publicados.
- [ ] Imagens sociais continuam válidas quando afetadas.
- [ ] Nenhuma política futura de autenticação/robots foi antecipada sem decisão.

### Validação

Quando aplicável:

```bash
pnpm content:validate
pnpm search:benchmark
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit:prod
```

- [ ] Foram executadas as validações proporcionais ao impacto.
- [ ] Nenhum resultado não executado foi declarado como aprovado.
- [ ] Falhas preexistentes, quando houver, foram diferenciadas de regressões novas.
