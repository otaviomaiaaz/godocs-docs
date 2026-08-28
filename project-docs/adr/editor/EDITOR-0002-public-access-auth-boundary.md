# EDITOR-0002 — Fronteira entre leitura e autenticação

- **Status:** Aceito no E0
- **Data:** 28/08/2026

## Contexto

O contrato anterior descrevia o GoDocs Docs como canal público. A decisão do E0 exige sessão para acessar documentação, busca e outras superfícies que revelem conteúdo. A mudança afeta posicionamento, usuários, SEO, sitemap, robots, cache, geração estática e URLs de entrada.

## Decisão

Adotar `DOCS_ACCESS_MODE=authenticated`. `/login` pode permanecer público, mas `/`, `/docs/**`, busca e superfícies derivadas de conteúdo exigirão sessão autenticada quando E1 for implementado.

Não haverá cadastro público irrestrito. O MVP adotará convite/criação de usuários no fluxo administrativo. Usuários sem capacidade administrativa podem somente ler; autorização editorial será reforçada no servidor e pela camada de dados.

## Consequências

E1 deve implementar guards, redirecionamento e revisão coordenada de sitemap, robots, metadata, cache e geração. E0 não altera o comportamento atual nem torna conteúdo privado antecipadamente.
