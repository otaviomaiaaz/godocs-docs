# GoDocs Docs — Prompt mestre de retomada e evolução

> **Papel deste arquivo:** servir como prompt auxiliar para retomar e evoluir o GoDocs Docs com contexto suficiente para executar uma tarefa real no estado atual do projeto.
>
> Este arquivo **não substitui** `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, `project-docs/REDESIGN_ARCHITECTURE.md`, `project-docs/SYSTEM_BLUEPRINT.md`, `project-docs/daily_stats.md` nem a implementação atual. Quando for utilizado, essas fontes devem ser consultadas conforme o domínio da tarefa.
>
> O antigo objetivo de “implementar o MVP inicial do zero” foi superado. O projeto já possui aplicação, conteúdo publicado, navegação, busca, hubs, temas, acessibilidade, compatibilidade histórica e uma arquitetura consolidada. A missão agora é **preservar o que já está correto e evoluir somente o escopo solicitado**.

## Tarefa

Retome o **GoDocs Docs** no estado real do repositório e execute integralmente a tarefa atual solicitada pelo usuário.

Não reconstrua o projeto do zero e não trate este arquivo como autorização para iniciar um novo redesign, refatoração geral ou funcionalidade futura.

Antes de começar:

1. leia o `AGENTS.md` completo;
2. leia `project-docs/daily_stats.md` para identificar o estado operacional, a fase atual, o último baseline confirmado e a próxima tarefa;
3. verifique o estado real do repositório:

```bash
git status
git branch --show-current
git rev-parse HEAD
git remote -v
```

4. leia as fontes canônicas adicionais conforme o escopo:
   - produto, conteúdo, posicionamento ou comportamento documental → `PRODUCT.md`;
   - UI, UX, identidade, acessibilidade visual ou componentes → `DESIGN.md`;
   - hubs, navegação, URLs, compatibilidade ou redesign → `project-docs/REDESIGN_ARCHITECTURE.md`;
   - arquitetura técnica ou comportamento estrutural → `project-docs/SYSTEM_BLUEPRINT.md`;
   - retomada de decisões históricas → `project-docs/Memória.md`;
5. inspecione a implementação atual da área que será modificada;
6. consulte `project-docs/references/` somente quando a tarefa realmente envolver interface, identidade ou evidência visual;
7. identifique alterações locais existentes antes de editar qualquer arquivo.

Se fontes divergirem, não escolha silenciosamente uma interpretação. Determine o domínio do conflito, diferencie decisão canônica de estado acidental do código e reporte a inconsistência quando ela exigir decisão de produto, design, arquitetura ou governança.

### Estado consolidado de referência

O snapshot documental confirmado até **09/09/2026** registra:

```text
Lotes 0–5
→ concluídos

Lote 6
→ em andamento / avançado

Paleta A2 Contrast Refined
→ implementada e aprovada

Home Cards V2
→ implementados

Sidebar V2.5
→ implementada e estabilizada

Background oficial da Home + Logos
→ implementados, refinados e promovidos

Editor E1
→ preservado e pausado

Governança documentada
→ develop para desenvolvimento
→ main para produção
```

A intervenção registrada como próxima naquele snapshot era:

```text
Sidebar V2.5 Final Interaction Polish
```

Esse bloco é **apenas referência histórica recente**. Se `daily_stats.md`, o Bitbucket ou o repositório atual apresentarem estado mais novo, prevalece o estado corrente confirmado.

O remoto oficial mais recente informado para o projeto é o **Bitbucket**. GitHub pode existir como histórico ou snapshot auxiliar e não deve ser usado para sobrepor o estado do repositório oficial.

## Contexto do produto

O **GoDocs Docs** é a aplicação de documentação oficial do **GoDocs 4** para usuários finais.

Seu objetivo é permitir que pessoas aprendam o sistema, consultem funcionalidades, recuperem procedimentos e resolvam dúvidas com maior autonomia.

O produto é independente do GoDocs 4:

- não deve presumir integração com o código privado do GoDocs;
- não deve presumir acesso a APIs privadas;
- não deve presumir autenticação interna;
- não deve utilizar dados reais de clientes sem necessidade e autorização;
- não deve inventar comportamentos para preencher lacunas.

A direção de produto é substituir progressivamente a dependência do **Confluence** como experiência principal de documentação do GoDocs.

O **Mintlify** é benchmark de maturidade de documentação. Ele pode inspirar padrões de busca, navegação, organização e leitura, mas não deve ser copiado.

Combine:

- **GoDocs:** identidade, ativos oficiais, laranja, neutros grafite, caráter corporativo e linguagem própria;
- **documentação moderna:** leitura confortável, boa descoberta, busca central, navegação previsível, hubs, Related e experiência responsiva;
- **arquitetura editorial própria:** biblioteca operacional orientada por intenção.

Direção visual consolidada:

> **robusto na estrutura e clean na apresentação.**

O produto deve parecer uma documentação moderna do ecossistema GoDocs, não:

- dashboard administrativo;
- landing page promocional;
- reprodução literal do GoDocs 4;
- clone de Mintlify/AbacatePay.

### Usuários e contexto

O público principal inclui usuários operacionais, responsáveis por processos, administradores e gestores quando aplicável.

A mesma documentação precisa funcionar para:

- primeiro contato;
- aprendizado de funcionalidade;
- execução de tarefa;
- consulta rápida;
- resolução de dúvida.

O GoDocs é white-label. Não universalize nomes, cargos, pastas, workflows, fases, formulários, grupos ou processos de um único ambiente.

### Notion e conteúdo publicado

O Notion, quando utilizado, serve apenas para autoria, organização e revisão interna.

A documentação oficial pública é o conteúdo consolidado e versionado no repositório.

## Decisões e contratos obrigatórios atuais

- A home canônica é `/`.
- Artigos usam `/docs/[...slug]`.
- O conteúdo público vem de `content/docs/**/*.md` e `content/docs/**/*.mdx`.
- Markdown/MDX versionado permanece a fonte pública da documentação.
- A mesma coleção normalizada alimenta, conforme a arquitetura atual, Home, artigos, hubs, rotas, sidebar, drawer, breadcrumbs, busca, TOC, paginação, Related, sitemap e metadados.
- Não criar uma segunda lista manual concorrente para representar documentos já existentes na coleção.
- `pageType` aceita `hub`, `task` e `reference`.
- Um hub é declarado explicitamente; não deve ser inferido somente pela existência de filhos.
- Hubs com páginas-filhas mantêm os cards internos **no final do conteúdo**, depois de “Conceitos importantes” quando essa seção existir.
- Os cards internos dos hubs são compactos e subordinados ao artigo.
- Os seis cards principais de Funcionalidades permanecem visualmente equivalentes:
  - Visão Geral;
  - Busca Inteligente;
  - Documentos;
  - Favoritos;
  - Workflows;
  - Relatórios.
- Documentos e Workflows não recebem maior peso visual apenas por possuírem páginas-filhas.
- Sidebar e drawer consomem a mesma árvore de navegação.
- Estado ativo e estado expandido da navegação são independentes.
- A Sidebar V2.5 preserva a geometria estrutural:

```text
expanded: 240px
collapsed: 48px
preview: 240px
left: 0
```

- Recolher a sidebar não deve deslocar indevidamente artigo ou TOC.
- O estado expanded/collapsed atual não usa storage permanente; uma nova montagem inicia expanded.
- Preview por ponteiro deve respeitar dispositivos com hover/pointer apropriados; teclado e `Escape` continuam suportados.
- O TOC prioriza H2/H3 visualmente.
- H4 pode continuar participando da estrutura, busca e compatibilidade sem dominar o TOC.
- Páginas densas usam organização/progressive disclosure antes de serem divididas apenas por causa do tamanho do TOC.
- A busca do GoDocs Docs é diferente da **Busca Inteligente** do GoDocs.
- A busca da documentação permanece local, determinística e sem IA/embeddings.
- Contratos atuais da busca:

```text
máximo de 12 resultados
até 3 resultados por documento canônico
snippet de 220 caracteres
ranking antes da diversidade
```

- Aliases históricos não podem gerar resultados duplicados.
- Compatibilidade atualmente protegida:

```text
Documentos: 30 aliases/anchors
Workflows: 49 aliases/anchors
Total: 79
```

- `related` é manual, factual, opcional e limitado a no máximo 4 destinos.
- Related não utiliza similaridade automática ou IA.
- Paginação permanece hierárquica por domínio; não deve virar uma sequência global plana.
- Temas claro e escuro são requisitos estruturais.
- A paleta atual é a **A2 Contrast Refined**.
- O background oficial da Home possui variantes responsivas para tema claro e escuro e é baseline aprovado.
- Logos oficiais atuais também são baseline aprovado.
- Não reabrir Background, Logos ou paleta em tarefa focal sem problema comprovado ou novo escopo explícito.
- Home Cards V2 possuem resposta visual mais rica apenas dentro dos limites definidos no `DESIGN.md`.
- Imagens instrutivas já fazem parte da experiência documental.
- `Figure` suporta apresentação `instructional` e lightbox quando necessário.
- **Busca Inteligente** é serviço adicional do GoDocs e depende de contratação no ambiente.
- **Workflows** também é serviço adicional; ações podem variar conforme permissões.
- Permissões devem ser tratadas por ação quando necessário, sem presumir que um usuário pode criar, editar, mover, concluir, excluir ou configurar tudo.
- A documentação atual não exige autenticação própria para leitura.
- O Editor próprio e Supabase estão fora do baseline principal e permanecem pausados.
- Chat/assistente e GoPractice são direções futuras, não funcionalidades atuais e não devem ser iniciados por inferência.

## Stack

Preserve a stack atual do repositório.

Baseline confirmado no `package.json`:

```text
Next.js 16.2.11
React 19.2.8
React DOM 19.2.8
TypeScript 6.0.3
Tailwind CSS 4.3.3
pnpm 11.9.0
Vitest 4.1.10
Zod 4.4.3
next-mdx-remote 6.0.0
Lucide React 1.25.0
Inter Variable
```

O package manager obrigatório é:

```text
pnpm@11.9.0
```

Não use npm, Yarn ou Bun para instalar dependências e não crie lockfiles concorrentes.

Scripts atuais relevantes:

```bash
pnpm dev
pnpm content:validate
pnpm search:benchmark
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit:prod
```

Use React Server Components por padrão quando não houver necessidade real de estado/interação no cliente.

Reutilize componentes e dependências existentes antes de criar abstrações ou instalar pacotes novos.

## O que implementar / preservar

Implemente **somente o escopo da tarefa atual** e preserve os contratos consolidados que não fazem parte da mudança.

### Fundação

- Não reinicialize o projeto.
- Examine a arquitetura existente antes de escrever código.
- Preserve TypeScript estrito.
- Preserve a coleção local de Markdown/MDX.
- Preserve a separação entre conteúdo, navegação, layout, busca e regras de domínio.
- Reutilize componentes, utilitários e tokens existentes.
- Não crie nova fonte de conteúdo.
- Não faça refatoração geral como efeito colateral de uma tarefa focal.
- Não silencie erros com `any`, `@ts-ignore`, mocks permanentes ou stubs.
- Se a tarefa alterar uma decisão estrutural, sincronize a fonte canônica correspondente quando isso fizer parte do escopo.

### Home

A Home atual já é uma superfície real de descoberta.

Preserve, salvo escopo explícito:

- Hero com título, descrição e busca;
- background oficial responsivo por tema;
- header próprio da Home;
- seção “Comece por aqui”;
- seis cards de Funcionalidades equivalentes;
- estrutura editorial derivada da coleção;
- comportamento responsivo;
- FAQ apenas no estado realmente implementado, sem inventar perguntas para preencher espaço;
- footer e ativos de marca atuais.

Background e logos estão encerrados como baseline visual. Não criar uma nova rodada apenas por preferência estética.

### Header e marca

- Use os ativos oficiais disponíveis em `public/brand/`.
- Não volte ao antigo wordmark textual improvisado do MVP.
- Não redesenhe ou vetorize logo por inferência de screenshot.
- Preserve variantes adequadas aos temas.
- Header permanece funcional, legível e responsivo.
- A Home pode usar comportamento transparente → superfície após scroll conforme implementação atual.
- Páginas de documentação preservam header sticky e controles previstos pelo Design System.
- Nenhum link externo fictício.

### Pesquisa

Preserve a arquitetura atual:

- índice local;
- busca determinística;
- clique e `Ctrl/Cmd + K`;
- `Escape`;
- teclado;
- combobox/listbox e ARIA;
- foco inicial e retorno adequado;
- página/seção como tipos de resultado;
- limite de 12;
- até 3 resultados por documento;
- snippet de 220;
- sem duplicar aliases.

Não introduza:

- IA;
- embeddings;
- serviço externo;
- ranking novo;
- autocomplete complexo;

sem uma tarefa específica de arquitetura de busca.

### Conteúdo e navegação

- Conteúdo público permanece em `content/docs/`.
- Slugs e URLs publicados são contratos.
- Preserve os 79 aliases/anchors protegidos.
- Navegação deve continuar derivada da coleção.
- Sidebar e drawer continuam compartilhando a mesma árvore.
- Hubs continuam derivados da taxonomia, não de listas hardcoded específicas.
- Breadcrumbs representam a hierarquia editorial real.
- Paginação não salta arbitrariamente entre domínios.
- Related continua manual e separado de previous/next.
- Não invente documentação para demonstrar um componente.

### Layout de artigos

Preserve o `ArticleShell` e a arquitetura atual de leitura:

- sidebar à esquerda em desktop;
- breadcrumb;
- título e descrição;
- metadados quando aplicáveis;
- corpo MDX;
- TOC;
- figuras;
- callouts;
- passos;
- tabelas;
- código;
- Related;
- paginação.

A coluna principal permanece controlada e centrada.

Não use cards, painéis ou ornamentos em excesso dentro do artigo.

Imagens instrutivas devem reduzir ambiguidade. Não devem ser decoração.

### Tema e responsividade

Preserve a **A2 Contrast Refined**.

Direção cromática consolidada:

```text
dark canvas: #151515
dark navigation: #1a1a1a
dark surface: #202020
dark interactive: #262626
dark elevated: #2c2c2c

light canvas: #f6f7f9
light navigation: #f1f3f5
light surface: #ffffff
light interactive: #e9edf1

orange dark accent: #ff7a1a
orange light accent: #ff7600
```

Os valores completos e papéis semânticos pertencem ao `DESIGN.md`.

Breakpoints estruturais existentes devem ser preferidos a novos breakpoints isolados:

```text
1320px
1024px
768px
341px
```

Valide:

- desktop amplo;
- notebook;
- tablet;
- mobile;
- tema claro;
- tema escuro.

Não introduza overflow horizontal.

### Acessibilidade

Preserve e valide:

- HTML semântico;
- um único H1 por página;
- landmarks;
- `lang="pt-BR"`;
- skip link;
- navegação completa por teclado;
- foco visível;
- contraste WCAG AA quando aplicável;
- targets adequados;
- labels acessíveis;
- `aria-current`;
- dialog/drawer/lightbox com foco correto;
- `Escape`;
- retorno de foco;
- informação que não dependa apenas de cor;
- `prefers-reduced-motion`.

Uma tarefa visual não está concluída apenas porque compila.

## Restrições

Não:

- reconstrua o projeto como se ainda estivesse no MVP inicial;
- integre com código, APIs privadas ou autenticação interna do GoDocs sem autorização explícita;
- invente comportamento, permissão, mensagem, dado, integração, link ou funcionalidade do GoDocs;
- universalize exemplo de cliente ou ambiente;
- transforme uma tarefa visual em revisão factual de conteúdo sem solicitação;
- altere URLs, slugs, anchors ou aliases protegidos sem decisão arquitetural;
- crie uma segunda fonte manual para documentos já presentes na coleção;
- introduza banco, CMS runtime ou serviço externo sem tarefa específica;
- transforme a busca atual em IA;
- retome o Editor, Supabase ou autenticação por iniciativa própria;
- execute migrations ou bootstrap de owner;
- crie ou altere secrets;
- use credenciais privilegiadas de produção em desenvolvimento;
- faça `push`, merge, PR, promoção ou deploy sem autorização explícita e confirmação do ambiente;
- assuma que `push = deploy`;
- assuma que um site acessível corresponde ao `HEAD` atual sem verificar;
- trate o GitHub auxiliar como fonte superior ao Bitbucket;
- use npm, Yarn ou Bun para gerenciar dependências;
- crie `package-lock.json`, `yarn.lock` ou lockfile concorrente;
- edite `project-docs/references/`;
- copie Mintlify, AbacatePay, Confluence, 21st.dev ou outra referência literalmente;
- use verde ou cor funcional como substituta da identidade laranja;
- transforme a documentação em dashboard ou landing page;
- reabra Home, Background, Logos, paleta, busca, TOC ou outra frente estabilizada quando ela estiver fora do escopo;
- deixe logs de depuração, controles inativos, stubs ou erros silenciados;
- declare validação que não foi realmente executada.

## Processo obrigatório

1. Leia `AGENTS.md`.
2. Leia `daily_stats.md`.
3. Confirme pasta, branch, `HEAD`, remote e working tree.
4. Identifique o escopo real da solicitação atual.
5. Leia somente as fontes canônicas adicionais necessárias ao domínio da tarefa.
6. Examine código, testes e estilos da área afetada.
7. Identifique contratos e regression guards que precisam permanecer intactos.
8. Verifique se já existe componente, token, utilitário ou padrão reutilizável.
9. Implemente a menor mudança coerente capaz de atender integralmente a tarefa.
10. Não amplie o escopo por iniciativa própria.
11. Execute as validações proporcionais ao impacto.
12. Para tarefa visual, execute a aplicação e inspecione a interface real.
13. Valide breakpoints relevantes e temas claro/escuro.
14. Teste teclado, foco, hover/pointer e reduced motion quando a interação for afetada.
15. Verifique console, overflow, links e estados relevantes.
16. Compare a solução com `DESIGN.md` e referências somente quando aplicável.
17. Corrija regressões introduzidas pela tarefa.
18. Faça uma revisão final focada no escopo original.
19. Não faça operação remota sem autorização explícita.
20. Se a tarefa alterar uma decisão canônica e incluir documentação de fechamento, atualize a fonte responsável.

### Validação por impacto

Código TypeScript, componente ou lógica:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Conteúdo, MDX, frontmatter, links, assets ou taxonomia:

```bash
pnpm content:validate
```

Busca, ranking ou indexação:

```bash
pnpm search:benchmark
```

Dependências:

```bash
pnpm audit:prod
```

Mudança com impacto de build/publicação:

```bash
pnpm build
```

Categorias são cumulativas. Uma mudança que atravesse mais de um domínio precisa combinar as validações relevantes.

### Ferramentas auxiliares

**Impeccable** pode ser usado como auditoria e quality gate, especialmente em tarefas visuais, acessibilidade e fechamento de lote.

**UI UX PRO MAX** pode apoiar pesquisa e revisão de UX.

Essas ferramentas:

- não substituem `DESIGN.md`;
- não redefinem produto;
- não autorizam mudança por conta própria;
- não formam um Design System concorrente.

**Build Web Apps, Lovable e referências externas** pertencem ao fluxo de prototipagem/experimento:

```text
protótipo
→ avaliação
→ decisão
→ implementação oficial adaptada ao repositório
```

Não copie solução externa sem adaptação à arquitetura, tokens, tipos, acessibilidade e componentes do projeto.

## Critérios de aceite

A entrega só está concluída quando:

- a solicitação atual foi atendida integralmente dentro do escopo;
- o código existente relevante foi compreendido antes da alteração;
- nenhum trabalho local do usuário foi sobrescrito;
- nenhuma informação do GoDocs foi inventada;
- URLs, aliases e contratos públicos não foram quebrados sem autorização;
- conteúdo e navegação continuam derivados das fontes corretas;
- TypeScript e convenções existentes foram preservados;
- os comandos aplicáveis foram executados e seus resultados são conhecidos;
- mudanças visuais foram inspecionadas em interface renderizada;
- tema claro e escuro permanecem funcionais quando afetados;
- breakpoints relevantes permanecem utilizáveis;
- teclado, foco e acessibilidade permanecem funcionais;
- não há overflow ou erro de console introduzido pela tarefa;
- a solução segue `PRODUCT.md`, `DESIGN.md`, `REDESIGN_ARCHITECTURE.md` e `SYSTEM_BLUEPRINT.md` nos domínios aplicáveis;
- nenhuma frente futura foi transformada em capacidade atual por inferência;
- nenhuma operação de publicação foi feita sem autorização;
- limitações reais restantes estão claramente registradas.

Para uma alteração visual focal, também confirme que ela não reabriu componentes ou áreas congeladas fora do escopo.

## Entrega final

Ao concluir, informe de forma objetiva:

- o que foi implementado;
- principais arquivos criados ou alterados;
- decisões técnicas ou visuais relevantes;
- contratos importantes preservados;
- validações realmente executadas e seus resultados;
- inspeção visual realizada, quando aplicável;
- limitações, riscos ou pendências reais;
- estado de Git/deploy somente se tiver sido verificado ou modificado durante a tarefa.

Não apresente trabalho não executado como concluído.

Não repita todo o histórico do projeto na entrega.

Não pare em decisões técnicas rotineiras que possam ser resolvidas com segurança pelo código, pelos testes ou pelas fontes canônicas.

O princípio operacional é:

> **entenda o estado real, preserve os contratos corretos, altere apenas o necessário, valide proporcionalmente ao impacto e nunca invente o que o projeto não comprova.**
