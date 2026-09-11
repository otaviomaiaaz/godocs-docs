# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.
Formato baseado em conventional commits; versionamento semântico (SemVer).

## [1.0.1] — 2026-09-11

### Correções

- Renew the session via /refresh before bouncing to login

### Tarefas

- Patch the critical next and high sharp/js-yaml advisories
- Regenerate next-env.d.ts for 16.3

## [1.0.0] — 2026-09-02

### Build

- Package the docs site as a standalone image

### CI

- Build, publish and release the docs image

### Correções

- Resolve article screenshots under the base path
- Keep the healthcheck green behind the session gate
- Let the image optimizer reach its own source files
- Install sharp for the runner platform
- Point the public metadata at the product domain
- Fall back when the site url arrives empty
- Evict the stale host-only cookie the gate keeps reading

### Documentação

- Declare when each article was last updated

### Funcionalidades

- Gate docs behind the shared session cookie
- Tell the login where the reader was headed
- Report every documentation open to signoz
- Stamp the article footer with version and last update
- Flag when the documented version is not the one running
- Report the version of all three services in the footer

### Refatorações

- Serve docs under the /docs base path
- Take the footer version from the running image tag


