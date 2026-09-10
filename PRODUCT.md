# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

O GoDocs Docs é uma aplicação web responsiva destinada à consulta da documentação do GoDocs 4 em desktop, notebook, tablet e celular.

## Users

Os usuários principais são pessoas que utilizam o GoDocs no trabalho, incluindo:

- usuários operacionais;
- responsáveis por processos;
- administradores;
- gestores, quando aplicável ao contexto documentado.

A documentação precisa atender necessidades diferentes dentro do mesmo produto:

- **primeiro contato:** pessoas que precisam entender o que é o GoDocs, acessar o sistema e aprender os conceitos e fluxos iniciais;
- **aprendizado de funcionalidade:** pessoas que estão conhecendo uma área do sistema e precisam compreender seu propósito, funcionamento, requisitos e consequências;
- **execução de tarefa:** pessoas que consultam a documentação enquanto realizam uma ação no GoDocs;
- **consulta rápida:** usuários experientes que já conhecem o sistema e precisam apenas recuperar uma informação, regra ou procedimento;
- **resolução de dúvida:** pessoas que encontraram uma situação específica durante o uso e precisam entender o comportamento esperado.

Equipes de implantação e suporte também podem consultar o GoDocs Docs para orientar usuários e confirmar comportamentos já documentados, mas são públicos secundários.

O produto não deve presumir que todas essas pessoas possuem as mesmas permissões, responsabilidades, módulos contratados ou configurações de ambiente.

## Product Purpose

O **GoDocs Docs** é o canal oficial de publicação e consulta da documentação do **GoDocs 4** para usuários finais.

Seu propósito é permitir que uma pessoa compreenda e utilize o GoDocs com autonomia, reduzindo a necessidade de depender de outra pessoa para aprender uma funcionalidade, recuperar um procedimento ou esclarecer uma dúvida sobre o uso do sistema.

A documentação deve:

- orientar o primeiro acesso;
- explicar conceitos antes de instruções quando isso for necessário para compreensão;
- mostrar como as funcionalidades funcionam;
- ensinar procedimentos de forma clara e proporcional à complexidade;
- deixar requisitos, permissões, disponibilidade e consequências explícitos quando afetarem uma ação;
- oferecer descoberta por navegação, busca e relações contextuais;
- permitir consulta rápida sem exigir a leitura integral de páginas longas;
- continuar útil tanto para iniciantes quanto para usuários experientes.

O sucesso do produto significa que o usuário consegue:

1. encontrar a informação relevante;
2. entender o contexto e as condições daquela informação;
3. saber o que pode ou deve fazer em seguida;
4. executar a tarefa com maior autonomia;
5. confiar que a documentação representa o comportamento conhecido do GoDocs.

A documentação não deve buscar completude artificial. Quando uma informação ainda não estiver confirmada, a lacuna deve permanecer explícita em vez de ser preenchida por inferência.

## Positioning

O GoDocs Docs é a **referência oficial voltada aos usuários finais do GoDocs 4**.

Ele está sendo desenvolvido para substituir progressivamente a dependência do **Confluence** como experiência principal de documentação do GoDocs. Essa direção se aplica ao produto GoDocs e não deve ser generalizada automaticamente para os demais produtos ou documentações da FábricaInfo.

O posicionamento combina:

```text
documentação oficial do GoDocs
+
experiência moderna de aprendizado e consulta
+
conteúdo versionado
+
identidade própria do ecossistema GoDocs
```

O **Mintlify** é uma referência de maturidade e experiência de documentação, não um produto a ser copiado. O GoDocs Docs pode aprender com padrões de busca, navegação, leitura e descoberta utilizados em documentações modernas, mas deve preservar arquitetura, identidade, conteúdo e decisões próprias.

O produto deve ser percebido como **documentação**, não como dashboard administrativo, landing page promocional ou reprodução visual do GoDocs 4.

### Relação com o Notion

O Notion não é um canal alternativo para os leitores.

Quando utilizado, ele serve apenas como ambiente interno de:

- autoria;
- organização;
- preparação;
- revisão.

Uma informação só passa a integrar a documentação oficial quando é consolidada no conteúdo versionado e publicada no GoDocs Docs pelo fluxo oficial do projeto.

O Notion não substitui o repositório como fonte pública da documentação.

## Operating Context

Os usuários consultam a documentação enquanto trabalham com o GoDocs.

Os principais contextos de uso são:

- primeiro acesso ao sistema;
- aprendizado de uma nova funcionalidade;
- realização de uma tarefa;
- recuperação de um procedimento já conhecido;
- esclarecimento de uma dúvida durante o uso;
- compreensão de uma limitação, requisito ou permissão;
- confirmação de como determinada funcionalidade se comporta.

O GoDocs opera em ambientes e workspaces configurados para diferentes organizações. Por isso, a documentação precisa considerar que:

- funcionalidades disponíveis podem variar;
- módulos ou serviços podem não estar contratados em todos os ambientes;
- permissões podem variar entre usuários;
- ações disponíveis podem depender de responsabilidade, configuração ou contexto;
- nomes e estruturas de uma organização não representam necessariamente o comportamento universal do GoDocs.

### Serviços condicionais

A documentação publicada já confirma que:

- **Busca Inteligente** é um serviço adicional do GoDocs e fica disponível nos ambientes que possuem o serviço contratado;
- **Workflows** também é um serviço adicional e precisa estar contratado para estar disponível;
- dentro de Workflows, as ações exibidas também podem variar conforme as permissões do usuário.

Essas condições devem ser preservadas sempre que conteúdos relacionados forem revisados.

### White-label

O GoDocs possui caráter white-label.

A documentação não deve transformar em regra universal:

- nomes de clientes;
- departamentos;
- cargos;
- grupos;
- workflows;
- fases;
- formulários;
- campos;
- pastas;
- processos;
- exemplos específicos de um único ambiente.

Quando um exemplo for necessário, ele deve ser claramente genérico e não pode ser apresentado como regra do produto.

## Capabilities and Constraints

### Capacidades atuais confirmadas

- O GoDocs Docs documenta o GoDocs 4 por meio de uma aplicação independente.
- O conteúdo publicado é escrito em **português do Brasil**.
- A documentação pública é armazenada e versionada no repositório em arquivos **Markdown/MDX**.
- A mesma coleção normalizada de conteúdo alimenta, conforme a arquitetura atual, artigos, rotas, Home, hubs, navegação, breadcrumbs, busca, sumário, paginação, Related, sitemap e metadados.
- A documentação possui navegação hierárquica e hubs de domínio para conteúdos que foram decompostos em páginas-filhas.
- O site oferece busca local da documentação.
- A busca do GoDocs Docs é diferente da funcionalidade **Busca Inteligente** do GoDocs.
- A busca atual da documentação é local e determinística; não utiliza IA ou embeddings.
- O produto possui temas claro e escuro.
- A experiência é responsiva.
- Acessibilidade faz parte do produto, não é um refinamento opcional.
- A documentação já suporta imagens instrutivas e ampliação de imagens quando adequado.
- O **Primeiro Acesso** já utiliza imagens instrutivas como parte da experiência de aprendizado.
- A aplicação pública atual não depende de banco de dados ou CMS em tempo de execução.
- O baseline atual não exige autenticação própria para leitura.
- O GoDocs Docs não deve presumir acesso ao código privado, APIs privadas, autenticação interna ou serviços privados do GoDocs.

### Restrições editoriais e de produto

- Não inventar comportamentos, funcionalidades, dados, integrações, links, mensagens, permissões ou regras do GoDocs.
- Não preencher lacunas de conhecimento com suposições apresentadas como fatos.
- Não tratar configuração específica de um cliente como comportamento universal.
- Não afirmar que uma ação está disponível para todos quando ela puder depender de permissão.
- Analisar permissões por ação, e não apenas por um rótulo geral de perfil.
- Separar, quando aplicável, ações como visualizar, criar, editar, mover, concluir, reabrir, excluir e configurar.
- Preservar diferenças entre ambientes, módulos e serviços contratados.
- Melhorias de layout, design, responsividade, acessibilidade ou navegação não autorizam alteração factual do conteúdo.
- Conteúdo real de clientes, dados pessoais, segredos ou informações de ambientes não devem ser publicados como material de documentação.
- A pessoa ou equipe com responsabilidade formal final pela validação editorial ainda não está definida nas fontes atuais e não deve ser presumida.

### Autenticação

A autenticação própria foi explorada na frente do Editor, incluindo trabalho preservado em uma branch isolada, mas **não faz parte do baseline atual da experiência de leitura**.

Portanto:

- não descrever o GoDocs Docs atual como uma experiência autenticada;
- não afirmar que a leitura exige sessão;
- não afirmar que existe cadastro público ou fluxo de convite próprio do GoDocs Docs;
- não transformar decisões históricas do Editor em requisito atual do produto.

Qualquer mudança desse estado precisa ser retomada e confirmada explicitamente no contexto do Editor ou de uma futura decisão de proteção da documentação.

### Editor próprio

O desenvolvimento de um editor/criador de documentação próprio é uma direção aprovada para evolução do produto, mas a frente está atualmente:

```text
preservada
pausada
```

Seu objetivo futuro é reduzir dependência de manutenção manual e aproximar autoria, organização e publicação do próprio ecossistema do GoDocs Docs.

O Editor não é uma capacidade atual e não deve ser retomado ou apresentado como disponível sem autorização explícita.

Quando essa frente for retomada, ela não deve criar uma segunda fonte pública concorrente ao conteúdo versionado. A relação entre autoria, persistência e publicação deverá preservar uma fonte publicada coerente.

### Imagens e vídeos

A evolução da documentação para uma experiência mais visual é uma direção aprovada.

Estado atual:

- imagens instrutivas já são suportadas;
- o Primeiro Acesso já funciona como aplicação inicial desse padrão.

Direção futura:

- ampliar o uso de imagens quando elas reduzirem ambiguidade ou melhorarem aprendizado;
- utilizar vídeos-guia de forma seletiva, somente quando trouxerem ganho real em relação a texto e imagem.

Imagens ou vídeos não devem ser adicionados apenas como ornamentação.

### Chat / assistente da documentação

Existe uma direção futura planejada para um assistente capaz de responder dúvidas com base na documentação.

Esse assistente:

- não é uma capacidade atual;
- não substitui a busca local existente;
- não autoriza transformar a busca atual em IA por inferência;
- deverá ser tratado como uma frente própria quando for priorizado.

Nenhuma arquitetura específica para esse assistente deve ser considerada decidida sem nova confirmação.

### GoPractice

**GoPractice** é uma ideia futura aprovada para aprendizado prático por microssimulações.

A proposta é permitir que a pessoa aprenda fazendo, por meio de simulações de ações do GoDocs sem modificar dados reais.

Estado:

```text
ideia aprovada para o futuro
não implementar agora
```

GoPractice não deve ser tratado como capacidade atual nem como próximo passo automático.

### FAQ

FAQ e dúvidas frequentes fazem parte da direção editorial de descoberta de conteúdo, mas não devem ser tratados como uma funcionalidade atual completa sem confirmação de implementação.

Quando utilizados, devem:

- responder dúvidas reais e úteis;
- evitar duplicar artigos inteiros;
- direcionar para documentação completa quando a resposta exigir contexto maior;
- permanecer factuais.

## Brand Commitments

- O nome do produto é **GoDocs Docs**.
- O GoDocs Docs é o canal oficial da documentação do GoDocs 4 para usuários finais.
- O produto não deve exibir mensagens sugerindo que a documentação é informal ou não oficial.
- A experiência deve permanecer coerente com o ecossistema GoDocs.
- Ativos oficiais disponíveis no repositório devem ser preferidos a recriações da marca por inferência.
- O laranja faz parte da identidade GoDocs, mas decisões de cor, tipografia, tokens e componentes pertencem ao `DESIGN.md`.
- A documentação deve parecer um produto de documentação, não uma adaptação do dashboard do GoDocs.
- A direção visual consolidada é **robusta na estrutura e clean na apresentação**.
- A voz deve ser clara, natural, direta, humana, profissional e didática quando necessário.
- Evitar excesso de formalidade, frases promocionais, texto genérico ou linguagem que não ajude o usuário a compreender o sistema.
- Mintlify, Confluence e outras referências servem para benchmark e aprendizado, não para cópia de marca, texto, navegação ou identidade.
- A Landing Page do GoDocs 4 pode servir como referência de identidade e atmosfera, mas não como template literal para a documentação.

## Evidence on Hand

As decisões deste documento possuem atualmente as seguintes evidências no projeto:

- existe uma coleção real de documentos publicados em `content/docs/`;
- a coleção cobre orientação inicial e funcionalidades documentadas do GoDocs 4;
- Documentos e Workflows já possuem estrutura de hubs e páginas-filhas;
- a busca local, navegação, TOC, paginação e Related já estão implementados;
- o conteúdo publicado distingue a busca da documentação da **Busca Inteligente** do produto;
- o conteúdo publicado confirma **Busca Inteligente** e **Workflows** como serviços adicionais sujeitos à disponibilidade do ambiente;
- o conteúdo publicado registra que determinadas ações podem variar conforme permissões;
- imagens instrutivas já fazem parte da documentação de Primeiro Acesso;
- os ativos oficiais usados pela aplicação estão em `public/brand/`;
- as referências visuais estão em `project-docs/references/` e são somente leitura;
- o baseline atual da aplicação não possui autenticação própria integrada à leitura;
- a frente do Editor está preservada e pausada;
- não há evidência atual suficiente para tratar Chat, GoPractice, vídeos ou Editor como capacidades disponíveis;
- não há evidências publicáveis de depoimentos, estudos de caso, benchmarks comerciais ou preços;
- a responsabilidade formal final pela validação editorial ainda não está explicitamente definida.

Essas evidências não devem ser extrapoladas além do que realmente comprovam.

## Product Principles

1. **Autonomia do usuário:** cada conteúdo deve aumentar a capacidade da pessoa de compreender o GoDocs e executar sua tarefa sem depender de orientação externa.
2. **Clareza antes de promoção:** interface e conteúdo existem para encontrar, compreender e aplicar informação.
3. **Verdade antes de completude:** uma lacuna explícita é preferível a uma resposta inventada.
4. **Aprendizado e consulta no mesmo canal:** iniciantes precisam de contexto; usuários experientes precisam chegar rapidamente à informação.
5. **Intenção antes de volume:** dividir, resumir ou aprofundar conteúdo de acordo com a intenção do usuário, não para aumentar artificialmente o número de páginas.
6. **Detalhamento proporcional à complexidade:** tarefas simples devem ser breves; processos com regras, permissões, consequências ou múltiplos participantes devem receber contexto suficiente.
7. **Uma fonte publicada coerente:** as formas de descoberta devem derivar do mesmo conteúdo publicado e não de cadastros concorrentes.
8. **Neutralidade white-label:** a documentação deve funcionar em diferentes organizações e não universalizar exemplos de um ambiente.
9. **Permissões por ação:** não assumir acesso uniforme; explicar dependências quando elas alterarem o procedimento.
10. **Disponibilidade com contexto:** serviços, módulos e funcionalidades condicionais devem ser identificados como tal.
11. **Conceito antes do procedimento quando necessário:** explicar o que uma funcionalidade faz antes de ensinar uma sequência de passos quando isso reduzir erro ou ambiguidade.
12. **Descoberta sem poluição:** navegação, hubs, busca, TOC, Related e futuros recursos de descoberta devem facilitar orientação sem competir com o conteúdo.
13. **Visual com função didática:** imagens, vídeos, animações e componentes devem existir quando ajudam a compreender, localizar ou executar algo.
14. **Evolução sem apagar contratos úteis:** mudanças de experiência devem preservar conteúdo válido, URLs públicas e padrões consolidados quando não houver motivo aprovado para ruptura.
15. **Separação entre capacidade atual e visão futura:** uma ideia aprovada ou um protótipo não deve ser comunicado como funcionalidade disponível.

## Accessibility & Inclusion

O GoDocs Docs deve atender pessoas com diferentes níveis de experiência digital e de familiaridade com o GoDocs.

A experiência precisa funcionar em:

- desktop;
- notebook;
- tablet;
- celular;
- tema claro;
- tema escuro.

O produto exige:

- HTML semântico;
- hierarquia válida de headings;
- navegação completa por teclado;
- foco visível;
- contraste compatível com WCAG AA;
- gerenciamento correto de foco em diálogos e drawers;
- retorno de foco ao acionador;
- suporte a `prefers-reduced-motion`;
- touch targets adequados;
- textos e estados que não dependam apenas de cor ou ícones.

Inclusão também se aplica ao conteúdo.

A documentação deve:

- evitar jargão desnecessário;
- explicar termos quando o contexto exigir;
- não presumir conhecimento avançado do sistema;
- utilizar instruções claras e ordenadas;
- preservar contexto suficiente para que usuários iniciantes compreendam a ação;
- permitir escaneabilidade e consulta rápida para usuários experientes;
- utilizar texto alternativo útil em imagens instrutivas;
- não depender exclusivamente de screenshots para transmitir informação essencial.

Acessibilidade, legibilidade e compreensão fazem parte da definição de qualidade do produto.
