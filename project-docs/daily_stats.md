# GoDocs Docs — Daily Stats

> Acompanhamento operacional do projeto **GoDocs Docs**.
>
> **Última atualização:** 19 de agosto de 2026, fechamento documental do Lote 3 (UTC−03:00)
> **Estado geral:** Lotes 1, 2 e 3 da Nova Arquitetura concluídos e sincronizados no GitHub.
> **Fase atual:** preparação do Lote 4 — Busca.
> **Commit mais recente confirmado:** `415a113` — `Revisão dos workflows`.
> **Deploy:** a associação do estado atual a um deployment específico não foi confirmada. A última confirmação explícita registrada de Vercel `success` permanece no commit `700998c`. Prints renderizados do sistema foram fornecidos em 19/08/2026, mas não devem ser usados para inferir automaticamente qual SHA está publicado.
> **Próxima ação principal:** concluir este fechamento documental, instalar UI UX PRO MAX e então iniciar o Lote 4 — Busca.

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

BRANCH
main

HEAD FINAL CONFIRMADO DO LOTE 3
415a113 — Revisão dos workflows

ESTADO DO LOTE 1
Versionado

ESTADO DO LOTE 2
Concluído e sincronizado
Hub + cinco páginas-filhas
Compatibilidade histórica preservada
Validação visual aprovada

COLEÇÃO APÓS O LOTE 3
21 documentos

COLEÇÃO DO LOTE 1 VERSIONADO
9 documentos

PRÓXIMO LOTE
Lote 4 — Busca
Próxima etapa do redesign

FRENTE EDITORIAL PARALELA
Configurações — analisada/documentada em conversa; publicação MDX não confirmada

AUDITORIA IMPECCABLE ANTERIOR
Encerrada

UI UX PRO MAX
Não há confirmação de instalação
Instalação planejada após o Lote 3, antes do Lote 4

VERCEL
Último success explicitamente registrado: 700998c
Estado do SHA atual não confirmado
```

### Observação sobre “publicado”

A contagem de **21 documentos** pertence ao estado final do Lote 3 em `415a113`, com `HEAD = origin/main` na verificação final. Isso não confirma, por si só, qual SHA está publicado em produção.

---

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

Estado conhecido:

| Item | Situação |
|---|---|
| Branch principal | `main` |
| Deploy | Vercel |
| Conteúdo | Markdown/MDX local |
| CMS público | Não |
| Banco de dados próprio da documentação | Não |
| Autenticação própria da documentação | Não |

### Último HEAD confirmado para a frente atual

No início do Lote 2:

```text
cc5f6e1 — Redesign - Implementação do Lote 1
```

O Lote 2 foi desenvolvido sobre esse estado. As validações intermediárias ocorreram antes dos commits finais; o fechamento foi consolidado e sincronizado posteriormente em `0ae9420`.

### Deploy

A última confirmação explícita registrada permanece:

```text
Vercel: success para 700998c
```

Não assumir que um push ou um estado local mais novo está publicado sem confirmar a associação:

```text
commit / SHA
→ deployment
→ ambiente acessível
```

Em 19/08/2026 foram fornecidos prints renderizados do sistema com a nova estrutura de Documentos. Esses prints servem como evidência visual da interface apresentada, mas não confirmam, por si só, qual SHA está ativo no Vercel.

---

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

## 11. Documentos canônicos e atualizações necessárias

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

Uma versão revisada desse documento foi preparada nesta frente de trabalho em 19/08/2026. A incorporação/versionamento no repositório deve ser confirmada no fluxo Git; não assumir que o arquivo gerado fora do repositório já esteja na `main`.

### `daily_stats.md`

Este arquivo deve registrar o estado atual descrito aqui:

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

## 13. Busca — estado e decisões

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

### Baseline final após Lote 3

```text
21 documentos
148 entradas
127 seções
252741 rawBytes
29706 gzipBytes
limit 12
snippet 220
```

### Decisão deferida do Lote 0

Ainda não existe limite definitivo distinto por viewport.

Hipótese registrada para o Lote 4:

- testar até 8 resultados no mobile;
- testar até 10 no desktop;
- comparar com o baseline atual de 12;
- avaliar descoberta, densidade e qualidade antes de consolidar.

### Nova observação relacionada

O problema visual identificado em **Busca Inteligente** está atualmente ligado ao componente `Nesta página`, não a uma decisão de decompor automaticamente a página.

---

## 14. Skills, Codex e economia de créditos

### Impeccable

Estado:

- instalada/em uso no projeto;
- auditoria anterior encerrada;
- não usar automaticamente em todos os lotes;
- volta a ter papel central na fase visual e na reauditoria final.

### UI UX PRO MAX

Estado conhecido:

- não há confirmação de instalação;
- não instalar durante o fechamento do Lote 2;
- não usar no Lote 3;
- instalar **após o Lote 3 — Workflows e antes do Lote 4 — Busca**.

Plano atual:

```text
Lote 4 — uso pontual para UX da busca
Lote 5 — uso pontual/opcional
Lotes 6 e 7 — UI UX PRO MAX + Impeccable
Lote 9 — Impeccable principal; UI UX PRO MAX somente se necessário
```

Papel esperado quando usadas juntas:

```text
UI UX PRO MAX
→ explorar padrões e alternativas

Impeccable
→ auditar, criticar e funcionar como quality gate
```

UI UX PRO MAX não deve:

- substituir `PRODUCT.md`;
- substituir `DESIGN.md`;
- substituir `REDESIGN_ARCHITECTURE.md`;
- gerar um Design System paralelo;
- apagar a identidade GoDocs.

### Regra de escolha de modelo no Codex

Antes de cada nova tarefa do Codex, indicar explicitamente:

- modelo: **Sol, Terra ou Luna**;
- nível de raciocínio;
- escolha orientada ao melhor resultado com economia de créditos/tokens.

Convenção operacional adotada:

- arquitetura ou trabalho de alto risco: Sol High quando realmente necessário;
- implementação técnica/editorial delimitada: Terra, geralmente High;
- validação visual/focal: Terra Medium;
- tarefas Git simples: Luna Medium pode ser suficiente.

Não usar Sol High/Extra High por padrão sem necessidade.

### Configuração histórica do Lote 3

No início do Lote 3, a direção era:

```text
Modelo: Terra
Nível: High
Chat: novo chat
Impeccable: não
UI UX PRO MAX: não
```

O Lote 3 foi concluído. A instalação da UI UX PRO MAX continua sendo o próximo marco antes do Lote 4.

---

## 15. Desenvolvimento entre máquinas e contas

O desenvolvimento entre computador do trabalho e computador pessoal foi definido usando o GitHub como fonte central.

O caminho local da pasta não precisa ser igual.

Fluxo:

```bash
git status
git pull origin main
```

desenvolver e validar, depois:

```bash
git status
git add .
git commit -m "mensagem descritiva"
git push origin main
```

No outro computador:

```bash
git pull origin main
```

Regras:

- não depender de sincronização de pastas locais entre máquinas;
- `node_modules` permanece local;
- segredos e `.env` não devem ser versionados;
- Git é a fonte de continuidade;
- confirmar deployment Vercel quando o marco for publicado.

### Alternância entre contas Plus no Codex

Foi validado que o usuário pode:

- manter o projeto principal e o contexto no mesmo ChatGPT;
- alternar entre duas contas Plus no Codex;
- continuar usando o mesmo repositório local;
- não migrar o projeto do ChatGPT por causa da troca de conta do Codex.

A continuidade do Codex deve vir dos arquivos do projeto e do Git, não da memória da conta autenticada.

---

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

O arquivo foi consolidado como memória canônica nesta atualização documental. Ele permanece não rastreado até a revisão humana e o próximo commit documental deliberado; não tratar essa pendência documental como pendência do Lote 2 de código.

---

## 17. Débitos e riscos atuais

### P1 — Fechamento dos Lotes 2 e 3

- [x] hub de Documentos concluído com os cinco cards após `Conceitos importantes`;
- [x] desktop, mobile, light e dark validados manualmente;
- [x] compatibilidade de Documentos e Workflows preservada;
- [x] checkpoints do lote sincronizados em `origin/main`;
- [x] baseline técnico final revalidado.
- [x] Workflows decomposto em hub e sete filhas;
- [x] `Explore Workflows`, drawer, paginação, aliases e cards validados;
- [x] correção de derivação genérica de hubs versionada em `415a113`.

### P1 — Arquitetura e documentação interna

- [x] `REDESIGN_ARCHITECTURE.md` atualizado com o estado concluído do Lote 2;
- [x] `daily_stats.md` e `Memória.md` atualizados para o fechamento documental;
- [ ] revisar e versionar o fechamento documental do Lote 3.

### P1 — Editorial

- [ ] finalizar/publicar Configurações somente quando o conteúdo estiver aprovado e implementado;
- [ ] continuar usando apenas informações sustentadas por evidências;
- [ ] não inventar permissões ou comportamentos.

### P2 — Navegação futura

- [ ] implementar sidebar desktop retrátil em lote adequado;
- [ ] manter ramos internos expansíveis;
- [ ] evoluir `Nesta página` para comportamento hierárquico/progressivo;
- [ ] preservar drawer no mobile.

### P2 — Visual

- [ ] revisar paleta do tema claro com prioridade;
- [ ] refinar tema escuro;
- [ ] realizar revisão por tokens;
- [ ] consolidar valores finais no `DESIGN.md` somente após desenho/validação;
- [ ] preservar laranja GoDocs como accent;
- [ ] evitar poluição visual.

### P2 — FAQ

- [ ] desenvolver FAQ em etapa posterior;
- [ ] usar somente perguntas factuais e úteis;
- [ ] manter respostas curtas;
- [ ] direcionar para artigos completos quando necessário.

### P2 — Busca

- [ ] testar hipótese de quantidade de resultados no Lote 4;
- [ ] medir densidade e descoberta;
- [ ] não alterar limite por suposição antes dos testes.

### Governança

- [ ] revalidar o estado real de `Memória.md` na `main` quando necessário;
- [ ] continuar consolidando decisões importantes nos arquivos canônicos;
- [ ] evitar tratar snapshots antigos como estado atual.

---

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

Esses números pertencem a snapshots diferentes. Não compará-los como se fossem a mesma suíte sem considerar o crescimento da implementação.

---

## 20. Roadmap oficial atualizado

```text
Lote 0 — Contrato ✅
Lote 0.1 — Consolidação ✅
Lote 1 — Fundação ✅ versionado

Lote 2 — Documentos ✅ concluído
├── decomposição ✅
├── compatibilidade ✅
├── busca/SEO ✅
├── Explore Documentos ✅
├── validação técnica ✅
└── validação visual manual ✅

Lote 3 — Workflows ✅ concluído
├── hub + sete filhas ✅
├── compatibilidade 49/49 ✅
├── Explore Workflows ✅
├── validação técnica ✅
└── validação visual manual ✅

Lote 4 — Busca
Lote 5 — Descoberta e consolidação
Lote 6 — Home + Hubs + identidade visual
Lote 7 — Refinamento visual e microinterações
Lote 8 — Governança editorial
Lote 9 — Reauditoria Impeccable + regressão final
```

### Dependências importantes

```text
Lote 3 concluído e versionado
→ fechamento documental
→ instalar UI UX PRO MAX
→ Lote 4 — Busca
```

### Lotes 6 e 7

Concentrarão a evolução visual mais profunda:

- paletas;
- tema claro;
- tema escuro;
- tokens;
- superfícies;
- cards;
- hubs;
- sidebar;
- estados;
- hover/focus/active;
- microinterações.

Impeccable e UI UX PRO MAX deverão trabalhar de forma complementar nesses lotes.

---

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

### 1. Revisar e versionar o fechamento documental do Lote 3

O Lote 3 está consolidado em `415a113`. Esta atualização documental deve ser revisada e versionada separadamente antes do próximo lote.

### 2. Instalar UI UX PRO MAX

Não há confirmação de instalação. Ela deve ser instalada após este fechamento documental e antes do Lote 4, de modo pontual, sem substituir `DESIGN.md`.

### 3. Iniciar o Lote 4 — Busca

Preservar o baseline de 12 resultados e snippet de 220 caracteres até que uma decisão de busca seja validada.

### 4. Manter Configurações como frente editorial separada

Não misturar publicação de Configurações com o fechamento técnico do Lote 2 sem uma tarefa específica.

---

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
6. ler este arquivo para estado operacional;
7. inspecionar `git status`, branch e HEAD antes de assumir o estado do repositório;
8. não inventar fatos do GoDocs;
9. preservar white-label, permissões por ação e proporcionalidade editorial;
10. antes de tarefa no Codex, indicar modelo + nível;
11. após marco relevante, atualizar os arquivos canônicos correspondentes.

---

## 26. Estado ao encerrar esta atualização

O HEAD final confirmado do Lote 3 é:

```text
415a113 — Revisão dos workflows
```

O Lote 3 está concluído e sincronizado com `origin/main`:

```text
21 documentos
148 entradas de busca
127 seções
233/233 testes
50 páginas estáticas no build
30/30 aliases de Documentos preservados
49/49 aliases/anchors de Workflows preservados
```

O hub de Workflows foi encerrado com `Explore Workflows`, sete cards derivados da coleção, mobile em uma coluna e árvore ativa/recolhível validada. A próxima frente é o Lote 4 — Busca.

As decisões de arquitetura preservadas incluem:

- Funcionalidades com seis cards uniformes;
- cards internos no final dos hubs;
- Workflows implementado no mesmo padrão;
- decomposição orientada por intenção, não por tempo isolado;
- `Nesta página` progressivo em páginas densas;
- sidebar desktop retrátil;
- drawer mobile preservado;
- FAQ factual em etapa posterior;
- revisão futura das paletas com prioridade para tema claro;
- revisão visual sistêmica por tokens;
- UI UX PRO MAX antes do Lote 4.

Nenhum commit, push ou deployment é inferido por esta atualização documental.
