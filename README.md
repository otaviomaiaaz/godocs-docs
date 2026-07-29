# GoDocs Docs

Aplicação independente de documentação do GoDocs 4. A navegação, a busca, o sumário, a home e as rotas públicas são gerados a partir da mesma coleção local de Markdown/MDX.

## Executar o projeto

Requisitos: Node.js compatível com Next.js 16 e pnpm 11.

```bash
pnpm install
pnpm dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Adicionar um documento

Crie um arquivo `.md` ou `.mdx` dentro de `content/docs/`. Não existe registro manual: o loader local descobre o arquivo no build e usa a mesma coleção para gerar rota, navegação, busca, sumário e paginação.

Todo documento precisa começar com este contrato de frontmatter:

```yaml
---
title: Título da página
description: Descrição curta da página.
slug: guias/caminho-da-pagina
navTitle: Título curto
section:
  id: guias
  label: Guias
  description: Orientações publicadas.
  order: 10
ancestors:
  - segment: guias
    label: Guias
    order: 10
order: 10
keywords:
  - termo opcional
status: published
updatedAt: 2026-07-29
version: GoDocs 4
permission: Acesso ao módulo de documentos
related:
  - funcionalidades/visao-geral
---
```

- `title`, `description`, `slug` e `order` são obrigatórios.
- `section` agrupa páginas e define `id`, label visível, descrição e ordem sem derivar texto do slug.
- `navTitle` é opcional e fornece um título curto para navegação; o artigo continua usando `title`.
- `ancestors` descreve cada nível anterior de um slug aninhado com `segment`, label e ordem explícitos. A quantidade e os segmentos devem corresponder ao slug.
- `keywords` é opcional e melhora a relevância da busca.
- `status` aceita `published` ou `draft`. Apenas documentos publicados aparecem na aplicação e um documento publicado não pode apontar para um rascunho.
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
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`content:validate` compila MD/MDX e verifica frontmatter, taxonomia, componentes permitidos, links internos, fragmentos e assets locais. O build deve continuar funcionando quando `content/docs/` contém apenas o arquivo `.gitkeep`.
