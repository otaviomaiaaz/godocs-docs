# GoDocs Docs

Aplicação independente de documentação do GoDocs 4. A navegação, a busca, o sumário, a home e as rotas públicas são gerados a partir da mesma coleção local de Markdown/MDX.

## Executar o projeto

Requisitos: Node.js compatível com Next.js 16 e pnpm 11.

```bash
pnpm install
pnpm dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Ambientes e branches

O repositório usa branches e worktrees separados para reduzir o risco de publicar trabalho incompleto:

```text
godocs-docs
└── main             produção estável

godocs-docs-dev
└── develop          integração e testes
    └── feature/*    desenvolvimento isolado
```

- `main` recebe somente mudanças finalizadas, testadas e aprovadas.
- `develop` integra features para validação conjunta; não deve ser promovida inteira quando contiver trabalho ainda não aprovado.
- `feature/editor` preserva o E1 do Editor e é a branch para sua continuação.
- Para trabalhar em uma feature, use `godocs-docs-dev`, confirme `git status --short --branch` e troque para a branch necessária. Não desenvolva na pasta de produção.

Fluxo recomendado:

```text
feature/* → validação isolada → merge em develop → validação integrada
feature aprovada → PR isolada para main → produção
```

Se a feature já estiver misturada a outras integrações, crie uma branch de promoção a partir de `main` e selecione apenas os commits aprovados. Nunca use `develop` como promoção automática para produção.

## Configuração local e serviços externos

Arquivos `.env*` reais são ignorados pelo Git. Nas branches que contêm o E1, copie `.env.example` para `.env.local` somente no worktree de desenvolvimento e use um projeto Supabase Development separado. Não reutilize chaves, usuários ou dados de produção.

O ambiente de desenvolvimento do E1 exige:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
DOCS_ACCESS_MODE=authenticated
```

`SUPABASE_SECRET_KEY` (ou a chave legada `SUPABASE_SERVICE_ROLE_KEY`) e `DOCS_OWNER_BOOTSTRAP_USER_ID` são temporários e exclusivamente server-side para o bootstrap controlado do owner de desenvolvimento. Consulte `project-docs/EDITOR_E1_SETUP.md` na `feature/editor`/`develop` antes de configurar o Supabase; não execute esse procedimento contra produção sem aprovação própria.

No Vercel, a configuração externa deve manter `main` como **Production Branch**. `develop` e `feature/*` usam Preview Deployments e variáveis de Preview apontando para Supabase Development. Variáveis de Production apontam exclusivamente para Supabase Production. Um domínio de staging pode ser associado a `develop`, desde que não substitua o domínio de produção e tenha proteção de preview apropriada.

## Adicionar um documento

Crie um arquivo `.md` ou `.mdx` dentro de `content/docs/`. Não existe registro manual: o loader local descobre o arquivo no build e usa a mesma coleção para gerar rota, navegação, busca, sumário e paginação.

Todo documento precisa começar com este contrato de frontmatter:

```yaml
---
title: Título da página
description: Descrição curta da página.
slug: guias/caminho-da-pagina
pageType: task
navTitle: Título curto
section:
  id: guias
  label: Guias
  description: Orientações publicadas.
  entrySlug: guias
  order: 10
ancestors:
  - segment: guias
    label: Guias
    order: 10
order: 10
keywords:
  - termo opcional
status: published
availability: available
updatedAt: 2026-07-29
version: GoDocs 4
permission: Acesso ao módulo de documentos
related:
  - funcionalidades/visao-geral
---
```

- `title`, `description`, `slug`, `pageType` e `order` são obrigatórios.
- `pageType` aceita somente `hub`, `task` ou `reference` e registra a função editorial sem impor estilo visual.
- `section` agrupa páginas e define `id`, label visível, descrição, `entrySlug` explícito e ordem sem derivar texto do slug ou do primeiro `order`.
- `navTitle` é opcional e fornece um título curto para navegação; o artigo continua usando `title`.
- `ancestors` descreve cada nível anterior de um slug aninhado com `segment`, label e ordem explícitos. A quantidade e os segmentos devem corresponder ao slug.
- `keywords` é opcional e melhora a relevância da busca.
- `status` aceita `published` ou `draft`. Apenas documentos publicados aparecem na aplicação e um documento publicado não pode apontar para um rascunho.
- `availability` aceita `available` ou `coming-soon`. Use `coming-soon` somente quando a página publicada for um estado editorial em preparação que deve permanecer navegável e identificado na home.
- `updatedAt` é opcional e usa `YYYY-MM-DD`; `version` e `permission` também são metadados editoriais opcionais.
- `related` aceita slugs de outros documentos publicados e alimenta a navegação contextual ao fim do artigo.
- `order` é um inteiro não negativo usado na navegação e na paginação.
- `slug` aceita segmentos minúsculos com números e hífens, por exemplo `configuracao/perfis`. A URL resultante será `/docs/configuracao/perfis`.
- slugs duplicados, taxonomia divergente ou metadados inválidos interrompem o build com uma mensagem clara.
- o título principal vem do frontmatter; o corpo deve começar em `##` para manter um único `h1` por página.

O corpo aceita Markdown e MDX. Estão disponíveis `Callout`, `Info`, `Tip`, `Warning`, `Steps`, `Step`, `Requirements`, `Permissions`, `ExpectedResult`, `KeyboardShortcut`, `RelatedLinks`, `Figure` e `CodeBlock`.

`Figure` exige uma imagem local publicável e dimensões explícitas:

```mdx
<Figure
  src="/docs/exemplo.png"
  alt="Descrição objetiva da interface exibida"
  width={1440}
  height={900}
  caption="Legenda opcional."
/>
```

Coloque o arquivo correspondente em `public/docs/`. A imagem pode ser ampliada em um diálogo acessível; não publique capturas com dados privados, marcas de ambiente ou conteúdo de referência.

## Organização e ordenação

Arquivos podem ser organizados livremente em subpastas; a URL é definida exclusivamente por `slug`. `section` cria o agrupamento de primeiro nível e `ancestors` nomeia os ramos de slugs com `/`. Home, sidebar, drawer, busca e breadcrumbs consomem essa mesma taxonomia explícita.

## Validação

Execute a verificação completa antes de publicar alterações:

```bash
pnpm audit:prod
pnpm content:validate
pnpm search:benchmark
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`content:validate` compila MD/MDX e verifica frontmatter, taxonomia, componentes permitidos, links internos, fragments H2/H3/H4, aliases de compatibilidade e assets locais. `search:benchmark` registra de forma determinística documentos, entradas de página/seção, payload bruto/gzip, limite, snippet e as consultas de referência. O build deve continuar funcionando quando `content/docs/` contém apenas o arquivo `.gitkeep`.
