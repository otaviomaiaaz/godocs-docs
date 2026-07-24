# GoDocs Docs — Memória geral e acompanhamento do projeto

> Documento vivo de contexto, decisões, progresso e próximos passos.
>
> **Última atualização:** 24 de julho de 2026, 14:55 (UTC−03:00)<br>
> **Estado geral:** MVP implementado e coleção local expandida para quatro documentos reais, com home, navegação, busca, SEO e imagens sociais derivados dos arquivos MDX<br>
> **Fase atual:** validação da primeira coleção editorial com as seções **Comece por aqui** e **Funcionalidades**<br>
> **Próxima ação recomendada:** revisar as alterações locais, criar commit e publicar somente mediante instrução explícita; depois, confirmar o deployment correspondente no Vercel

## 1. Finalidade deste arquivo

Este arquivo é a memória operacional do projeto **GoDocs Docs**. Ele deve permitir que qualquer nova tarefa do ChatGPT, Codex ou outra ferramenta compreenda rapidamente:

- por que o projeto existe;
- o que já foi decidido e produzido;
- qual é o estado real da aplicação e do repositório;
- quais conteúdos já foram publicados ou estão em produção;
- como funciona o fluxo de desenvolvimento e deploy;
- quais riscos e lacunas permanecem abertos;
- qual deve ser o próximo passo;
- como registrar o progresso futuro sem depender apenas do histórico das conversas.

Este documento resume o estado do trabalho. Ele não substitui o código, as evidências diretas do GoDocs 4, as regras permanentes do repositório nem as especificações detalhadas.

## 2. Resumo executivo

O **GoDocs Docs** é uma aplicação independente de documentação para o **GoDocs 4**, plataforma de Gestão Eletrônica de Documentos e Processos da FábricaInfo.

Seu objetivo é oferecer uma central de conhecimento clara, progressiva e fácil de consultar para apoiar:

- onboarding e primeiro acesso;
- aprendizado sobre a interface e as funcionalidades;
- execução de processos;
- consulta de configurações e permissões;
- solução de dúvidas;
- boas práticas de utilização;
- formação de uma base de conhecimento interna e, quando aplicável, acessível a outros usuários do sistema.

A direção do produto combina:

- **identidade GoDocs:** laranja, neutros grafite, superfícies escuras, bordas discretas, logotipo oficial e linguagem corporativa;
- **experiência moderna de documentação:** busca em destaque, navegação contextual, leitura confortável, cards simples e hierarquia inspirada em referências como Mintlify;
- **arquitetura versionada:** Next.js, TypeScript, Tailwind CSS e conteúdo em Markdown/MDX;
- **crescimento progressivo:** novas seções e páginas são incorporadas somente quando existe conteúdo real e aprovado;
- **qualidade técnica:** validação de conteúdo, testes, acessibilidade, SEO, responsividade, temas claro e escuro e deploy contínuo.

A aplicação já foi implementada e passou por diversas rodadas de melhoria. O repositório público está na branch `main` e o Vercel está conectado ao GitHub. Nesta atualização, o `HEAD` local observado é `2268fed`; as mudanças editoriais descritas abaixo permanecem sem commit e não tiveram deployment verificado.

No estado editorial atual:

- a seção **Comece por aqui** contém **O que é o GoDocs?** e **Primeiro Acesso**;
- a seção **Funcionalidades** contém **Visão Geral** e **Busca Inteligente**;
- os quatro cards da home são derivados da taxonomia dos arquivos MDX;
- sidebar, drawer mobile, breadcrumbs, sumário, paginação, busca, sitemap e imagens sociais refletem os quatro documentos;
- os três novos documentos estão implementados e validados localmente, mas ainda não foram enviados ao GitHub nem ao Vercel.

## 3. Fontes de verdade e ordem de autoridade

Para qualquer tarefa futura, use esta ordem:

1. solicitação atual do usuário;
2. evidências diretas do GoDocs 4 fornecidas pelo usuário, como prints, vídeos, fluxos e explicações;
3. `AGENTS.md`, com regras permanentes para desenvolvimento e manutenção;
4. código e conteúdo atualmente presentes na branch `main`;
5. `project-docs/SYSTEM_BLUEPRINT.md`, como especificação técnica e visual de referência;
6. este `project-docs/daily_stats.md`, como memória operacional;
7. `project-docs/PROJECT_PROMPT.md`, apenas como registro histórico da implementação inicial;
8. referências visuais em `project-docs/references/`;
9. arquivos contextuais e pesquisas externas, somente como apoio de domínio.

Em caso de conflito:

- as decisões mais recentes do usuário prevalecem;
- evidências diretas do GoDocs 4 prevalecem sobre suposições ou informações históricas;
- o estado real do código prevalece sobre documentos internos desatualizados;
- pesquisas externas nunca devem ser usadas para afirmar comportamentos atuais do GoDocs 4 sem validação direta.

### Inconsistência de caminho identificada

O repositório utiliza a pasta real `project-docs/`, com hífen. Entretanto, a versão atual do `AGENTS.md` ainda contém referências a `project_docs/`, com sublinhado. Essas referências devem ser corrigidas para evitar que o Codex procure arquivos em um caminho inexistente.

## 4. Histórico consolidado

### 4.1 Concepção e pesquisa inicial

O projeto começou com a necessidade de documentar completamente o GoDocs 4, desde o primeiro contato do usuário até funcionalidades, processos, permissões, configurações, erros e dúvidas frequentes.

Inicialmente, foram avaliadas ferramentas como Notion e Mintlify. O Mintlify foi identificado como uma boa referência de experiência, mas a direção evoluiu para uma plataforma própria, capaz de:

- manter a identidade visual do GoDocs;
- receber atualizações frequentes;
- versionar conteúdos junto ao código;
- crescer por seções, cards e páginas;
- permitir controle direto da interface e da navegação.

A base conceitual aprovada foi:

```text
aplicação de documentação + Markdown/MDX + imagens + busca + navegação
```

Também foram produzidos materiais de contexto sobre a FábricaInfo e o GoDocs para orientar a redação, sem transformar informações históricas ou externas em fatos funcionais sobre o GoDocs 4.

### 4.2 Definição do produto

Foram consolidadas as seguintes decisões:

- o GoDocs Docs é uma aplicação independente;
- não integra código, APIs, autenticação ou serviços privados do GoDocs;
- deve manter coerência visual com o ecossistema GoDocs, sem copiar a identidade do Mintlify;
- a home canônica é `/`;
- artigos são publicados em `/docs/[...slug]`;
- o conteúdo é armazenado em `content/docs/`;
- navegação, busca, breadcrumbs, sumário e paginação derivam da mesma fonte de conteúdo;
- não devem existir artigos, links, funcionalidades ou integrações fictícias;
- banco de dados, CMS, editor visual, comentários, autenticação própria e busca com IA continuam fora do escopo atual.

### 4.3 Preparação das especificações

Antes da implementação, foram criados:

- `AGENTS.md` — regras permanentes do repositório;
- `PROJECT_PROMPT.md` — prompt one-shot usado para orientar a construção inicial;
- `SYSTEM_BLUEPRINT.md` — arquitetura técnica, visual e critérios de aceite;
- referências visuais do GoDocs e da documentação da AbacatePay/Mintlify;
- `daily_stats.md` — memória viva do projeto.

Após a implementação, os documentos internos e as referências foram movidos para `project-docs/`, enquanto `AGENTS.md` permaneceu na raiz e o código da aplicação passou a ocupar a estrutura principal do repositório.

### 4.4 Versionamento inicial

A pasta local foi inicializada como repositório Git e conectada ao repositório:

```text
otaviomaiaaz/godocs-docs
```

Informações atuais confirmadas:

- visibilidade: pública;
- branch principal: `main`;
- remoto principal: `origin`;
- commit inicial: `2b6d8e5` — `Initial commit`;
- README inicial posterior: `0d5de35` — `Add initial README for GoDocs documentation`.

### 4.5 Implementação do MVP

O commit `775c8d5` — **MVP Inicial** — marcou a construção efetiva da aplicação.

A entrega incluiu, entre outros elementos:

- aplicação Next.js com App Router;
- TypeScript estrito;
- Tailwind CSS;
- home em `/`;
- rota dinâmica `/docs/[...slug]`;
- página `not-found`;
- header da documentação;
- busca local;
- alternância de tema claro e escuro;
- navegação desktop e mobile;
- layout de artigo;
- sidebar;
- breadcrumbs;
- sumário;
- paginação;
- componentes MDX;
- loader de conteúdo local;
- esquema de frontmatter;
- scripts de lint, typecheck, testes e build;
- README com instruções de execução e publicação de conteúdo.

A partir desse ponto, deixou de ser correto registrar que a aplicação ainda não existia.

### 4.6 Primeira rodada de robustez técnica

O commit `e1333c8` — **Melhoria do sistema** — ampliou a robustez da base.

As principais evoluções observadas foram:

- workflow de qualidade em `.github/workflows/quality.yml`;
- reorganização dos materiais internos em `project-docs/`;
- validação completa de conteúdo MD/MDX;
- verificação de frontmatter, taxonomia, links, fragmentos e assets;
- endpoint de índice de busca;
- benchmark de pesquisa;
- melhorias na árvore de navegação;
- melhorias nos diálogos e no comportamento modal;
- testes de integração de interface;
- testes de navegação, busca e validação;
- refinamentos da home e do layout de artigo.

### 4.7 Publicação do primeiro conteúdo real e SEO

O commit `47b44d7` — **Melhoria do sistema** — marcou a saída do estado totalmente vazio.

Foi publicado o primeiro documento real:

```text
content/docs/o-que-e-o-godocs.mdx
```

Também foram adicionados ou aprimorados:

- metadados globais;
- sitemap;
- `robots.txt`;
- imagem Open Graph da home;
- imagens sociais por artigo;
- testes de SEO;
- adaptação da home para exibir conteúdo publicado;
- testes do primeiro conteúdo real.

### 4.8 Refinamento de UX/UI, identidade e busca

O commit `dbd37ea` — **Melhoria do sistema** — concentrou mudanças importantes de experiência e identidade.

Entre as alterações observadas:

- refinamento da home;
- melhoria da busca e de sua relevância;
- ajustes no header;
- substituição e evolução dos assets de marca;
- refinamento de imagens sociais;
- ampliação dos testes de identidade e design;
- atualização do blueprint e dos documentos internos;
- melhoria de contraste, espaçamento e comportamento visual.

Esse commit também foi identificado pelo Vercel durante o fluxo de atualização e serviu como referência em uma das etapas de deploy manual.

### 4.9 Última melhoria observada

O commit local mais recente confirmado é:

```text
2268fed — Melhoria 4
```

Principais mudanças registradas:

- novos refinamentos em `app/globals.css`;
- ajustes no componente de marca;
- evolução da busca e do comportamento modal;
- ampliação dos testes de integração, identidade e design;
- consolidação desta memória operacional.

O estado de deployment desse commit não foi verificado nesta atualização. O status Vercel bem-sucedido registrado anteriormente permanece apenas como evidência histórica de uma fase anterior.

### 4.10 Fluxo de desenvolvimento e publicação

O fluxo prático consolidado é:

```text
ChatGPT → Codex → pasta local → GitHub → Vercel
```

Na operação atual:

1. o conteúdo ou a melhoria é planejado no ChatGPT;
2. o Codex implementa ou altera os arquivos do repositório;
3. as mudanças são verificadas localmente;
4. os arquivos são enviados para a branch `main` no GitHub;
5. o Vercel detecta o commit e cria um novo deployment;
6. quando necessário, o deployment pode ser promovido manualmente para produção.

Comandos de atualização normalmente utilizados:

```bash
cd "C:\Users\joao.otavio\Documents\godocs-docs"
git status
git add .
git commit -m "Descrição da atualização"
git push origin main
```

### 4.11 Evolução da arquitetura editorial

A arquitetura de conteúdo foi reorganizada para melhorar a aprendizagem e evitar páginas genéricas demais.

A seção **Comece por aqui** ficou focada em conteúdos introdutórios, como:

- **O que é o GoDocs?**;
- **Primeiro Acesso**.

O card **Explorando o GoDocs**, que concentraria explicações gerais sobre várias áreas do sistema, foi removido dessa seção. Seu conteúdo passou a ser dividido em uma nova seção chamada **Funcionalidades**, com uma página específica para cada recurso.

A nova seção contém atualmente:

- **Visão Geral**;
- **Busca Inteligente**.

Ela poderá incluir progressivamente páginas como:

- Workflows;
- demais funcionalidades confirmadas durante a análise do sistema.

Os conteúdos **Funcionalidades → Visão Geral** e **Funcionalidades → Busca Inteligente** estão implementados e validados no checkout local, com publicação externa pendente de commit e push.

## 5. Conversas e materiais considerados nesta atualização

Esta consolidação considerou:

- histórico do projeto GoDocs Docs no ChatGPT;
- decisões sobre Notion, Mintlify, Codex, GitHub e Vercel;
- conversas de criação dos conteúdos **O que é o GoDocs?**, **Primeiro Acesso** e **Explorando o GoDocs**;
- reorganização recente da seção **Funcionalidades**;
- prints enviados da área **Visão Geral** do GoDocs;
- arquivos contextuais `Contexto.txt`, `FabricaInfo.txt`, `GoDocs.txt` e `Regras-para-criar-as-documetações.txt`;
- versão anterior do `daily_stats.md`;
- repositório público `otaviomaiaaz/godocs-docs`;
- estrutura atual da branch `main`;
- sequência de commits desde o commit inicial até `2268fed`;
- estado de integração com o Vercel registrado anteriormente, sem nova verificação de provider nesta tarefa.

## 6. Contexto de negócio e público

### 6.1 FábricaInfo

A FábricaInfo atua em transformação digital de processos intensivos em documentos, combinando tecnologia, digitalização, gestão documental, automação e operação de processos. Seu ecossistema inclui o GoDocs, além de outras soluções e serviços relacionados a OCR, guarda documental, integração e operação de processos.

Essas informações servem como contexto institucional. Dados externos, números históricos ou descrições comerciais não devem substituir evidências diretas do produto ao documentar o GoDocs 4.

### 6.2 GoDocs 4

O GoDocs é a plataforma de Gestão Eletrônica de Documentos e Processos da FábricaInfo. Seu propósito conhecido inclui centralizar documentos, organizar informações, permitir pesquisa, controlar acessos e apoiar fluxos de trabalho.

Detalhes de telas, botões, permissões, resultados e regras devem ser documentados apenas quando sustentados por:

- prints;
- vídeos;
- explicações fornecidas pelo usuário;
- comportamento observado diretamente no GoDocs 4.

Informações sobre versões antigas não devem ser apresentadas automaticamente como comportamento atual.

### 6.3 Público da documentação

A documentação é destinada principalmente a:

- funcionários internos da FábricaInfo;
- novos usuários do GoDocs;
- equipes que precisam consultar funcionalidades e processos;
- outras pessoas autorizadas que precisem compreender o sistema.

A linguagem deve ser:

- em português do Brasil;
- profissional;
- simples;
- objetiva;
- natural;
- didática;
- acessível a pessoas com diferentes níveis de familiaridade tecnológica.

## 7. Estado técnico atual

### 7.1 Repositório e infraestrutura

| Item | Estado atual | Observação |
|---|---|---|
| Repositório GitHub | Ativo e público | `otaviomaiaaz/godocs-docs` |
| Branch principal | Ativa | `main` |
| Último commit local observado | Presente | `2268fed` — `Melhoria 4` |
| Alterações desta fase | Locais e sem commit | Três novos documentos, taxonomia, estilos e testes |
| Vercel | Integrado; estado desta fase não verificado | Nenhum commit ou deployment foi criado nesta tarefa |
| URL configurada | Definida no código | `https://godocs-docs.vercel.app` |
| Aplicação | Implementada | Next.js com App Router |
| Deploy contínuo | Funcional | GitHub → Vercel |
| Workflow de qualidade | Presente | `.github/workflows/quality.yml` |
| Banco de dados | Não utilizado | Conteúdo local em arquivos |
| CMS | Não utilizado | Conteúdo versionado no Git |
| Autenticação própria | Não implementada | Fora do escopo atual |

### 7.2 Stack confirmada

| Tecnologia | Versão observada | Função |
|---|---:|---|
| Next.js | 16.2.11 | Framework da aplicação |
| React | 19.2.8 | Interface |
| TypeScript | 6.0.3 | Tipagem e segurança do código |
| Tailwind CSS | 4.3.3 | Base de estilização |
| pnpm | 11.9.0 | Gerenciamento de dependências |
| MDX | 3.1.1 | Conteúdo documental com componentes |
| Zod | 4.4.3 | Validação de frontmatter e metadados |
| Vitest | 4.1.10 | Testes automatizados |
| Testing Library | 16.3.2 | Testes de componentes e interação |
| axe-core | 4.12.1 | Apoio a testes de acessibilidade |

### 7.3 Estrutura principal do repositório

```text
/
├── app/                    # rotas, layout, SEO e endpoints
├── components/             # componentes de interface e documentação
├── content/docs/           # páginas reais em Markdown/MDX
├── lib/                    # conteúdo, busca, navegação, validação e domínio
├── public/                 # assets públicos e identidade
├── scripts/                # validação e benchmark
├── tests/                  # testes e fixtures
├── project-docs/           # memória, blueprint, prompt histórico e referências
├── .github/workflows/      # automações de qualidade
├── AGENTS.md               # regras permanentes para o agente
├── README.md               # instruções do projeto
└── package.json            # dependências e comandos
```

### 7.4 Funcionalidades técnicas implementadas

- home orientada à documentação;
- rota dinâmica de artigos;
- descoberta automática de arquivos MD/MDX;
- navegação derivada da coleção de conteúdo;
- sidebar desktop;
- drawer mobile;
- breadcrumbs;
- sumário por headings;
- paginação entre documentos;
- busca local;
- índice de busca em JSON;
- ranking e benchmark de pesquisa;
- tema claro e escuro com persistência;
- componentes MDX reutilizáveis;
- validação de metadados e conteúdo;
- validação de links internos, fragmentos e assets;
- página 404;
- SEO por página;
- sitemap;
- robots;
- Open Graph da home e dos artigos;
- responsividade;
- suporte a teclado;
- gerenciamento de foco;
- diálogos nativos;
- testes unitários, de integração, identidade, design, SEO e acessibilidade;
- workflow de qualidade;
- deploy no Vercel.

### 7.5 Comandos de qualidade disponíveis

```bash
pnpm audit:prod
pnpm content:validate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

O `prebuild` executa automaticamente `pnpm content:validate` antes do build.

Resultados desta atualização:

| Validação | Resultado |
|---|---|
| `pnpm audit:prod` | Bloqueado: a consulta ao registro npm foi recusada dentro do sandbox e a execução externa foi negada pela política do ambiente |
| `pnpm content:validate` | Aprovado: 4 documentos válidos |
| `pnpm lint` | Aprovado |
| `pnpm typecheck` | Aprovado |
| `pnpm test` | Aprovado: 10 arquivos e 70 testes |
| `pnpm build` | Aprovado: 16 páginas estáticas, incluindo os 4 documentos e suas imagens sociais |
| Inspeção visual e funcional | Aprovada nos temas claro e escuro, em desktop, notebook, tablet, celular e 320 px; sem overflow horizontal ou erros no console |

## 8. Estado editorial atual

### 8.1 Estrutura aprovada

A estrutura é progressiva e pode evoluir, mas o estado atual conhecido é:

```text
GoDocs Docs
├── Comece por aqui
│   ├── O que é o GoDocs?
│   └── Primeiro Acesso
└── Funcionalidades
    ├── Visão Geral
    └── Busca Inteligente
```

Outras seções previstas continuam válidas como direção futura, quando houver conteúdo suficiente:

- Processos e fluxos;
- Permissões e acessos;
- Configurações;
- Boas práticas;
- Solução de problemas;
- FAQ.

### 8.2 Conteúdos por estado

| Conteúdo | Estado editorial | Estado no repositório |
|---|---|---|
| O que é o GoDocs? | Aprovado e refinado | Publicado em `content/docs/o-que-e-o-godocs.mdx` |
| Primeiro Acesso | Aprovado | Implementado localmente em `content/docs/primeiro-acesso.mdx`; commit pendente |
| Explorando o GoDocs | Descontinuado como card único | Não deve ser publicado nessa forma |
| Funcionalidades — Visão Geral | Aprovado | Implementado localmente em `content/docs/funcionalidades/visao-geral.mdx`; commit pendente |
| Funcionalidades — Busca Inteligente | Aprovado | Implementado localmente em `content/docs/funcionalidades/busca-inteligente.mdx`; commit pendente |
| Workflows | Planejado | Aguardando análise e conteúdo aprovado |
| Demais funcionalidades | Pendentes | Dependem de novas evidências |

### 8.3 Conteúdo atualmente publicado

O repositório contém quatro documentos reais confirmados:

```text
content/docs/o-que-e-o-godocs.mdx
content/docs/primeiro-acesso.mdx
content/docs/funcionalidades/visao-geral.mdx
content/docs/funcionalidades/busca-inteligente.mdx
```

Estado derivado atual:

- **Comece por aqui:** `/docs/o-que-e-o-godocs` e `/docs/primeiro-acesso`;
- **Funcionalidades:** `/docs/funcionalidades/visao-geral` e `/docs/funcionalidades/busca-inteligente`;
- quatro cards reais na home, com dimensões e estrutura visual uniformes;
- ordem global: **O que é o GoDocs? → Primeiro Acesso → Visão Geral → Busca Inteligente**;
- metadados, busca, navegação, sitemap e imagens sociais gerados pela mesma coleção.

### 8.4 Regra de escrita permanente

Toda documentação deve ser escrita como conteúdo final de uma documentação real, destinada diretamente aos leitores.

Nunca incluir no texto publicado:

- observações de bastidores;
- menções a limitações da IA;
- comentários sobre prints não analisados;
- explicações sobre falta de contexto;
- linguagem que revele o processo interno de produção;
- afirmações não confirmadas apresentadas como fatos.

Quando uma informação essencial estiver ausente, a dúvida deve ser resolvida durante a produção. O texto final deve conter apenas conteúdo útil e validado para o leitor.

### 8.5 Fluxo editorial atual

1. o usuário envia prints e contexto;
2. informa o conteúdo ou formato necessário;
3. o material é analisado em conjunto com o conhecimento acumulado;
4. somente informações sustentadas são utilizadas;
5. perguntas são feitas apenas quando faltar uma informação material;
6. o conteúdo é escrito como documentação final;
7. o usuário revisa e solicita ajustes;
8. a versão aprovada é convertida em MDX e adicionada ao repositório;
9. GitHub e Vercel publicam a atualização.

## 9. Estado de UX/UI e identidade

### 9.1 Direção visual

A síntese aprovada permanece:

```text
experiência e organização de documentação moderna
                         +
identidade, paleta e linguagem visual do GoDocs
                         =
                    GoDocs Docs
```

### 9.2 Elementos consolidados

- logotipo oficial do GoDocs em arquivos próprios para temas claro e escuro;
- laranja como cor de destaque;
- fundos neutros grafite no tema escuro;
- superfícies claras e neutras no tema claro;
- bordas discretas;
- tipografia Inter;
- ícones lineares;
- header compacto;
- busca em destaque;
- cards simples;
- layout de leitura com largura controlada;
- sidebar e sumário apenas quando existe conteúdo contextual;
- responsividade para desktop, notebook, tablet e celular;
- estados de foco visíveis;
- redução de animações quando solicitada pelo sistema operacional.

### 9.3 Melhorias recentes de design

As últimas rodadas de alteração aprimoraram:

- escala tipográfica;
- contraste;
- tokens semânticos;
- proporção do logotipo;
- consistência entre temas;
- descrição dos cards;
- comportamento dos modais;
- acessibilidade da busca;
- acessibilidade do menu mobile;
- testes automatizados de identidade e design.

### 9.4 Restrições visuais

Não utilizar:

- verde como cor principal da marca;
- cópia literal do Mintlify ou da AbacatePay;
- aparência de dashboard na documentação;
- excesso de cards;
- sombras pesadas;
- glassmorphism;
- animações decorativas desnecessárias;
- elementos sem função real;
- links e CTAs fictícios.

## 10. Análise dos documentos internos

### 10.1 `AGENTS.md`

Continua sendo a principal fonte de regras permanentes para o Codex. Está adequado em propósito, engenharia, acessibilidade, conteúdo e validação.

Pendência real:

- substituir as referências `project_docs/` por `project-docs/`.

### 10.2 `project-docs/PROJECT_PROMPT.md`

Cumpriu sua função na construção inicial e agora é histórico. Não deve ser usado como instrução ativa sem solicitação explícita.

### 10.3 `project-docs/SYSTEM_BLUEPRINT.md`

Continua sendo referência para arquitetura, interface e comportamento estrutural. Deve ser atualizado quando uma decisão recente alterar materialmente a direção do produto.

### 10.4 `project-docs/daily_stats.md`

A versão presente na branch `main` ainda descreve a aplicação como não iniciada. Este arquivo atualizado substitui essa visão e deve ser incorporado ao repositório.

### 10.5 `README.md`

O README descreve corretamente o processo de adicionar documentos e os comandos de validação, mas mantém uma frase desatualizada afirmando que o MVP começa sem artigos publicados.

Como **O que é o GoDocs?** já existe em `content/docs/`, o resumo inicial do README deve ser atualizado.

### 10.6 Referências visuais

As referências continuam organizadas em:

```text
project-docs/references/GoDocs/
project-docs/references/AbacatePay - Mintlify/
```

Elas são somente leitura e servem para orientar identidade, layout, densidade, tipografia, busca, navegação e ritmo visual.

## 11. Decisões registradas

| Decisão | Estado | Motivo |
|---|---|---|
| Produto independente do GoDocs | Confirmada | Reduz acoplamento e preserva autonomia |
| Experiência visual coerente com o GoDocs | Confirmada | Mantém continuidade de ecossistema |
| Mintlify como referência, não cópia | Confirmada | Aproveita padrões de UX sem reproduzir identidade alheia |
| Next.js + TypeScript + Tailwind | Implementada | Base atual da aplicação |
| Conteúdo em Markdown/MDX | Implementada | Versionamento e crescimento progressivo |
| Home em `/` | Implementada | Entrada canônica |
| Artigos em `/docs/[...slug]` | Implementada | Rotas extensíveis |
| Busca local | Implementada | Consulta sem serviço externo |
| Tema claro e escuro | Implementada | Consistência e acessibilidade |
| Responsividade | Implementada | Uso em múltiplos dispositivos |
| Acessibilidade por teclado e foco | Implementada e evoluindo | Requisito permanente |
| Conteúdo real somente com evidência | Confirmada | Evita documentação inventada |
| GitHub como fonte versionada | Implementada | Histórico e manutenção |
| Vercel como plataforma de publicação | Implementada | Deploy conectado à `main` |
| Codex como ferramenta principal de desenvolvimento | Confirmada | Adequado ao fluxo versionado |
| `PROJECT_PROMPT.md` como histórico | Confirmada | O MVP já foi construído |
| `Comece por aqui` focada em introdução | Confirmada | Melhora a trilha inicial |
| Remoção de `Explorando o GoDocs` como card único | Confirmada | Evita concentração excessiva de assuntos |
| Nova seção `Funcionalidades` | Confirmada | Permite explicar cada recurso individualmente |
| Primeiro card de Funcionalidades: `Visão Geral` | Confirmada | Início da documentação funcional |
| Texto final sem bastidores ou menções à IA | Confirmada | Conteúdo deve parecer documentação real |

## 12. Lacunas, riscos e inconsistências

### 12.1 Documentos internos ainda parcialmente desatualizados

Este `daily_stats.md` agora reflete a coleção local de quatro documentos. O README ainda mantém uma descrição anterior à expansão atual.

Impacto: a introdução do README pode transmitir uma visão editorial incompleta.

### 12.2 Caminho incorreto no `AGENTS.md`

O arquivo usa `project_docs/`, mas a pasta real é `project-docs/`.

Impacto: agentes podem falhar ao localizar blueprint, referências e memória.

### 12.3 Alterações editoriais ainda não versionadas

**Primeiro Acesso**, **Visão Geral** e **Busca Inteligente** estão implementados e validados no checkout local, mas ainda não possuem commit, push ou deployment.

Impacto: a publicação externa permanece pendente e não deve ser presumida.

### 12.4 Auditoria de dependências bloqueada

`pnpm audit:prod` não conseguiu consultar o registro npm no sandbox. A tentativa de execução externa foi negada pela política do ambiente por envolver transmissão de metadados de dependências.

Impacto: a auditoria de segurança das dependências de produção não foi concluída nesta atualização.

### 12.5 Dependência de evidências do GoDocs 4

Permissões, estados, mensagens, regras e resultados precisam de validação direta.

Impacto: qualquer tentativa de acelerar o conteúdo por suposição pode gerar documentação incorreta.

### 12.6 Sincronização de deploy

As alterações desta fase não foram commitadas nem enviadas. Quando houver autorização para versioná-las, será necessário verificar se o novo push foi promovido ao ambiente de produção esperado.

### 12.7 Qualidade local

Conteúdo, lint, typecheck, testes e build foram aprovados. A inspeção visual cobriu temas, breakpoints, busca, navegação, sumários, breadcrumbs, paginação, menu mobile, medidas dos cards, overflow e console. A única lacuna é `pnpm audit:prod`, registrada em 12.4.

## 13. Próximos passos recomendados

### 13.1 Prioridade imediata — memória e regras

1. revisar as alterações locais desta fase;
2. criar commit e push somente mediante instrução explícita;
3. confirmar o deployment correspondente no Vercel após o push;
4. corrigir `project_docs/` para `project-docs/` no `AGENTS.md` em tarefa própria;
5. atualizar a introdução do README para reconhecer a coleção publicada.

### 13.2 Prioridade editorial

1. escolher o próximo conteúdo somente a partir de material real e aprovado;
2. revisar títulos, descrições, `cardDescription`, slugs, ordem e palavras-chave a cada nova página;
3. manter a home sem cards vazios ou fictícios;
4. avançar para Workflows e demais recursos somente quando novas evidências forem analisadas.

### 13.3 Prioridade técnica

1. concluir `pnpm audit:prod` em um ambiente autorizado a consultar o registro npm;
2. confirmar o estado do workflow de qualidade após o futuro push;
3. validar busca, menu mobile, foco e temas após cada mudança visual;
4. confirmar o deploy de cada novo commit no Vercel;
5. manter SEO, sitemap e imagens sociais sincronizados com os novos conteúdos.

### 13.4 Prioridade de processo

1. manter o fluxo Codex → GitHub → Vercel;
2. usar mensagens de commit mais descritivas do que `Melhoria do sistema` quando possível;
3. atualizar este arquivo após mudanças relevantes;
4. registrar no repositório toda decisão durável;
5. não depender exclusivamente da memória das conversas.

## 14. Critério de conclusão da próxima fase

A implementação local desta fase está concluída: os quatro conteúdos são navegáveis, a home e as estruturas derivadas refletem a taxonomia, os temas e breakpoints foram inspecionados e as validações locais aplicáveis foram aprovadas.

A publicação externa desta fase poderá ser considerada concluída quando:

- houver instrução explícita para criar commit e push;
- o commit correspondente estiver publicado no GitHub;
- o workflow de qualidade estiver aprovado;
- o Vercel registrar deployment bem-sucedido;
- `pnpm audit:prod` for executado em ambiente autorizado.

## 15. Protocolo de atualização deste arquivo

Atualize o `daily_stats.md` após cada mudança relevante.

No mínimo:

1. altere **Última atualização**, **Estado geral**, **Fase atual** e **Próxima ação recomendada**;
2. atualize separadamente o estado técnico, editorial e de deploy;
3. registre novos conteúdos criados, aprovados ou publicados;
4. registre commits relevantes e seus resultados, sem narrar comandos rotineiros;
5. mova itens concluídos para o histórico;
6. mantenha apenas riscos e lacunas reais;
7. informe validações efetivamente executadas;
8. registre alterações de arquitetura ou estrutura editorial;
9. adicione uma entrada ao registro cronológico.

Não transformar este arquivo em um diário detalhado de cada comando. O objetivo é registrar decisões, entregas, estado atual e próximos passos.

## 16. Registro cronológico

| Data | Atualização | Resultado |
|---|---|---|
| 21/07/2026 | Pesquisa sobre ferramentas de documentação | Mintlify identificado como referência de UX; projeto próprio passou a ser considerado |
| 21/07/2026 | Pesquisa sobre FábricaInfo e GoDocs | Contexto inicial de negócio e produto consolidado |
| 21/07/2026 | Definição da arquitetura editorial inicial | Estrutura progressiva da documentação estabelecida |
| 21/07/2026 | Criação de `O que é o GoDocs?` | Conteúdo introdutório produzido e refinado |
| 21/07/2026 | Desenvolvimento de `Primeiro Acesso` | Segundo conteúdo da seção inicial trabalhado |
| 21–22/07/2026 | Organização das referências visuais | Capturas do GoDocs e da AbacatePay/Mintlify organizadas |
| 22/07/2026 | Criação e revisão de `AGENTS.md` | Regras permanentes consolidadas |
| 22/07/2026 | Criação de `PROJECT_PROMPT.md` | Instrução one-shot do MVP criada |
| 22/07/2026 | Criação de `SYSTEM_BLUEPRINT.md` | Arquitetura técnica e visual detalhada |
| 22/07/2026 | Inicialização do Git e GitHub | Commit `2b6d8e5` criado na branch `main` |
| 22/07/2026 | Criação do README inicial | Commit `0d5de35` publicado |
| 22/07/2026 | Definição do fluxo Codex → GitHub → Vercel | Processo de desenvolvimento e publicação estabelecido |
| 22/07/2026 | Preparação do Vercel | Projeto conectado ao repositório |
| 23/07/2026 | Implementação do MVP | Commit `775c8d5` criou a aplicação funcional |
| 23/07/2026 | Primeira rodada de robustez | Commit `e1333c8` adicionou validação, testes, CI e reorganização interna |
| 23/07/2026 | Publicação do primeiro artigo | Commit `47b44d7` adicionou `O que é o GoDocs?`, SEO e imagens sociais |
| 23/07/2026 | Refinamento de UX/UI e busca | Commit `dbd37ea` ampliou identidade, pesquisa e testes de design |
| 23–24/07/2026 | Configuração e validação de deploy | GitHub e Vercel passaram a refletir as atualizações da branch `main` |
| 24/07/2026 | Nova reorganização editorial | `Explorando o GoDocs` foi substituído pela seção `Funcionalidades` |
| 24/07/2026 | Início de `Funcionalidades — Visão Geral` | Prints analisados e página iniciada |
| 24/07/2026 | Terceira rodada de melhorias | Commit `17bb648` refinou design, marca, acessibilidade e cards |
| 24/07/2026 | Verificação do último commit | Status Vercel confirmado como `success` |
| 24/07/2026 | Auditoria geral e atualização desta memória | Estado técnico, editorial e operacional consolidado |
| 24/07/2026 | Expansão da primeira coleção editorial | **Primeiro Acesso**, **Visão Geral** e **Busca Inteligente** implementados localmente; home, navegação, busca, SEO, testes e layout atualizados e validados |

---

**Resumo para retomada rápida:** o GoDocs Docs possui pipeline MDX, busca, navegação, temas, acessibilidade, SEO, testes e integração com Vercel. O `HEAD` local observado é `2268fed`. A coleção local contém **O que é o GoDocs?**, **Primeiro Acesso**, **Visão Geral** e **Busca Inteligente**, distribuídos entre **Comece por aqui** e **Funcionalidades**. Conteúdo, lint, typecheck, 70 testes, build e inspeção visual foram aprovados; `pnpm audit:prod` ficou bloqueado pela política de rede. As mudanças permanecem sem commit, push ou deployment verificado.
