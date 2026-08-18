# Referências de Redesign — GoDocs Docs

Este diretório reúne as referências visuais e estruturais utilizadas na nova fase de evolução do **GoDocs Docs**.

O objetivo dessas referências não é reproduzir interfaces existentes, mas estudar princípios de arquitetura, UX, navegação, organização da informação, Design System e linguagem visual que possam ajudar a elevar o GoDocs Docs ao nível de plataformas profissionais de documentação.

O GoDocs Docs está sendo desenvolvido para se tornar a **documentação oficial do GoDocs 4**, substituindo o uso atual do Confluence para esse produto dentro da FábricaInfo.

A ambição desta fase é construir uma experiência comparável — e, quando fizer sentido, superior — a ferramentas maduras como **Confluence** e **Mintlify**, preservando a identidade própria do GoDocs.

---

## 1. Estrutura das referências

```text
redesign/
├── benchmarks/
│   ├── confluence/
│   └── mintlify/
│       ├── abacatepay/
│       └── stripe/
│
├── godocs-brand/
│   └── landing-page/
│
└── README.md
```

As referências possuem papéis diferentes e não devem ser interpretadas com o mesmo peso.

---

## 2. Hierarquia de autoridade

Ao analisar ou propor alterações para o GoDocs Docs, considere esta ordem:

1. objetivos e necessidades reais do GoDocs Docs;
2. `PRODUCT.md`;
3. `DESIGN.md`;
4. implementação atual do sistema;
5. identidade visual do GoDocs 4;
6. benchmarks externos.

Os benchmarks nunca substituem as fontes canônicas do projeto.

Uma solução existente no Confluence ou Mintlify não deve ser adotada apenas porque essas plataformas a utilizam.

Toda decisão precisa fazer sentido para o contexto do GoDocs Docs.

---

## 3. GoDocs 4 — referência de identidade

Diretório:

```text
godocs-brand/landing-page/
```

As imagens da Landing Page do GoDocs 4 representam a principal referência externa deste diretório para a **identidade visual da marca**.

Devem ser analisados aspectos como:

- paleta;
- utilização do laranja;
- fundos escuros;
- superfícies;
- contraste;
- profundidade;
- bordas;
- iluminação ambiental;
- hierarquia visual;
- tipografia;
- iconografia;
- sensação de produto;
- composição;
- equilíbrio entre superfícies neutras e elementos de destaque.

A Landing Page deve ajudar a compreender como o ecossistema GoDocs transmite visualmente sua identidade.

### Importante

O GoDocs Docs é uma plataforma de documentação, não uma landing page.

Portanto, não transportar automaticamente para a documentação:

- grandes blocos promocionais;
- CTAs de marketing;
- ilustrações decorativas excessivas;
- composições próprias de páginas comerciais;
- efeitos que prejudiquem leitura ou concentração.

O objetivo é absorver **linguagem visual, atmosfera e identidade**, adaptando esses princípios a uma experiência voltada à leitura e consulta.

---

## 4. Confluence — benchmark de documentação enterprise

Diretório:

```text
benchmarks/confluence/
```

O Confluence possui importância especial neste projeto porque é a ferramenta atualmente utilizada pela FábricaInfo para hospedar documentações do GoDocs e de outros produtos.

O GoDocs Docs está sendo desenvolvido para substituir o Confluence como documentação oficial do GoDocs.

Por isso, o Confluence deve ser analisado como referência de:

- organização de grandes bases de conhecimento;
- hierarquia de páginas;
- navegação por árvore;
- escalabilidade;
- espaços e agrupamentos;
- localização do usuário;
- busca;
- organização de conteúdos empresariais;
- descoberta de páginas relacionadas.

Também devem ser identificadas suas limitações.

Avaliar especialmente:

- densidade visual;
- excesso de níveis;
- poluição da navegação;
- quantidade de elementos competindo por atenção;
- experiência de leitura;
- aparência de ferramenta genérica;
- pontos de atrito em bases muito extensas.

O objetivo não é reproduzir o Confluence.

A análise deve identificar:

> O que o Confluence resolve bem por necessidade de escala e o que o GoDocs Docs pode resolver de forma mais simples, clara e moderna.

---

## 5. Mintlify — benchmark de documentação moderna

Diretório:

```text
benchmarks/mintlify/
```

O Mintlify é uma das principais referências do projeto para experiências modernas de documentação.

As pastas de Stripe e AbacatePay contêm exemplos de documentações construídas utilizando essa plataforma.

O objetivo é estudar os princípios presentes nessas experiências, principalmente:

- arquitetura da informação;
- navegação;
- estrutura de artigos;
- sidebar;
- busca;
- organização por produtos ou assuntos;
- escaneabilidade;
- hierarquia tipográfica;
- largura de leitura;
- sumário da página;
- breadcrumbs;
- navegação entre páginas;
- apresentação de exemplos;
- componentes documentais;
- equilíbrio entre densidade e respiro;
- percepção de qualidade;
- consistência visual;
- experiência mobile.

Stripe e AbacatePay não devem ser tratadas como dois sistemas de documentação independentes para fins desta análise.

Elas funcionam principalmente como **exemplos diferentes de utilização do ecossistema Mintlify**.

### 5.1 Stripe

Diretório:

```text
benchmarks/mintlify/stripe/
```

Utilizar principalmente como referência para:

- arquitetura documental;
- organização de grandes conjuntos de conteúdo;
- descoberta;
- estrutura das páginas;
- navegação;
- divisão entre conteúdo principal e elementos auxiliares;
- experiência orientada a tarefas.

Não copiar identidade visual, marca ou estrutura específica dos produtos Stripe.

### 5.2 AbacatePay

Diretório:

```text
benchmarks/mintlify/abacatepay/
```

Utilizar principalmente como referência para:

- aplicação contemporânea do Mintlify;
- tema escuro;
- hierarquia;
- composição;
- superfícies;
- cards;
- tipografia;
- densidade;
- componentes técnicos;
- percepção visual moderna.

Não utilizar o verde, a identidade, o branding ou elementos específicos da AbacatePay como referência para a identidade do GoDocs.

---

## 6. O que deve ser estudado

As referências devem ajudar a responder perguntas como:

### Arquitetura de informação

- A documentação continua organizada se crescer para dezenas ou centenas de páginas?
- A profundidade da navegação é adequada?
- Os conteúdos estão divididos nas unidades corretas?
- É fácil entender onde uma página está dentro da documentação?
- Assuntos extensos estão sendo concentrados demais em uma única página?

### Navegação

- A sidebar é clara?
- A hierarquia é facilmente compreendida?
- Busca, breadcrumbs, TOC e navegação anterior/próxima trabalham juntos?
- O usuário consegue encontrar rapidamente um assunto conhecido?
- É fácil explorar conteúdos relacionados?

### Página de documentação

- A hierarquia entre título, introdução, headings e conteúdo está clara?
- A largura de leitura é adequada?
- O conteúdo possui bom ritmo vertical?
- Componentes auxiliares ajudam ou disputam atenção?
- O TOC realmente facilita a leitura?
- A página continua confortável quando possui bastante conteúdo?

### Home

- Funciona como porta de entrada para a documentação?
- Ajuda novos usuários?
- Também atende usuários recorrentes?
- Facilita a descoberta das principais áreas?
- A busca recebe a importância adequada?

### Design System

- Os componentes parecem fazer parte do mesmo produto?
- Tipografia, espaçamentos, bordas, superfícies e estados seguem uma linguagem consistente?
- Existe profundidade suficiente sem excesso de decoração?
- Tema claro e escuro possuem o mesmo nível de acabamento?

### Escalabilidade

- A solução atual funcionará quando o número de páginas crescer significativamente?
- Existem padrões que dependem demais da quantidade atual de conteúdo?
- A arquitetura permite criar novas seções sem degradar a experiência?

### Percepção de maturidade

Ao comparar as experiências lado a lado:

- O GoDocs Docs parece pertencer à mesma categoria de produto?
- Onde ele já possui vantagens?
- Onde ainda parece menos maduro?
- Quais melhorias poderiam fazê-lo superar as referências dentro do seu contexto específico?

---

## 7. O que não deve ser feito

Estas referências **não são especificações de implementação**.

Não:

- copiar layouts completos;
- copiar componentes;
- reproduzir identidade visual de terceiros;
- copiar paletas;
- copiar textos;
- reproduzir estrutura específica de outro produto sem necessidade;
- transformar o GoDocs Docs em um clone do Mintlify;
- transformar o GoDocs Docs em um Confluence redesenhado;
- adicionar componentes apenas porque aparecem nos benchmarks;
- alterar o Design System sem avaliar `DESIGN.md`;
- priorizar aparência sobre legibilidade;
- transformar páginas documentais em landing pages;
- introduzir animações ou efeitos sem ganho real de UX.

Todo princípio observado deve ser reinterpretado para o contexto do GoDocs.

---

## 8. Objetivo estratégico do redesign

A nova fase de redesign deve elevar o GoDocs Docs em quatro dimensões principais:

### Estrutura

Criar uma arquitetura capaz de crescer com a documentação do GoDocs sem gerar navegação excessivamente complexa ou páginas difíceis de consumir.

### Experiência

Permitir que novos usuários aprendam o sistema e que usuários experientes encontrem rapidamente uma informação específica.

### Design

Construir uma experiência moderna, profissional e consistente, alinhada à identidade visual do GoDocs 4 e ao conceito definido no Design System do GoDocs Docs.

### Maturidade

Fazer com que o GoDocs Docs tenha qualidade suficiente para assumir o papel de documentação oficial do produto e competir com plataformas especializadas de documentação.

---

## 9. Princípio de evolução

O redesign é **evolutivo**.

A aplicação atual possui uma base funcional e um Design System estabelecido.

Portanto:

- preservar o que funciona;
- melhorar o que está fraco;
- redesenhar somente quando houver justificativa;
- evitar reconstrução desnecessária;
- evitar mudanças puramente estéticas sem benefício para o usuário;
- manter acessibilidade, responsividade e legibilidade como requisitos permanentes.

O objetivo não é criar um sistema visualmente diferente apenas para caracterizar um redesign.

O objetivo é criar uma versão **estruturalmente, visualmente e funcionalmente melhor**.

---

## 10. Uso destas referências em auditorias

Ao utilizar Impeccable ou outra ferramenta de auditoria:

1. compreender primeiro o produto e suas fontes canônicas;
2. analisar a implementação atual;
3. identificar seus pontos fortes e limitações;
4. somente então consultar estas referências;
5. extrair princípios relevantes;
6. comparar com as necessidades do GoDocs Docs;
7. propor melhorias adaptadas ao produto;
8. separar problemas objetivos de oportunidades e preferências estéticas.

O resultado esperado de uma auditoria não é:

> “O Mintlify faz desta forma, então o GoDocs Docs também deve fazer.”

O resultado esperado é:

> “Este princípio resolve determinado problema de documentação. Considerando a identidade, os usuários e a arquitetura do GoDocs Docs, esta seria uma forma adequada de aplicá-lo ou superá-lo.”

---

## 11. Resultado esperado

O GoDocs Docs deve evoluir para uma plataforma que combine:

```text
maturidade e escalabilidade enterprise
+
arquitetura documental moderna
+
excelente legibilidade e descoberta
+
identidade própria do GoDocs
+
experiência mais simples e focada
```

Confluence e Mintlify são referências importantes para essa evolução, mas não representam o destino final.

O objetivo é construir uma solução própria, coerente com o GoDocs e capaz de oferecer uma experiência de documentação tão madura quanto essas plataformas — e melhor onde o contexto do produto permitir.
