# GoDocs Docs — Instruções permanentes

## 1. Propósito

Este repositório contém o **GoDocs Docs**, uma aplicação independente para documentar o GoDocs 4.

O produto não integra o código, as APIs, a autenticação ou os serviços privados do GoDocs. Ainda assim, deve parecer uma experiência oficial do mesmo ecossistema.

A direção central é:

> experiência de documentação inspirada no Mintlify, com identidade visual inspirada no GoDocs.

Inspiração não significa cópia. Não reproduza marcas, textos, links, componentes ou identidade da AbacatePay/Mintlify.

## 2. Ordem de leitura e autoridade

Antes de implementar qualquer tarefa:

1. leia este `AGENTS.md`;
2. siga a solicitação atual do usuário como instrução principal da tarefa;
3. consulte `project_docs/SYSTEM_BLUEPRINT.md` quando a tarefa envolver arquitetura, interface, experiência ou comportamento estrutural do produto;
4. inspecione `project_docs/references/` quando a tarefa afetar interface ou identidade visual.

Em caso de conflito, siga esta ordem: solicitação atual do usuário, este arquivo, `project_docs/SYSTEM_BLUEPRINT.md` e referências visuais.

`project_docs/PROJECT_PROMPT.md` é um documento histórico da implementação inicial e não deve ser tratado como instrução ativa, salvo quando o usuário solicitar explicitamente sua consulta.

`project_docs/daily_stats.md` é uma memória de acompanhamento do projeto e não faz parte da leitura obrigatória para tarefas de desenvolvimento, salvo quando o usuário solicitar uma atualização, auditoria de progresso ou retomada de contexto.

## 3. Invariantes do produto

- O projeto é uma aplicação de documentação, não um dashboard.
- A identidade usa neutros escuros e laranja; verde não é cor de marca.
- A home deve permanecer útil e intencional mesmo sem artigos.
- Não invente artigos, seções, funcionalidades do GoDocs, dados, links ou integrações.
- Conteúdo documental é baseado em arquivos Markdown/MDX, sem banco de dados ou CMS no MVP.
- Navegação, sumário e busca devem derivar da mesma fonte de conteúdo.
- Tema claro, tema escuro, responsividade e acessibilidade são requisitos, não opcionais.
- Arquivos em `project_docs/references/` são somente leitura: não edite, renomeie, mova ou exclua.

## 4. Uso das referências visuais

Use `project_docs/references/GoDocs/` para orientar:

- wordmark e relação entre branco e laranja;
- paleta, superfícies e contraste;
- bordas, radius e densidade visual;
- tipografia corporativa e ícones lineares;
- estados ativos e controles de tema.

Use `project_docs/references/AbacatePay - Mintlify/` para orientar:

- estrutura de documentação;
- header e busca central;
- largura e ritmo do conteúdo;
- navegação contextual;
- cards de conteúdo futuros;
- hierarquia tipográfica e espaçamento.

Não copie da AbacatePay o verde, a marca, o conteúdo, a navegação específica, os CTAs ou os links externos.

## 5. Princípios de engenharia

- Mantenha o código da aplicação e seus arquivos de configuração na raiz do repositório.
- Use `project_docs/` apenas para memória, especificações internas e referências do projeto.
- Mantenha `AGENTS.md` na raiz do repositório como fonte permanente de instruções para o agente.
- Examine o repositório antes de alterar arquivos.
- Preserve a stack e as convenções existentes quando adequadas.
- Mantenha TypeScript estrito quando o projeto usar TypeScript.
- Prefira componentes pequenos, tipados e com responsabilidade clara.
- Separe layout, conteúdo, navegação e regras de domínio.
- Centralize tokens visuais e metadados de conteúdo.
- Reutilize componentes e dependências existentes antes de adicionar novos.
- Instale somente dependências necessárias e justificáveis.
- Evite `any`, silenciamento de lint, stubs e abstrações prematuras.
- Não faça refatorações ou melhorias fora do escopo da tarefa.
- Preserve alterações do usuário e não sobrescreva trabalho não relacionado.
- Não exponha segredos nem crie variáveis de ambiente sem necessidade.

## 6. Conteúdo e informação

- Não use lorem ipsum nem conteúdo fictício apresentado como real.
- Estados vazios devem ser curtos, úteis e visualmente intencionais.
- Ao receber documentação, preserve seu significado e organize-a para leitura.
- Não afirme comportamentos do GoDocs sem evidência fornecida pelo usuário ou pelas fontes do projeto.
- Slugs devem ser estáveis, legíveis e compatíveis com URL.
- Metadados devem seguir o contrato definido em `project_docs/SYSTEM_BLUEPRINT.md`.

## 7. Design e acessibilidade

- Priorize clareza, conforto de leitura e identidade GoDocs.
- Use tokens semânticos em vez de cores ou medidas espalhadas.
- Garanta layout adequado em desktop, notebook, tablet e celular.
- Use HTML semântico, landmarks, headings válidos e labels acessíveis.
- Toda interação deve funcionar por teclado e ter foco visível.
- Diálogos e drawers devem gerenciar foco, fechar com `Escape` e devolver o foco ao acionador.
- Respeite `prefers-reduced-motion`.
- Não use apenas cor para comunicar estado.
- Evite excesso de cards, sombras, gradientes, glassmorphism e animações decorativas.

## 8. Validação obrigatória

Antes de concluir uma alteração, execute os comandos disponíveis e relevantes para:

- lint;
- typecheck;
- testes;
- build de produção.

Para mudanças visuais:

1. execute a aplicação;
2. inspecione a interface renderizada;
3. valide os principais breakpoints;
4. valide temas claro e escuro;
5. teste interações por mouse e teclado;
6. verifique console e overflow;
7. compare com as referências;
8. refine a interface antes de concluir.

Não declare uma validação que não foi executada. Se algo estiver bloqueado ou falhar por causa anterior à tarefa, registre a causa com precisão.

## 9. Comportamento esperado do agente

- Prossiga com autonomia em decisões técnicas rotineiras.
- Faça suposições conservadoras que não ampliem o escopo.
- Pergunte apenas quando faltar uma decisão material que não possa ser inferida com segurança.
- Investigue e tente resolver problemas antes de solicitar intervenção.
- Para implementações, continue até entregar e validar tudo o que estiver ao alcance do ambiente.
- Não considere uma tarefa visual concluída apenas porque o código compila.

## 10. Entrega

Ao concluir, informe de forma concisa:

- o que foi implementado;
- principais arquivos criados ou alterados;
- decisões técnicas relevantes;
- validações executadas e resultados;
- limitações, riscos ou pendências reais.

