# GoDocs Docs — Memória consolidada

> **Última consolidação:** 21/08/2026
> **Estado geral:** Lotes 1, 2, 3 e 4 concluídos; a próxima frente é o Lote 5 — Discovery / consolidação.
> **Última implementação funcional aprovada:** `5c8a7c` — `Implementacao do Lote 4`.

## Estado atual

O Lote 4 — Busca está concluído. O checkpoint funcional é `5c8a7c120aba1d6afd323621a7ec186776178bd6`; a correção posterior de infraestrutura `5b69be4e0fb08ceb4832f6f8973bd8c2886ada38` exclui `.agents/skills/**` do lint da aplicação e não substitui o SHA funcional da busca. `HEAD` e `origin/main` estavam alinhados em `5b69be4` antes deste fechamento documental. A associação desses SHAs a um deployment específico da Vercel não é inferida.

**Estado atual em uma frase:** Documentos e Workflows preservam compatibilidade histórica de `30/30` e `49/49`; a busca local determinística foi consolidada com diversidade por documento, stopwords conservadoras e baseline de `242/242` testes.

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

## Baseline técnico final do Lote 4

```text
content:validate: 21 documentos válidos
lint: 0 erros; 0 warnings
typecheck: aprovado
test: 20 arquivos, 242/242 testes
build: 50 páginas estáticas
search: 148 entradas, 127 seções, 252741 rawBytes, 29706 gzipBytes
search: limite de 12 resultados e snippet de 220 caracteres
git diff --check: aprovado
```

Workflows mantém `49/49` aliases e Documentos `30/30`; SEO, sitemap, navegação e conteúdo público não sofreram alteração no Lote 4.

## Roadmap

```text
Lote 0   ✅
Lote 0.1 ✅
Lote 1   ✅
Lote 2   ✅
Lote 3   ✅
Lote 4   ✅
Lote 5   próxima frente
Lote 6   pendente
Lote 7   pendente
Lote 8   pendente
Lote 9   pendente
```

## Próximo marco

```text
Lote 4 concluído e versionado
↓
fechamento documental
↓
Lote 5 — Discovery / consolidação
```

UI UX PRO MAX está instalada e foi utilizada pontualmente no Lote 4. Ela não substitui `DESIGN.md` nem constitui um Design System paralelo; seu uso no Lote 5 permanece opcional e condicionado a ganho real.

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

## Retomada segura

Antes do Lote 5, confirmar o estado Git e a prioridade aprovada. Tratar MDX como fonte de rotas, navegação, breadcrumbs, busca, sitemap e geração estática; preservar alterações locais não relacionadas. A busca do Lote 4 é baseline consolidado e não deve receber mudanças fora de escopo.
