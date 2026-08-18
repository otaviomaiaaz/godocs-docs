# GoDocs Docs — Daily Stats

> Acompanhamento operacional do projeto **GoDocs Docs**.
>
> **Última atualização:** 18 de agosto de 2026 (UTC−03:00)<br>
> **Estado geral:** Lotes 1 e 2 da Nova Arquitetura implementados localmente, sem commit ou push. A coleção possui 14 documentos; Documentos é um hub com cinco páginas-filhas e 30 deep links históricos compatíveis.<br>
> **Fase atual:** Lote 2 pronto para revisão técnica; Lote 3 — Workflows é o próximo passo.<br>
> **Commit mais recente verificado:** `587069f` — `Contrato da nova arquitetura` — 18/08/2026.<br>
> **Deploy do commit mais recente:** não revalidado nesta tarefa; a última confirmação registrada é Vercel `success` para `700998c`.<br>
> **Próxima ação principal:** revisar e versionar os Lotes 1 e 2; somente depois iniciar o Lote 3 com solicitação própria.
---

## 1. Função deste arquivo

O `daily_stats.md` é o **retrato operacional atual do projeto**.

Ele deve responder rapidamente:

- onde o projeto está agora;
- o que foi concluído recentemente;
- o que está em andamento;
- quais são as pendências atuais;
- qual é o commit mais recente relevante;
- qual é o estado do deploy;
- qual é a próxima ação recomendada.

Ele **não deve funcionar como memória histórica completa**.

Para contexto amplo, conhecimento funcional do GoDocs, decisões antigas, decisões superadas, histórico e transferência de contexto entre IAs ou ambientes, usar:

```text
project-docs/Memória.md
```

### Divisão de responsabilidade

| Arquivo | Função |
|---|---|
| `project-docs/Memória.md` | Contexto universal e consolidado do projeto |
| `project-docs/daily_stats.md` | Estado operacional atual |
| `AGENTS.md` | Regras de execução para agentes/Codex |
| `PRODUCT.md` | Definição de produto e princípios editoriais |
| `DESIGN.md` | Design System e decisões visuais canônicas |
| `README.md` | Execução, estrutura, conteúdo e comandos do repositório |
| `content/docs/` | Documentação final publicada |

As conversas servem para análise e trabalho. Informações que precisem sobreviver ao histórico devem ser consolidadas nos arquivos adequados.

---

## 2. Estado atual em uma visão

```text
PROJETO
GoDocs Docs

REPOSITÓRIO
otaviomaiaaz/godocs-docs

BRANCH
main

ÚLTIMO COMMIT
587069f — Contrato da nova arquitetura

VERCEL
não revalidado nesta estabilização

DOCUMENTOS PUBLICADOS
14

FRENTE EDITORIAL
Configurações

FRENTE DE DESIGN E ARQUITETURA
Lotes 1 e 2 implementados localmente; Lote 3 — Workflows pendente

MEMÓRIA UNIVERSAL
Memória.md (ainda não versionado em project-docs/ na main)

ESTADO OPERACIONAL
daily_stats.md + REDESIGN_ARCHITECTURE.md
```

---

## 3. Repositório e publicação

### Repositório

```text
otaviomaiaaz/godocs-docs
```

Estado verificado:

| Item | Situação |
|---|---|
| Visibilidade | Pública |
| Branch principal | `main` |
| Permissão | Admin / push |
| Repositório arquivado | Não |
| Deploy | Vercel |
| Conteúdo | Markdown/MDX local |
| CMS | Não |
| Banco de dados | Não |
| Autenticação própria | Não |

### Último commit verificado

```text
07dfed73b3eeb6275d73ad67f0cbdb80cb636112
Atualiza estado operacional do projeto
14/08/2026
```

O commit atualiza apenas:

```text
project-docs/daily_stats.md
```

### Deploy

O deploy associado a `07dfed7` não foi revalidado nesta estabilização. A última confirmação registrada permanece:

```text
Vercel: success para 700998c
```

Não inferir o estado do deploy de um commit posterior sem nova verificação no provedor.

### Estado local verificado na estabilização

Não houve commit nem push nesta tarefa. O working tree contém apenas as alterações esperadas da estabilização: referências de redesign, fronteira do teste de identidade e este registro operacional.

---

## 4. O que mudou recentemente

### `b595458` — Melhoria de interface

Principais efeitos:

- correções de estados visuais;
- melhorias de semântica ARIA da busca;
- `aria-expanded` alinhado à visibilidade real;
- `aria-controls` condicionado à existência da lista;
- ampliação de testes de estados do combobox.

### `d9b9278` — Melhoria de interface 2

Principais efeitos:

- grande limpeza de `app/globals.css`;
- remoção de mais de mil linhas em relação ao commit anterior;
- redução de estilos antigos e duplicados;
- ampliação de testes de acessibilidade de artigos;
- novos testes de blocos de código;
- melhorias em headings;
- ajustes em componentes MDX;
- melhorias de touch targets em navegação mobile;
- botão de retry da busca ajustado para 44 px;
- reforço de testes de identidade e design.

### `ec96743` — Melhoria de interface 3

Principais efeitos:

- `DESIGN.md` passou a documentar formalmente a regra **Hero Atmosphere**;
- a ambientação técnica/focal do hero deixou de ser apenas um possível design drift e passou a ter uma exceção governada dentro do Design System;
- a exceção ficou restrita ao hero e não autoriza decoração equivalente em cards, artigos, sidebar ou outras superfícies;
- foram explicitamente mantidas restrições contra decoração gratuita, glassmorphism, glow promocional, efeitos 3D, parallax e animações ornamentais;
- a implementação do hero foi simplificada;
- o campo pontilhado ornamental foi removido;
- os anéis/elipses ambientais adicionais foram removidos;
- `home-hero__ambient` foi simplificado para uma única camada estrutural;
- a implementação e o `DESIGN.md` ficaram mais alinhados.

### `a5f8534` — Atualização de memória e design do sistema

Principais efeitos verificados:

- ajustes pontuais no `DESIGN.md`;
- refinamentos no `PRODUCT.md`;
- reorganização ampla de `project-docs/daily_stats.md` para sua função operacional atual;
- nenhuma criação de `project-docs/Memória.md` foi verificada na `main`.

### `23e2a32` — Revisão de auditoria

Principais efeitos:

- correções de fechamento concentradas no TOC, no estado ativo, no token tipográfico da home e na governança de caminhos;
- TOC móvel de artigos longos passou a usar divulgação progressiva sem reduzir os touch targets de 44 px;
- Workflows preservou os 24 destinos e passou a mostrar 7 destinos inicialmente;
- `.home-hero h1` passou a consumir `--type-home-title` como fonte canônica;
- referências operacionais `project_docs/` no `AGENTS.md` foram corrigidas para `project-docs/`;
- cobertura automatizada do TOC foi ampliada.

### `fc384cc` — Revisão de auditoria final

Principais efeitos:

- correção do caso residual de `aria-current` no último heading de artigos longos;
- o listener passivo de `scroll` passou a coexistir com `IntersectionObserver`, garantindo reavaliação da regra de fim do documento;
- dois testes de regressão foram adicionados para o último heading no limite inferior;
- suíte final passou de 98 para **100 testes**, todos aprovados;
- N1 foi considerado resolvido;
- a auditoria deixou de possuir bloqueio técnico pendente.

### `700998c` — Sincroniza Impeccable com o Design System

Principais efeitos:

- somente `.impeccable/design.json` foi alterado;
- sidecar foi regenerado para refletir o `DESIGN.md` atual;
- foram adicionadas rampas tonais OKLCH às 20 cores existentes;
- overview e regras narrativas foram sincronizados, incluindo **The Essential Technical Atmosphere Rule**;
- o exemplo de Icon Button foi alinhado ao token semântico `--accent-hover`;
- o breakpoint `mobile-compact: 341px` foi preservado após confirmação de correspondência com regras reais `@media (max-width: 340px)` da implementação;
- `DESIGN.md` permaneceu inalterado durante a sincronização;
- JSON/schema e `git diff --check` foram aprovados.

### Consequência operacional

O antigo item pendente:

```text
decidir se a ambientação do hero faz parte da Sala de Referência GoDocs
```

está **resolvido**.

A decisão atual é:

> A ambientação estrutural e focal discreta pode existir no hero quando subordinada ao conteúdo e obedecendo às regras definidas em `DESIGN.md`.

Além disso, a auditoria Impeccable que gerou os lotes de correção e fechamento está **formalmente encerrada**. Novas mudanças visuais devem ser tratadas como uma nova frente de evolução, e não como continuação automática dessa auditoria.

---

## 5. Conteúdo publicado

Existem **14 documentos MDX** na coleção atual.

### Comece por aqui

```text
content/docs/o-que-e-o-godocs.mdx
content/docs/primeiro-acesso.mdx
```

### Funcionalidades

```text
content/docs/funcionalidades/index.mdx
content/docs/funcionalidades/visao-geral.mdx
content/docs/funcionalidades/documentos.mdx
content/docs/funcionalidades/documentos/pastas.mdx
content/docs/funcionalidades/documentos/adicionar-documentos.mdx
content/docs/funcionalidades/documentos/filtros-e-metadados.mdx
content/docs/funcionalidades/documentos/gerenciar-documentos.mdx
content/docs/funcionalidades/documentos/logs-e-acoes.mdx
content/docs/funcionalidades/favoritos.mdx
content/docs/funcionalidades/workflows.mdx
content/docs/funcionalidades/busca-inteligente.mdx
content/docs/funcionalidades/relatorios.mdx
```

### Estado editorial

| Página | Estado |
|---|---|
| O que é o GoDocs? | Publicado |
| Primeiro Acesso | Publicado |
| Funcionalidades | Publicado — hub explícito |
| Visão Geral | Publicado |
| Documentos | Publicado — hub editorial |
| Organizar pastas e subpastas | Publicado |
| Adicionar documentos | Publicado |
| Localizar, filtrar e consultar metadados | Publicado |
| Visualizar e gerenciar documentos | Publicado |
| Logs e ações | Publicado |
| Favoritos | Publicado |
| Workflows | Publicado |
| Busca Inteligente | Publicado |
| Relatórios | Publicado |
| Configurações | Em análise/documentação |

Não existe, até a verificação atual, um arquivo publicado de **Configurações** em `content/docs/`.

---

## 6. Trabalho em andamento

### 6.1 Configurações

**Estado:** frente editorial ativa.

Já foi realizada uma análise inicial da seção a partir de um conjunto amplo de prints.

Próximas etapas:

1. concluir a análise funcional;
2. consolidar o texto final;
3. revisar como especialista em documentação;
4. revisar como usuário iniciante;
5. salvar/aprovar a versão editorial;
6. transformar em MDX;
7. validar navegação, busca, TOC, paginação e home após publicação.

Regra: não inferir funções de Configurações apenas pelo nome da área. Utilizar somente informações sustentadas pelas evidências.

### 6.2 Auditoria Impeccable

**Estado:** encerrada.

A auditoria passou por lotes de correção, reauditoria, lotes de fechamento, revalidação focal e um lote final para o caso residual de `aria-current`.

Estado final confirmado:

- achado #5 do TOC móvel: resolvido;
- N1 — estado ativo / `aria-current`: resolvido;
- N2 — token `--type-home-title`: resolvido;
- N3 — caminhos do `AGENTS.md`: resolvido;
- nenhuma regressão relevante permaneceu aberta;
- suíte final: **14 arquivos / 100 testes / 100 aprovados / 0 falhas**;
- `pnpm content:validate`: aprovado para 8 documentos;
- typecheck: aprovado;
- lint: 0 erros do produto; warnings conhecidos restritos a `.agents/skills/impeccable`;
- build: aprovado com 24 páginas estáticas;
- console do produto: sem erros ou warnings observados na validação final;
- overflow horizontal: ausente nos breakpoints inspecionados;
- `git diff --check`: aprovado.

Indicadores finais do TOC de Workflows em `390×844`:

- 24 destinos totais;
- 7 destinos inicialmente visíveis;
- 17 destinos progressivos;
- altura inicial aberta de 384 px;
- 45,50% da viewport;
- touch targets mínimos de 44 px preservados.

Após o encerramento funcional, `.impeccable/design.json` foi sincronizado separadamente com o `DESIGN.md` e versionado no commit `700998c`.

Não existe, no estado verificado, bloqueio técnico remanescente da auditoria.

### 6.3 Auditoria Estratégica e contrato da nova arquitetura

A Auditoria Estratégica foi concluída. O Lote 0 foi aprovado e consolidado em `project-docs/REDESIGN_ARCHITECTURE.md`, que registra a arquitetura-alvo, hubs, slugs públicos futuros, compatibilidade, `pageType`, paginação, guardrails e roadmap.

No baseline do contrato, os 8 documentos publicados permaneciam inalterados. Documentos e Workflows continuavam, respectivamente, com aproximadamente 11 e 20 minutos de leitura; a decomposição ainda não havia sido implementada. A decisão sobre quantidade de resultados da busca em mobile e desktop permanece deferida para o Lote 4.

O passo seguinte desse baseline foi o Lote 1 — Fundação da Nova Arquitetura.

### 6.4 Lote 1 — Fundação da Nova Arquitetura

O Lote 1 foi implementado localmente sobre `587069f`, sem commit ou push. A fundação agora inclui `pageType` explícito, destino de seção por `entrySlug`, hub `/docs/funcionalidades`, árvore preparada para hubs com filhos, breadcrumbs por ancestrais reais, paginação por domínio, manifesto tipado dos 79 anchors atuais, fragments H2/H3/H4 + aliases e baseline determinístico da busca.

Documentos e Workflows não foram decompostos. Seus corpos editoriais e 79 anchors permanecem nas URLs atuais. A home continua mostrando os seis cards de funcionalidades; o novo hub entra em rota, canonical, sitemap, imagem social e busca sem antecipar o redesign visual.

Validação registrada neste lote:

```text
content:validate: 9 documentos válidos
lint: 0 erros do produto; 151 warnings preexistentes em .agents/skills/impeccable
typecheck: aprovado com --incremental false
testes: 18 arquivos / 127 testes aprovados / 0 falhas
build: aprovado / 26 páginas estáticas
busca: 9 documentos / 134 entradas / 271.847 bytes bruto / 36.557 bytes gzip
visual: 320, 390, 767, 1023, 1279 e 1440; light/dark; sem overflow ou console errors
```

### 6.5 Governança de memória

Foi definida uma organização:

```text
conversas
   ↓
trabalho temporário
   ↓
decisões / conhecimento confirmado
   ↓
arquivos canônicos
   ↓
Memória.md + daily_stats.md
```

O objetivo é reduzir dependência das conversas antigas.

Na `main` verificada em 14/08/2026, `project-docs/Memória.md` ainda não está versionado. O `daily_stats.md` já existe em `project-docs/` e esta atualização consolida o encerramento da auditoria.

---

### 6.5 Lote 2 — Documentos

O Lote 2 foi implementado localmente sobre `cc5f6e1`, sem commit ou push. `/docs/funcionalidades/documentos` agora é um hub editorial e suas cinco páginas-filhas publicadas organizam o conteúdo por intenção: pastas, adição, filtros e metadados, gerenciamento e logs e ações. Nenhum conteúdo de Workflows foi alterado.

Os 30 aliases históricos de Documentos resolvem para os destinos canônicos; os 49 aliases de Workflows continuam apontando para a mesma URL e fragmento. A navegação, breadcrumbs, paginação, busca, sitemap, canonical e imagens sociais derivam das 14 páginas publicadas. A Home preserva os seis cards de funcionalidades de primeiro nível.

Baseline da busca após o lote: 14 documentos, 141 entradas, 14 páginas, 127 seções, payload bruto de 276.568 bytes e gzip de 35.862 bytes. As consultas `pastas`, `adicionar documento`, `metadados`, `logs da pasta` e `visualizar documento` priorizam as respectivas filhas. Não houve ajuste de algoritmo, pesos, snippets ou limite de resultados.

Validações técnicas executadas: `pnpm content:validate`, lint (0 erros; 151 avisos preexistentes em `.agents`), typecheck, 165 testes, build, benchmark e `git diff --check`. A inspeção visual automatizada do navegador local ficou bloqueada pela restrição do ambiente antes de abrir uma página; o servidor de produção respondeu `200` para o hub.

## 7. Arquivos de contexto e governança

### Estado desejado

```text
godocs-docs/
├── AGENTS.md
├── PRODUCT.md
├── DESIGN.md
├── README.md
│
├── content/
│   └── docs/
│
└── project-docs/
    ├── Memória.md
    ├── daily_stats.md
    ├── PROJECT_PROMPT.md
    ├── SYSTEM_BLUEPRINT.md
    └── references/
```

### Estado atual da `main`

Na verificação de 14/08/2026, `project-docs/` contém:

```text
PROJECT_PROMPT.md
SYSTEM_BLUEPRINT.md
daily_stats.md
references/
```

O `Memória.md` ainda não está versionado em `project-docs/`.

O `daily_stats.md` foi incorporado à `main` em sua forma operacional no commit `a5f8534`; esta revisão de 14/08 atualiza o estado após o encerramento da auditoria e a sincronização do Impeccable.

As referências operacionais do `AGENTS.md` usam atualmente o caminho correto `project-docs/`. A ocorrência histórica de `project_docs` registrada anteriormente no próprio `daily_stats.md` não é uma instrução operacional.

---

## 8. Débitos e riscos atuais

### P1 — Governança

- [ ] Versionar `Memória.md` em `project-docs/`.
- [x] Substituir a antiga versão ampla de `project-docs/daily_stats.md` pelo formato operacional atual.
- [x] Corrigir referências `project_docs/` → `project-docs/` no `AGENTS.md`.
- [ ] Revalidar README e documentos históricos para evitar estados editoriais antigos tratados como atuais.
- [ ] Versionar esta atualização do `daily_stats.md` após revisão/aprovação.

### P1 — Design e acessibilidade

- [x] Resolver a decisão de Design System sobre a ambientação do hero.
- [x] Simplificar a decoração do hero e remover elementos ornamentais excedentes.
- [x] Realizar uma grande limpeza inicial de CSS legado.
- [x] Ampliar testes de acessibilidade de artigos.
- [x] Corrigir e revalidar touch targets de 44 px nos componentes auditados.
- [x] Revalidar contraste dos pontos identificados pela auditoria.
- [x] Revisar o TOC mobile de páginas longas, principalmente Workflows.
- [x] Revalidar o achado de CSS legado/duplicações sem reintrodução relevante.
- [x] Ampliar a cobertura automatizada de páginas completas e cenários de acessibilidade.
- [x] Corrigir o estado ativo / `aria-current` no último heading sem espaço inferior suficiente.
- [x] Sincronizar `.impeccable/design.json` com o `DESIGN.md` após o encerramento da auditoria.

**Estado:** não há débito de design/acessibilidade remanescente identificado como bloqueador pela auditoria encerrada. Novos achados devem ser tratados como nova análise, regressão ou nova frente de evolução.

### P1 — Editorial

- [ ] Finalizar Configurações.
- [ ] Converter Configurações para MDX após aprovação.
- [ ] Manter Notion e MDX sincronizados.
- [ ] Continuar revisão das páginas existentes quando surgirem novas evidências.

### P2 — Processo

- [ ] Preferir mensagens de commit descritivas.
- [ ] Manter rotina Git consistente entre trabalho e casa.
- [ ] Consolidar decisões importantes nos arquivos em vez de depender dos chats.

---

## 9. Stack e validação

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

Comandos de qualidade:

```bash
pnpm audit:prod
pnpm content:validate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Para alterações visuais, validar também:

- desktop;
- notebook;
- tablet;
- celular;
- tema claro;
- tema escuro;
- teclado;
- foco;
- dialogs/drawers;
- overflow;
- console;
- reduced motion quando aplicável.

### Baseline funcional validado no encerramento da auditoria

No lote final de `fc384cc`:

```text
Arquivos de teste: 14
Testes: 100
Aprovados: 100
Falhas: 0

content:validate: aprovado — 8 documentos
typecheck: aprovado
lint: 0 erros
build: aprovado — 24 páginas estáticas
console: sem erros/warnings observados
overflow horizontal: não reproduzido nos breakpoints inspecionados
git diff --check: aprovado
```

O lint registrou 151 warnings preexistentes restritos aos scripts internos em `.agents/skills/impeccable`; eles não foram classificados como falha do produto.

A primeira execução de testes em ambiente restrito encontrou `spawn EPERM`; a repetição pelo mecanismo permitido passou integralmente. O aviso de `HTMLCanvasElement.getContext()` pertence ao JSDOM auxiliar e não afetou os testes.

### Validação da sincronização do sidecar

O commit `700998c` altera apenas `.impeccable/design.json`.

Na tarefa de sincronização foram confirmados:

- JSON válido;
- schema v2;
- 20 cores com 20 rampas tonais válidas;
- narrativa comparada com `DESIGN.md`;
- `DESIGN.md` preservado;
- correção do exemplo de Icon Button para `--accent-hover`;
- validade do breakpoint `mobile-compact: 341px`;
- `git diff --check` aprovado.

A suíte funcional completa de 100 testes pertence ao baseline imediatamente anterior; não foi registrada como reexecutada após a alteração exclusiva do sidecar.

Não registrar resultados antigos de testes como se fossem validações de uma versão futura diferente.

---

## 10. Desenvolvimento entre máquinas e contas

O projeto pode ser desenvolvido no computador do trabalho e em casa.

O caminho local não precisa ser igual.

A continuidade vem do mesmo repositório:

```bash
git pull origin main
```

antes de começar, e:

```bash
git status
git add .
git commit -m "mensagem descritiva"
git push origin main
```

ao finalizar.

Também é possível alternar entre contas Plus no Codex.

A troca da conta do Codex:

- não muda os arquivos locais;
- não muda o Git;
- não muda o GitHub;
- não exige migrar o projeto do ChatGPT;
- não deve ser usada como fonte de continuidade contextual.

A continuidade deve vir dos arquivos e do repositório.

---

## 11. Fluxo editorial e de publicação

```text
GoDocs real / evidências
          ↓
análise e documentação
          ↓
Notion, quando usado na autoria interna
          ↓
conteúdo aprovado
          ↓
Codex / MDX
          ↓
repositório local
          ↓
GitHub / main
          ↓
Vercel
          ↓
GoDocs Docs
```

Importante:

```text
Notion atualizado ≠ site atualizado
```

A versão pública só muda depois da sincronização com o repositório e do deployment correspondente.

---

## 12. Próximas ações recomendadas

### 1. Revisar e versionar o Lote 1 — Fundação da Nova Arquitetura

Revisar o diff local e, após aprovação, criar commit e publicar separadamente. Não iniciar a decomposição de Documentos ou Workflows sem a solicitação correspondente aos Lotes 2 ou 3.

### 2. Finalizar Configurações

A frente editorial de Configurações permanece separada. Continuar somente com informações sustentadas pelas evidências disponíveis e converter para MDX após aprovação.

### 3. Sincronizar a memória universal do projeto

`project-docs/Memória.md` continua ausente da `main` verificada.

Quando a versão consolidada estiver aprovada e disponível para versionamento, adicionar:

```text
project-docs/Memória.md
```

Não reconstruir esse arquivo por inferência caso a versão canônica não esteja disponível.

### 4. Versionar esta atualização operacional

Após revisar este `daily_stats.md`, substituir a versão do repositório e criar um commit descritivo.

### 5. Tratar novas melhorias visuais como nova fase

Qualquer evolução visual deve ocorrer em tarefa separada e partir da fundação estrutural aprovada.

Não reabrir automaticamente os achados antigos. Qualquer nova evolução visual deve partir do baseline auditado e ser tratada como nova iniciativa, preservando:

- `DESIGN.md` como fonte visual canônica;
- acessibilidade;
- touch targets;
- comportamento do TOC;
- temas claro e escuro;
- ausência de regressões.

### 6. Manter GitHub e Vercel sincronizados

Após cada marco material:

- confirmar SHA na `main`;
- confirmar status de deployment;
- atualizar este arquivo apenas quando houver mudança operacional relevante.

---

## 13. Registro recente

| Data | Marco | Resultado |
|---|---|---|
| 11/08/2026 | `8c7b5d6` | Atualização ampla da documentação |
| 11/08/2026 | `561c3de` | Checkpoint GoDocs Docs |
| 12/08/2026 | Impeccable | Auditoria de design avançou por lotes |
| 12/08/2026 | `b595458` | Semântica e estados da busca refinados |
| 12/08/2026 | `d9b9278` | Grande limpeza de CSS, testes e acessibilidade ampliados |
| 12/08/2026 | Memória universal | `Memória.md` consolidado como contexto universal fora da `main`; versionamento continua pendente |
| 12/08/2026 | Codex | Alternância entre duas contas Plus validada |
| 13/08/2026 | Governança | Conversas passam a ser tratadas como ambiente temporário de trabalho |
| 13/08/2026 | `ec96743` | Hero e `DESIGN.md` alinhados; ambientação governada e simplificada |
| 13/08/2026 | Vercel | `success` confirmado para `ec96743` |
| 13/08/2026 | `a5f8534` | `DESIGN.md`, `PRODUCT.md` e `daily_stats.md` atualizados |
| 13/08/2026 | `23e2a32` | Lotes de fechamento consolidados: TOC progressivo, token tipográfico e caminhos operacionais |
| 13/08/2026 | `fc384cc` | Caso residual de `aria-current` corrigido; suíte final 100/100 |
| 14/08/2026 | Auditoria Impeccable | Auditoria formalmente encerrada, sem bloqueio técnico remanescente |
| 14/08/2026 | `700998c` | `.impeccable/design.json` sincronizado com o Design System |
| 14/08/2026 | Vercel | `success` confirmado para `700998c` |
| 14/08/2026 | Git | `main` sincronizada com `origin/main` e working tree limpo após o push de `700998c` |
| 18/08/2026 | Baseline do redesign | Referências normalizadas, falso positivo de identidade corrigido e validação técnica verde; pronto para revisão e versionamento |
| 18/08/2026 | Lote 0 e Lote 0.1 | Contrato da nova arquitetura aprovado e consolidado em `REDESIGN_ARCHITECTURE.md`; próximo passo é o Lote 1 |
| 18/08/2026 | Lote 1 | Fundação técnica implementada e validada localmente; sem commit, push ou decomposição editorial |
| 18/08/2026 | Lote 2 | Documentos decomposto em hub e cinco filhas; 30 aliases preservados, 49 anchors de Workflows intactos e validação técnica verde; sem commit ou push |

---

## 14. Protocolo de manutenção

Atualizar este arquivo somente quando houver mudança material, como:

- novo commit relevante;
- novo deployment importante;
- página concluída ou publicada;
- nova frente iniciada;
- prioridade alterada;
- débito relevante resolvido;
- risco novo;
- mudança de fase;
- mudança importante de design ou arquitetura.

Não registrar:

- cada comando;
- cada tentativa;
- cada pequena alteração;
- conversas completas;
- histórico funcional detalhado do GoDocs.

Esses detalhes pertencem ao código, aos documentos canônicos ou ao `Memória.md`.

### Cabeçalho obrigatório

Manter sempre atualizados:

```text
Última atualização
Estado geral
Fase atual
Commit mais recente verificado
Deploy do commit
Próxima ação principal
```

---

## 15. Retomada rápida

Ao iniciar uma nova sessão:

1. Leia `AGENTS.md`.
2. Leia `PRODUCT.md` se a tarefa afetar produto ou documentação.
3. Leia `DESIGN.md` se a tarefa afetar interface.
4. Leia `Memória.md` quando precisar do contexto amplo.
5. Leia este arquivo para saber o estado operacional.
6. Inspecione a `main` antes de assumir commit, conteúdo ou pendências.
7. Não use conversas antigas como fonte superior aos arquivos e ao repositório.
8. Não invente fatos do GoDocs.
9. Preserve visão white-label, permissões por ação e detalhamento proporcional.
10. Ao concluir um marco relevante, atualize este arquivo novamente.

---

**Estado ao encerrar esta atualização:** a branch `main` permanece em `cc5f6e1` — **Redesign - Implementação do Lote 1**, com os Lotes 1 e 2 implementados apenas no working tree e prontos para revisão. A coleção possui 14 documentos publicados; `/docs/funcionalidades/documentos` é hub de cinco filhas. Os 30 anchors históricos de Documentos apontam para seus destinos canônicos e os 49 anchors de Workflows permanecem inalterados. `content:validate`, lint, typecheck, testes, build, benchmark e `git diff --check` foram executados neste lote; não houve commit, push ou deploy.
