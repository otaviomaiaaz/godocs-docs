# GoDocs Docs — Arquitetura do Redesign

> **Status:** APROVADO PARA IMPLEMENTAÇÃO PROGRESSIVA  
> **Fase:** Redesign estrutural  
> **Implementação:** Lotes 1 e 2 implementados localmente e prontos para revisão; Lotes 3–9 pendentes
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

### Documentos

- URL preservada: `/docs/funcionalidades/documentos`.
- Implementado como hub editorial com cinco páginas-filhas aprovadas e compatibilidade dos 30 anchors históricos.

### Workflows

- URL preservada: `/docs/funcionalidades/workflows`.
- A página atual será transformada progressivamente em hub de Workflows.

### Integração via API

Não terá página própria neste ciclo. O conteúdo disponível ainda não possui volume nem intenção editorial independente suficientes; ele permanece no hub ou contexto adequado de Workflows até nova documentação aprovada.

## 4. Slugs públicos futuros aprovados

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

Esses slugs são contratos públicos futuros e devem ser preservados depois da criação das páginas.

## 5. `pageType` aprovado

O Lote 1 introduziu explicitamente no modelo documental:

```yaml
pageType: hub
pageType: task
pageType: reference
```

- Não inferir hub apenas pela existência de filhos.
- `pageType` representa função editorial e comportamento estrutural.
- Não obriga estilo visual diferente; templates e componentes continuam subordinados ao Design System.

## 6. Compatibilidade pública

### URLs

- As oito URLs públicas atuais permanecem funcionais.
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

- Funcionalidades terá hub explícito.
- Hubs podem ser clicáveis e expansíveis; a expansão usa controle separado do link.
- O ramo atual abre automaticamente; os demais ficam recolhidos.
- O drawer mobile usa a mesma árvore da sidebar.
- Touch targets de 44 px permanecem obrigatórios.
- Não criar sistema paralelo de navegação.

### Breadcrumbs

```text
Home > Página
Home > Funcionalidades > Página
Home > Funcionalidades > Documentos > Página-filha
```

A profundidade máxima é de quatro elementos, incluindo Home. “Comece por aqui” não ganha hub artificial apenas para atender breadcrumbs.

### Paginação

O modelo global plano atual será abandonado progressivamente em favor de paginação **hierárquica e limitada ao domínio**:

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

## 9. Busca

Baseline preservado:

```text
132 entradas
269.380 bytes bruto
36.232 bytes gzip
12 resultados
220 caracteres de snippet
```

Orçamento inicial da arquitetura futura:

```text
aproximadamente 145–160 entradas
até 350 KB bruto
até 50 KB gzip
```

Não implementar otimização neste momento.

### Decisão deferida — quantidade de resultados

Não há limite definitivo distinto por viewport. O futuro Lote de Busca deverá testar até 8 resultados no mobile e 10 no desktop contra o baseline atual de 12, avaliando descoberta, densidade e qualidade antes de consolidar o comportamento.

## 10. Critérios editoriais aprovados

| Tipo | Referência |
|---|---|
| Hub | aproximadamente 200–500 palavras |
| Página de tarefa | aproximadamente 350–900 palavras |

Páginas menores são permitidas quando possuem intenção independente forte. Uma página exige revisão quando tiver aproximadamente mais de 1.200 palavras, mais de 12 destinos no TOC ou mais de 6 minutos de leitura. Esses sinais não são limites matemáticos.

Regra principal:

> Uma intenção clara e útil por página, com no máximo 1–2 intenções fortemente relacionadas quando necessário.

## 11. Guardrails

- MDX permanece a fonte pública principal.
- A mesma coleção normalizada alimenta todas as superfícies públicas.
- O Design System e a identidade GoDocs permanecem fundação.
- Temas claro e escuro e acessibilidade continuam requisitos estruturais.
- Artigos permanecem sóbrios; hubs não são landing pages comerciais.
- Não introduzir CMS, banco, IA ou serviço externo sem evidência.
- Não copiar Mintlify, Stripe ou Confluence.
- Não sacrificar compatibilidade para simplificar implementação.
- Não implementar redesign visual antes da fundação estrutural correspondente.

## 12. Roadmap oficial

```text
Lote 0 — Contrato ✅
Lote 0.1 — Consolidação ✅

Lote 1 — Fundação — implementado localmente, pronto para revisão
Lote 2 — Documentos — implementado localmente, pronto para revisão
Lote 3 — Workflows
Lote 4 — Busca
Lote 5 — Descoberta e consolidação
Lote 6 — Home + Hubs + identidade visual
Lote 7 — Refinamento visual e microinterações
Lote 8 — Governança editorial
Lote 9 — Reauditoria Impeccable + regressão final
```

Nenhum lote futuro é autorizado por este documento sem a respectiva tarefa e validação.
