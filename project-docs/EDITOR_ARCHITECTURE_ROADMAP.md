# GoDocs Docs — Arquitetura e Roadmap do Editor/Criador

> **Origem:** proposta recebida em 28/08/2026 e revisada no Lote E0 contra o repositório real.
> **Status:** E0 concluído documentalmente; implementação do Editor não iniciada.
> **Baseline técnico:** [`EDITOR_E0_BASELINE.md`](./EDITOR_E0_BASELINE.md).
> **Decisões:** [`adr/editor/`](./adr/editor/).
> **Próximo lote:** E1 está liberado pela análise E0.5: as vulnerabilidades transitivas de produção registradas no baseline foram corrigidas com overrides de patch validados.

## 1. Autoridade e escopo

Este documento é o contrato arquitetural revisado para a evolução do GoDocs Docs em uma plataforma com autoria integrada. Ele orienta os lotes E1–E13, mas não autoriza nenhum deles por si só.

O Lote E0 é exclusivamente documental. Ele não adiciona Supabase, autenticação, banco, Tiptap, rotas administrativas, botão `+ Criar`, gestão de usuários, publicação, variáveis de ambiente ou feature flags executáveis.

Continuam prevalecendo:

1. a solicitação específica do lote;
2. `AGENTS.md`;
3. `PRODUCT.md` e `DESIGN.md` em seus domínios;
4. `project-docs/SYSTEM_BLUEPRINT.md`;
5. `project-docs/REDESIGN_ARCHITECTURE.md`;
6. este roadmap para a arquitetura futura do Editor.

Quando houver conflito material entre essas fontes, o conflito deve ser resolvido explicitamente antes de implementar o comportamento afetado.

## 2. Objetivo do Editor

Adicionar ao produto atual uma camada segura de autoria, organização, rascunho e publicação, preservando a experiência de leitura e o pipeline publicado já consolidados.

O administrador deve trabalhar no contexto da documentação, sem criar um segundo produto editorial. Toda leitura exige sessão autenticada; o usuário sem capacidade administrativa recebe somente a experiência de consulta e não recebe controles, dados de rascunho ou bundle do editor.

Quatro garantias são permanentes:

1. a experiência de leitura permanece limpa;
2. autorização de mutações é verificada no servidor e no banco;
3. salvar rascunho nunca equivale a publicar;
4. nenhuma evolução pode perder ou sobrescrever silenciosamente conteúdo, metadados, URLs, anchors ou componentes existentes.

## 3. Arquitetura compatível aprovada no E0

```text
Leitura publicada
content/docs/**/*.mdx
        ↓
loader + schema + validação atuais
        ↓
coleção DocRecord publicada
        ├── rotas e metadata
        ├── home e cards
        ├── sidebar e drawer
        ├── breadcrumbs
        ├── TOC e anchors
        ├── paginação e Related
        ├── /search-index.json
        ├── sitemap/robots
        └── share images e build estático

Autoria futura
Supabase Auth + PostgreSQL + RLS
        ↓
estado administrativo + rascunhos versionados
        ↓ Publicar (server-only, lote próprio)
serializador determinístico
        ↓
um change set / um commit Git lógico
        ↓
content/docs/**/*.mdx
        ↓
pipeline publicado existente
```

Decisão: o banco poderá ser a fonte de verdade de autenticação, permissões e rascunhos; MDX no Git continuará sendo a fonte publicada no MVP. O runtime de leitura não deve passar a ler rascunhos diretamente do banco.

Essa direção é compatível com Next.js 16, React 19, TypeScript estrito, o loader local e a geração estática atuais, desde que o publicador preserve integralmente o contrato registrado no baseline.

## 4. Ajustes obrigatórios à proposta original

### 4.1 Acesso autenticado por convite

Decisão do E0: a documentação passará a exigir sessão autenticada. `/login` poderá ser público; `/`, `/docs/**`, busca, sitemap, metadata de artigos, share images e demais superfícies que revelam conteúdo deverão respeitar a fronteira autenticada no lote de implementação.

O MVP não terá cadastro público irrestrito. Contas serão convidadas/criadas no fluxo administrativo. Usuários autenticados comuns possuem somente leitura; capacidades editoriais exigem papel administrativo.

Essa decisão altera o contrato atualmente público e será refletida em `PRODUCT.md`. E1 deverá revisar middleware, redirecionamento, sitemap, robots, metadata, cache e geração estática; E0 não os altera.

Ver ADR `EDITOR-0002`.

### 4.2 Modelo editorial não pode ser plano

O modelo futuro deve representar:

- seção com destino explícito (`section.entrySlug` hoje);
- hub, tarefa e referência;
- até dois ancestrais, preservando a profundidade pública máxima atual;
- página-pai real para hubs e filhas;
- `order` por domínio/hierarquia, não apenas uma lista global;
- `navTitle`, `cardDescription`, `availability`, `keywords`, `updatedAt`, `version`, `permission` e `related`;
- estado editorial de rascunho separado do estado de lixeira;
- aliases de anchors e hashes históricos;
- versionamento otimista e hashes de sincronização com Git.

### 4.3 Componentes e imagens existentes

O MVP textual não precisa oferecer criação de imagens, mas já existem três `Figure` publicados e componentes MDX estruturais. Eles precisam ser preservados no importador, preview e serializador.

Componentes não suportados como nós editáveis devem entrar como `legacyMdxBlock` somente leitura. Um artigo sem round-trip seguro não pode ser convertido para edição plena.

### 4.4 Compatibilidade permanece um contrato separado

Os 79 aliases atuais vivem em `lib/docs/compatibility.ts` e possuem resolução client-side e validação própria. Eles não são frontmatter de página e não podem ser descartados por um importador que leia somente `content/docs/`.

No primeiro ciclo, o manifesto permanece versionado no Git e somente leitura para o Editor. Uma futura edição de slugs/anchors exige um artefato gerado equivalente e testes antes de ser liberada.

### 4.5 Publicação não é apenas serialização

Uma publicação futura deve, no mínimo:

1. validar sessão e capacidade no servidor;
2. bloquear um change set lógico;
3. recalcular o diff contra o snapshot publicado;
4. verificar versões otimistas e o SHA/hash-base do Git;
5. gerar todos os arquivos afetados;
6. executar validação de conteúdo e regressões aplicáveis;
7. criar uma árvore e um commit lógico;
8. atualizar a referência somente se o HEAD esperado continuar válido;
9. registrar SHA e auditoria;
10. acompanhar deployment separadamente do commit.

Nada disso pertence aos lotes E0 ou E1.

## 5. Feature flags conceituais

As flags abaixo são contratos para implementação posterior. Nenhuma variável foi criada neste lote.

| Flag | Default seguro | Responsabilidade |
|---|---|---|
| `DOCS_EDITOR_ENABLED` | `false` | Habilita a camada de autoria para contas autorizadas. |
| `DOCS_DRAFT_PREVIEW_ENABLED` | `false` | Habilita preview protegido de rascunhos. |
| `DOCS_USER_ADMIN_ENABLED` | `false` | Habilita a área de gestão de usuários. |
| `DOCS_PUBLISH_MODE` | `disabled` | Enum `disabled`, `test-branch` ou `main`; impede publicação antes do lote próprio. |
| `DOCS_ACCESS_MODE` | `authenticated` | Enum `public` ou `authenticated`; o E0 aprovou `authenticated`. |
| `DOCS_INVITATIONS_ENABLED` | `false` | Habilita somente o fluxo administrativo de convite; não cria cadastro aberto. |

Regras:

- avaliação de capacidade ocorre no servidor; flag não substitui role/RLS;
- o cliente recebe somente capacidades já autorizadas;
- ausência ou valor inválido deve cair no default seguro;
- `main` nunca deve ser default;
- flags devem ser validadas de forma tipada quando forem implementadas;
- o bundle Tiptap não deve ser carregado para leitores sem capacidade editorial.

## 6. Schemas conceituais

Os schemas abaixo registram semântica. Não são migrations nem código executável.

### 6.1 Identidade e capacidade

```ts
type DocsRole = "user" | "docs_admin" | "owner";
type ProfileStatus = "active" | "disabled";

type Profile = {
  id: UUID;                 // mesmo id de auth.users
  name: string;
  email: string;            // referência; Auth mantém identidade canônica
  role: DocsRole;
  status: ProfileStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastSeenAt?: Timestamp;
};
```

Papéis iniciais:

- `user`: leitura autenticada da documentação;
- `docs_admin`: leitura e mutações editoriais autorizadas;
- `owner`: administrador inicial e responsável por convite, gestão de papéis/status e recuperação administrativa.

Não existe cadastro público. O bootstrap do primeiro `owner` ocorre uma única vez por procedimento server-side de implantação: recebe a identidade previamente aprovada em configuração privada, confirma o usuário correspondente no Auth, verifica transacionalmente que não há owner ativo e cria o profile/audit log. Ele não é exposto como endpoint nem usa dados do browser.

Role, status e owner nunca são confiados ao estado client-side. A mesma transação deve rejeitar qualquer ação que deixe zero `owner` ativo ou zero perfil com capacidade administrativa (`owner` ou `docs_admin`). Um owner não pode desativar ou rebaixar a si próprio; transferência de ownership exige destinatário ativo e confirmação explícita antes da alteração atômica.

### 6.2 Seções

```ts
type EditorSection = {
  id: UUID;
  key: SlugSegment;         // equivalente conceitual ao section.id atual
  label: string;
  description: string;
  entryPageId: UUID;
  position: number;
  lifecycle: "active" | "trashed";
  editVersion: number;
  publishedSnapshot?: Json;
  publishedHash?: string;
  createdBy: UUID;
  updatedBy: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  trashedAt?: Timestamp;
};
```

### 6.3 Páginas/cards

```ts
type EditorPage = {
  id: UUID;
  sectionId: UUID;
  parentPageId?: UUID;
  title: string;
  navTitle?: string;
  description: string;
  cardDescription?: string;
  slug: DocSlug;
  pageType: "hub" | "task" | "reference";
  position: number;
  lifecycle: "active" | "trashed";
  availability: "available" | "coming-soon";
  keywords: string[];
  editorialUpdatedAt?: DateOnly;
  versionLabel?: string;
  permission?: string;
  editorSchemaVersion: number;
  editorDocument: Json;
  rawMdxFallback?: string;
  editVersion: number;
  sourceBaseSha?: string;
  sourceMdxHash?: string;
  publishedSnapshot?: Json;
  publishedHash?: string;
  createdBy: UUID;
  updatedBy: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  trashedAt?: Timestamp;
};
```

`frontmatter.status` e `lifecycle` não são o mesmo conceito. Rascunhos administrativos permanecem no banco; arquivos materializados para páginas publicadas usam o contrato publicado vigente. Uma página nova ainda não publicada não ganha MDX publicado.

`ancestors` deve ser derivado e validado a partir de `parentPageId`, preservando labels, posições e o limite estrutural. O serializador deve produzir o frontmatter atual exatamente no formato aceito pelo schema.

### 6.4 Relações, aliases, publicação e auditoria

```ts
type PageRelated = {
  sourcePageId: UUID;
  targetPageId: UUID;
  position: number;
};

type CompatibilityAlias = {
  fromSlug: DocSlug;
  fromFragment: string;
  toSlug: DocSlug;
  toFragment: string;
  ownership: "git_manifest" | "editor_generated";
  editable: boolean;
};

type PublicationStatus =
  | "publishing"
  | "committed"
  | "deploying"
  | "published"
  | "publish_failed"
  | "deploy_failed";

type Publication = {
  id: UUID;
  status: PublicationStatus;
  expectedHeadSha: string;
  githubCommitSha?: string;
  deploymentId?: string;
  changeSummary: Json;
  createdBy: UUID;
  createdAt: Timestamp;
  committedAt?: Timestamp;
  publishedAt?: Timestamp;
  errorCode?: string;
  errorMessage?: string;
};

type AuditLog = {
  id: UUID;
  actorId: UUID;
  action: string;
  entityType: string;
  entityId?: UUID;
  publicationId?: UUID;
  metadata: Json;
  createdAt: Timestamp;
};
```

`related` mantém ordem declarada, 1–4 itens quando presente, e as proibições atuais de autorreferência, duplicata, draft e previous/next.

## 7. Estratégia conceitual de migrations

Nenhum SQL é criado no E0. A implementação futura deve usar migrations pequenas, ordenadas, revisáveis e aplicadas separadamente por ambiente.

Sequência proposta:

1. extensões/tipos e função de timestamp estritamente necessários;
2. `profiles`, enum/constraints de role e status e bootstrap controlado de owner;
3. `sections` e `pages`, FKs, profundidade e versionamento otimista;
4. relações ordenadas, snapshots e hashes;
5. `publications` e lock de publicação;
6. `audit_logs` append-only;
7. RLS e grants no mesmo lote das tabelas que protegem;
8. índices depois de confirmar consultas reais;
9. importação em dry-run, sem alterar MDX ou `main`;
10. validação de idempotência, rollback operacional e seed de teste.

Guardrails:

- ambientes local/preview/produção separados;
- service role somente server-side e nunca `NEXT_PUBLIC_*`;
- migrations não fazem publicação Git;
- importação é repetível ou falha antes de mutar;
- nenhuma migration promove usuário comum automaticamente;
- RLS é coberta por testes negativos via chamadas diretas, não somente pela UI.

## 8. Compatibilidade com o conteúdo atual

O importador e o serializador futuros devem preservar:

- todos os campos do `docFrontmatterSchema`;
- os 21 slugs atuais e suas URLs canônicas;
- `pageType`, seção, entry slug, ancestors e ordens;
- H2/H3/H4 e IDs explícitos de `Step`;
- texto, links, listas, inline code e strong;
- componentes MDX e seus atributos/children;
- três `Figure` e respectivos assets locais;
- Related e sua ordem;
- manifesto de 79 aliases;
- busca publicada, TOC, breadcrumbs, paginação, sitemap, metadata e share images.

Round-trip deve ser comparado semanticamente e por invariantes públicas. Diferença byte a byte pode ser tolerada somente quando não altera significado, IDs, componentes, atributos, whitespace significativo, frontmatter ou resultado renderizado.

## 9. Segurança e concorrência

- mutações exigem sessão ativa, role/capability atual e validação server-side;
- RLS permanece defesa obrigatória no banco;
- cada save envia `expectedVersion`; divergência gera conflito, nunca overwrite;
- mudança manual em MDX divergente do hash conhecido bloqueia publicação;
- somente uma publicação lógica pode avançar por vez;
- commit bem-sucedido e deployment bem-sucedido são estados distintos;
- logs não contêm secrets, tokens, senhas ou conteúdo desnecessário;
- drag-and-drop exige alternativa equivalente por teclado/menu.

## 10. Roadmap autorizado somente por tarefas futuras

| Lote | Resultado esperado |
|---|---|
| E0 | Contrato, inventário, baseline, flags conceituais, schemas, migrations e ADRs. |
| E1 | Fundação de Auth/Supabase, bootstrap seguro de Owner, convite e proteção da documentação autenticada. |
| E2 | Autorização, RLS final do escopo e gestão de usuários. |
| E3 | Modelo editorial e importação estrutural em dry-run. |
| E4 | Capacidades administrativas integradas e `+ Criar`. |
| E5 | Ordenação acessível de seções e páginas. |
| E6 | Editor Document v1, parser/serializer e round-trip protegido. |
| E7 | Tiptap inline, undo/redo, autosave e concorrência otimista. |
| E8 | Change set, snapshots e estado de Publicar. |
| E9 | Publicador MDX e commit Git lógico. |
| E10 | Preview real e status de deployment. |
| E11 | Lixeira, sincronização e recuperação de conflitos. |
| E12 | Segurança, acessibilidade, performance e regressão final. |
| E13 | Rollout progressivo por flag e branch de teste. |

Não antecipar UI, banco ou integrações de um lote posterior para facilitar um lote anterior.

## 11. Pré-condição restante e decisões posteriores

### Pré-condição antes de ampliar o Editor

O baseline do E0 registrou duas vulnerabilidades high e uma moderate transitivas em `js-yaml`, `nanoid` e `postcss`. O E0.5 aplicou overrides de patch para `gray-matter>js-yaml@3.15.1`, `next>postcss@8.5.23` e `postcss>nanoid@3.3.18`; `pnpm audit:prod` passou sem vulnerabilidades conhecidas. E0 não alterou dependências; a correção ocorreu exclusivamente no E0.5 e foi validada integralmente.

### Decisões que podem permanecer para lotes próprios

- biblioteca de drag-and-drop: E5;
- conjunto de nós editáveis e legacy blocks: E6;
- GitHub App e branch de publicação: E9;
- mecanismo de acompanhamento Vercel: E10;
- exclusão definitiva: E11 ou pós-MVP.

## 12. Baseline consolidado do E0

```text
21 documentos MDX válidos
146 entradas de busca
125 seções de busca
248918 rawBytes
29229 gzipBytes
79 aliases históricos
21 arquivos de teste
268/268 testes aprovados
lint aprovado
typecheck aprovado
build aprovado
50 páginas estáticas
```

`pnpm audit:prod` falhou por 3 vulnerabilidades transitivas preexistentes: 2 high e 1 moderate, relacionadas a `js-yaml`, `nanoid` e `postcss`. O detalhe e a pré-condição estão no baseline.

## 13. Critério de aceite do E0

O E0 está concluído quando:

- este contrato e o baseline existem no repositório;
- consumidores de `content/docs/`, frontmatter, hierarquia e componentes estão inventariados;
- incompatibilidades estão registradas sem alterar comportamento;
- flags, schemas e migrations existem apenas como contratos conceituais;
- ADRs registram as decisões críticas;
- validações atuais passam ou possuem falha explicada;
- o diff contém somente documentação do E0.
