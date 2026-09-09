# GoDocs Docs — Daily Stats

> Acompanhamento operacional do projeto **GoDocs Docs**.
>
> **Última atualização:** 09 de setembro de 2026 (UTC−03:00)
> **Estado geral:** Lotes 0–5 concluídos; Lote 6 em andamento. `develop` é a branch padrão de desenvolvimento; `main` é reservada à produção. O Editor E1 permanece preservado e pausado em `feature/editor`.
> **Fase atual:** Lote 6 — próxima intervenção focal: **Sidebar V2.5 Final Interaction Polish**.
> **Baseline de desenvolvimento auditado:** `1d392c18360d7535ddbdce7452880356bc5a6671` — `Finaliza background responsivo e estabilidade das logos`.
> **Produção confirmada:** `07635a6d1fa8480bebec0e485ef85c4f8e451d89` — `Finaliza background responsivo e estabilidade das logos`; deployment Vercel confirmado como `READY`.
> **Snapshot preservado do E1:** `be80a03` — `Editor - Preserva implementação inicial E1`.
> **Próxima ação principal:** executar a Sidebar V2.5 Final Interaction Polish em `develop`, usando o prompt canônico consolidado, sem reabrir Home, Background, Logos, paleta ou outros escopos congelados.

---

## 1. Função deste arquivo

O `daily_stats.md` é o **retrato operacional atual do projeto**.

Ele deve permitir entender rapidamente:

- onde o projeto está;
- o que já foi concluído;
- o que está em andamento;
- quais decisões recentes alteram os próximos lotes;
- quais pendências ainda bloqueiam o próximo marco;
- qual é o último estado Git confirmado;
- qual é o estado conhecido do deploy;
- qual é a próxima ação recomendada.

Ele **não substitui a memória universal nem os documentos canônicos de produto, design ou arquitetura**.

### Divisão de responsabilidade

| Arquivo | Função |
|---|---|
| `project-docs/Memória.md` | Contexto universal e consolidado do projeto |
| `project-docs/daily_stats.md` | Estado operacional atual |
| `project-docs/REDESIGN_ARCHITECTURE.md` | Contrato e arquitetura-alvo do redesign |
| `AGENTS.md` | Regras de execução para agentes/Codex |
| `PRODUCT.md` | Definição do produto e princípios editoriais |
| `DESIGN.md` | Design System e decisões visuais canônicas |
| `README.md` | Execução, estrutura, conteúdo e comandos do repositório |
| `content/docs/` | Documentação pública em Markdown/MDX |

As conversas são ambiente de análise e trabalho. Decisões que precisem sobreviver ao histórico devem ser consolidadas nos arquivos apropriados.

---

## 2. Estado atual em uma visão

```text
PROJETO
GoDocs Docs

REPOSITÓRIO
otaviomaiaaz/godocs-docs

PASTA PRINCIPAL DE TRABALHO
godocs-docs

BRANCH PADRÃO DE DESENVOLVIMENTO
develop

BRANCH DE PRODUÇÃO
main

BASELINE DE DESENVOLVIMENTO AUDITADO
1d392c18360d7535ddbdce7452880356bc5a6671
Finaliza background responsivo e estabilidade das logos

PRODUÇÃO CONFIRMADA
07635a6d1fa8480bebec0e485ef85c4f8e451d89
Finaliza background responsivo e estabilidade das logos
Vercel: READY

EDITOR E1
feature/editor → be80a03, preservada e pausada

LOTE 1
Concluído e versionado

LOTE 2 — DOCUMENTOS
Concluído

LOTE 3 — WORKFLOWS
Concluído

LOTE 4 — BUSCA
Concluído

LOTE 5 — DISCOVERY / CONSOLIDAÇÃO
Concluído; SHA funcional 34ffcb9

LOTE 6
Em andamento

PALETA A2 CONTRAST REFINED
Implementada e aprovada

SIDEBAR V2.5
Implementada, estabilizada e promovida para produção
Próxima rodada: Final Interaction Polish

BACKGROUND + LOGO
Concluídos, aprovados e publicados em produção

COLEÇÃO / BASELINE DO LOTE 5
21 documentos, 147 entradas e 126 seções

FRENTE EDITORIAL PARALELA
Configurações — analisada/documentada em conversa; publicação MDX não confirmada

UI UX PRO MAX
Instalada e utilizada pontualmente

IMPECCABLE
Auditoria anterior encerrada; revisão focal prevista no polish final da Sidebar

PRÓXIMO PASSO
Sidebar V2.5 Final Interaction Polish em develop
```

### Observação sobre baselines e “publicado”

Os SHAs `1d392c1...` e `07635a6...` são baselines confirmados em 09/09/2026. O primeiro representa o estado de desenvolvimento auditado antes de novas atualizações documentais; o segundo foi confirmado em produção pela Vercel.

Snapshots históricos anteriores continuam válidos apenas para os marcos aos quais pertencem e não devem ser usados para inferir o estado operacional atual.

## 3. Contexto operacional do produto

O GoDocs Docs é uma aplicação de documentação independente para o GoDocs 4.

Direções consolidadas:

- substituir a dependência do Confluence como experiência principal de documentação;
- utilizar Markdown/MDX versionado como fonte pública;
- usar Notion apenas quando necessário na autoria/revisão interna;
- usar GitHub para versionamento;
- usar Vercel para publicação;
- manter o Codex como ferramenta principal de implementação;
- usar Confluence como referência do estado corporativo atual;
- usar Mintlify como benchmark de maturidade de documentação, sem copiar;
- usar a Landing Page do GoDocs 4 como referência de identidade, atmosfera e linguagem visual, sem copiar literalmente.

Princípio do redesign:

> **biblioteca operacional orientada por intenção**

Fluxo-alvo:

```text
Home
→ hub de domínio
→ página de tarefa ou referência
→ relacionados / próximos passos
```

Direção visual consolidada:

> **robusto na estrutura e clean na apresentação**

---

## 4. Repositório, Git e publicação

### Repositório

```text
otaviomaiaaz/godocs-docs
```

### Governança vigente

A partir de 01/09/2026:

| Item | Situação |
|---|---|
| Pasta principal | `godocs-docs` |
| Desenvolvimento | `develop` |
| Produção | `main` |
| Editor | `feature/editor`, E1 preservado e pausado |
| Deploy | Vercel |
| Conteúdo | Markdown/MDX local |
| CMS público | Não |
| Supabase / Editor | fora do escopo imediato enquanto o Editor estiver pausado |

Fluxo atual:

```text
develop
→ implementação / protótipo / validação
→ aprovação
→ promoção isolada para main
→ produção
```

`main` não deve ser usada como branch de desenvolvimento contínuo.

A configuração de 28/08/2026, em que `godocs-docs` e `godocs-docs-dev` eram usados como ambientes locais separados, pertence ao histórico da reorganização inicial. Ela foi substituída pela governança definida em 01/09/2026, com `godocs-docs` como pasta principal e `develop` como branch padrão.

### Histórico de HEADs relevantes

Marcos anteriores preservados:

```text
cc5f6e1 — Redesign - Implementação do Lote 1
0ae9420 — Consolidação do Lote 2
415a113 — Revisão dos workflows
5c8a7c120aba1d6afd323621a7ec186776178bd6 — Implementacao do Lote 4
34ffcb9eae1c155b66f07abc7efa2cdb68195471 — Implementacao do Lote 5
be80a0309d0c1daaef6dd55d8172510bd94ce0c4 — Editor - Preserva implementação inicial E1
```

Marcos recentes do Lote 6:

```text
ad0212eb65d72ef4272ba269d995962350e6cdb7
Implementa paleta A2 Contrast Refined
(main / produção)

fa3ff62e9f800b21fb55d09db5f29090497a8b64
Implementa Sidebar V2.5 e estabilização final
(main / produção)

0630b6067ef54b492e971cd4f7a664cb712a14f9
Implementa background oficial da Home
(main / produção)

430d269
Refina background da Home e atualiza logos
(main)

07635a6d1fa8480bebec0e485ef85c4f8e451d89
Finaliza background responsivo e estabilidade das logos
(main / produção)
```

Baseline correspondente em `develop` para o fechamento de Background + Logo:

```text
1d392c18360d7535ddbdce7452880356bc5a6671
Finaliza background responsivo e estabilidade das logos
```

### Deploy

A associação produção → commit foi confirmada em 09/09/2026:

```text
branch: main
commit: 07635a6d1fa8480bebec0e485ef85c4f8e451d89
mensagem: Finaliza background responsivo e estabilidade das logos
Vercel state: READY
target: production
```

A confirmação anterior de `700998c` permanece válida apenas como marco histórico de deployment anterior.

Não assumir publicação de novos commits sem confirmar:

```text
commit / SHA
→ deployment
→ target
→ estado READY
```

## 5. Marcos técnicos e de design já concluídos

### 5.1 Evolução de interface anterior ao redesign estrutural

Commits e marcos relevantes preservados no histórico:

#### `b595458` — Melhoria de interface

- correções de estados visuais;
- melhorias de semântica ARIA da busca;
- `aria-expanded` alinhado à visibilidade real;
- `aria-controls` condicionado à existência da lista;
- ampliação de testes de estados do combobox.

#### `d9b9278` — Melhoria de interface 2

- grande limpeza de `app/globals.css`;
- remoção de mais de mil linhas em relação ao estado anterior;
- redução de estilos antigos e duplicados;
- ampliação dos testes de acessibilidade de artigos;
- ajustes em headings e componentes MDX;
- melhorias de touch targets na navegação mobile;
- retry da busca ajustado para 44 px;
- reforço dos testes de identidade e design.

#### `ec96743` — Melhoria de interface 3

- `DESIGN.md` passou a governar formalmente a **Hero Atmosphere**;
- ambientação técnica/focal do hero foi aceita como exceção controlada;
- decoração ornamental excedente foi removida;
- `home-hero__ambient` foi simplificado;
- a regra não autoriza decoração equivalente em cards, artigos, sidebar ou outras superfícies.

#### `a5f8534` — Atualização de memória e design do sistema

- ajustes em `DESIGN.md`;
- refinamentos em `PRODUCT.md`;
- reorganização do `daily_stats.md` para a função operacional atual.

#### `23e2a32` — Revisão de auditoria

- TOC móvel longo passou a usar divulgação progressiva;
- Workflows preservou 24 destinos, com 7 inicialmente visíveis;
- `.home-hero h1` passou a consumir `--type-home-title`;
- caminhos `project_docs/` no `AGENTS.md` foram corrigidos para `project-docs/`;
- cobertura automatizada do TOC foi ampliada.

#### `fc384cc` — Revisão de auditoria final

- caso residual de `aria-current` no último heading corrigido;
- listener de `scroll` passou a coexistir com `IntersectionObserver`;
- dois testes de regressão adicionados;
- baseline final da auditoria: **100/100 testes**;
- N1 considerado resolvido.

#### `700998c` — Sincroniza Impeccable com o Design System

- somente `.impeccable/design.json` foi alterado;
- sidecar regenerado a partir do `DESIGN.md`;
- rampas tonais OKLCH adicionadas às cores;
- regras narrativas sincronizadas;
- exemplo de Icon Button alinhado a `--accent-hover`;
- breakpoint `mobile-compact: 341px` preservado;
- `git diff --check` aprovado.

### 5.2 Estado final da auditoria Impeccable anterior

A auditoria que originou os lotes de correção está **formalmente encerrada**.

Estado final conhecido:

- TOC móvel longo resolvido;
- `aria-current` residual resolvido;
- `--type-home-title` resolvido;
- caminhos `project-docs/` resolvidos;
- nenhuma regressão relevante permaneceu aberta;
- baseline final: **14 arquivos / 100 testes / 100 aprovados / 0 falhas**;
- build aprovado com 24 páginas estáticas naquele snapshot;
- console sem erros/warnings de produto observados;
- overflow horizontal não reproduzido nos breakpoints inspecionados;
- `git diff --check` aprovado.

Os 151 warnings de lint conhecidos estavam restritos a scripts internos em `.agents/skills/impeccable` e não foram tratados como erro do produto.

Novas mudanças visuais pertencem à nova frente de evolução do redesign e **não reabrem automaticamente os achados antigos**.

---

## 6. Redesign estrutural — baseline e contrato

### 6.1 Baseline estabilizado

Foi estabilizado um baseline antes dos lotes arquiteturais.

Commit registrado:

```text
0e86d92 — Estabiliza baseline do redesign
```

Principais confirmações daquele marco:

- teste de identidade deixou de gerar falso positivo sobre referências internas;
- referências do redesign foram organizadas;
- suíte técnica ficou verde;
- o redesign passou a ter um ponto de partida estável.

### 6.2 Auditoria Estratégica

A Auditoria Estratégica do redesign foi concluída.

Conclusão principal:

- não fazer uma reconstrução visual ampla primeiro;
- priorizar arquitetura editorial e navegação;
- decompor domínios excessivamente monolíticos;
- preparar busca, hubs, compatibilidade e navegação para escala;
- refinar identidade visual somente depois da fundação estrutural.

Achados principais consolidados:

- **F-01:** Workflows e Documentos concentravam múltiplas intenções;
- **F-02:** busca precisava ser preparada para o crescimento da coleção;
- **F-03:** seções não possuíam hubs explícitos;
- **F-04:** resultados de busca mobile podiam ficar densos;
- **F-05:** Related ainda não estava ativado;
- **F-06:** metadados editoriais poderiam ser mais aproveitados;
- **F-07:** breadcrumbs precisavam suportar a profundidade futura;
- **F-08:** FAQ ainda era placeholder;
- **F-09:** hubs poderiam ganhar assinatura visual mais clara em etapa posterior;
- **F-10:** primitives editoriais poderiam ser mais bem aproveitadas.

### 6.3 Lote 0 — Contrato da Nova Arquitetura

Concluído e aprovado.

Decisões consolidadas:

- preservar URLs públicas existentes;
- criar hub explícito `/docs/funcionalidades`;
- manter `/docs/funcionalidades/visao-geral` como página real de Visão Geral;
- transformar as URLs atuais de Documentos e Workflows em hubs;
- introduzir `pageType: hub | task | reference`;
- limitar profundidade a seção → hub/página → filha;
- usar paginação hierárquica por domínio;
- preservar compatibilidade de URLs e anchors;
- manter Related manual e factual;
- não criar página própria de Integração via API neste ciclo;
- considerar critérios editoriais como sinais, não limites matemáticos;
- deferir otimizações específicas de busca para o Lote 4.

Baseline de compatibilidade do contrato:

```text
Documentos: 30 anchors históricos
Workflows: 49 anchors históricos
Total: 79
```

### 6.4 Lote 0.1 — Consolidação

Concluído.

Criado:

```text
project-docs/REDESIGN_ARCHITECTURE.md
```

Função:

- ser a referência canônica e versionável da arquitetura-alvo;
- permitir que novos chats do Codex entendam o contrato sem depender da conversa anterior.

Commit-base registrado no documento:

```text
587069f — Contrato da nova arquitetura
```

---

## 7. Lote 1 — Fundação da Nova Arquitetura

### Estado

**Implementado, revalidado e versionado.**

Commit confirmado:

```text
cc5f6e1 — Redesign - Implementação do Lote 1
```

### Implementações principais

- `pageType` explícito no schema;
- `section.entrySlug` substituindo inferência pelo primeiro item ordenado;
- novo hub `/docs/funcionalidades`;
- árvore preparada para hub → filhos;
- hub clicável com controle de expansão separado;
- mesma árvore para sidebar e drawer;
- breadcrumbs baseados em ancestrais reais;
- paginação hierárquica e limitada ao domínio;
- manifesto tipado de compatibilidade para os 79 anchors;
- resolução client-side preparada para aliases históricos;
- validação de H2/H3/H4 e aliases;
- baseline determinístico de busca por `pnpm search:benchmark`.

### `pageType` após o Lote 1

- hub: Funcionalidades;
- task: Primeiro Acesso, Busca Inteligente, Favoritos;
- reference: O que é o GoDocs, Visão Geral, Documentos, Workflows, Relatórios.

Documentos e Workflows ainda não foram decompostos no Lote 1.

### Revalidação focal do Lote 1

Foram adicionados testes que confirmaram:

1. o manifesto de compatibilidade é explícito, versionado e independente da permanência do heading original;
2. `section.entrySlug` possui validação centralizada para conflito, destino inexistente e destino não publicado.

Resultado final registrado:

```text
Documentos: 9
Entradas de busca: 134
Páginas: 9
Seções: 125
Payload bruto: 271.847 bytes
Payload gzip: 36.557 bytes
Testes: 131/131
Build: 26 páginas estáticas
```

---

## 8. Lote 2 — Documentos

### Estado final

**CONCLUÍDO.** A implementação aprovada está em `0ae9420` — `Consolidacao do Lote 2`, sincronizada com `origin/main`.

Antes desta atualização documental, o working tree estava limpo e não havia alterações staged ou untracked.

Base confirmada no início do lote:

```text
main
HEAD cc5f6e1
origin sem divergência registrada
working tree inicialmente limpo
```

Checkpoints confirmados do lote: `de25753` (decomposição e compatibilidade), `b09b042` (Explore Documentos), `292e11b` (fechamento funcional e contratual) e `0ae9420` (consolidação visual final).

### Estrutura implementada

```text
Documentos
├── Organizar pastas e subpastas
├── Adicionar documentos
├── Localizar, filtrar e consultar metadados
├── Visualizar e gerenciar documentos
└── Logs e ações
```

Rotas:

```text
/docs/funcionalidades/documentos
/docs/funcionalidades/documentos/pastas
/docs/funcionalidades/documentos/adicionar-documentos
/docs/funcionalidades/documentos/filtros-e-metadados
/docs/funcionalidades/documentos/gerenciar-documentos
/docs/funcionalidades/documentos/logs-e-acoes
```

### Métricas editoriais registradas

| Página | Palavras | Leitura | TOC |
|---|---:|---:|---:|
| Hub Documentos | 214 | 2 min | 2 |
| Organizar pastas e subpastas | 542 | 3 min | 5 |
| Adicionar documentos | 183 | 1 min | 2 |
| Localizar, filtrar e consultar metadados | 253 | 2 min | 3 |
| Visualizar e gerenciar documentos | 597 | 3 min | 7 |
| Logs e ações | 313 | 2 min | 6 |

Nenhuma perda útil de conteúdo foi identificada na migração registrada.

### Compatibilidade

Os 30 aliases de Documentos foram distribuídos entre os novos destinos:

```text
Hub: 2
Pastas: 10
Adicionar documentos: 2
Filtros e metadados: 3
Gerenciar documentos: 7
Logs e ações: 6
Total: 30
```

Workflows permaneceu intacto:

```text
49/49 aliases/anchors preservados
```

### Navegação

Implementado:

- ramo Documentos com cinco filhas;
- hub clicável;
- expansão separada;
- breadcrumbs hierárquicos;
- domínio próprio de paginação;
- `Logs e ações` encerra a sequência de Documentos;
- não deve existir `Logs e ações → Favoritos`.

### Busca após o Lote 2

Baseline registrado:

```text
Documentos: 14
Entradas: 141
Páginas: 14
Seções: 127
Payload bruto: 276.446 bytes
Payload gzip: 35.862 bytes
```

Consultas registradas como priorizando as respectivas páginas-filhas:

- `pastas`;
- `adicionar documento`;
- `metadados`;
- `logs da pasta`;
- `visualizar documento`.

Não houve alteração do algoritmo, pesos, snippets ou limite de resultados.

### SEO

As cinco novas páginas entraram no pipeline de:

- sitemap;
- canonical;
- imagem social;
- busca.

### Validações técnicas do Lote 2

Resultados registrados:

```text
content:validate: 14 documentos válidos
lint: 0 erros do produto; 151 warnings preexistentes em .agents
typecheck: aprovado
testes: 19 arquivos / 167 testes / 167 aprovados
build: aprovado / 36 páginas estáticas
search:benchmark: aprovado
git diff --check: aprovado
```

### Revalidação visual automatizada

O ambiente do Codex não conseguiu iniciar um navegador:

- navegador integrado bloqueado por restrição de confiança;
- Chrome/Chromium/Playwright não disponíveis no runtime;
- servidor `next start` respondeu localmente;
- as rotas de Documentos e a rota-controle de Workflows retornaram `200`;
- H1 e canonical foram confirmados;
- inspeção de console, foco, drawer, temas e breakpoints não pôde ser feita pelo Codex.

Veredito da revalidação automatizada daquela tentativa:

```text
PENDENTE NO AMBIENTE DO CODEX
```

A validação visual manual posterior foi concluída com os prints fornecidos; nenhum arquivo adicional foi alterado nessa revalidação automatizada.

---

## 8.1 Lote 3 — Workflows

### Estado final

**CONCLUÍDO e versionado.** O estado final aprovado é `415a113936b776dc65d73b58f343426680327af8` — `Revisão dos workflows`, sincronizado com `origin/main`.

O checkpoint inicial do lote é `d5e5251` — `Redesign - Implementação do Lote 3`. Após a auditoria focal, foram recuperados três detalhes editoriais e fortalecidos contratos de teste. A validação visual identificou que `Explore Workflows` não aparecia no hub; a correção final em `415a113` generalizou a derivação de filhos diretos para hubs aninhados, sem alterar Documentos.

### Estrutura, navegação e compatibilidade

```text
Workflows (hub)
├── Cards, Kanban e Lista
├── Automações
├── Criar e configurar
├── Fases e transições
├── Formulários e campos
├── Membros e papéis
└── Formulário público e acompanhamento
```

- hub com `pageType: hub`; sete filhas com `pageType: task`;
- `Explore Workflows` deriva os sete cards da coleção canônica, na ordem editorial, antes da paginação;
- o último card ímpar ocupa as duas colunas no desktop e retorna a uma coluna no mobile;
- sidebar e drawer compartilham `NavigationTree`; estado ativo e expandido são independentes;
- breadcrumbs: `Funcionalidades > Workflows` e, nas filhas, `Funcionalidades > Workflows > Página-filha`;
- paginação termina em `Formulário público e acompanhamento`, sem avançar para Relatórios;
- compatibilidade: Workflows `49/49`; Documentos `30/30`; `#dúvidas-e-situações-comuns` resolve para `#como-um-workflow-funciona` no hub.

### Baseline final

```text
21 documentos
148 entradas de busca
127 seções
252741 rawBytes
29706 gzipBytes
limit 12
snippet 220
20 arquivos de teste
233/233 testes
50 páginas estáticas
```

Validações aprovadas: `pnpm content:validate`, `pnpm lint` (0 erros; 151 warnings preexistentes em `.agents/skills/impeccable`), `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm search:benchmark` e `git diff --check`. `pnpm audit:prod` não foi executado nesta rodada.

### Validação visual

A validação manual no ambiente publicado foi aprovada para Hub Workflows, páginas-filhas, `Explore Workflows`, sidebar, drawer, TOC e paginação nos cenários desktop dark, desktop light e mobile dark. Não foi identificado overflow horizontal; não há associação inferida entre esse ambiente e um SHA específico.

---

## 8.2 Lote 4 — Busca

### Estado final

**CONCLUÍDO, revisado e validado visualmente.** O SHA funcional é `5c8a7c120aba1d6afd323621a7ec186776178bd6` — `Implementacao do Lote 4`. O commit posterior `5b69be4e0fb08ceb4832f6f8973bd8c2886ada38` corrige exclusivamente a infraestrutura do ESLint e não substitui a referência funcional da busca.

### Decisões consolidadas

- índice estático `/search-index.json`, normalização de acentos, matching determinístico por palavras/prefixos, pesos e campos pesquisados preservados;
- limite universal de 12 resultados e snippet de 220 caracteres preservados;
- candidatos recebem score e ordenação completos antes da diversidade; cada documento canônico, identificado pelo href sem fragmento, contribui com no máximo três resultados;
- a busca continua pelos candidatos elegíveis após o teto por documento, podendo preencher o limite de 12;
- stopwords são conservadoras; `sem` foi preservado como termo semântico após a revisão focal, incluindo as consultas `sem login` e `enviar solicitação sem login`;
- resultados exibem a classificação `Página` ou `Seção`, e o estado vazio orienta tentar outro termo ou uma busca mais curta;
- sem IA, NLP, embeddings, autocomplete complexo ou mudança de arquitetura nesta fase.

### Revisão, acessibilidade e validação

A revisão focal encontrou dois P1: a remoção indevida de `sem` como ruído e cobertura insuficiente dos contratos de stopwords/diversidade. A correção preservou `sem` e adicionou testes para consultas somente com stopwords, intenção sem login, máximo de três por documento e preenchimento até 12 após a diversidade.

Foram preservados Ctrl/Cmd+K, ArrowUp/ArrowDown, Enter, Escape, retorno de foco, combobox/listbox/options, ARIA e comportamento responsivo. A validação visual da busca incluiu desktop, mobile, claro/escuro e as consultas `sem login` e `enviar solicitação sem login`; não se infere associação de deployment além da evidência disponível.

UI UX PRO MAX foi utilizada pontualmente como apoio consultivo para acessibilidade, teclado, responsividade e estado vazio. Não substituiu `PRODUCT.md`, `DESIGN.md`, `REDESIGN_ARCHITECTURE.md` ou a arquitetura existente.

### Baseline final

```text
21 documentos
148 entradas de busca
127 seções
252741 rawBytes
29706 gzipBytes
limit 12
snippet 220
20 arquivos de teste
242/242 testes
50 páginas estáticas
Workflows 49/49 aliases
Documentos 30/30 aliases
```

Validações aprovadas: `pnpm lint` (0 erros, 0 warnings), lint focal do Lote 4, `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm search:benchmark` e `git diff --check`. A correção do lint adicionou exclusivamente `.agents/skills/**` ao ignore oficial do Flat Config; nenhuma skill foi alterada e o código real da aplicação continua no escopo.

---

## 9. Inspeção visual manual do Lote 2 e nova decisão de UX

Em 19/08/2026 foram fornecidos prints representativos de:

- Home;
- hub de Documentos em dark;
- hub de Documentos em light;
- Organizar pastas e subpastas em desktop;
- Organizar pastas e subpastas em mobile;
- drawer mobile com Documentos expandido;
- paginação de uma página-filha;
- Logs e ações;
- final de Logs e ações.

### O que os prints confirmaram visualmente

- hierarquia de Documentos renderizada;
- breadcrumbs coerentes;
- ramo Documentos expandido na sidebar;
- filha ativa identificável;
- TOC renderizado;
- layout desktop coerente;
- layout mobile sem overflow aparente nos exemplos fornecidos;
- drawer mobile comportando as cinco filhas;
- paginação `Documentos → Pastas → Adicionar...`;
- `Logs e ações` sem `Próxima → Favoritos`;
- temas claro e escuro renderizando a estrutura.

Os prints não comprovam, sozinhos:

- retorno de foco;
- `Escape`;
- console;
- todos os breakpoints;
- execução real de deep links históricos no navegador.

### Problema de UX identificado

A decomposição editorial ficou adequada, porém o hub de Documentos ainda se comportava visualmente como um artigo comum.

Problema percebido:

> o usuário precisava descobrir pela sidebar que Documentos possuía cinco páginas-filhas.

Decisão:

- manter a decomposição atual;
- não refazer o Lote 2;
- adicionar uma navegação explícita por cards compactos dentro do hub;
- posicionar esses cards **no final do hub**;
- os cards devem aparecer depois do conteúdo conceitual e também depois de **Conceitos importantes**, quando essa seção existir.

### Estrutura aprovada para o hub de Documentos

```text
Documentos
↓
H1 + resumo
↓
conteúdo geral / contextual
↓
permissões ou informações relevantes
↓
Conceitos importantes
↓
Explore Documentos
↓
5 cards compactos das páginas-filhas
```

Os cards devem ser:

- compactos;
- uniformes;
- clean;
- fáceis de escanear;
- com título;
- descrição curta;
- indicação discreta de navegação.

Evitar:

- cards excessivamente grandes;
- gradientes pesados;
- excesso de badges;
- imagens decorativas sem função;
- informação demais dentro do card.

### Estado do Lote 2 após essa decisão

O ajuste focal foi concluído posteriormente: o hub recebeu `Explore Documentos`, o texto redundante foi simplificado, a árvore ativa passou a ser recolhível e o último card passou a ocupar duas colunas no desktop. O mobile permanece em uma coluna.

---

## 10. Novas decisões arquiteturais do redesign

> **Nota de status (09/09/2026):** esta seção preserva decisões tomadas durante as fases anteriores. Parte delas já foi implementada no Lote 6 — especialmente paleta, sidebar retrátil/preview e refinamentos visuais. Para o estado operacional atual, usar as seções 2, 17, 20, 22, 26 e 28.


Estas decisões foram definidas após a implementação e inspeção do Lote 2 e devem orientar os próximos lotes.

### 10.1 Funcionalidades mantém seis cards equivalentes

Manter os seis destinos principais com o mesmo peso visual:

```text
Visão Geral
Busca Inteligente
Documentos
Favoritos
Workflows
Relatórios
```

Não criar cards maiores ou mais densos para Documentos e Workflows apenas por serem hubs.

Objetivo:

- preservar limpeza;
- evitar poluição;
- manter a primeira camada da arquitetura simples e consistente.

### 10.2 Padrão oficial dos hubs de domínio

Hubs como Documentos e Workflows devem:

1. explicar o domínio;
2. apresentar conceitos e informações relevantes;
3. finalizar com navegação explícita para as páginas-filhas.

Padrão:

```text
H1 + resumo
→ conteúdo geral
→ informações/requisitos
→ Conceitos importantes, quando existir
→ cards compactos das páginas-filhas
```

Os cards ficam **no final**.

A sidebar continua sendo navegação persistente; os cards funcionam como descoberta e orientação.

### 10.3 Workflows aplicou o mesmo padrão

A estrutura abaixo, planejada no fechamento do Lote 2, foi implementada e concluída no Lote 3:

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

O hub de Workflows foi entregue com:

```text
contexto
→ conteúdo conceitual
→ Conceitos importantes, quando aplicável
→ cards finais das sete páginas-filhas
```

### 10.4 Tempo de leitura não determina sozinho a decomposição

Não adotar regra:

```text
4 minutos ou mais = criar mini hub
```

O tempo é apenas sinal editorial.

Uma página pode permanecer única quando:

- possui uma intenção principal;
- há sequência lógica;
- os subtópicos dependem do contexto comum;
- a divisão criaria páginas pequenas ou fragmentadas.

Considerar decomposição quando:

- existem várias intenções independentes;
- procedimentos fazem sentido isoladamente;
- a estrutura fica excessivamente ramificada;
- a consulta parcial é mais provável que a leitura sequencial.

O critério principal permanece:

> **intenção e arquitetura da informação**

### 10.5 Evolução do componente “Nesta página”

Problema identificado em páginas como Busca Inteligente:

- o componente pode ficar visualmente grande e competir com o artigo;
- uma página com cerca de 5 minutos não precisa ser dividida apenas para reduzir o TOC.

Direção aprovada:

- páginas simples podem exibir os destinos normalmente;
- páginas densas devem priorizar os tópicos principais;
- H2 têm prioridade;
- H3 podem ser agrupados progressivamente;
- o grupo da seção ativa pode permanecer expandido;
- grupos não ativos podem ficar compactos;
- H4 não deve dominar visualmente o TOC;
- altura e scroll interno podem ser limitados quando necessário;
- o comportamento sticky permanece;
- no mobile, `Nesta página` continua recolhível e segue a mesma hierarquia progressiva.

Busca Inteligente permanece, no estado discutido, como **uma página única**. A solução preferida é melhorar o TOC antes de considerar decomposição.

### 10.6 Sidebar desktop retrátil

Decisão:

- sidebar desktop aberta por padrão;
- usuário pode recolher/expandir;
- não recolher automaticamente ao entrar em um card ou mudar de página;
- estado deve permanecer consistente durante a navegação;
- retração da sidebar inteira é independente da expansão dos ramos internos.

### 10.7 Ramos internos continuam expansíveis

Exemplo:

```text
▼ Documentos
    Pastas
    Adicionar documentos
    Metadados
    Gerenciar documentos
    Logs e ações

› Workflows
```

Regras:

- ramo atual abre automaticamente;
- demais podem ficar recolhidos;
- reduzir densidade da árvore sem esconder o contexto atual.

### 10.8 Mobile continua com drawer

Não criar sidebar persistente para mobile.

Continuar:

```text
menu
→ drawer
→ árvore de navegação
```

O drawer utiliza a mesma arquitetura da sidebar.

### 10.9 FAQ será desenvolvido

A seção de FAQ deixará de ser apenas placeholder em etapa posterior do redesign.

Direção aprovada:

- perguntas agrupadas por domínio quando fizer sentido;
- accordions simples;
- respostas curtas e diretas;
- respostas extensas devem apontar para a documentação completa;
- não duplicar artigos;
- não inventar perguntas, funcionalidades ou comportamentos;
- usar conteúdo documentado e dúvidas reais/úteis quando houver evidência.

O lote exato de implementação ainda não foi formalmente fechado neste registro.

### 10.10 Revisão das paletas

As duas paletas serão revistas.

Prioridade:

> **tema claro**

Motivo observado:

- baixa diferenciação perceptível entre algumas superfícies;
- contraste estrutural menos claro que no dark;
- interface pode parecer lavada em determinadas áreas.

Direção:

- melhorar separação entre background, superfícies, cards, navegação e artigo;
- melhorar bordas e divisores;
- melhorar contraste de textos secundários;
- revisar hover/active/focus;
- manter o sistema clean.

Tema escuro:

- também será refinado;
- intervenção deve ser mais contida;
- preservar a base que já funciona melhor.

### 10.11 Laranja GoDocs permanece como accent

Continuar usando principalmente em:

- links;
- foco;
- estados ativos;
- navegação atual;
- pequenos destaques funcionais.

Evitar grandes superfícies laranja sem necessidade.

### 10.12 Revisão visual por tokens

A revisão das paletas deve ser sistêmica.

Direção de camadas:

```text
background
surface
surface secundária
surface interativa/elevada
border
text-muted
text
accent
focus
```

Os valores finais não foram definidos nesta etapa e **não devem ser inventados**.

A especificação definitiva pertence à etapa visual e deverá ser consolidada no `DESIGN.md`.

### 10.13 DESIGN.md não deve ser reescrito agora

A direção visual pode ser registrada na arquitetura, mas a especificação final de:

- cores;
- tokens;
- superfícies;
- sidebar recolhida;
- TOC;
- estados;
- microinterações;

deve ser consolidada quando as soluções forem efetivamente desenhadas e validadas nos Lotes 6 e 7.

---

## 11. Documentos canônicos — registro histórico do Lote 3

As anotações desta seção registram a necessidade identificada no fechamento do Lote 3. O estado operacional atual foi atualizado nas seções 2, 8.2, 20, 22 e 26.

### `REDESIGN_ARCHITECTURE.md`

Deve refletir:

- padrão oficial de hubs;
- cards no final;
- Funcionalidades com seis cards equivalentes;
- Workflows usando o mesmo padrão de Documentos;
- regra de decomposição por intenção;
- evolução do `Nesta página`;
- sidebar retrátil;
- drawer mobile preservado;
- FAQ planejado;
- direção da revisão de paletas;
- robustez estrutural sem poluição visual.

Em 19/08/2026, uma versão revisada desse documento foi preparada; a nota é histórica. O documento está presente na `main` e foi atualizado neste fechamento do Lote 4.

### `daily_stats.md`

Naquele momento, este arquivo deveria registrar:

- Lote 1 versionado;
- Lote 2 concluído e sincronizado;
- próximo lote: Workflows;
- decisões que alteram os próximos lotes;
- uso planejado das skills;
- estado Git/deploy sem inferências.

### `DESIGN.md`

Não atualizar profundamente agora.

Atualizar quando as decisões visuais tiverem especificação concreta nos Lotes 6 e 7.

### `PRODUCT.md`

Nenhuma das decisões recentes exige alteração confirmada de definição de produto.

### `AGENTS.md`

Nenhuma alteração adicional foi definida nesta frente.

### Auditoria Impeccable anterior

Não editar para fazer o relatório histórico refletir decisões posteriores.

---

## 12. Conteúdo e frentes editoriais

### Estado após o Lote 2

Coleção:

```text
14 documentos MDX
```

Estrutura conhecida:

### Comece por aqui

```text
O que é o GoDocs?
Primeiro Acesso
```

### Funcionalidades

```text
Funcionalidades
Visão Geral
Busca Inteligente
Documentos
Organizar pastas e subpastas
Adicionar documentos
Localizar, filtrar e consultar metadados
Visualizar e gerenciar documentos
Logs e ações
Favoritos
Workflows
Relatórios
```

### Configurações

Foi realizada análise/documentação da seção a partir de prints em conversa do projeto.

Estado seguro:

- existe trabalho editorial realizado;
- não há confirmação de arquivo MDX publicado na coleção;
- não inventar funções não sustentadas pelas evidências;
- publicação permanece pendente até implementação e validação confirmadas.

### Relatórios

A documentação de Relatórios já foi trabalhada e revisada em conversa anterior.

Pontos funcionais documentados no projeto incluem:

- Tabela de Temporalidades;
- dados indexados;
- comportamento observado de descarte com notificação `Temporalidades excluídas com sucesso`.

Esses registros funcionais pertencem à documentação da seção e não alteram a arquitetura atual.

### FAQ

Ainda não implementado.

Passou de “placeholder sem conteúdo confirmado” para **frente planejada do redesign**, condicionada a perguntas factuais e úteis.

---

## 13. Busca — histórico e decisões anteriores ao Lote 4

### Baseline após Lote 1

```text
9 documentos
134 entradas
125 seções
271.847 bytes bruto
36.557 bytes gzip
```

### Baseline após Lote 2 local

```text
14 documentos
141 entradas
127 seções
276.568 bytes bruto
35.862 bytes gzip
```

### Baseline ao encerrar o Lote 3

```text
21 documentos
148 entradas
127 seções
252741 rawBytes
29706 gzipBytes
limit 12
snippet 220
```

### Decisão do Lote 0 consolidada no Lote 4

A hipótese de limites distintos por viewport foi encerrada sem alteração: o limite universal de 12 e o snippet de 220 permaneceram. A busca foi consolidada com diversidade máxima de três resultados por documento, stopwords conservadoras e preservação de `sem` como termo semântico.

### Nova observação relacionada

O problema visual identificado em **Busca Inteligente** está atualmente ligado ao componente `Nesta página`, não a uma decisão de decompor automaticamente a página.

---

## 14. Skills, Codex e economia de créditos

### Impeccable

Estado:

- instalada e utilizada no projeto;
- auditoria anterior formalmente encerrada;
- não deve ser executada automaticamente em qualquer tarefa;
- permanece prevista como revisão crítica focal da Sidebar V2.5 Final Interaction Polish;
- o escopo dessa revisão deve permanecer limitado à Sidebar, motion, hover/focus, spacing, shell editorial, acessibilidade e light/dark.

### UI UX PRO MAX

Estado:

- instalada;
- utilizada pontualmente no Lote 4;
- uso consultivo;
- não substitui `PRODUCT.md`, `DESIGN.md` ou `REDESIGN_ARCHITECTURE.md`;
- não constitui Design System paralelo.

Plano preservado:

```text
Lote 4 — uso pontual concluído
Lote 5 — uso pontual/opcional concluído
Lote 6 — uso quando trouxer ganho real; Impeccable como auditoria crítica
Lote 7 — UI UX PRO MAX + Impeccable conforme necessidade
Lote 9 — Impeccable principal; UI UX PRO MAX somente se necessário
```

### Regra de escolha de modelo no Codex

Antes de cada nova tarefa do Codex, indicar explicitamente:

- modelo: **Sol, Terra ou Luna**;
- nível de raciocínio;
- escolha orientada ao melhor resultado com economia de créditos/tokens.

Convenção operacional adotada:

- arquitetura, debugging sensível ou implementação de alto risco: **Sol High** quando necessário;
- implementação técnica/editorial bem delimitada: **Terra High**;
- validação visual/focal e tarefas documentais delimitadas: **Terra Medium**;
- tarefas Git simples: **Luna Medium**.

Não usar Sol High/Extra High por padrão sem necessidade.

### Recomendação para a próxima implementação

Para **Sidebar V2.5 Final Interaction Polish**:

```text
Modelo: Sol
Nível: High
Chat: dedicado ao escopo da Sidebar
```

O motivo é a combinação de interação por pointer, timers, motion, regressões geométricas, responsividade e acessibilidade.

## 15. Desenvolvimento entre máquinas e contas

O desenvolvimento entre computador do trabalho e computador pessoal continua usando o repositório remoto como fonte de continuidade.

O caminho local da pasta não precisa ser igual nas duas máquinas.

A governança atual usa `develop` como branch de desenvolvimento.

Fluxo normal ao iniciar trabalho em uma máquina:

```bash
git switch develop
git pull --ff-only origin develop
git status
```

Depois de implementar, validar e decidir versionar uma mudança de desenvolvimento:

```bash
git status
git add <arquivos aprovados>
git commit -m "mensagem descritiva"
git push origin develop
```

A promoção para produção é uma etapa separada e ocorre somente após aprovação:

```text
develop aprovado
→ main
→ push de main
→ Vercel produção
```

Como `develop` e `main` possuem históricos próprios, mudanças aprovadas podem ser promovidas isoladamente e receber SHAs diferentes em cada branch.

Regras preservadas:

- não depender de sincronização de pastas locais entre máquinas;
- `node_modules` permanece local;
- segredos e `.env` não devem ser versionados;
- Git é a fonte de continuidade;
- confirmar o deployment Vercel quando um marco for promovido para produção;
- não desenvolver continuamente em `main`.

### Alternância entre contas Plus no Codex

Foi validado que o usuário pode:

- manter o projeto principal e o contexto no mesmo ChatGPT;
- alternar entre duas contas Plus no Codex;
- continuar usando o mesmo repositório local;
- não migrar o projeto do ChatGPT por causa da troca de conta do Codex.

A continuidade do Codex deve vir dos arquivos do projeto e do Git, não da memória da conta autenticada.

## 16. Governança de contexto

Fluxo definido:

```text
conversas
↓
trabalho temporário
↓
decisões e conhecimento confirmado
↓
arquivos canônicos
↓
Memória.md + daily_stats.md + documentos específicos
```

Objetivo:

- reduzir dependência de chats antigos;
- permitir troca de computador, conta ou chat;
- preservar decisões arquiteturais;
- evitar documentos redundantes.

### Memória universal

`Memória.md` continua sendo a referência ampla para:

- histórico;
- contexto do produto;
- funcionamento confirmado;
- regras editoriais;
- decisões superadas;
- transferência de contexto.

O arquivo está versionado como memória canônica do projeto. Neste fechamento documental, possui alterações locais ainda não commitadas, assim como `daily_stats.md` e `REDESIGN_ARCHITECTURE.md`; não tratar essa pendência documental como pendência do Lote 2 de código.

---

## 17. Débitos e riscos atuais

### P1 — Sidebar V2.5 Final Interaction Polish

- [x] Sidebar V2.5 estabilizada e promovida para produção;
- [x] geometria estrutural `240 / 48 / 240` consolidada;
- [x] shell editorial, drawer mobile, branches e acessibilidade preservados no baseline V2.5;
- [ ] reproduzir e corrigir o hover preview intermitente;
- [ ] confirmar ou rejeitar a hipótese atual relacionada ao tratamento de `pointerenter`/área de intenção;
- [ ] aumentar e calibrar o inset interno esquerdo de itens expanded/preview;
- [ ] reduzir a percepção de delay/travamento sem criar regressões;
- [ ] validar 30+ ciclos válidos de hover com 100% de sucesso após intent válido;
- [ ] executar validações técnicas e Impeccable focal;
- [ ] realizar validação visual humana antes de commit/push/deploy da rodada.

### P1 — Escopos congelados durante o polish da Sidebar

- [x] Background + Logo concluídos e publicados;
- [x] paleta A2 Contrast Refined implementada e aprovada;
- [x] Home/cards já possuem refinamentos do Lote 6;
- [ ] não reabrir Home, Background, Logos, cards, busca, paleta, conteúdo editorial, URLs ou arquitetura do TOC dentro da tarefa da Sidebar.

### P1 — Editorial

- [ ] finalizar/publicar Configurações somente quando o conteúdo estiver aprovado e implementado;
- [ ] continuar usando apenas informações sustentadas por evidências;
- [ ] não inventar permissões ou comportamentos.

### P2 — Navegação e leitura

- [x] sidebar desktop retrátil implementada;
- [x] ramos internos expansíveis preservados;
- [x] drawer mobile preservado;
- [ ] evoluir `Nesta página` somente em tarefa específica quando ainda houver necessidade real;
- [ ] não misturar mudanças do TOC com o polish focal da Sidebar.

### P2 — Visual

- [x] paleta A2 Contrast Refined implementada;
- [x] Background + Logo concluídos;
- [ ] concluir o polish focal de interação da Sidebar;
- [ ] preservar a paleta aprovada durante essa rodada;
- [ ] não criar V3 de Background/Logo sem novo problema visual comprovado.

### P2 — FAQ

- [ ] desenvolver FAQ em etapa posterior;
- [ ] usar somente perguntas factuais e úteis;
- [ ] manter respostas curtas;
- [ ] direcionar para artigos completos quando necessário.

### P2 — Busca

- [x] Lote 4 concluído com limite universal de 12, snippet de 220 e diversidade máxima de três por documento;
- [x] `sem` preservado após revisão focal e contratos de stopwords/diversidade cobertos;
- [ ] não alterar a busca consolidada fora de tarefa específica.

### Governança

- [x] `godocs-docs` definido como pasta principal;
- [x] `develop` definido como branch padrão de desenvolvimento;
- [x] `main` reservada à produção;
- [x] Editor E1 preservado em `feature/editor`;
- [ ] continuar consolidando decisões importantes nos arquivos canônicos;
- [ ] evitar tratar snapshots históricos como estado atual;
- [ ] confirmar sempre o estado Git real antes de qualquer implementação.

## 18. Stack e comandos de validação

Stack principal registrada:

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
```

Comandos principais:

```bash
pnpm audit:prod
pnpm content:validate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm search:benchmark
git diff --check
```

Para mudanças visuais, validar proporcionalmente:

- desktop;
- notebook/tablet quando aplicável;
- celular;
- tema claro;
- tema escuro;
- teclado;
- foco;
- drawer/dialog;
- overflow;
- console;
- reduced motion quando aplicável.

Não registrar validações antigas como se tivessem sido reexecutadas em uma versão nova.

---

## 19. Baselines de qualidade por fase

### Encerramento da auditoria Impeccable anterior

```text
Testes: 100/100
Build: 24 páginas estáticas
Estado: auditoria encerrada
```

### Lote 1 final

```text
Documentos da coleção: 9
Testes: 131/131
Build: 26 páginas estáticas
Busca: 134 entradas
```

### Lote 2 — baseline final

```text
Documentos da coleção: 14
Testes: 167/167
Build: 36 páginas estáticas
Busca: 141 entradas
```

### Lote 3 — baseline final

```text
Documentos da coleção: 21
Busca: 148 entradas, 127 seções
Testes: 233/233
Build: 50 páginas estáticas
```

### Lote 4 — baseline final

```text
Documentos da coleção: 21
Busca: 148 entradas, 127 seções
Testes: 242/242
Build: 50 páginas estáticas
```

### Lote 5 — baseline final

```text
Documentos da coleção: 21
Busca: 147 entradas, 126 seções
Payload bruto: 250639 bytes
Payload gzip: 29456 bytes
Testes: 250/250
Build: 50 páginas estáticas
Documentos: 30/30 aliases
Workflows: 49/49 aliases
```

### Lote 6 — validação mais recente registrada antes do polish final da Sidebar

Na correção final de Background + Logo foi reportado:

```text
Testes: 283 aprovados
Testes focados: 59 aprovados
content:validate: aprovado
typecheck: aprovado
lint: aprovado
build: aprovado
git diff --check: aprovado
```

Esses números pertencem ao snapshot correspondente à correção final de Background + Logo e não devem ser tratados como resultado da futura Sidebar V2.5 Final Interaction Polish.

Cada baseline pertence ao snapshot em que foi executado. Não reutilizar resultados antigos como se tivessem sido reexecutados depois de novas alterações.

## 20. Roadmap oficial atualizado

```text
Lote 0 — Contrato ✅
Lote 0.1 — Consolidação ✅
Lote 1 — Fundação ✅
Lote 2 — Documentos ✅
Lote 3 — Workflows ✅
Lote 4 — Busca ✅
Lote 5 — Descoberta e consolidação ✅
Lote 6 — Home + Hubs + identidade visual 🔄 em andamento
Lote 7 — Refinamento visual e microinterações ⏳
Lote 8 — Governança editorial ⏳
Lote 9 — Reauditoria Impeccable + regressão final ⏳
```

### Estado do Lote 6

Já concluído ou estabilizado dentro do Lote 6:

```text
Paleta A2 Contrast Refined
Cards/Home em rodadas de refinamento já promovidas
Sidebar V2.5 estabilizada
Background oficial da Home
Logos GoDocs Client
Background + Logo — correção final responsiva
```

Próxima intervenção:

```text
Sidebar V2.5 Final Interaction Polish
```

Problemas delimitados:

```text
hover preview intermitente
+
inset esquerdo insuficiente
+
motion com percepção de delay/travamento
```

O prompt canônico consolidado é:

```text
Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md
```

### Depois do polish

A próxima decisão de roadmap deve ser tomada somente após:

```text
implementação
→ testes
→ Impeccable focal
→ validação visual humana
→ eventual promoção para produção
```

Não antecipar Lote 7 dentro da tarefa atual.

## 21. Ideias futuras discutidas, sem implementação confirmada

Estas ideias pertencem ao histórico do projeto, mas **não devem ser tratadas como roadmap aprovado enquanto não houver decisão específica**:

- assistente de IA para a documentação;
- busca avançada e sugestões contextuais;
- navegação inteligente;
- melhorias adicionais de onboarding;
- mini vídeos-guia produzidos com IA para explicar áreas do GoDocs, como Workflows.

Nenhuma implementação dessas ideias é assumida por este arquivo.

---

## 22. Próximas ações recomendadas

### 1. Sincronizar a documentação operacional atualizada

Atualizar os arquivos canônicos necessários sem apagar o histórico relevante e sem transformar hipóteses em fatos.

### 2. Executar Sidebar V2.5 Final Interaction Polish

Usar:

```text
Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md
```

como contrato canônico.

Escopo restrito:

```text
hover preview intermitente
inset esquerdo
perceived motion
```

Não reabrir Background, Logo, Home, cards, busca, paleta, conteúdo editorial ou TOC.

### 3. Validar antes de versionar

Exigir:

- reprodução da causa do hover;
- 30+ ciclos válidos;
- regression guards geométricos;
- desktop/intermediário/mobile;
- light/dark;
- teclado;
- reduced motion;
- testes automatizados;
- build;
- Impeccable focal;
- validação visual humana.

### 4. Manter Configurações como frente editorial separada

Não misturar publicação de Configurações com a tarefa focal da Sidebar.

## 23. Registro recente

| Data | Marco | Resultado |
|---|---|---|
| 11/08/2026 | Desenvolvimento contínuo | Fluxo trabalho/casa consolidado via GitHub |
| 12/08/2026 | Configurações | Análise/documentação iniciada a partir de prints |
| 12/08/2026 | `b595458` | Semântica e estados da busca refinados |
| 12/08/2026 | `d9b9278` | Limpeza ampla de CSS, acessibilidade e testes ampliados |
| 12/08/2026 | Codex | Alternância entre duas contas Plus validada |
| 13/08/2026 | Governança | Conversas passam a ser tratadas como ambiente temporário |
| 13/08/2026 | `ec96743` | Hero e `DESIGN.md` alinhados |
| 13/08/2026 | `a5f8534` | Documentos canônicos/operacionais atualizados |
| 13/08/2026 | `23e2a32` | TOC progressivo, token tipográfico e caminhos corrigidos |
| 13/08/2026 | `fc384cc` | Caso residual de `aria-current` corrigido; 100/100 |
| 14/08/2026 | Auditoria Impeccable | Formalmente encerrada |
| 14/08/2026 | `700998c` | `.impeccable/design.json` sincronizado |
| 14/08/2026 | Vercel | `success` confirmado para `700998c` |
| 18/08/2026 | `0e86d92` | Baseline do redesign estabilizado |
| 18/08/2026 | Lote 0 | Contrato da nova arquitetura concluído |
| 18/08/2026 | Lote 0.1 | `REDESIGN_ARCHITECTURE.md` consolidado |
| 18/08/2026 | `587069f` | Contrato da nova arquitetura versionado |
| 18/08/2026 | Lote 1 | Fundação implementada e revalidada |
| 18–19/08/2026 | `cc5f6e1` | Lote 1 versionado; este é o HEAD confirmado no início do Lote 2 |
| 18/08/2026 | `de25753` | Lote 2 estrutural: Documentos virou hub com cinco páginas-filhas e compatibilidade preservada |
| 19/08/2026 | `b09b042` | `Explore Documentos` e os cards das páginas-filhas foram introduzidos |
| 19/08/2026 | `292e11b` | Navegação ativa/recolhível, simplificação editorial e contrato atualizados |
| 19/08/2026 | `0ae9420` | Lote 2 consolidado: grade final dos cards aprovada e sincronizada |
| 19/08/2026 | Revalidação visual | Navegador do Codex bloqueado; revalidação automatizada permaneceu pendente |
| 19/08/2026 | Inspeção manual | Prints confirmaram a nova hierarquia e a paginação do domínio |
| 19/08/2026 | Decisão de UX | Hub de Documentos recebeu cards compactos das filhas no final |
| 19/08/2026 | Arquitetura | Mesmo padrão definido para Workflows; Funcionalidades mantém seis cards uniformes |
| 19/08/2026 | Navegação | Sidebar retrátil e evolução do `Nesta página` aprovadas como direção |
| 19/08/2026 | Visual | Revisão futura de paletas definida, com prioridade para light mode |
| 19/08/2026 | FAQ | Desenvolvimento aprovado para etapa posterior, sem conteúdo inventado |
| 19/08/2026 | Skills | UI UX PRO MAX mantida para instalação após Lote 3, antes do Lote 4 |
| 19/08/2026 | `d5e5251` | Primeira implementação versionada do Lote 3 — Workflows |
| 19/08/2026 | Auditoria focal | Três detalhes editoriais recuperados e contratos de teste fortalecidos |
| 19/08/2026 | Validação visual | Ausência de `Explore Workflows` identificada no hub |
| 19/08/2026 | `415a113` | Derivação genérica de filhos de hubs corrigida; `Explore Workflows` renderizado e validação final aprovada |
| 20/08/2026 | UI UX PRO MAX | Instalada e consultada pontualmente para a UX da busca do Lote 4 |
| 20/08/2026 | `5c8a7c` | Checkpoint funcional: Lote 4 — Busca implementado e validado visualmente |
| 20/08/2026 | Revisão focal | `sem` preservado como termo semântico; testes de stopwords e diversidade fortalecidos para 242/242 |
| 21/08/2026 | `5b69be4` | Infraestrutura: ESLint Flat Config ignora exclusivamente `.agents/skills/**`; lint final 0 erros e 0 warnings |
| 28/08/2026 | Governança do Editor | E1 preservado em `feature/editor`; produção e desenvolvimento separados sem integrar o Editor. |
| 01/09/2026 | Governança de branches | `godocs-docs` voltou a ser a pasta principal; `develop` passou a ser a branch padrão de desenvolvimento e `main` ficou reservada à produção. |
| 01/09/2026 | `ad0212e` | Paleta A2 Contrast Refined promovida para produção. |
| 02/09/2026 | `2a74e87` | Refinamento V2 dos cards da Home promovido para produção. |
| 08/09/2026 | `fa3ff62` | Sidebar V2.5 e estabilização final promovidas para produção. |
| 09/09/2026 | `0630b60` | Background oficial da Home promovido para produção. |
| 09/09/2026 | `430d269` | Refinamento de Background + Logo promovido para `main`. |
| 09/09/2026 | `07635a6` | Correção final responsiva do background e estabilidade das logos promovida; Vercel confirmou deployment `READY` em produção. |
| 09/09/2026 | Sidebar V2.5 | Auditoria do prompt histórico separou regressions guards dos três problemas ainda abertos. |
| 09/09/2026 | Prompt canônico | `Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md` consolidado para a próxima implementação. |
---

## 24. Protocolo de manutenção

Atualizar este arquivo somente quando houver mudança material:

- novo commit relevante;
- novo deployment confirmado;
- lote iniciado/concluído;
- página criada/publicada;
- arquitetura alterada;
- decisão relevante de UX/design;
- prioridade alterada;
- débito relevante resolvido;
- nova frente iniciada;
- baseline de testes/busca/build alterado.

Não registrar como estado atual:

- hipóteses não aprovadas;
- ideias sem implementação como se fossem roadmap;
- commits não verificados;
- deployments inferidos;
- resultados antigos como se fossem reexecuções;
- informações funcionais não sustentadas por evidência.

### Cabeçalho obrigatório

Manter sempre:

```text
Última atualização
Estado geral
Fase atual
Commit mais recente confirmado
Deploy
Próxima ação principal
```

---

## 25. Retomada rápida

Ao iniciar uma nova sessão:

1. ler `AGENTS.md`;
2. ler `PRODUCT.md` se a tarefa afetar produto/documentação;
3. ler `DESIGN.md` se afetar interface;
4. ler `project-docs/REDESIGN_ARCHITECTURE.md` se afetar o redesign;
5. ler `Memória.md` quando precisar de contexto amplo;
6. ler este arquivo para o estado operacional;
7. abrir a pasta `godocs-docs`;
8. confirmar `develop` como branch de trabalho, salvo tarefa explícita de promoção;
9. inspecionar `git status`, `git diff`, `git diff --cached` e HEAD antes de assumir o estado do repositório;
10. tratar `1d392c1...` e `07635a6...` como baselines auditados em 09/09/2026, não como HEADs obrigatórios se houver somente avanço documental posterior;
11. preservar qualquer WIP legítimo;
12. não inventar fatos do GoDocs;
13. preservar white-label, permissões por ação e proporcionalidade editorial;
14. antes de tarefa no Codex, indicar modelo + nível;
15. para a próxima implementação, usar `Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md`;
16. não reabrir os escopos congelados dentro do polish da Sidebar;
17. após marco relevante, atualizar os arquivos canônicos correspondentes.

## 26. Estado ao encerrar esta atualização

O baseline de desenvolvimento auditado em 09/09/2026 é:

```text
develop
1d392c18360d7535ddbdce7452880356bc5a6671
Finaliza background responsivo e estabilidade das logos
```

A produção confirmada é:

```text
main
07635a6d1fa8480bebec0e485ef85c4f8e451d89
Finaliza background responsivo e estabilidade das logos

Vercel:
state READY
target production
```

Os Lotes 1, 2, 3, 4 e 5 permanecem concluídos. O Lote 6 está em andamento.

Estado consolidado do Lote 6:

```text
Paleta A2 Contrast Refined — implementada/aprovada
Sidebar V2.5 — estabilizada e em produção
Background oficial — em produção
Logos GoDocs Client — em produção
Background + Logo final — aprovado e em produção
Sidebar V2.5 Final Interaction Polish — próximo escopo
```

A Sidebar V2.5 Final Interaction Polish possui apenas três problemas abertos confirmados no contrato:

```text
1. hover preview intermitente
2. inset esquerdo insuficiente
3. motion com percepção de delay/travamento
```

Existe uma hipótese técnica concreta para o primeiro problema relacionada à entrada por pointer/área de intenção, mas ela ainda deve ser reproduzida e confirmada no navegador antes de qualquer correção.

O prompt canônico da próxima implementação está consolidado como:

```text
Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md
```

Background, Logos, Home, cards, busca, paleta, conteúdo editorial, URLs e arquitetura do TOC permanecem fora do escopo dessa rodada.

O Editor E1 continua preservado e pausado em `feature/editor`.

Esta atualização documental não deve ser tratada como evidência de nova implementação, novo commit ou novo deployment além dos marcos explicitamente confirmados acima.

## 27. Lote 5 — fechamento documental

> **Registro histórico preservado:** esta seção descreve o fechamento do Lote 5 no momento em que o Lote 6 ainda era a próxima frente. O estado operacional posterior está consolidado nas seções 2, 20, 22, 26 e 28.

O Lote 5 — Discovery / Consolidação foi implementado e versionado em `34ffcb9eae1c155b66f07abc7efa2cdb68195471` (`Implementacao do Lote 5`). A cronologia foi: auditoria de Discovery → Related identificado como núcleo → plano ajustado → implementação → revisão focal → dois P2 de testes → correção dos P2 → 250/250 → commit da implementação → fechamento documental.

Related / Próximos Passos passou a complementar os demais mecanismos de descoberta: paginação mantém a continuidade editorial; Related conecta contextos curados e não sequenciais; Busca atende descoberta transversal por termo ou intenção. O contrato implementado mantém `related` opcional, de 1 a 4 destinos quando utilizado, sem duplicatas ou autorreferência, com destinos existentes e publicados, sem repetir previous/next e preservando a ordem declarada. Não há recomendação automática, similaridade ou IA.

A validação usa a coleção publicada e reutiliza `getAdjacentDocs()` como fonte canônica para previous/next. A curadoria inicial contém 3 páginas e 4 relações: `O que é o GoDocs? → Visão Geral`; `Visão Geral → Documentos, Favoritos`; `Logs e ações → Favoritos`. A migração removeu o bloco manual `Próximos passos` de `O que é o GoDocs?`, preservou `Primeiro Acesso` na paginação e manteve o conteúdo funcional dos três artigos.

O baseline atual validado é: 21 documentos, 147 entradas, 126 seções, 250639 rawBytes, 29456 gzipBytes, limite 12, snippet 220, 20 arquivos/250 testes e 50 páginas estáticas. A redução de uma entrada e uma seção frente ao Lote 4 resulta somente da remoção editorial intencional do bloco manual; a busca preserva algoritmo, diversidade máxima de três resultados por documento, stopwords, `sem`, Página/Seção e zero-resultados. Compatibilidade permanece em Documentos `30/30`, Workflows `49/49`, total `79/79`.

A revisão focal encontrou dois P2 exclusivamente de cobertura: prova de que draft intercalado não contamina a paginação pública e limites positivos de 1 e 4 relações. Ambos foram corrigidos antes do commit. Permanecem como P3 não bloqueantes: teste completo de sequência Tab em Related e reavaliação futura do primitive `RelatedLinks`, que ficou sem uso nos MDX publicados e não foi removido por limpeza especulativa.

A próxima frente é o Lote 6 — Home + Hubs + identidade visual. Nenhuma decisão visual detalhada, implementação de sidebar retrátil, TOC, paletas, temas, FAQ, IA, RAG, embeddings ou similaridade foi antecipada pelo Lote 5.

---

## 28. Lote 6 — estado operacional consolidado em 09/09/2026

### Paleta A2 Contrast Refined

Implementada e aprovada.

Referência de produção registrada:

```text
ad0212eb65d72ef4272ba269d995962350e6cdb7
Implementa paleta A2 Contrast Refined
```

Direção consolidada:

```text
light canvas: #f6f7f9
dark canvas: #151515
nav: #1a1a1a
cards: #202020
interactive: #262626
elevated: #2c2c2c
orange light: #ff7600
orange dark: #ff7a1a
```

A paleta está congelada durante a rodada atual da Sidebar.

### Sidebar V2.5

Implementada, estabilizada e promovida.

```text
develop:
861a502c01f519601744bf840d708ca47aa4a317

main:
fa3ff62e9f800b21fb55d09db5f29090497a8b64
```

Baseline funcional preservado:

```text
expanded: 240px
collapsed: 48px
preview: 240px
left: 0
```

Motion auditado:

```text
hover intent: 130ms
preview close: 240ms
width open: 195ms
width close: 185ms
reveal start: 85ms
reveal duration: 95ms
opacity: .35 → 1
translateX: -4px → 0
cascade: até 9ms/item e até 85ms total
branch: 180ms geometry / 125ms opacity / 7ms stagger
toggle: 120ms
```

O baseline também preserva:

- uma única `NavigationTree`;
- preview sem mover/cobrir o artigo;
- TOC estável;
- ícones sem salto estrutural;
- hubs navegáveis com chevron separado;
- `active` independente de `open`;
- drawer mobile;
- acessibilidade;
- reduced motion;
- ausência de nova dependência de motion/UI.

### Sidebar V2.5 Final Interaction Polish

Próxima implementação.

Problemas delimitados:

1. hover preview intermitente;
2. inset esquerdo insuficiente nos itens expanded/preview;
3. perceived motion com sensação de delay/travamento.

O aumento do inset é requisito visual confirmado; a calibração deve partir aproximadamente da faixa `12–16px`, preservando a geometria.

A hipótese atual para o hover é apenas uma hipótese técnica: precisa ser reproduzida e confirmada antes de alteração.

O contrato exige pelo menos 30 ciclos válidos de hover e 100% de sucesso após intent satisfeito, além dos regression guards:

```text
icon centerY delta <= 1px
article centerX delta <= 1px
TOC delta <= 1px
```

Prompt canônico:

```text
Lote_6_Sidebar_V2_5_Final_Interaction_Polish.md
```

### Background + Logo

Concluídos, aprovados e publicados.

Histórico confirmado:

```text
develop:
50435b44dabf583d7cf4f928ae0b277082ea71d8
Implementa background oficial da Home

main:
0630b6067ef54b492e971cd4f7a664cb712a14f9
Implementa background oficial da Home
```

Refinamento:

```text
develop:
a2a88df49aaffdd281ac9d3a170c47e95966a227

main:
430d269

Refina background da Home e atualiza logos
```

Correção final:

```text
develop:
1d392c18360d7535ddbdce7452880356bc5a6671

main:
07635a6d1fa8480bebec0e485ef85c4f8e451d89

Finaliza background responsivo e estabilidade das logos
```

O deployment de produção do commit `07635a6d1fa8480bebec0e485ef85c4f8e451d89` foi confirmado como `READY`.

Decisão atual:

- Background + Logo encerrados;
- não criar V3 sem um problema novo e comprovado;
- manter esses elementos congelados durante a Sidebar.

### Próximo fluxo

```text
documentação operacional atualizada
↓
Sidebar V2.5 Final Interaction Polish em develop
↓
validações técnicas
↓
30+ ciclos de hover
↓
Impeccable focal
↓
validação visual humana
↓
commit/push somente após aprovação
↓
eventual promoção isolada para main
```
