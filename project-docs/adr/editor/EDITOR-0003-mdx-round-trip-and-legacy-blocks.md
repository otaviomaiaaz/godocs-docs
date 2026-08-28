# EDITOR-0003 — Round-trip MDX e blocos protegidos

- **Status:** Aceito no E0
- **Data:** 28/08/2026

## Contexto

A coleção contém componentes MDX, `Step` com IDs estruturais e `Figure` com assets. A busca, TOC, aliases e links dependem do AST e dos IDs resultantes. Um editor rich text inicial não representa todos esses contratos.

## Decisão

Adotar um `Editor Document` versionado. Nós suportados podem ser editados; qualquer região sem round-trip comprovadamente seguro entra como `legacyMdxBlock` somente leitura, preservando source e atributos originais.

Um documento que não passe importação, serialização e comparação semântica permanece protegido e não recebe edição plena.

## Consequências

- E3 importa estrutura sem alterar MDX;
- E6 é o gate de parser/serializer antes de Tiptap;
- componentes permitidos mas hoje não usados também precisam de política explícita;
- `Figure` pode permanecer protegida mesmo com upload fora do MVP;
- criação arbitrária de JSX/React pelo navegador permanece proibida.
