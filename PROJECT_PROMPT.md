# GoDocs Docs — Prompt de implementação do MVP

## Tarefa

Implemente integralmente o MVP inicial do **GoDocs Docs**, uma aplicação independente de documentação para o GoDocs 4.

Antes de começar:

1. leia o `AGENTS.md` completo;
2. leia o `SYSTEM_BLUEPRINT.md` completo;
3. inspecione todas as imagens de `references/GoDocs/` e `references/AbacatePay - Mintlify/`;
4. examine todo o repositório e identifique o que já existe.

O `SYSTEM_BLUEPRINT.md` é a especificação técnica e visual desta entrega. Implemente seus requisitos de MVP, respeitando as regras permanentes do `AGENTS.md`.

Não entregue apenas um plano ou mockup. Crie a aplicação funcional, execute-a, faça inspeção visual, corrija problemas e valide o build.

## Contexto do produto

O GoDocs Docs não será incorporado ao código ou aos serviços privados do GoDocs. Ele será publicado como uma aplicação própria, mas deve parecer uma documentação oficial do produto.

Combine:

- **GoDocs:** marca, laranja, superfícies escuras, bordas discretas, tipografia corporativa e ícones lineares;
- **Mintlify/AbacatePay:** arquitetura de documentação, header, busca em destaque, leitura confortável, navegação contextual e cards futuros.

Não copie literalmente nenhuma referência. Não use o verde, os textos, links, logo ou conteúdo da AbacatePay.

## Decisões obrigatórias do MVP

- A home canônica é `/`.
- Artigos futuros usam `/docs/[...slug]`.
- A home não exibe uma sidebar vazia; ela usa conteúdo amplo e centralizado.
- Sidebar e sumário pertencem ao layout de artigos e passam a aparecer quando houver conteúdo.
- Não existem artigos, categorias ou cards de conteúdo publicados nesta entrega.
- A pesquisa é local e apresenta estado vazio até existirem documentos.
- Tema escuro é a referência principal; tema claro também deve ser completo.
- O conteúdo futuro deve ser baseado em Markdown/MDX e metadados centralizados.
- Não use banco de dados, CMS, autenticação ou serviços externos de busca.

## Stack

Preserve a stack existente se ela for adequada.

Se o repositório contiver apenas especificações e referências, inicialize com:

- Next.js com App Router;
- TypeScript estrito;
- Tailwind CSS;
- React Server Components por padrão;
- componentes client-side apenas para busca, tema, drawer e outras interações reais;
- `next/font` com Inter ou fonte equivalente disponível;
- Lucide Icons ou alternativa enxuta e consistente;
- pipeline local de Markdown/MDX compatível com build estático/servidor.

Use o gerenciador indicado por lockfile. Se não houver lockfile, escolha um único gerenciador comum. Instale apenas dependências necessárias.

## O que implementar

### Fundação

- aplicação configurada e executável;
- TypeScript estrito;
- scripts claros para desenvolvimento, lint, typecheck, testes existentes e build;
- metadados básicos da aplicação;
- tokens semânticos para cores, tipografia, spacing, radius, bordas e layout;
- estrutura organizada conforme o blueprint.

### Home

- header sticky;
- wordmark textual com `go` em laranja e `docs` na cor primária, seguido por separador e pelo rótulo `Documentação`;
- nome acessível completo: `GoDocs Documentação`;
- busca em posição de destaque;
- alternância de tema;
- apresentação institucional curta;
- estado indicando que o conteúdo será publicado progressivamente;
- detalhe abstrato laranja muito sutil, se contribuir para o acabamento;
- nenhuma sidebar vazia, seção inventada, card fictício ou CTA sem destino.

Use estes textos:

- título: `Documentação do GoDocs`;
- descrição: `Encontre guias, conceitos e instruções para utilizar o GoDocs.`;
- estado: `Novos conteúdos serão publicados progressivamente.`

### Header e marca

- menu mobile à esquerda quando aplicável;
- wordmark inspirado na relação visual do logo GoDocs: `go` em laranja, `docs` em cor de texto, separador discreto e rótulo `Documentação`;
- não redesenhe nem vetorize o logo a partir do screenshot;
- encapsule a marca em componente substituível por asset oficial;
- busca central com placeholder `Pesquisar na documentação...`;
- indicação do atalho `Ctrl K` ou `⌘ K`;
- toggle de tema à direita;
- nenhum link externo fictício.

### Pesquisa

- abre por clique, `Ctrl + K` e `Cmd + K`;
- fecha por `Escape`;
- possui label acessível;
- gerencia, prende e restaura foco;
- funciona por teclado e em mobile;
- usa índice local derivado dos documentos;
- estado vazio: `Nenhum conteúdo disponível para pesquisa.`;
- não contém resultados fictícios.

### Conteúdo e navegação

- diretório `content/docs/` pronto para arquivos Markdown/MDX;
- loader/índice único e tipado para metadados e conteúdo;
- navegação, busca, paginação e sumário preparados para consumir essa fonte;
- rota de artigos em `/docs/[...slug]`;
- `not-found` coerente para slug inexistente;
- ausência de artigo demonstrativo publicado;
- documentação curta no README ou arquivo apropriado explicando como adicionar a primeira página.

O suporte declarado a Markdown/MDX deve ser real. Adicionar um arquivo válido conforme o contrato do blueprint deve ser suficiente para torná-lo disponível após build, sem reconstruir manualmente o layout. Se uma etapa de registro for tecnicamente necessária, centralize-a e documente-a.

### Layout de artigos

Implemente a estrutura reutilizável necessária para:

- sidebar hierárquica à esquerda;
- breadcrumb, título, descrição e corpo;
- sumário à direita quando houver headings suficientes;
- headings com âncoras e offset correto;
- imagens, listas, links, tabelas e código;
- callouts e passos;
- navegação anterior/próxima.

Não crie páginas ou componentes vazios apenas para preencher uma lista. Não publique conteúdo fictício para demonstrar o layout.

### Tema e responsividade

- temas claro e escuro;
- preferência persistida;
- preferência inicial de `prefers-color-scheme`;
- prevenção de flash de tema incorreto;
- desktop, notebook, tablet e mobile;
- drawer de navegação nos artigos em telas menores;
- sem overflow horizontal;
- respeito a `prefers-reduced-motion`.

### Acessibilidade

- HTML semântico e landmarks;
- hierarquia válida de headings;
- foco visível;
- labels e nomes acessíveis;
- contraste adequado;
- áreas de toque confortáveis;
- operação completa por teclado;
- gerenciamento correto de foco em dialog e drawer;
- estado nunca comunicado apenas por cor.

## Restrições

Não:

- integre com o GoDocs real;
- crie autenticação, banco de dados, CMS, analytics ou editor;
- use serviço externo de busca;
- invente documentação, categorias, dados ou funcionalidades;
- use lorem ipsum;
- copie o layout ou a marca das referências;
- use verde como cor principal;
- transforme a home em dashboard ou landing page promocional;
- renderize cards de seções inexistentes;
- inclua GitHub, API, SDK, suporte, redes sociais ou CTAs sem destino real;
- edite as imagens de referência;
- faça refatorações fora do escopo;
- deixe stubs, controles inativos, logs de depuração ou erros silenciados.

## Processo obrigatório

1. Analise o repositório, as três especificações e as cinco imagens.
2. Defina a menor arquitetura capaz de cumprir o blueprint.
3. Implemente toda a fundação e a interface.
4. Execute a aplicação e inspecione-a visualmente.
5. Compare a hierarquia e a leitura com o Mintlify/AbacatePay.
6. Compare marca, superfícies e contraste com o GoDocs.
7. Valide desktop e mobile nos breakpoints do blueprint.
8. Valide temas claro e escuro.
9. Teste busca por clique, teclado e `Escape`.
10. Verifique foco, console, links, overflow e estados vazios.
11. Execute lint, typecheck, testes relevantes e build de produção.
12. Corrija todos os problemas introduzidos.
13. Faça uma segunda revisão visual e refine espaçamento, tipografia, contraste, alinhamento e estados interativos.

## Critérios de aceite

A entrega só está concluída quando:

- a aplicação inicia e o build de produção passa;
- `/` apresenta uma home profissional e intencional;
- a interface é reconhecível como GoDocs sem copiar o sistema;
- a experiência é reconhecível como documentação moderna;
- tema, pesquisa e responsividade funcionam;
- teclado e foco funcionam corretamente;
- a arquitetura aceita o primeiro documento real;
- não há artigos, categorias, resultados ou links fictícios;
- não há erros introduzidos de lint, tipos, build ou console;
- a interface foi inspecionada e refinada visualmente.

## Entrega final

Ao concluir, informe:

- resumo do que foi implementado;
- stack e arquitetura adotadas;
- rotas criadas;
- principais arquivos alterados;
- como adicionar o primeiro documento;
- validações executadas e resultados;
- limitações reais restantes.

Não pare em decisões técnicas triviais. Implemente, valide e refine o MVP completo.
