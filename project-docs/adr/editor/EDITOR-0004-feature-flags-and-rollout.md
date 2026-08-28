# EDITOR-0004 — Feature flags e rollout seguro

- **Status:** Aceito conceitualmente no E0
- **Data:** 28/08/2026

## Contexto

Auth, administração, preview, editor e publicação possuem riscos e maturidades diferentes. Um único booleano não expressa a fronteira de acesso nem impede publicação prematura na `main`.

## Decisão

Separar capacidades conceituais:

- `DOCS_EDITOR_ENABLED=false`;
- `DOCS_DRAFT_PREVIEW_ENABLED=false`;
- `DOCS_USER_ADMIN_ENABLED=false`;
- `DOCS_PUBLISH_MODE=disabled|test-branch|main`, default `disabled`;
- `DOCS_ACCESS_MODE=public|authenticated`, default `authenticated`, decisão aceita no E0;
- `DOCS_INVITATIONS_ENABLED=false`, liberado somente com o fluxo administrativo de convites aprovado.

Flags são avaliadas no servidor e combinadas com sessão, status e role. Elas não substituem autorização nem RLS.

## Consequências

- cada frente pode ser ativada e revertida separadamente;
- publicação para `main` exige configuração explícita posterior;
- leitores sem capacidade não carregam bundle de edição;
- valores ausentes/inválidos adotam o default seguro;
- nenhuma flag executável é criada no E0.
