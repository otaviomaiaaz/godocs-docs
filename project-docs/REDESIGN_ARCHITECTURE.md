# GoDocs Docs — Arquitetura do Redesign

> **Status:** APROVADO PARA IMPLEMENTAÇÃO PROGRESSIVA  
> **Fase:** Redesign estrutural  
> **Implementação:** Lotes 1, 2, 3 e 4 implementados e concluídos; Lote 5 é a próxima frente.
> **Commit-base verificado:** `587069f` — `Contrato da nova arquitetura`
> **Origem:** Lote 0 — Contrato da Nova Arquitetura, consolidado no Lote 0.1 em 18/08/2026.

## 1. Finalidade e escopo

Este documento registra a arquitetura-alvo aprovada para o GoDocs Docs. Ele é uma referência interna para os próximos lotes e **não descreve integralmente a implementação atual**. A implementação será progressiva e deve preservar os contratos públicos existentes durante a migração.

Não autoriza, por si só, alteração de conteúdo público, MDX, URLs, anchors, componentes, Design System ou comportamento de busca.

## 2. Arquitetura-alvo aprovada

```text
Home

Comece por aqui
├── O que é o GoDocs?
└── Primeiro Acesso

Funcionalidades
├── Visão Geral
├── Busca Inteligente
├── Documentos
│   ├── Organizar pastas e subpastas
│   ├── Adicionar documentos
│   ├── Localizar, filtrar e consultar metadados
│   ├── Visualizar e gerenciar documentos
│   └── Logs e ações
├── Favoritos
├── Workflows
│   ├── Cards, Kanban e Lista
│   ├── Automações
│   ├── Criar e configurar
│   ├── Fases e transições
│   ├── Formulários e campos
│   ├── Membros e papéis
│   └── Formulário público e acompanhamento
└── Relatórios
```

O modelo editorial é uma biblioteca operacional orientada por intenção:

```text
Home → hub de domínio → página de tarefa ou referência → relacionados/próximos passos
```

## 3. Hubs aprovados

### Funcionalidades

- Nova URL: `/docs/funcionalidades`.
- Função: hub editorial e mapa das áreas documentadas da seção.
- Não substitui `/docs/funcionalidades/visao-geral`.
- A URL de Visão Geral continua sendo a documentação da funcionalidade **Visão Geral**.
- Mantém os seis destinos principais com peso visual equivalente: Visão Geral, Busca Inteligente, Documentos, Favoritos, Workflows e Relatórios.
- Documentos e Workflows não recebem cards maiores ou tratamento que quebre a uniformidade do conjunto apenas por possuírem páginas-filhas.

### Documentos

- URL preservada: `/docs/funcionalidades/documentos`.
- Implementado como hub editorial com cinco páginas-filhas aprovadas e compatibilidade dos 30 anchors históricos.
- O hub apresenta primeiro o contexto e o conteúdo conceitual do domínio.
- A navegação para as cinco páginas-filhas é apresentada em cards compactos ao final do hub, depois do conteúdo conceitual e de **Conceitos importantes**, quando essa seção existir.

### Workflows

- URL preservada: `/docs/funcionalidades/workflows`.
- Implementado como hub editorial com sete páginas-filhas `pageType: task` e compatibilidade dos 49 anchors históricos.
- O hub aplica o mesmo padrão estrutural de Documentos: contexto e conteúdo conceitual primeiro; **Conceitos importantes** e **Integração via API** antes de `Explore Workflows`; cards compactos das páginas-filhas no final e antes da paginação.
- `HubNavigation` deriva os filhos diretos da coleção canônica por segmentos, hierarquia e `order`. Essa regra atende hubs aninhados, preserva Documentos e evita hardcode específico de domínio.
- Sidebar e drawer reutilizam a mesma árvore; os breadcrumbs são `Funcionalidades > Workflows` no hub e acrescentam a filha na profundidade seguinte.
- A paginação percorre Workflows e suas sete filhas, terminando em `Formulário público e acompanhamento`; não avança para Relatórios.

### Integração via API

Não terá página própria neste ciclo. O conteúdo disponível ainda não possui volume nem intenção editorial independente suficientes; ele permanece no hub ou contexto adequado de Workflows até nova documentação aprovada.


### Padrão estrutural dos hubs de domínio

Hubs com páginas-filhas seguem a estrutura:

```text
H1 + resumo
→ conteúdo geral e conceitual do domínio
→ informações ou requisitos relevantes
→ Conceitos importantes, quando existir
→ navegação para páginas-filhas em cards compactos
```

Regras:

- os cards das páginas-filhas ficam no final do conteúdo do hub;
- quando houver **Conceitos importantes**, os cards aparecem depois dessa seção;
- cada card representa uma página-filha canônica;
- os cards devem ser compactos, uniformes e fáceis de escanear;
- o conteúdo dos cards deve permanecer conciso, com título, descrição curta e indicação de navegação;
- não transformar hubs em landing pages;
- evitar excesso de elementos decorativos, informação ou diferenciação visual que prejudique a leitura;
- a sidebar continua sendo a navegação persistente; os cards servem como descoberta e orientação dentro do domínio.

O princípio é manter a experiência **robusta na estrutura e clean na apresentação**.

## 4. Slugs públicos aprovados

### Documentos

```text
/docs/funcionalidades/documentos
/docs/funcionalidades/documentos/pastas
/docs/funcionalidades/documentos/adicionar-documentos
/docs/funcionalidades/documentos/filtros-e-metadados
/docs/funcionalidades/documentos/gerenciar-documentos
/docs/funcionalidades/documentos/logs-e-acoes
```

| Slug | Título editorial |
|---|---|
| `/pastas` | Organizar pastas e subpastas |
| `/adicionar-documentos` | Adicionar documentos |
| `/filtros-e-metadados` | Localizar, filtrar e consultar metadados |
| `/gerenciar-documentos` | Visualizar e gerenciar documentos |
| `/logs-e-acoes` | Logs e ações |

### Workflows

```text
/docs/funcionalidades/workflows
/docs/funcionalidades/workflows/cards-kanban-e-lista
/docs/funcionalidades/workflows/automacoes
/docs/funcionalidades/workflows/criar-e-configurar
/docs/funcionalidades/workflows/fases-e-transicoes
/docs/funcionalidades/workflows/formularios-e-campos
/docs/funcionalidades/workflows/membros-e-papeis
/docs/funcionalidades/workflows/formulario-publico
```

| Slug | Título editorial |
|---|---|
| `/cards-kanban-e-lista` | Cards, Kanban e Lista |
| `/automacoes` | Automações |
| `/criar-e-configurar` | Criar e configurar |
| `/fases-e-transicoes` | Fases e transições |
| `/formularios-e-campos` | Formulários e campos |
| `/membros-e-papeis` | Membros e papéis |
| `/formulario-publico` | Formulário público e acompanhamento |

Esses slugs são contratos públicos implementados e devem ser preservados.

## 5. `pageType` aprovado

O Lote 1 introduziu explicitamente no modelo documental:

```yaml
pageType: hub
pageType: task
pageType: reference
```

- Não inferir hub apenas pela existência de filhos.
- `pageType` representa função editorial e comportamento estrutural.
- Não obriga estilo visual isolado ou um template comercial; templates e componentes continuam subordinados ao Design System.
- Hubs com páginas-filhas devem respeitar o padrão estrutural aprovado neste documento, incluindo a navegação por cards compactos ao final.

## 6. Compatibilidade pública

### URLs

- As oito URLs públicas existentes no baseline pré-redesign permanecem funcionais.
- Nenhuma URL existente pode retornar 404 durante a migração.
- As URLs atuais de Documentos e Workflows continuam canônicas e passam a representar seus hubs.
- Redirects só existem quando uma URL realmente deixar de ser canônica.
- Não criar cadeias de redirects.
- Sitemap e busca apontam apenas para destinos canônicos.

### Anchors

Baseline aprovado:

```text
Documentos: 30 anchors
Workflows: 49 anchors
Total: 79
```

Contrato:

- criar manifesto explícito de compatibilidade;
- preservar IDs quando possível;
- mapear `URL antiga + hash antigo → URL nova + hash correspondente`;
- não depender apenas de redirect HTTP, pois fragments não chegam ao servidor;
- não transformar aliases em resultados duplicados da busca;
- cobrir compatibilidade com testes parametrizados;
- fazer o validador reconhecer H2, H3, H4 e aliases.

Essa fundação pertence ao Lote 1 e aos lotes de decomposição.

## 7. Navegação estrutural

### Profundidade máxima

```text
seção
→ hub/página
→ página-filha
```

Nenhum quarto nível de conteúdo será criado sem nova aprovação arquitetural.

### Sidebar e drawer

- Funcionalidades possui hub explícito.
- Hubs podem ser clicáveis e expansíveis; a expansão usa controle separado do link.
- O ramo correspondente à página atual pode abrir automaticamente para fornecer contexto; depois dessa abertura, a pessoa pode recolhê-lo manualmente.
- Página ativa e estado expandido são independentes: a árvore não deve forçar reabertura contínua enquanto a mesma rota permanecer ativa; a regra vale para hubs com páginas-filhas, como Documentos e Workflows, e deve ser preservada em futuros hubs equivalentes.
- A sidebar desktop será retrátil por ação do usuário e ficará aberta por padrão.
- Recolher a sidebar não deve ser consequência automática de entrar em um card ou trocar de página.
- O estado aberto/recolhido deve permanecer consistente durante a navegação do usuário.
- A retração da sidebar inteira é independente da expansão e do recolhimento dos ramos internos.
- O drawer mobile usa a mesma árvore da sidebar e continua sendo o padrão de navegação em telas pequenas.
- Touch targets de 44 px permanecem obrigatórios.
- Não criar sistema paralelo de navegação.


### “Nesta página” / TOC

O componente **Nesta página** deve adaptar sua densidade à complexidade do artigo sem fragmentar conteúdo desnecessariamente.

- páginas simples podem manter seus destinos visíveis;
- páginas com muitos subtópicos devem priorizar os tópicos principais e usar expansão progressiva dos níveis internos;
- H2 têm prioridade na hierarquia;
- H3 podem ser agrupados e revelados conforme a seção ativa;
- H4 não deve dominar visualmente o componente;
- o grupo da seção atual pode permanecer expandido enquanto os demais ficam compactos;
- altura e scroll interno podem ser limitados quando necessários para evitar que o TOC compita visualmente com o artigo;
- o comportamento sticky permanece;
- no mobile, **Nesta página** continua recolhível e deve respeitar a mesma hierarquia progressiva.

Uma página não deve ser decomposta apenas para reduzir o tamanho visual do TOC.

### Breadcrumbs

```text
Home > Página
Home > Funcionalidades > Página
Home > Funcionalidades > Documentos > Página-filha
```

A profundidade máxima é de quatro elementos, incluindo Home. “Comece por aqui” não ganha hub artificial apenas para atender breadcrumbs.

### Paginação

Nos domínios já migrados, a paginação é **hierárquica e limitada ao domínio**. Superfícies ainda não migradas devem convergir para esse modelo:

- hub e filhos formam sequência editorial;
- não saltar automaticamente entre domínios;
- o fim de um domínio pode encerrar a paginação;
- transições entre domínios usam Related/Próximos Passos;
- a paginação percorre a árvore, não uma lista global plana.

## 8. Related / Próximos Passos

- Curadoria manual e factual.
- Normalmente 1–3 links; máximo absoluto de 4.
- Apenas páginas publicadas.
- Não duplicar automaticamente a paginação.
- Hub não lista todos os filhos em Related.
- Não usar IA ou similaridade automática.

A ativação pertence a lote posterior.


## 9. FAQ

A seção de FAQ será desenvolvida durante o redesign, substituindo o placeholder atual por conteúdo útil e factual.

Diretrizes:

- organizar perguntas por domínio quando isso melhorar a descoberta;
- preferir respostas curtas e diretas;
- usar accordions simples para reduzir densidade visual;
- quando uma resposta exigir explicação extensa, resumir a dúvida e direcionar para a documentação completa;
- não duplicar artigos inteiros dentro do FAQ;
- não inventar perguntas, comportamentos ou funcionalidades;
- usar como base conteúdo já documentado e dúvidas realmente úteis ou recorrentes quando houver evidência disponível.

A implementação detalhada do FAQ pertence a etapa posterior e não altera, por si só, a arquitetura pública aprovada neste documento.

## 10. Busca

O Lote 4 consolidou a busca local existente sem trocar sua arquitetura:

- índice estático `/search-index.json`, matching determinístico, normalização de acentos, matching por palavras/prefixos, pesos e campos pesquisados preservados;
- limite universal de 12 resultados e snippet de 220 caracteres preservados;
- candidatos completos recebem score e ordenação antes da diversidade; cada documento canônico, identificado pelo href sem fragmento, pode contribuir com no máximo três resultados;
- a diversidade continua pelos candidatos elegíveis até preencher o limite quando houver resultados suficientes;
- stopwords são conservadoras; `sem` não é ruído e permanece relevante para intenções como `sem login`;
- consultas somente com stopwords retornam zero resultados sem ranking arbitrário; o estado vazio é orientativo;
- resultados informam `Página` ou `Seção` a partir de `result.kind`;
- combobox, listbox, ARIA, foco, Ctrl/Cmd+K, setas, Enter e Escape permanecem contratos da busca;
- não foram introduzidos IA, NLP, embeddings, operadores booleanos ou autocomplete complexo.

Baseline consolidado:

```text
21 documentos
148 entradas
127 seções
252741 rawBytes
29706 gzipBytes
12 resultados
220 caracteres de snippet
242/242 testes
50 páginas estáticas
```

O SHA funcional da busca é `5c8a7c120aba1d6afd323621a7ec186776178bd6`. A infraestrutura posterior `5b69be4e0fb08ceb4832f6f8973bd8c2886ada38` ajusta apenas o ignore do ESLint para `.agents/skills/**` e não substitui essa referência funcional.

## 11. Critérios editoriais aprovados

| Tipo | Referência |
|---|---|
| Hub | aproximadamente 200–500 palavras |
| Página de tarefa | aproximadamente 350–900 palavras |

Páginas menores são permitidas quando possuem intenção independente forte. Uma página exige revisão quando tiver aproximadamente mais de 1.200 palavras, mais de 12 destinos no TOC ou mais de 6 minutos de leitura. Esses sinais não são limites matemáticos.

O tempo de leitura é um sinal editorial, não uma regra automática de decomposição. Conteúdos na faixa de aproximadamente 4–6 minutos podem exigir revisão de densidade ou navegação, mas só devem ser divididos quando houver ganho claro de arquitetura da informação.

A decomposição é indicada principalmente quando existem intenções independentes, procedimentos que fazem sentido isoladamente ou uma estrutura tão ramificada que prejudica a consulta. Uma página pode permanecer única quando houver uma intenção principal e sequência lógica coerente, mesmo que seja mais longa que páginas simples.

Regra principal:

> Uma intenção clara e útil por página, com no máximo 1–2 intenções fortemente relacionadas quando necessário.

## 12. Guardrails

- MDX permanece a fonte pública principal.
- A mesma coleção normalizada alimenta todas as superfícies públicas.
- O Design System e a identidade GoDocs permanecem fundação.
- Temas claro e escuro e acessibilidade continuam requisitos estruturais.
- Artigos permanecem sóbrios; hubs não são landing pages comerciais.
- Não introduzir CMS, banco, IA ou serviço externo sem evidência.
- Não copiar Mintlify, Stripe ou Confluence.
- Não sacrificar compatibilidade para simplificar implementação.
- Não implementar redesign visual antes da fundação estrutural correspondente.


## 13. Direção visual planejada

A revisão visual mais profunda permanece reservada aos lotes próprios de identidade e refinamento. As decisões abaixo registram direção, não especificações finais de Design System.

### Paletas e temas

- os temas claro e escuro serão refinados;
- o tema claro é a prioridade da revisão por apresentar menor diferenciação perceptível entre algumas superfícies;
- a revisão deve aumentar legibilidade, contraste e separação entre background, superfícies, bordas, navegação, cards e conteúdo sem poluir a interface;
- o tema escuro será refinado de forma mais contida, preservando a base atual;
- o laranja GoDocs permanece como accent principal, especialmente em links, foco, estados ativos e pequenos destaques;
- evitar grandes superfícies laranja sem necessidade funcional.

### Tokens e consistência

A revisão de paleta deve ser sistêmica e orientada por tokens, evitando correções isoladas de CSS. Os valores finais e a nomenclatura definitiva serão consolidados no `DESIGN.md` durante a etapa visual.

### Referência de identidade

A Landing Page do GoDocs 4 permanece referência de identidade, atmosfera, profundidade e relação entre superfícies. Ela não deve ser copiada literalmente.

O objetivo continua sendo fazer o GoDocs Docs pertencer claramente à família GoDocs sem deixar de parecer uma ferramenta de documentação.


## 14. Roadmap oficial

```text
Lote 0 — Contrato ✅
Lote 0.1 — Consolidação ✅

Lote 1 — Fundação — implementado
Lote 2 — Documentos — concluído
Lote 3 — Workflows — implementado e concluído
Lote 4 — Busca — concluído
Lote 5 — Descoberta e consolidação — próxima frente
Lote 6 — Home + Hubs + identidade visual
Lote 7 — Refinamento visual e microinterações
Lote 8 — Governança editorial
Lote 9 — Reauditoria Impeccable + regressão final
```

Nenhum lote futuro é autorizado por este documento sem a respectiva tarefa e validação.

### Registro do Lote 4

UI UX PRO MAX foi instalada e usada pontualmente, de modo consultivo, para acessibilidade, teclado, responsividade e estado vazio da busca. Ela não substitui `DESIGN.md` nem constitui um Design System paralelo. O uso no Lote 5 permanece opcional e condicionado a ganho real.
