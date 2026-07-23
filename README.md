# GoDocs Docs

Aplicação independente de documentação do GoDocs 4. O MVP contém a infraestrutura completa da plataforma e começa sem artigos publicados.

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
slug: caminho-da-pagina
section: identificador-da-secao
order: 10
keywords:
  - termo opcional
---
```

- `title`, `description`, `slug` e `order` são obrigatórios.
- `section` agrupa páginas na navegação e passa a ser obrigatório quando o conteúdo usar categorias.
- `keywords` é opcional e melhora a relevância da busca.
- `order` é um inteiro não negativo usado na navegação e na paginação.
- `slug` aceita segmentos minúsculos com números e hífens, por exemplo `configuracao/perfis`. A URL resultante será `/docs/configuracao/perfis`.
- slugs duplicados ou metadados inválidos interrompem o build com uma mensagem clara.
- o título principal vem do frontmatter; o corpo deve começar em `##` para manter um único `h1` por página.

O corpo aceita Markdown e MDX. Os componentes `Callout`, `Steps`, `Step`, `Figure` e `CodeBlock` já estão disponíveis para documentos futuros.

## Organização e ordenação

Arquivos podem ser organizados livremente em subpastas; a URL é definida exclusivamente por `slug`. `section` cria o agrupamento de primeiro nível e slugs com `/` geram ramos aninhados. Dentro da coleção, páginas são ordenadas por seção, `order` e título.

## Validação

Execute a verificação completa antes de publicar alterações:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

O build deve continuar funcionando quando `content/docs/` contém apenas o arquivo `.gitkeep`.
