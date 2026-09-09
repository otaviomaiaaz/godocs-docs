# GoDocs Docs — Memória consolidada

> **Última consolidação:** 09/09/2026
> **Estado geral:** Lotes 0–5 concluídos; Lote 6 em andamento. `develop` é a branch padrão de desenvolvimento e `main` é reservada à produção. O Editor E1 permanece preservado e pausado em `feature/editor`.
> **Baseline atual de desenvolvimento confirmado:** `1d392c18360d7535ddbdce7452880356bc5a6671` — `Finaliza background responsivo e estabilidade das logos`.
> **Baseline atual de produção confirmado:** `07635a6d1fa8480bebec0e485ef85c4f8e451d89` — `Finaliza background responsivo e estabilidade das logos`.
> **Snapshot preservado do E1:** `be80a03` — `Editor - Preserva implementação inicial E1`.

## Governança atual de ambientes

A governança vigente foi atualizada em 01/09/2026.

- A pasta principal de trabalho voltou a ser `godocs-docs`.
- A branch padrão de desenvolvimento é `develop`.
- `main` é reservada para produção e não deve ser usada como branch de desenvolvimento contínuo.
- Alterações são desenvolvidas e validadas em `develop`; somente versões aprovadas são promovidas para `main`.
- Como `develop` e `main` possuem históricos próprios, uma promoção pode gerar SHAs diferentes para o mesmo conjunto aprovado de alterações.
- `feature/editor` continua preservando o snapshot do Editor E1 e permanece pausada. O E1 não foi reintegrado ao fluxo atual.
- Supabase, migrations, bootstrap de owner e demais pendências do Editor continuam fora do escopo imediato e só devem ser retomados quando o Editor for explicitamente reaberto.

### Histórico da reorganização de 28/08/2026

A configuração registrada em 28/08/2026 usava `main` como base da pasta `godocs-docs`, `develop` em uma pasta/worktree irmã `godocs-docs-dev` e `feature/editor` isolada. Esse arranjo foi importante para preservar o E1 durante a separação inicial entre produção e desenvolvimento, mas **não representa mais o fluxo operacional vigente** após a decisão de 01/09/2026.

O baseline remoto então confirmado era:

```text
ee9b6b1 — Corrige configuração do pnpm no Vercel
```

A reorganização de 28/08 foi feita sem integrar o E1 em produção, sem migration em produção e sem bootstrap de owner.


### Registro histórico preservado — 28/08/2026

Na consolidação de 28/08/2026, o estado registrado era:

- `main` como produção e sem o E1, com a pasta `godocs-docs` associada àquela branch;
- `develop` como base estável de desenvolvimento, então alinhada à `main` e sem o E1, usando a pasta/worktree irmã `godocs-docs-dev`;
- `feature/editor` contendo o snapshot integral do E1, pausado e sem integração em `develop`;
- funcionalidades futuras e independentes previstas para nascer em `feature/*` a partir de `develop`, com promoção isolada para `main` somente após aprovação;
- Supabase, migrations, usuários fictícios, bootstrap e variáveis Preview do Editor fora das pendências imediatas;
- reorganização local sem push, deploy, alteração de secrets externos, migration em produção ou bootstrap de owner.

Esse registro é mantido como histórico. Onde ele conflita com a governança definida em 01/09/2026 — especialmente pasta principal, branch padrão e uso do worktree `godocs-docs-dev` — prevalece a governança atual descrita acima.

## Estado atual

O histórico dos lotes editoriais, de busca, navegação e refinamento visual permanece preservado.

Em 01/09/2026, o GoDocs Docs passou a ser tratado como a documentação que integrará oficialmente o GoDocs, reforçando a necessidade de manter `develop` como ambiente de evolução e `main` somente para versões aprovadas de produção.

O Lote 5 — Discovery / Consolidação foi concluído no commit `34ffcb9eae1c155b66f07abc7efa2cdb68195471`. Desde então, o projeto avançou para o Lote 6, que concentra evolução visual e de interação sem reconstruir a arquitetura documental existente.

O baseline `ee9b6b1` continua preservado como referência histórica do período anterior ao avanço do Lote 6; não deve ser confundido com o baseline atual de produção.

**Estado atual em uma frase:** Documentos e Workflows preservam compatibilidade histórica de `30/30` e `49/49`; a busca local determinística e Related permanecem preservados pelo baseline do Lote 5; o Lote 6 já consolidou paleta, cards/Home, Sidebar V2.5 e Background + Logo, e a próxima intervenção é o polish final de interação da Sidebar.

## Lote 6 — estado consolidado até 09/09/2026

### Paleta

A paleta **A2 Contrast Refined** foi implementada e aprovada.

Referência de produção registrada:

```text
ad0212eb65d72ef4272ba269d995962350e6cdb7
Implementa paleta A2 Contrast Refined
```

Direção preservada:

- light canvas `#f6f7f9`;
- dark canvas `#151515`;
- navegação `#1a1a1a`;
- cards `#202020`;
- superfícies interativas `#262626`;
- superfícies elevadas `#2c2c2c`;
- laranja `#ff7600` no claro e `#ff7a1a` no escuro;
- sem tendência azulada.

A paleta está congelada para a rodada atual da Sidebar.

### Sidebar V2.5 estabilizada

A Sidebar V2.5 foi implementada e promovida para produção.

Referências:

```text
develop:
861a502c01f519601744bf840d708ca47aa4a317
Implementa Sidebar V2.5 e estabilização final

main:
fa3ff62e9f800b21fb55d09db5f29090497a8b64
Implementa Sidebar V2.5 e estabilização final
```

Baseline preservado da V2.5:

- uma única `NavigationTree` compartilhada;
- `expanded = 240px`;
- `collapsed = 48px`;
- `preview = 240px`;
- Sidebar em `left: 0`;
- geometria vertical estabilizada;
- shell editorial estável;
- preview sem mover ou cobrir o artigo;
- TOC estável;
- hub navegável com chevron separado;
- independência entre `active` e `open`;
- drawer mobile preservado;
- acessibilidade, teclado e reduced motion preservados;
- sem nova dependência de motion/UI.

Baseline de motion auditado após a estabilização:

```text
hover intent: 130ms
preview close: 240ms
width open: 195ms
width close: 185ms
reveal start: 85ms
reveal duration: 95ms
opacity: .35 → 1
translateX: -4px → 0
cascade: até 9ms por item / até 85ms total
branch: 180ms geometry / 125ms opacity / 7ms child stagger
toggle: 120ms
```

### Pendências reais da Sidebar após a V2.5

Após validação visual, permaneceram somente três problemas para a rodada final:

1. **hover preview intermitente** — em algumas entradas no rail collapsed, a preview não abre;
2. **inset esquerdo insuficiente** — os itens expanded/preview precisam de maior respiro interno à esquerda;
3. **motion com percepção de delay/travamento** — a interação ainda pode parecer pesada ou fragmentada mesmo com timings nominais curtos.

Foi identificada uma hipótese técnica para o hover intermitente relacionada ao tratamento de `pointerenter` e à área de intenção no `aside`, mas essa hipótese **ainda precisa ser reproduzida e confirmada no navegador antes de qualquer correção**.

O prompt canônico da próxima implementação foi consolidado como:

```text
Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md
```

Esse prompt trata a Sidebar atual como componente estabilizado e limita a próxima rodada aos três pontos acima, com regression guards de geometria, acessibilidade, responsividade, shell editorial, light/dark e reduced motion.

### Background + Logo — concluído e publicado

O background oficial da Home e as logos GoDocs Client foram implementados, refinados, validados visualmente e promovidos para produção.

Primeira implementação do background:

```text
develop:
50435b44dabf583d7cf4f928ae0b277082ea71d8
Implementa background oficial da Home

main:
0630b6067ef54b492e971cd4f7a664cb712a14f9
Implementa background oficial da Home
```

Refinamento de Background + Logo:

```text
develop:
a2a88df49aaffdd281ac9d3a170c47e95966a227
Refina background da Home e atualiza logos

main:
430d269
Refina background da Home e atualiza logos
```

Correção final responsiva e de estabilidade das logos:

```text
develop:
1d392c18360d7535ddbdce7452880356bc5a6671
Finaliza background responsivo e estabilidade das logos

main:
07635a6d1fa8480bebec0e485ef85c4f8e451d89
Finaliza background responsivo e estabilidade das logos
```

O deployment de produção correspondente ao commit `07635a6d1fa8480bebec0e485ef85c4f8e451d89` foi confirmado como `READY`.

Decisão final:

- Background + Logo estão aprovados;
- não criar uma V3 sem um problema visual novo e comprovado;
- Home, background e logos ficam congelados durante o polish da Sidebar.

Validação técnica reportada na correção final:

```text
283 testes aprovados
59 testes focados aprovados
typecheck aprovado
lint aprovado
build aprovado
content:validate aprovado
git diff --check aprovado
```

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
Lote 6   em andamento
Lote 7   pendente
Lote 8   pendente
Lote 9   pendente
```

No Lote 6, paleta, cards/Home, Sidebar V2.5 e Background + Logo já passaram por implementação e validações próprias. O próximo escopo focal é **Sidebar V2.5 Final Interaction Polish**.

## Próximo marco

```text
Sidebar V2.5 Final Interaction Polish
↓
corrigir hover preview intermitente
↓
ajustar inset esquerdo dos itens expanded/preview
↓
refinar perceived motion sem regressão
↓
validação técnica + Impeccable
↓
validação visual humana
↓
versionar/promover somente após aprovação
```

O Editor permanece preservado e pausado em `feature/editor`. Supabase e E1 continuam fora do escopo até autorização explícita de retomada.

UI UX PRO MAX está instalada e foi utilizada pontualmente no Lote 4. Ela não substitui `DESIGN.md` nem constitui um Design System paralelo. O uso de Impeccable continua previsto como auditoria focal nas rodadas de refinamento do Lote 6.

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
| 28/08/2026 | Editor E1 preservado em `feature/editor` e separado do fluxo principal. |
| 01/09/2026 | `godocs-docs` voltou a ser a pasta principal e `develop` passou a ser a branch padrão de desenvolvimento; `main` ficou reservada à produção. |
| `ad0212e` | Paleta A2 Contrast Refined promovida para produção. |
| `fa3ff62` | Sidebar V2.5 promovida para produção. |
| `0630b60` | Background oficial da Home promovido inicialmente para produção. |
| `430d269` | Refinamento de Background + Logo promovido para `main`. |
| `07635a6` | Correção final responsiva do background e estabilidade das logos promovida para produção; deployment confirmado como `READY`. |
| 09/09/2026 | Prompt canônico `Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md` consolidado para a próxima rodada. |

## Retomada segura

Antes de iniciar a próxima implementação:

1. trabalhar em `godocs-docs`;
2. confirmar branch `develop`;
3. verificar `git status`, `git diff` e qualquer WIP existente;
4. tratar os SHAs `1d392c1` e `07635a6` como baselines auditados, não como obrigação de HEAD se houver apenas avanço documental posterior;
5. preservar Background, Logo, Home, paleta, conteúdo editorial, URLs e arquitetura do TOC;
6. usar `Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md` como contrato da rodada;
7. não reconstruir a Sidebar;
8. limitar a implementação a hover preview, inset esquerdo e perceived motion;
9. validar geometria, acessibilidade, responsividade, reduced motion, light/dark e 30+ ciclos válidos de hover;
10. não fazer commit, push ou deploy antes da validação humana prevista no prompt.

Tratar MDX como fonte de rotas, navegação, breadcrumbs, busca, sitemap e geração estática; preservar alterações locais não relacionadas. Related permanece manual, factual e limitado a contextos aprovados; a busca do Lote 4 continua preservada pelo baseline técnico do Lote 5.
