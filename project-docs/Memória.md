# GoDocs Docs — Memória consolidada

> **Última consolidação:** 19/08/2026  
> **Estado geral:** Lotes 1, 2 e 3 concluídos; a próxima frente é o Lote 4 — Busca.
> **Última implementação aprovada:** `415a113` — `Revisão dos workflows`.

## Estado atual

O Lote 3 — Workflows está concluído e versionado em `415a113936b776dc65d73b58f343426680327af8`. A associação desse SHA a um deployment específico da Vercel não foi confirmada; é válido registrar apenas que a validação visual manual foi realizada no ambiente publicado.

**Estado atual em uma frase:** os hubs de Documentos e Workflows estão concluídos; Workflows possui hub, sete páginas-filhas, `Explore Workflows`, compatibilidade histórica `49/49` e baseline técnico de `233/233` testes.

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

## Baseline técnico final do Lote 3

```text
content:validate: 21 documentos válidos
lint: 0 erros; 151 warnings preexistentes em .agents/skills/impeccable
typecheck: aprovado
test: 20 arquivos, 233/233 testes
build: 50 páginas estáticas
search: 148 entradas, 127 seções, 252741 rawBytes, 29706 gzipBytes
search: limite de 12 resultados e snippet de 220 caracteres
git diff --check: aprovado
```

O algoritmo, os pesos, o limite e o snippet da busca não foram alterados pelo Lote 3. A evolução da busca continua pertencendo ao Lote 4.

## Roadmap

```text
Lote 0   ✅
Lote 0.1 ✅
Lote 1   ✅
Lote 2   ✅
Lote 3   ✅
Lote 4   pendente
Lote 5   pendente
Lote 6   pendente
Lote 7   pendente
Lote 8   pendente
Lote 9   pendente
```

## Próximo marco obrigatório

```text
Lote 3 concluído e versionado
↓
fechamento documental
↓
instalar UI UX PRO MAX
↓
Lote 4 — Busca
```

UI UX PRO MAX ainda não foi instalada. Ela não substitui `DESIGN.md` nem constitui um Design System paralelo.

## Cronologia relevante

| Referência | Marco |
| --- | --- |
| `eec705e` | Fechamento documental do Lote 2. |
| `d5e5251` | Primeira implementação versionada do Lote 3. |
| Auditoria e correção focal | Três detalhes editoriais foram recuperados e contratos de teste foram fortalecidos. |
| Validação visual | Identificou a ausência de `Explore Workflows` no hub. |
| `415a113` | Derivação genérica dos filhos de hubs corrigida; `Explore Workflows` passou a renderizar e o Lote 3 foi aprovado. |

## Retomada segura

Antes do Lote 4, confirmar o estado Git e instalar UI UX PRO MAX. Tratar MDX como fonte de rotas, navegação, breadcrumbs, busca, sitemap e geração estática; preservar alterações locais não relacionadas. A busca é a próxima frente e não deve ser antecipada por mudanças não aprovadas.
