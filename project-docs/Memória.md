# GoDocs Docs — Memória consolidada

> **Última consolidação:** 19/08/2026  
> **Estado geral:** Lotes 1 e 2 concluídos; Lote 3 — Workflows é a próxima etapa.  
> **Último commit relevante:** `0ae9420` — `Consolidacao do Lote 2`.  
> **Git verificado antes deste fechamento documental:** `HEAD = origin/main`; este arquivo aguarda apenas o próximo commit documental deliberado.

## Estado atual

O Lote 2 — Documentos foi concluído e sincronizado em `0ae9420`. A associação desse SHA a um deployment específico da Vercel não foi confirmada; não inferir publicação a partir do estado Git local.

**Estado atual em uma frase:** Lote 2 concluído em `0ae9420`, com hub de Documentos, cinco páginas-filhas, `Explore Documentos` e `167/167` testes; o próximo lote é Workflows.

Documentos é agora um hub explícito com cinco páginas-filhas aprovadas:

- Organizar pastas e subpastas;
- Adicionar documentos;
- Localizar, filtrar e consultar metadados;
- Visualizar e gerenciar documentos;
- Logs e ações.

O conteúdo útil anterior foi decomposto sem perda intencional. A compatibilidade histórica de Documentos foi preservada com `30/30` aliases/anchors, mantendo URLs, navegação, busca, sitemap e paginação derivados da mesma fonte MDX.

## Padrão de hubs de domínio

O padrão aprovado é: conteúdo contextual → `Conceitos importantes`, quando houver → `Explore <Domínio>` → cards das páginas-filhas.

Os cards servem a descoberta e orientação dentro do domínio; não substituem a sidebar. Em desktop e tablet largo, Documentos usa duas colunas: os quatro primeiros cards formam uma grade 2×2 e o quinto ocupa as duas colunas. Em mobile, todos os cards ocupam uma coluna.

## Navegação e acessibilidade

A rota ativa e o estado expandido da árvore são independentes. Um ramo pode abrir ao entrar no domínio, ser recolhido manualmente, não deve reabrir em um rerender comum e pode abrir novamente diante de nova navegação relevante. A mesma `NavigationTree` atende sidebar e drawer.

O Lote 2 preserva breadcrumbs, TOC, paginação, temas claro/escuro, foco, responsividade e a semântica já aprovada. Workflows não foi decomposto e não deve ser descrito como implementado.

## Baseline final do Lote 2

```text
content:validate: 14 documentos válidos
typecheck: aprovado
test: 19 arquivos, 167/167 testes
build: 36 páginas estáticas
search: 141 entradas, 127 seções, 276.446 bytes bruto, 35.862 bytes gzip
search: limite de 12 resultados e snippet de 220 caracteres
compatibilidade: 30/30 aliases/anchors de Documentos e 49/49 de Workflows
```

## Roadmap

```text
Lote 0 — Contrato: concluído
Lote 0.1 — Consolidação: concluído
Lote 1 — Fundação: concluído
Lote 2 — Documentos: concluído
Lote 3 — Workflows: futuro
Lote 4 — Busca: futuro
Lote 5 — Descoberta e consolidação: futuro
Lote 6 — Home + Hubs + identidade visual: futuro
Lote 7 — Refinamento visual e microinterações: futuro
Lote 8 — Governança editorial: futuro
Lote 9 — Reauditoria Impeccable + regressão final: futuro
```

## Prioridade imediata

1. Versionar o fechamento documental após a revisão humana.
2. Iniciar o Lote 3 — Workflows, usando o padrão de hub já validado sem antecipar sua implementação.

## Cronologia do Lote 2

| Data | Referência | Marco |
| --- | --- | --- |
| 18/08/2026 | `de25753` | Documentos tornou-se hub com cinco páginas-filhas e compatibilidade preservada. |
| 19/08/2026 | `b09b042` | `Explore Documentos` e os cards das filhas foram introduzidos. |
| 19/08/2026 | `292e11b` | Navegação ativa/recolhível, simplificação editorial e contrato foram atualizados. |
| 19/08/2026 | `0ae9420` | Grade final dos cards consolidada; Lote 2 concluído e sincronizado. |
| 19/08/2026 | Validação e Git | Validação visual manual concluída; Git reconstruído com `HEAD = origin/main`. |
| 19/08/2026 | Fechamento documental | Memória canônica preparada para revisão; próximo lote confirmado: Workflows. |

## Retomada segura

Antes de iniciar o Lote 3, confirmar o estado Git atual e ler `AGENTS.md`, `project-docs/SYSTEM_BLUEPRINT.md` e `project-docs/REDESIGN_ARCHITECTURE.md`. Tratar o conteúdo MDX como fonte de rotas, navegação, breadcrumbs, busca, sitemap e geração estática; preservar alterações locais não relacionadas.
