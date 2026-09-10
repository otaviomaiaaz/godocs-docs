# GoDocs Docs

Aplicação independente de documentação do GoDocs 4 e canal oficial de publicação e consulta da documentação para usuários finais.

A navegação, a busca, o sumário, a home, os hubs, a paginação, os conteúdos relacionados e as rotas públicas são derivados da mesma coleção local de Markdown/MDX em `content/docs/`. O projeto não deve manter cadastros paralelos para representar a mesma documentação.

Antes de alterar o repositório, siga as regras operacionais de `AGENTS.md`. Para decisões de produto, design ou arquitetura, consulte também `PRODUCT.md`, `DESIGN.md` e `project-docs/REDESIGN_ARCHITECTURE.md` conforme o tipo da tarefa.

## Executar o projeto

Requisitos:

- Node.js compatível com Next.js 16;
- `pnpm@11.9.0`, definido pelo próprio projeto.

Use `pnpm` para instalar dependências e executar scripts. Não use npm, Yarn ou Bun para instalação e não crie lockfiles concorrentes como `package-lock.json`, `yarn.lock` ou `bun.lock`.

```bash
pnpm install
pnpm dev
```

A aplicação fica disponível em:

```text
http://localhost:3000
```

Stack principal registrada no projeto:

```text
Next.js 16.2.11
React 19.2.8
TypeScript 6.0.3
Tailwind CSS 4.3.3
pnpm 11.9.0
Vitest 4.1.10
Zod 4.4.3
next-mdx-remote 6.0.0
Lucide React 1.25.0
Inter Variable
```

Antes de uma alteração relevante, confirme o estado do repositório:

```bash
git status
git branch --show-current
git rev-parse HEAD
git remote -v
```

Preserve alterações locais existentes e não descarte trabalho não relacionado à tarefa atual.

## Ambientes e branches

A governança vigente do projeto separa desenvolvimento de produção:

```text
godocs-docs
└── develop          desenvolvimento e validação

main                 produção
feature/editor       Editor E1 preservado e pausado
```

- `godocs-docs` é a pasta principal de trabalho.
- `develop` é a branch padrão de desenvolvimento.
- `main` é reservada para versões aprovadas de produção e não deve ser usada como branch de desenvolvimento contínuo.
- Alterações são implementadas e validadas em `develop`; somente versões aprovadas devem ser promovidas para `main`.
- `develop` e `main` podem possuir SHAs diferentes para o mesmo conjunto aprovado de alterações.
- `feature/editor` preserva o trabalho do Editor E1 e continua pausada. Não retome, integre ou altere essa frente sem autorização explícita.
- A antiga organização com `godocs-docs` em `main` e um worktree separado `godocs-docs-dev` em `develop` pertence ao histórico e não representa mais o fluxo operacional vigente.

O remoto oficial mais recente informado para o projeto é o **Bitbucket**. O GitHub pode existir como histórico ou snapshot auxiliar, mas não deve substituir o estado confirmado do repositório oficial.

Ao alternar entre computadores, a continuidade deve vir do mesmo repositório e da mesma branch de trabalho, não do caminho físico da pasta. Antes de começar em outra máquina, confirme remote, branch e working tree e sincronize a branch seguindo o fluxo Git vigente.

Não faça `push`, merge, promoção ou deploy sem confirmar a branch e o ambiente de destino.

## Configuração local e serviços externos

Arquivos `.env*` reais devem permanecer locais e ignorados pelo Git. Somente exemplos sem valores sensíveis podem ser versionados.

O baseline atual da documentação não exige Supabase para a execução local normal. O Supabase faz parte da frente futura do Editor, que continua pausada.

Enquanto o Editor estiver pausado:

- não crie ou configure projeto Supabase por causa dessa frente;
- não execute migrations;
- não execute bootstrap de `owner`;
- não crie usuários fictícios em ambiente real;
- não altere secrets;
- não introduza dependências exclusivas do Editor no baseline principal.

O Vercel continua sendo utilizado no fluxo de publicação. `main` representa produção no fluxo vigente, mas qualquer alteração de configuração, secrets, domínio, pipeline ou integração entre repositório e Vercel deve ser feita somente após confirmar o estado atual do ambiente.

Não assuma que um `push` representa automaticamente um deploy concluído. Quando for necessário confirmar uma publicação, verifique a associação entre commit, deployment, target e estado do Vercel.

O Notion, quando utilizado, funciona como ferramenta interna de autoria e organização. A documentação pública só muda quando o conteúdo correspondente é versionado no repositório e publicado pelo fluxo oficial.

## Adicionar um documento

Crie um arquivo `.md` ou `.mdx` dentro de `content/docs/`.

Não existe registro manual separado: o loader local descobre os arquivos e a coleção normalizada alimenta rotas, home, hubs, sidebar, drawer, breadcrumbs, busca, sumário, paginação, Related, sitemap e metadados.

Todo documento precisa usar o contrato de frontmatter aceito pelo schema:

```yaml
---
title: Título da página
description: Descrição curta da página.
cardDescription: Descrição curta opcional para cards.
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
updatedAt: 2026-09-10
version: GoDocs 4
permission: Permissão opcional
related:
  - funcionalidades/visao-geral
---
```

Regras principais:

- `title`, `description`, `slug`, `pageType` e `order` são obrigatórios.
- `cardDescription` é opcional e permite uma descrição mais curta para cards e superfícies de navegação; quando não existe, a implementação usa `description`.
- `pageType` aceita somente `hub`, `task` ou `reference`. Ele registra a função editorial da página e não deve ser inferido apenas pela existência de filhos.
- `section`, quando utilizada, define o agrupamento de primeiro nível por `id`, `label`, `description`, `entrySlug` e `order`.
- `navTitle` é opcional e fornece um título curto para navegação; o artigo continua usando `title`.
- `ancestors` descreve todos os níveis anteriores de um slug aninhado. Os segmentos devem corresponder exatamente ao slug e o schema atual aceita no máximo dois níveis anteriores.
- `keywords` é opcional e contribui para a relevância da busca.
- `status` aceita `published` ou `draft`. Apenas documentos publicados entram na experiência pública.
- `availability` aceita `available` ou `coming-soon`. Use `coming-soon` somente para uma página publicada que precise permanecer navegável e identificada como conteúdo em preparação.
- `updatedAt` é opcional e usa `YYYY-MM-DD`.
- `version` e `permission` são metadados editoriais opcionais.
- `related` é opcional, manual e aceita no máximo quatro slugs. Os destinos devem existir, estar publicados, ser distintos, não apontar para a própria página e não repetir a navegação anterior/próxima.
- `order` é um inteiro não negativo utilizado na navegação e na paginação.
- `slug` usa segmentos em minúsculas, números e hífens, sem barras nas extremidades. Por exemplo, `configuracao/perfis` gera `/docs/configuracao/perfis`.
- slugs duplicados, taxonomia divergente, ancestors incompatíveis, Related inválido ou outros metadados inválidos interrompem a validação/build.
- o `h1` principal vem do frontmatter; o corpo do artigo deve começar em `##` para manter um único `h1` por página.

O corpo aceita Markdown e MDX. Os componentes permitidos incluem:

```text
Callout
Info
Tip
Warning
Steps
Step
Requirements
Permissions
ExpectedResult
KeyboardShortcut
RelatedLinks
Figure
CodeBlock
```

Use esses componentes somente quando melhorarem a compreensão. Não transforme páginas simples em uma coleção desnecessária de boxes.

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

Coloque imagens da documentação em `public/docs/`.

`Figure` também suporta propriedades opcionais como:

```mdx
<Figure
  src="/docs/exemplo-instrutivo.png"
  alt="Descrição objetiva da etapa apresentada"
  width={1440}
  height={900}
  size="instructional"
  zoom={true}
/>
```

- `size="instructional"` usa uma apresentação mais compacta, adequada a imagens de tutorial.
- `zoom` é `true` por padrão e pode ser desativado quando a ampliação não fizer sentido.
- a imagem ampliada usa um diálogo acessível.

Não publique capturas com dados privados, segredos, informações reais de clientes, marcas de ambiente desnecessárias ou conteúdo que não possa fazer parte da documentação final.

## Organização e ordenação

Os arquivos podem ser organizados em subpastas para facilitar manutenção, mas a URL pública é definida pelo `slug`, não pelo caminho físico do arquivo.

`section` organiza o primeiro nível e `ancestors` descreve os níveis anteriores de slugs aninhados. A profundidade atual do schema aceita no máximo dois ancestors.

Home, hubs, sidebar, drawer, breadcrumbs, busca, TOC, paginação e Related devem continuar consumindo a mesma coleção de conteúdo.

### Hubs

Páginas que funcionam como hubs devem usar explicitamente:

```yaml
pageType: hub
```

Hubs de domínio com páginas-filhas seguem o padrão editorial aprovado:

```text
H1 + resumo
→ conteúdo conceitual
→ informações ou requisitos relevantes
→ Conceitos importantes, quando existir
→ cards compactos das páginas-filhas
→ paginação
```

Os cards ficam no final do conteúdo do hub. Eles auxiliam descoberta e orientação; a sidebar permanece a navegação persistente.

### URLs, slugs e compatibilidade

URLs e anchors publicados são contratos públicos. Não renomeie slugs, headings usados como destino ou aliases históricos sem verificar o impacto e a arquitetura correspondente.

O redesign preserva atualmente:

```text
Documentos: 30 aliases/anchors
Workflows: 49 aliases/anchors
Total: 79
```

Aliases de compatibilidade não devem aparecer como resultados duplicados da busca.

### Busca e Related

A busca do GoDocs Docs é diferente da funcionalidade **Busca Inteligente** do próprio GoDocs.

A busca da documentação permanece local e determinística, com índice estático. O contrato atual preserva:

```text
máximo de 12 resultados
snippet de 220 caracteres
até 3 resultados por documento canônico
```

Não introduza IA, embeddings ou outro mecanismo de busca sem uma decisão arquitetural específica.

`related` representa navegação contextual manual. Não deve ser gerado automaticamente por similaridade ou IA, nem listar automaticamente todos os filhos de um hub.

## Validação

Durante o desenvolvimento, execute as validações correspondentes ao impacto da alteração.

### Código TypeScript, componentes ou lógica

```bash
pnpm lint
pnpm typecheck
pnpm test
```

### Conteúdo, MDX, frontmatter, links, assets ou taxonomia

```bash
pnpm content:validate
```

### Busca, ranking ou indexação

```bash
pnpm search:benchmark
```

### Dependências

```bash
pnpm audit:prod
```

### Alterações com impacto no build ou publicação

```bash
pnpm build
```

Quando a mudança atravessar mais de uma categoria, combine as validações aplicáveis.

Antes de publicar uma alteração relevante, a verificação completa disponível é:

```bash
pnpm audit:prod
pnpm content:validate
pnpm search:benchmark
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`content:validate` compila Markdown/MDX e verifica, entre outros pontos:

- frontmatter;
- taxonomia;
- componentes MDX permitidos;
- links internos;
- fragments H2/H3/H4;
- aliases de compatibilidade;
- Related;
- assets locais.

`search:benchmark` registra de forma determinística documentos, entradas de página/seção, payload, limite, snippet e consultas de referência da busca.

O build deve continuar funcionando quando `content/docs/` contém apenas o arquivo `.gitkeep`.

Para mudanças visuais, além dos comandos aplicáveis:

- execute a aplicação;
- inspecione a interface renderizada;
- valide desktop, notebook, tablet e celular;
- valide temas claro e escuro;
- teste mouse e teclado;
- verifique foco;
- verifique dialogs/drawers quando afetados;
- verifique console e overflow;
- respeite `prefers-reduced-motion`;
- compare a implementação com `DESIGN.md` e as referências aplicáveis.

Não declare lint, testes, build, deploy ou ausência de regressão como aprovados sem ter executado ou confirmado a validação correspondente.
