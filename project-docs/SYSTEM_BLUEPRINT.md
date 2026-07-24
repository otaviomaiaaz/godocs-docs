# GoDocs Docs — Esqueleto técnico e visual do MVP

## 1. Finalidade deste documento

Este arquivo é a fonte de verdade para a arquitetura de produto, interface e implementação do GoDocs Docs.

Ele descreve o sistema que deve existir após o MVP e separa:

- o que é renderizado agora;
- o que precisa funcionar como fundação;
- o que fica explicitamente fora do MVP.

## 2. Princípios do produto

1. **Documentação antes de promoção:** a interface existe para encontrar e ler informação.
2. **GoDocs na identidade:** laranja, neutros escuros, wordmark e tom corporativo.
3. **Mintlify na experiência:** busca central, navegação clara, leitura ampla e hierarquia precisa.
4. **Vazio intencional:** sem artigos, a home continua completa sem inventar seções.
5. **Conteúdo como arquivo:** Markdown/MDX é a fonte única para artigos, navegação e busca.
6. **Progressão simples:** adicionar conteúdo não exige reconstruir layouts.
7. **Acessibilidade nativa:** teclado, foco, contraste e semântica fazem parte do componente.

## 3. Leitura das referências

### 3.1 GoDocs — fonte de identidade

Arquivos:

- `references/GoDocs/Captura de tela 2026-07-21 130720.png`
- `references/GoDocs/Captura de tela 2026-07-21 130833.png`

Características a transportar:

- wordmark com `go` em laranja e `docs` em branco;
- fundo grafite, não preto absoluto;
- sidebar e cards com pequenas variações de luminosidade;
- bordas finas em cinza;
- item ativo com laranja forte;
- títulos brancos e textos auxiliares em cinza frio;
- ícones lineares brancos/laranja;
- radius moderado;
- tom corporativo e funcional.

Características a adaptar:

- reduzir a densidade do dashboard para favorecer leitura;
- usar laranja em destaque, não em grandes áreas persistentes;
- aumentar espaço em branco e largura de linha controlada;
- manter a marca sem reproduzir os cards e gráficos do dashboard.

### 3.2 AbacatePay/Mintlify — fonte de experiência

Arquivos:

- `references/AbacatePay - Mintlify/Captura de tela 2026-07-22 103140.png`
- `references/AbacatePay - Mintlify/Captura de tela 2026-07-22 103206.png`
- `references/AbacatePay - Mintlify/Captura de tela 2026-07-22 103234.png`

Características a transportar:

- header horizontal com busca central dominante;
- largura máxima consistente e grandes margens laterais;
- separação sutil entre header, navegação e conteúdo;
- títulos fortes e texto secundário de baixo contraste controlado;
- cards simples com ícone, título e descrição;
- grades responsivas e ritmo vertical generoso;
- superfícies discretas e bordas finas;
- navegação contextual que permanece disponível durante o scroll.

Não transportar:

- verde da marca;
- logo e nome AbacatePay;
- conteúdo de API;
- links `llms.txt`, repositório e dashboard;
- categorias e cards das screenshots;
- botão verde ou hierarquia promocional específica.

### 3.3 Síntese visual

```text
Estrutura Mintlify                       Identidade GoDocs
header compacto                         wordmark laranja + branco
busca central                           foco e ativos em laranja
conteúdo amplo                          fundo grafite
cards de borda fina                     superfícies cinza-escuras
ritmo vertical generoso                 tom corporativo
                    ↓
              GoDocs Docs
```

## 4. Arquitetura de informação

### 4.1 Rotas do MVP

| Rota | Estado no MVP | Função |
|---|---:|---|
| `/` | Renderizada | Home institucional e estado sem conteúdo |
| `/docs/[...slug]` | Funcional | Renderizar artigos futuros por slug |
| `not-found` | Renderizada quando necessário | Informar página inexistente e retornar à home |

Não criar rotas para login, dashboard, API, busca dedicada, admin ou CMS.

### 4.2 Estados de conteúdo

**Sem artigos — estado inicial:**

- home ampla;
- header com marca, busca e tema;
- nenhuma sidebar vazia;
- nenhuma navegação de categoria vazia;
- nenhuma grade de cards;
- pesquisa apresenta estado vazio.

**Com artigos — comportamento futuro já suportado:**

- categorias de primeiro nível podem alimentar navegação contextual;
- páginas alimentam a sidebar hierárquica;
- headings alimentam o sumário;
- metadados e texto alimentam a busca;
- ordem documental alimenta anterior/próxima.

## 5. Wireframes

### 5.1 Home desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ godocs | Documentação [ Pesquisar na documentação... Ctrl K ]   ◐  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                GODOCS DOCS                                           │
│                Documentação do GoDocs                               │
│                Encontre guias, conceitos e instruções...             │
│                Novos conteúdos serão publicados progressivamente.    │
│                                                                      │
│                     detalhe laranja sutil                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

Não existe sidebar ou card vazio na home inicial.

### 5.2 Artigo desktop futuro

```text
┌──────────────────────────────────────────────────────────────────────┐
│ godocs | Documentação [ Pesquisar na documentação... Ctrl K ]   ◐  │
├──────────────────────────────────────────────────────────────────────┤
│ Sidebar 240px │ Conteúdo 720–760px                    │ TOC 220px   │
│               │ breadcrumb                           │ nesta página │
│ Categoria     │ # Título                             │ heading      │
│   Página      │ descrição                            │ heading      │
│   Página      │ corpo do artigo                      │ heading      │
│               │ anterior / próxima                   │              │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Mobile

```text
┌──────────────────────────────────┐
│ ☰  godocs | Docs     Buscar  ◐  │
├──────────────────────────────────┤
│                                  │
│ Título / conteúdo                │
│                                  │
└──────────────────────────────────┘

☰ abre drawer apenas quando existe navegação documental.
Buscar abre o diálogo em tela adequada ao viewport.
```

## 6. Sistema visual

### 6.1 Cores semânticas

Use variáveis CSS. Os nomes são contratuais; os valores podem receber pequenos ajustes após inspeção visual.

#### Marca

| Token | Valor inicial | Uso |
|---|---:|---|
| `--brand` | `#FF7900` | links, ícones ativos, indicador e foco |
| `--brand-hover` | varia por tema | hover de elementos de marca com contraste adequado |
| `--brand-active` | varia por tema | estado pressionado com contraste adequado |
| `--brand-contrast` | `#FFFFFF` | texto sobre laranja quando inevitável |
| `--brand-subtle` | `rgba(255,121,0,.12)` | fundos sutis |
| `--brand-border` | `rgba(255,121,0,.30)` | borda de destaque |
| `--brand-text` | varia por tema | laranja com contraste adequado para texto |
| `--focus-ring` | varia por tema | foco visível com contraste mínimo de componente |

#### Tema escuro

| Token | Valor inicial |
|---|---:|
| `--background` | `#1B1B1B` |
| `--header` | `#1D1D1D` |
| `--surface-1` | `#242424` |
| `--surface-2` | `#2B2B2B` |
| `--surface-hover` | `#333333` |
| `--border` | `#474747` |
| `--border-subtle` | `#393939` |
| `--divider` | `#3E3E3E` |
| `--text-primary` | `#F6F6F6` |
| `--text-secondary` | `#C2C2C2` |
| `--text-muted` | `#9A9A9A` |
| `--overlay` | `rgba(0,0,0,.58)` |

#### Tema claro

| Token | Valor inicial |
|---|---:|
| `--background` | `#F8F9FB` |
| `--header` | `rgba(255,255,255,.94)` |
| `--surface-1` | `#FFFFFF` |
| `--surface-2` | `#F1F3F5` |
| `--surface-hover` | `#ECEFF2` |
| `--border` | `#CFD4DB` |
| `--border-subtle` | `#DDE1E6` |
| `--divider` | `#D6DBE1` |
| `--text-primary` | `#202020` |
| `--text-secondary` | `#555B63` |
| `--text-muted` | `#6F7680` |
| `--overlay` | `rgba(24,24,24,.35)` |

#### Estados

| Token | Valor inicial |
|---|---:|
| `--success` | `#2FBF71` |
| `--warning` | `#F5A524` |
| `--danger` | `#F05252` |
| `--info` | `#4C8DFF` |

Essas cores são funcionais e não substituem o laranja como identidade.

### 6.2 Tipografia

- Fonte primária: Inter via `next/font`, ou fonte equivalente já presente.
- Fonte monoespaçada: Geist Mono, JetBrains Mono ou equivalente local.
- Peso normal: 400.
- Peso médio: 500.
- Peso semibold: 600.
- Peso bold: 700, usado com moderação.

| Papel | Desktop | Mobile | Line-height |
|---|---:|---:|---:|
| Hero | 40px / 700 | 30px / 700 | 1.16 |
| H1 de artigo | 36px / 700 | 28px / 700 | 1.16 |
| H2 | 26px / 650 | 21px / 650 | 1.3 |
| H3 | 21px / 600 | 19px / 600 | 1.4 |
| Corpo | 16px / 400 | 16px / 400 | 1.68 |
| Texto pequeno | 14px / 400 | 14px / 400 | 1.55 |
| Navegação | 13px / 400 | 13px / 400 | 1.45 |
| Label | 12px / 600 | 12px / 600 | 1.4 |

Comprimento ideal do corpo: 60–78 caracteres por linha.

### 6.3 Espaçamento e layout

Escala base: `4px`.

```text
1: 4px   2: 8px   3: 12px   4: 16px
5: 20px  6: 24px  8: 32px  10: 40px
12: 48px 16: 64px 20: 80px 24: 96px
```

| Elemento | Medida inicial |
|---|---:|
| Altura do header | 64px |
| Largura máxima global | 1440px |
| Largura da sidebar | 240px |
| Largura do conteúdo | `70ch` |
| Largura do TOC | 220px |
| Gap entre colunas | 40px |
| Padding desktop | 32px |
| Padding tablet | 24px |
| Padding mobile | 20px |

### 6.4 Radius, bordas e sombra

| Token | Valor | Uso |
|---|---:|---|
| `--radius-sm` | 8px | atalhos, tags, pequenos controles |
| `--radius-md` | 12px | inputs e botões |
| `--radius-lg` | 16px | cards e painéis |
| `--radius-xl` | 20px | diálogo de busca |
| Borda padrão | 1px | separação de superfícies |

Sombras devem ser quase imperceptíveis no tema escuro. No tema claro, use uma sombra curta e suave apenas em elementos elevados, como diálogo e drawer.

### 6.5 Movimento

- duração rápida: 120ms;
- duração padrão: 180ms;
- easing: `cubic-bezier(.2,.8,.2,1)`;
- animar somente opacity, transform e mudanças simples de cor;
- desativar movimento não essencial com `prefers-reduced-motion`.

## 7. Componentes do MVP

### 7.1 `Brand`

- Exibe `go` em laranja e `docs` em cor primária.
- Usa separador e rótulo `Documentação`; em mobile, o rótulo pode ser abreviado visualmente para `Docs`.
- Mantém o nome acessível `GoDocs Documentação` em todas as variantes.
- Não redesenha o símbolo a partir do screenshot.
- Aceita substituição futura por asset oficial.

### 7.2 `DocsHeader`

- Sticky no topo, z-index consistente.
- Fundo sólido ou levemente translúcido com borda inferior.
- Marca à esquerda, busca central, tema à direita.
- Em mobile: marca compacta, botão de busca e tema; menu apenas quando houver navegação.

### 7.3 `SearchTrigger`

- Aparência de input, comportamento de botão.
- Ícone de lupa, placeholder e hint de atalho.
- Largura desktop aproximada: 420–520px.
- Foco visível com ring de marca.

### 7.4 `SearchDialog`

- Modal acessível com overlay.
- Campo focado ao abrir.
- Estado vazio real no MVP.
- Estrutura futura de resultados: título, descrição curta, breadcrumb e termo destacado.
- Fecha com `Escape`, clique controlado fora e ação explícita.

### 7.5 `ThemeToggle`

- Controle acessível com nome do estado/ação.
- Persiste preferência.
- Evita flash de tema incorreto.
- Não depende somente de ícone sem label acessível.

### 7.6 `HomeIntro`

- Eyebrow opcional `GODOCS DOCS`.
- Título e descrição definidos no prompt.
- Mensagem progressiva em tom secundário.
- Sem CTA ou card fictício.
- Elemento abstrato laranja limitado ao background e baixa opacidade.

### 7.7 `DocsSidebar`

- Não renderiza na home vazia.
- Renderiza em páginas de artigo quando houver árvore de navegação.
- Suporta grupos, níveis aninhados, expansão, item ativo e scroll próprio.
- O ramo do item ativo abre automaticamente.

### 7.8 `MobileNavDrawer`

- Só aparece quando há navegação disponível.
- Trap e retorno de foco.
- Fecha com `Escape`, seleção de item e ação explícita.

### 7.9 `ArticleShell`

- Breadcrumb, título, descrição e conteúdo.
- Sidebar e TOC condicionais.
- Layout mantém conteúdo central mesmo sem uma das colunas.
- `scroll-margin-top` em headings.

### 7.10 `TableOfContents`

- Exibido com pelo menos dois headings relevantes.
- Geração a partir do conteúdo, não de lista manual.
- Destaca seção visível via Intersection Observer ou solução equivalente.
- Navegação por âncora e sticky no desktop.

### 7.11 `DocCard` — preparado para conteúdo futuro

Não renderizar no MVP vazio. Quando houver conteúdo, seguir:

- ícone linear de 20–24px em laranja;
- título semibold;
- descrição de até três linhas;
- borda de 1px e fundo discreto;
- radius de 16px;
- padding de 24px;
- card inteiro clicável com foco visível;
- hover por borda/superfície, sem salto de layout;
- grid: 3 colunas desktop, 2 tablet, 1 mobile.

### 7.12 Componentes de conteúdo futuros

Preparar estilos/contratos para:

- `Callout` (`info`, `tip`, `warning`, `danger`);
- `Steps` e `Step`;
- `CodeBlock` com copiar;
- `Figure` com imagem, legenda e zoom opcional futuro;
- tabela responsiva;
- anterior/próxima.

Não criar demonstrações públicas fictícias.

## 8. Funcionalidades

| Funcionalidade | MVP | Comportamento |
|---|---:|---|
| Home institucional | Sim | Estado vazio visualmente completo |
| Tema claro/escuro | Sim | Sistema inicial + persistência local |
| Busca local | Sim | Modal e índice; vazio sem documentos |
| Atalho `Ctrl/Cmd + K` | Sim | Abre busca sem conflitar com campos editáveis |
| Markdown/MDX | Sim | Pipeline local funcional |
| Navegação hierárquica | Fundação funcional | Gerada quando documentos existirem |
| Rota dinâmica de artigo | Sim | `/docs/[...slug]` e `not-found` |
| Sumário automático | Fundação funcional | Gerado quando artigo tiver headings |
| Anterior/próxima | Fundação funcional | Derivado da ordem documental |
| Drawer mobile | Condicional | Exibido quando houver navegação |
| Busca externa/IA | Não | Fora do MVP |
| CMS/banco/admin | Não | Fora do MVP |
| Autenticação | Não | Fora do MVP |
| Analytics | Não | Fora do MVP |

## 9. Arquitetura técnica

### 9.1 Estrutura sugerida

Adapte somente se a stack existente exigir.

```text
app/
├── layout.tsx
├── page.tsx
├── not-found.tsx
├── globals.css
└── docs/
    └── [...slug]/
        └── page.tsx

components/
├── brand.tsx
├── docs-header.tsx
├── home-intro.tsx
├── search-dialog.tsx
├── search-trigger.tsx
├── theme-provider.tsx
├── theme-toggle.tsx
└── docs/
    ├── article-shell.tsx
    ├── breadcrumbs.tsx
    ├── docs-sidebar.tsx
    ├── mobile-nav-drawer.tsx
    ├── pagination.tsx
    ├── table-of-contents.tsx
    └── mdx-components.tsx

content/
└── docs/
    └── .gitkeep

lib/
└── docs/
    ├── schema.ts
    ├── source.ts
    ├── navigation.ts
    ├── search.ts
    └── headings.ts

public/
└── brand/

references/                 # somente leitura
AGENTS.md
PROJECT_PROMPT.md
SYSTEM_BLUEPRINT.md
README.md
```

### 9.2 Fonte de conteúdo

Um documento é definido por arquivo Markdown/MDX e frontmatter validado.

Contrato mínimo:

```yaml
---
title: Título da página
description: Descrição curta da página.
slug: caminho-da-pagina
section: identificador-da-secao
order: 10
keywords:
  - termo
---
```

Regras:

- `title`, `description`, `slug` e `order` são obrigatórios;
- `section` é obrigatório quando houver categorias publicadas;
- `keywords` é opcional;
- slug não começa nem termina com `/`;
- slugs duplicados falham de forma clara no build;
- dados inválidos não são ignorados silenciosamente;
- sidebar, busca, paginação e rotas consomem a mesma coleção normalizada.

### 9.3 Pipeline

```text
content/docs/**/*.mdx
        ↓
leitura + validação de frontmatter
        ↓
coleção normalizada e ordenada
        ├── rotas
        ├── árvore da sidebar
        ├── índice de busca
        ├── anterior/próxima
        └── headings/TOC
```

### 9.4 Busca

- índice gerado localmente a partir de metadados e texto;
- busca case-insensitive e tolerante a acentos;
- ordenação inicial: título, keywords, descrição e corpo;
- sem requisições para terceiros;
- com zero documentos, retornar coleção vazia sem erro;
- resultados navegáveis por teclado.

### 9.5 Tema

- atributo `data-theme` ou classe no elemento raiz;
- tokens CSS compartilham os mesmos nomes entre temas;
- preferência salva em `localStorage`;
- ausência de preferência usa o sistema;
- script inicial seguro evita flash incorreto;
- controle mantém `aria-label` coerente.

## 10. Responsividade

| Faixa | Layout |
|---|---|
| `>= 1280px` | Artigo em três colunas; header completo |
| `1024–1279px` | Sidebar + conteúdo; TOC oculto ou compacto |
| `768–1023px` | Conteúdo amplo; navegação em drawer |
| `< 768px` | Uma coluna; header compacto; diálogo adaptado |

Requisitos em todas as faixas:

- sem overflow horizontal;
- imagens com largura responsiva;
- tabelas com container de rolagem próprio;
- alvos de toque de pelo menos 44px quando apropriado;
- linha de texto confortável;
- sticky elements sem cobrir conteúdo.

## 11. Estados e microinterações

### Vazio da home

`Novos conteúdos serão publicados progressivamente.`

### Vazio da busca

`Nenhum conteúdo disponível para pesquisa.`

### Sem resultados futuro

`Nenhum resultado encontrado para “{termo}”.`

### Página inexistente

- título curto;
- explicação clara;
- link real para `/`;
- sem linguagem promocional.

### Feedback

- hover discreto;
- foco com ring de marca;
- pressed sem deslocamento de layout;
- transições de 120–180ms;
- skeletons apenas quando existir carregamento real.

## 12. Acessibilidade

- um único `h1` por página;
- `header`, `nav`, `main` e `aside` semanticamente corretos;
- link “Pular para o conteúdo” visível ao foco;
- contraste mínimo WCAG AA;
- busca com `role="dialog"`, nome acessível e foco preso;
- drawer com o mesmo padrão de foco;
- ícones decorativos com `aria-hidden`;
- botões de ícone com nome acessível;
- ordem de tabulação coerente;
- `Escape` fecha overlays;
- foco retorna ao acionador;
- movimento reduzido respeitado.

## 13. Performance e SEO básico

- Server Components por padrão;
- JavaScript cliente apenas para interações;
- fontes via `next/font` ou mecanismo equivalente;
- imagens futuras otimizadas sem perder legibilidade de screenshots;
- metadata com título e descrição padrão;
- título de artigo no formato `{Página} | GoDocs Docs`;
- semantic HTML;
- sem scripts de terceiros no MVP;
- build não deve depender de rede após dependências instaladas.

## 14. Critérios de aceite visual

- O primeiro olhar remete ao GoDocs pela marca, laranja e superfícies.
- A organização remete a uma documentação moderna, não ao dashboard original.
- A busca é o principal controle do header.
- A home vazia parece deliberada, não incompleta.
- O laranja orienta atenção sem dominar a tela.
- Texto secundário permanece legível no tema escuro.
- Tema claro possui contraste e superfícies próprios.
- Não há verde de marca, cards fictícios ou links copiados.
- Desktop e mobile mantêm hierarquia equivalente.

## 15. Fora do MVP

- conteúdo documental real;
- login e permissões;
- sincronização com o GoDocs;
- CMS ou edição no navegador;
- busca semântica/IA;
- analytics;
- comentários e feedback de artigo;
- versionamento de documentação;
- internacionalização;
- integração com GitHub ou repositórios públicos;
- publicação/deploy, salvo solicitação separada.

## 16. Checklist de conclusão

### Produto

- [ ] Home em `/` sem conteúdo fictício.
- [ ] Rota futura `/docs/[...slug]` funcional.
- [ ] Estado vazio de busca correto.
- [ ] Nenhuma integração privada.

### Visual

- [ ] Identidade GoDocs aplicada.
- [ ] Estrutura inspirada no Mintlify sem cópia.
- [ ] Tema claro e escuro revisados.
- [ ] Breakpoints principais inspecionados.

### Engenharia

- [ ] Conteúdo centralizado e tipado.
- [ ] Busca, navegação e TOC derivados da fonte documental.
- [ ] Sem componentes ou controles inativos.
- [ ] Sem erros silenciados ou logs de depuração.

### Acessibilidade

- [ ] Fluxo principal utilizável por teclado.
- [ ] Foco e contraste adequados.
- [ ] Dialog e drawer gerenciam foco.
- [ ] Movimento reduzido respeitado.

### Validação

- [ ] Aplicação executada e inspecionada.
- [ ] Lint aprovado.
- [ ] Typecheck aprovado.
- [ ] Testes relevantes aprovados.
- [ ] Build de produção aprovado.
- [ ] Console sem erros introduzidos.
