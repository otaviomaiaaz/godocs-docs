# GoDocs Docs — Memória consolidada

> **Última consolidação:** 28/08/2026
> **Estado geral:** produção e desenvolvimento separados; E1 preservado somente no fluxo de desenvolvimento.
> **Baseline remoto de produção confirmado:** `ee9b6b1` — `Corrige configuração do pnpm no Vercel`.
> **Snapshot local do E1:** `be80a03` — `Editor - Preserva implementação inicial E1`.

## Separação consolidada de ambientes

- `main` é produção e permanece sem o E1. A pasta `godocs-docs` fica associada a essa branch.
- `feature/editor` contém o snapshot integral do E1 e recebe a continuação funcional do Editor.
- `develop` é integração/testes e recebe o E1 por merge rastreável. A pasta irmã `godocs-docs-dev` é o worktree de desenvolvimento.
- Funcionalidades futuras nascem em `feature/*`; somente mudanças aprovadas são promovidas isoladamente para `main`.
- Supabase Production e Supabase Development são projetos separados. Migrations, usuários fictícios, owner de teste e operações mutáveis do Editor permanecem em Development até aprovação específica.
- Vercel Production acompanha `main`; `develop` e `feature/*` usam Preview/Staging com variáveis próprias de desenvolvimento.
- Esta reorganização é local: não houve push, deploy, alteração de secrets externos, migration em produção nem bootstrap de owner.

Pendências externas: criar/configurar Supabase Development, aplicar ali a migration `202608280001_identity_and_access.sql`, criar um usuário fictício e executar o bootstrap controlado, configurar variáveis Preview do Vercel e confirmar no painel que a Production Branch é `main`.

## Estado atual

O histórico dos lotes editoriais e visuais permanece preservado. O Lote 5 — Discovery / Consolidação foi concluído no commit `34ffcb9eae1c155b66f07abc7efa2cdb68195471`; depois dele, os lotes visuais e o E0 chegaram ao baseline `ee9b6b1`. A associação desse SHA a um deployment específico da Vercel não é inferida.

**Estado atual em uma frase:** Documentos e Workflows preservam compatibilidade histórica de `30/30` e `49/49`; a busca local determinística mantém diversidade por documento e baseline de `250/250` testes, enquanto Related conecta somente contextos editoriais não sequenciais.

## Workflows concluído

```text
Workflows
├── Cards, Kanban e Lista
├── Automações
├── Criar e configurar
├── Fases e transições
├── Formulários e campos
├── Membros e papéis
└── Formulário público e acompanhamento
```

O hub `/docs/funcionalidades/workflows` usa `pageType: hub`; as sete filhas usam `pageType: task`. Depois da introdução, dos conceitos importantes e da integração via API, o hub apresenta `Explore Workflows` antes da paginação para `Cards, Kanban e Lista`.

Os cards derivam da coleção canônica. Em desktop, a grade tem duas colunas e o último item ímpar ocupa a largura total; em mobile, todos os cards usam uma coluna. A regra do último card é genérica para hubs com número ímpar de filhos.

Durante a validação, foi corrigida uma integração: `DocPage` derivava filhos somente para Documentos. Hubs aninhados passaram a derivar filhos diretos por segmentos, hierarquia e `order`, preservando Documentos e permitindo a renderização de Workflows. A rota real de Workflows tem teste de regressão para `Explore Workflows`, seus sete destinos e sua ordem.

Uma auditoria editorial comparou o artigo original (3.895 palavras) com a estrutura final (~3.234 palavras). A redução de ~661 palavras (~17%) foi aceita por redistribuição, remoção de repetição e separação por intenção; não há perda funcional conhecida. Foram recuperados o menu de três pontos do card, a descrição da fase como orientação no Kanban e a divisão funcional do Formulário inicial.

## Navegação, compatibilidade e validação

- Sidebar e drawer usam a mesma `NavigationTree`; o ramo Workflows abre na navegação relevante, pode ser recolhido manualmente e mantém estado ativo independente do expandido.
- Breadcrumbs: `Funcionalidades > Workflows` no hub e `Funcionalidades > Workflows > Página-filha` nas filhas.
- Paginação: Workflows → Cards, Kanban e Lista → Automações → Criar e configurar → Fases e transições → Formulários e campos → Membros e papéis → Formulário público e acompanhamento. A última filha não possui próxima página.
- Compatibilidade: Workflows `49/49`; Documentos `30/30`. O alias `#dúvidas-e-situações-comuns` resolve para `/docs/funcionalidades/workflows#como-um-workflow-funciona`.
- Validação visual manual aprovada em desktop dark/light e mobile dark, incluindo hub, cards, sidebar/drawer, TOC e paginação; não houve overflow horizontal identificado.

## Lote 4 — Busca concluído

- A arquitetura da busca permaneceu local e determinística: índice estático, normalização de acentos, matching por palavras/prefixos, pesos e campos pesquisados foram preservados.
- O ranking completo é calculado antes da diversidade; cada documento canônico (href sem fragmento) pode contribuir com no máximo três resultados, e a busca continua pelos candidatos elegíveis até o limite final de 12.
- Stopwords permanecem conservadoras. `sem` foi removido da lista após revisão focal, preservando intenções como `sem login` e `enviar solicitação sem login`; `com`, `pode` e `ou` permaneceram por falta de evidência contrária no corpus.
- Consultas somente com stopwords retornam zero resultados sem ranking arbitrário nem listbox indevido. Resultados identificam `Página` ou `Seção`, e o estado vazio orienta uma nova tentativa.
- Teclado, foco, ARIA, responsividade e os temas claro/escuro foram preservados. A validação visual da busca incluiu `sem login` e `enviar solicitação sem login`.
- UI UX PRO MAX foi usada apenas de modo consultivo para acessibilidade, teclado, responsividade e estado vazio; não substituiu `PRODUCT.md`, `DESIGN.md`, `REDESIGN_ARCHITECTURE.md` ou a arquitetura existente.

## Baseline técnico final do Lote 5

```text
content:validate: 21 documentos válidos
lint: 0 erros; 0 warnings
typecheck: aprovado
test: 20 arquivos, 250/250 testes
build: 50 páginas estáticas
search: 147 entradas, 126 seções, 250639 rawBytes, 29456 gzipBytes
search: limite de 12 resultados e snippet de 220 caracteres
git diff --check: aprovado
```

Workflows mantém `49/49` aliases e Documentos `30/30`; SEO, sitemap, navegação e conteúdo público não sofreram alteração estrutural no Lote 5. Em comparação com o baseline do Lote 4 (`148` entradas e `127` seções), a redução para `147` e `126` decorre da remoção editorial intencional do heading manual `Próximos passos`, sem mudança no algoritmo da busca.

## Lote 5 — Related / Próximos Passos concluído

- `related` é opcional; omitido e `[]` são válidos. Quando usado, aceita de 1 a 4 destinos distintos, sem autorreferência, somente existentes e publicados.
- A validação reutiliza `getAdjacentDocs()` de `lib/docs/navigation.ts` sobre a coleção publicada para bloquear previous/next; não há algoritmo paralelo e drafts não contaminam a paginação pública.
- Curadoria inicial: `O que é o GoDocs? → Visão Geral`; `Visão Geral → Documentos, Favoritos`; `Logs e ações → Favoritos`. São 3 páginas, 4 relações e 0 relações automáticas.
- O bloco manual `Próximos passos` de `O que é o GoDocs?` foi migrado com a paginação preservando `Primeiro Acesso` e Related apontando para `Visão Geral`. `RelatedLinks` permaneceu definido, sem uso nos MDX publicados, como observação não bloqueante.
- A revisão focal encontrou dois P2 de cobertura, ambos corrigidos antes do commit: draft intercalado não altera a próxima página pública; relação contextual válida é aceita; e o schema cobre explicitamente 1 e 4 relações. Permanecem dois P3 não bloqueantes: teste de Tab completo e reavaliação futura de `RelatedLinks`.

## Roadmap

```text
Lote 0   ✅
Lote 0.1 ✅
Lote 1   ✅
Lote 2   ✅
Lote 3   ✅
Lote 4   ✅
Lote 5   ✅
Lote 6   próxima frente
Lote 7   pendente
Lote 8   pendente
Lote 9   pendente
```

## Próximo marco

```text
separação local concluída
↓
configurar Supabase Development e variáveis Preview do Vercel
↓
validar o E1 em Preview sem alterar produção
```

UI UX PRO MAX está instalada e foi utilizada pontualmente no Lote 4. Ela não substitui `DESIGN.md` nem constitui um Design System paralelo; decisões visuais detalhadas permanecem reservadas ao Lote 6 e ao `DESIGN.md`.

## Cronologia relevante

| Referência | Marco |
| --- | --- |
| `eec705e` | Fechamento documental do Lote 2. |
| `d5e5251` | Primeira implementação versionada do Lote 3. |
| Auditoria e correção focal | Três detalhes editoriais foram recuperados e contratos de teste foram fortalecidos. |
| Validação visual | Identificou a ausência de `Explore Workflows` no hub. |
| `415a113` | Derivação genérica dos filhos de hubs corrigida; `Explore Workflows` passou a renderizar e o Lote 3 foi aprovado. |
| `5c8a7c` | Checkpoint funcional do Lote 4 — Busca, utilizado na validação visual. |
| Revisão focal do Lote 4 | `sem` preservado como termo semântico; cobertura de stopwords e diversidade fortalecida. |
| `5b69be4` | Infraestrutura: Flat Config do ESLint passou a ignorar exclusivamente `.agents/skills/**`. |
| `34ffcb9` | Implementação do Lote 5: Related / Próximos Passos curado, contrato validado e P2 de testes corrigidos antes do commit. |

## Retomada segura

Antes do Lote 6, confirmar o estado Git e a prioridade aprovada. Tratar MDX como fonte de rotas, navegação, breadcrumbs, busca, sitemap e geração estática; preservar alterações locais não relacionadas. Related permanece manual, factual e limitado a contextos aprovados; a busca do Lote 4 continua preservada pelo baseline técnico do Lote 5.
