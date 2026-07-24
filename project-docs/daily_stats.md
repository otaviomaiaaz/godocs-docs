# GoDocs Docs — Memória geral e acompanhamento do projeto

> Documento vivo de contexto, decisões, progresso e próximos passos.
>
> **Última atualização:** 22 de julho de 2026, 11:34 (UTC−03:00)  
> **Estado geral:** especificação concluída; implementação do MVP ainda não iniciada  
> **Fase atual:** preparação para iniciar o desenvolvimento  
> **Próxima ação recomendada:** executar o `PROJECT_PROMPT.md` para criar e validar o MVP

## 1. Finalidade deste arquivo

Este arquivo é a memória operacional do projeto **GoDocs Docs**. Ele deve permitir que qualquer nova tarefa do ChatGPT ou do Codex compreenda rapidamente:

- por que o projeto existe;
- o que já foi decidido e produzido;
- qual é o estado real da pasta;
- o que está dentro e fora do MVP;
- quais riscos e lacunas continuam abertos;
- qual deve ser o próximo passo;
- como registrar o progresso futuro sem depender apenas do histórico das conversas.

Este documento resume o estado do trabalho. As regras e especificações completas continuam nos arquivos oficiais indicados na seção **Fontes de verdade**.

## 2. Resumo executivo

O **GoDocs Docs** será uma aplicação independente de documentação para o **GoDocs 4**, produto de Gestão Eletrônica de Documentos e Processos da FábricaInfo.

O objetivo é oferecer uma central de conhecimento clara e progressiva para apoiar onboarding, aprendizado, consulta de funcionalidades, processos, configurações, permissões, solução de dúvidas e boas práticas.

A direção do produto combina:

- **identidade GoDocs:** laranja, fundos grafite, superfícies escuras, bordas discretas, wordmark e tom corporativo;
- **experiência de documentação moderna:** busca em destaque, navegação contextual, leitura confortável, hierarquia tipográfica e organização inspiradas no Mintlify;
- **arquitetura simples:** conteúdo em Markdown/MDX, sem banco de dados ou CMS no MVP;
- **crescimento progressivo:** a fundação nasce sem artigos fictícios e recebe conteúdo real ao longo do projeto.

O projeto está bem especificado, mas ainda não contém a aplicação. A pasta possui somente os três documentos de orientação e cinco imagens de referência.

## 3. Fontes de verdade e ordem de autoridade

Para qualquer tarefa futura, use esta ordem:

1. solicitação atual do usuário;
2. [`AGENTS.md`](./AGENTS.md), com regras permanentes de trabalho;
3. [`PROJECT_PROMPT.md`](./PROJECT_PROMPT.md), com a entrega executável do MVP;
4. [`SYSTEM_BLUEPRINT.md`](./SYSTEM_BLUEPRINT.md), com arquitetura técnica, visual e critérios detalhados;
5. este `daily_stats.md`, como memória de estado e acompanhamento;
6. imagens em `references/`, como evidência visual;
7. materiais contextuais sincronizados do projeto do ChatGPT, como apoio de domínio.

Em caso de conflito, os arquivos mais altos nessa lista prevalecem. Este documento não substitui especificações detalhadas nem deve introduzir requisitos contrários a elas.

## 4. Histórico consolidado

### 4.1 Concepção

O projeto começou com a proposta de criar um sistema simples de documentação para o GoDocs, inspirado na experiência do Mintlify. A justificativa foi que a documentação do GoDocs tende a crescer e precisa funcionar simultaneamente como onboarding, manual, base de consulta e central de dúvidas.

Foi recomendado um produto próprio com a base:

```text
site de documentação + Markdown/MDX + imagens + pesquisa + navegação
```

Desde o início, foram excluídos do primeiro MVP elementos que aumentariam a manutenção sem necessidade imediata, como CMS, banco de dados, editor visual, comentários, analytics avançado, autenticação própria e busca com IA.

### 4.2 Definição do produto

A direção inicial ainda trazia ambiguidade sobre integrar a documentação ao código do GoDocs. Essa decisão foi corrigida e consolidada:

- o GoDocs Docs é uma **aplicação independente**;
- não acessa código, APIs, autenticação ou serviços privados do GoDocs;
- deve manter coerência visual com o mesmo ecossistema, sem se declarar oficial;
- a home canônica será `/`;
- artigos futuros usarão `/docs/[...slug]`;
- o MVP nasce sem artigos, categorias ou cards fictícios.

### 4.3 Configuração do projeto

Foi criada a pasta local `C:\Users\joao.otavio\Documents\godocs-docs` e preparados os seguintes documentos:

- `AGENTS.md` — regras permanentes para o Codex;
- `PROJECT_PROMPT.md` — prompt de implementação one-shot do MVP;
- `SYSTEM_BLUEPRINT.md` — fonte detalhada de arquitetura, interface e critérios de aceite.

Também foram organizadas cinco capturas em duas pastas de referência:

- `references/GoDocs/`;
- `references/AbacatePay - Mintlify/`.

### 4.4 Revisão e consolidação

Os documentos foram revisados para reduzir redundância e separar responsabilidades. A principal correção visual foi retirar uma sidebar vazia da home: enquanto não houver artigos, a página inicial deve usar uma composição ampla e intencional. Sidebar e sumário pertencem ao contexto de artigos.

Também foram consolidados:

- identidade e tokens visuais;
- rotas;
- componentes;
- contrato de conteúdo Markdown/MDX;
- busca local;
- temas claro e escuro;
- responsividade;
- acessibilidade;
- validações técnicas e visuais;
- itens explicitamente fora do MVP.

### 4.5 Criação desta memória

Em 22 de julho de 2026, as conversas acessíveis, os materiais sincronizados, os três documentos locais e as cinco imagens foram analisados em conjunto. Este `daily_stats.md` foi criado para registrar o estado real e reduzir a dependência da memória das conversas.

## 5. Conversas e materiais analisados

Esta consolidação considerou o conteúdo que estava tecnicamente acessível na tarefa atual:

- conversa referenciada **“Sistema de documentação GoDocs”**;
- tarefa Codex **“Criar AGENTS.md do GoDocs”**, incluindo criação, cópia e revisão dos três documentos;
- tarefa atual de criação da memória do projeto;
- arquivos sincronizados `Contexto.txt`, `FabricaInfo.txt` e `GoDocs.txt` do projeto do ChatGPT;
- todos os arquivos existentes na pasta local `godocs-docs`.

Limite conhecido: o Codex não possui garantia de acesso automático a todas as demais conversas existentes na interface do projeto do ChatGPT. Por isso, decisões duráveis devem continuar sendo registradas nesta pasta.

## 6. Contexto de negócio e público

### 6.1 FábricaInfo

A FábricaInfo atua em transformação digital de processos intensivos em documentos, combinando tecnologia, digitalização, gestão documental, automação e operação de processos. Seu portfólio inclui soluções como GoDocs, e-Identidade e GoAcademic, além de serviços de OCR, guarda documental, integração e BPO.

### 6.2 GoDocs 4

O GoDocs é a plataforma de Gestão Eletrônica de Documentos e Processos da FábricaInfo. Seu propósito conhecido é centralizar documentos, estruturá-los por classificação e indexação, permitir pesquisa e controle de acesso e apoiar fluxos de trabalho.

Detalhes funcionais do GoDocs 4 só podem ser documentados quando sustentados por materiais fornecidos ou observação direta. Informações históricas sobre versões anteriores não devem ser apresentadas automaticamente como comportamento atual.

### 6.3 Público e uso da documentação

O contexto original prioriza funcionários internos da FábricaInfo e usuários com diferentes níveis de familiaridade técnica. A documentação deve servir como:

- guia para novos usuários;
- material de onboarding;
- manual de utilização;
- base de consulta;
- referência sobre processos, configurações e permissões;
- central de dúvidas e solução de problemas;
- base de conhecimento interna.

A linguagem deve ser profissional, simples, didática, direta e em português do Brasil.

## 7. Estado atual da pasta local

### 7.1 Inventário

| Item | Estado | Função |
|---|---|---|
| `AGENTS.md` | Concluído | Regras permanentes e invariantes do projeto |
| `PROJECT_PROMPT.md` | Concluído | Especificação executável para construir o MVP |
| `SYSTEM_BLUEPRINT.md` | Concluído | Arquitetura técnica, visual e critérios de aceite |
| `daily_stats.md` | Criado nesta atualização | Memória geral e acompanhamento operacional |
| `references/GoDocs/` | 2 imagens, intactas | Identidade visual do produto |
| `references/AbacatePay - Mintlify/` | 3 imagens, intactas | Estrutura e experiência de documentação |
| Código da aplicação | Não iniciado | Ainda não existem `app/`, `components/`, `lib/` ou `content/` |
| Dependências e lockfile | Não iniciados | Ainda não existe `package.json` nem gerenciador definido |
| Repositório Git local | Ausente | A pasta ainda não contém `.git` |

### 7.2 Progresso por macroetapa

| Macroetapa | Situação |
|---|---|
| Descoberta e direção do produto | Concluída |
| Contexto de negócio e domínio | Consolidado para iniciar |
| Especificação do MVP | Concluída |
| Blueprint visual e técnico | Concluído |
| Referências visuais | Organizadas e analisadas |
| Fundação técnica | Não iniciada |
| Interface do MVP | Não iniciada |
| Pipeline Markdown/MDX | Não iniciado |
| Busca, tema e responsividade | Não iniciados |
| Testes e validação visual | Não iniciados |
| Conteúdo documental real | Fora desta primeira entrega |
| Publicação/deploy | Não definido; fora do MVP atual |

## 8. Análise dos documentos locais

### 8.1 `AGENTS.md`

Está conciso e cumpre seu papel de instrução permanente. Define propósito, hierarquia de autoridade, invariantes, uso das referências, princípios de engenharia, regras de conteúdo, acessibilidade, validação e comportamento esperado do agente.

Ponto central: impede que tarefas futuras inventem conteúdo, transformem o produto em dashboard ou alterem as referências.

### 8.2 `PROJECT_PROMPT.md`

Está pronto para disparar a implementação integral do MVP. Define stack padrão quando a pasta contém apenas especificações, lista tudo o que deve ser implementado e estabelece processo e critérios objetivos de conclusão.

Ponto central: não aceita plano ou mockup como entrega; exige aplicação funcional, inspeção visual e build aprovado.

### 8.3 `SYSTEM_BLUEPRINT.md`

É a especificação mais detalhada. Contém princípios, rotas, estados de conteúdo, wireframes, tokens visuais, componentes, funcionalidades, arquitetura sugerida, contrato de frontmatter, pipeline, busca, tema, responsividade, acessibilidade, desempenho, SEO, critérios visuais e checklist de conclusão.

Ponto central: reduz ambiguidades técnicas e visuais sem obrigar abstrações desnecessárias.

### 8.4 Consistência do conjunto

Os três documentos estão coerentes e possuem papéis complementares. Não foi encontrada divergência material entre eles.

O material sincronizado `Contexto.txt` ainda descreve entregas preparadas para Notion. Isso representa a origem editorial da documentação, mas não altera a decisão atual: o GoDocs Docs será a aplicação principal de apresentação. Conteúdo futuro poderá ser redigido de forma portável, porém deve obedecer ao contrato Markdown/MDX do repositório.

## 9. Análise das referências visuais

### 9.1 GoDocs — duas capturas

As imagens mostram um dashboard em tema escuro com:

- wordmark `go` em laranja e `docs` em branco;
- sidebar grafite persistente;
- item ativo preenchido em laranja;
- fundo e cards em diferentes níveis de cinza escuro;
- bordas finas, radius moderado e pouco uso de sombras;
- títulos brancos e textos auxiliares em cinza;
- ícones lineares;
- alternância clara entre modo claro e escuro;
- interface corporativa, funcional e relativamente densa.

O que deve migrar para a documentação: marca, paleta, contraste, bordas, tipografia e estados ativos. A densidade, os gráficos e a composição de dashboard não devem ser reproduzidos.

### 9.2 AbacatePay/Mintlify — três capturas

As imagens mostram uma documentação escura com:

- header compacto e navegação horizontal;
- busca central dominante com atalho de teclado;
- largura máxima consistente e grandes margens;
- hero com forte hierarquia tipográfica;
- conteúdo central com ritmo vertical generoso;
- grades de cards simples, borda fina, ícone, título e descrição;
- navegação disponível durante a rolagem;
- superfícies discretas e leitura confortável.

O que deve migrar: arquitetura espacial, busca, hierarquia, ritmo e comportamento responsivo. Não devem migrar o verde, a marca, o conteúdo de API, os links externos, os CTAs ou as categorias exibidas.

### 9.3 Síntese aprovada

```text
experiência e organização de documentação moderna
                         +
identidade, paleta e tom visual do GoDocs
                         =
                    GoDocs Docs
```

## 10. Escopo aprovado do MVP

### 10.1 Deve existir

- aplicação Next.js com App Router, caso nenhuma stack prévia seja encontrada;
- TypeScript estrito e Tailwind CSS;
- home em `/`;
- rota de artigos futuros em `/docs/[...slug]`;
- página `not-found` coerente;
- header sticky com marca, busca e tema;
- home vazia intencional, sem sidebar ou cards fictícios;
- temas claro e escuro com persistência;
- busca local aberta por clique, `Ctrl + K` e `Cmd + K`;
- diálogo e drawer acessíveis;
- pipeline real de Markdown/MDX em `content/docs/`;
- fonte única para rotas, sidebar, busca, sumário e paginação;
- layout futuro de artigo com sidebar e sumário condicionais;
- responsividade completa;
- acessibilidade básica sólida;
- documentação de como adicionar o primeiro artigo;
- lint, typecheck, testes relevantes, build e inspeção visual aprovados.

### 10.2 Não deve existir no MVP

- artigos, categorias, resultados de busca ou cards fictícios;
- integração com o GoDocs real;
- autenticação e permissões;
- banco de dados, CMS ou editor visual;
- analytics;
- busca externa, semântica ou com IA;
- comentários e feedback de artigo;
- internacionalização;
- links ou CTAs sem destino real;
- cópia literal do Mintlify ou da AbacatePay;
- publicação/deploy, salvo solicitação separada.

## 11. Decisões registradas

| Decisão | Estado | Motivo |
|---|---|---|
| Produto independente do GoDocs | Confirmada | Reduz acoplamento e preserva autonomia técnica |
| Coerência visual com o ecossistema GoDocs | Confirmada | Mantém continuidade de marca sem alegação institucional |
| Mintlify como referência, não cópia | Confirmada | Reutiliza padrões de UX sem reproduzir identidade alheia |
| Home canônica em `/` | Confirmada | Entrada direta e simples |
| Artigos em `/docs/[...slug]` | Confirmada | Rota clara e extensível |
| Home sem sidebar vazia | Confirmada | Evita espaço desperdiçado e aparência incompleta |
| Conteúdo em Markdown/MDX | Confirmada | Simplicidade, versionamento e crescimento progressivo |
| Busca local | Confirmada | Evita serviço externo e atende ao MVP |
| Tema escuro como referência principal | Confirmada | Alinha-se às capturas do GoDocs |
| Tema claro também completo | Confirmada | Requisito de produto e acessibilidade |
| Sem conteúdo real no primeiro MVP | Confirmada | Fundação primeiro; conteúdo depois, baseado em evidência |
| Verde não é cor de marca | Confirmada | A identidade principal é laranja |

## 12. Próximo passo recomendado

Executar integralmente o `PROJECT_PROMPT.md` dentro desta pasta.

Sequência prática:

1. inicializar a aplicação e o repositório Git;
2. configurar Next.js, TypeScript estrito, Tailwind e scripts de qualidade;
3. implementar tokens, temas, marca e header;
4. construir a home vazia e responsiva;
5. implementar busca local e atalhos;
6. criar o pipeline Markdown/MDX e o contrato de metadados;
7. implementar rota de artigos, shell, sidebar, sumário e paginação condicionais;
8. criar `not-found` e instruções para o primeiro documento;
9. executar e inspecionar desktop, tablet e mobile em temas claro e escuro;
10. testar teclado, foco, `Escape`, overflow e console;
11. executar lint, typecheck, testes relevantes e build;
12. corrigir problemas e fazer uma segunda revisão visual.

## 13. Lacunas, riscos e pontos a confirmar

### Antes ou durante o MVP

- **Asset oficial da marca:** ainda não há logo vetorial ou arquivo oficial; o MVP deve usar wordmark textual substituível e não vetorizar a captura.
- **Destino de publicação:** domínio, hospedagem e processo de deploy ainda não foram definidos e estão fora do MVP atual.
- **Repositório Git:** a pasta ainda não foi inicializada como repositório; isso deve ocorrer antes da implementação para preservar histórico.
- **Público e acesso em produção:** o contexto prioriza uso interno, mas o modelo de acesso futuro ainda não foi definido. Autenticação permanece fora do MVP até decisão explícita.
- **Conteúdo real:** não há artigos aprovados. Eles devem ser criados progressivamente a partir de evidências do GoDocs 4.
- **Comportamentos do GoDocs 4:** permissões, fluxos e detalhes de funcionalidades exigem validação direta; não reutilizar automaticamente informações de versões históricas.

### Sem bloqueio atual

Nenhuma dessas lacunas impede a construção da fundação técnica e visual especificada.

## 14. Critério de conclusão da próxima fase

O MVP só poderá ser marcado como concluído quando:

- a aplicação iniciar normalmente;
- o build de produção passar;
- `/` apresentar uma home profissional e intencional;
- tema, pesquisa e responsividade funcionarem;
- teclado e foco estiverem corretos;
- o pipeline aceitar o primeiro documento real;
- `/docs/[...slug]` e `not-found` funcionarem;
- não houver conteúdo, links ou controles fictícios;
- lint, tipos, testes relevantes e console estiverem sem erros introduzidos;
- a interface tiver sido comparada visualmente com as cinco referências e refinada.

## 15. Protocolo de atualização deste arquivo

Atualize o `daily_stats.md` após cada mudança relevante. No mínimo:

1. altere **Última atualização**, **Estado geral**, **Fase atual** e **Próxima ação recomendada** no topo;
2. atualize o inventário e o progresso por macroetapa;
3. registre decisões novas ou alteradas;
4. mova itens concluídos para o histórico;
5. registre somente bloqueios reais e lacunas que possam afetar decisões;
6. informe as validações efetivamente executadas, sem presumir sucesso;
7. adicione uma entrada ao registro cronológico abaixo.

Não transforme este arquivo em diário detalhado de comandos. Registre resultados, decisões e estado do produto.

## 16. Registro cronológico

| Data | Atualização | Resultado |
|---|---|---|
| 21–22/07/2026 | Organização das referências visuais | Duas capturas do GoDocs e três da AbacatePay/Mintlify disponíveis |
| 22/07/2026 | Criação e revisão de `AGENTS.md` | Regras permanentes consolidadas |
| 22/07/2026 | Criação e revisão de `PROJECT_PROMPT.md` | Prompt executável do MVP consolidado |
| 22/07/2026 | Criação de `SYSTEM_BLUEPRINT.md` | Arquitetura técnica e visual detalhada |
| 22/07/2026 | Auditoria cruzada dos documentos e referências | Conjunto considerado coerente e pronto para implementação |
| 22/07/2026 | Criação de `daily_stats.md` | Memória geral e acompanhamento passam a existir na pasta local |

---

**Resumo para retomada rápida:** a especificação está pronta, as referências estão organizadas e o próximo trabalho é construir o MVP. Ainda não existe código da aplicação.
