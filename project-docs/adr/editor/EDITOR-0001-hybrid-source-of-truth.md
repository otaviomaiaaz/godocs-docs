# EDITOR-0001 — Fonte híbrida de autoria e publicação

- **Status:** Aceito no E0
- **Data:** 28/08/2026

## Contexto

O runtime atual deriva todas as superfícies de leitura publicadas da coleção MDX do Git. O Editor precisa persistir identidades, permissões, rascunhos, concorrência e publicações sem expor drafts nem reescrever de imediato a arquitetura de leitura.

## Decisão

No MVP, Supabase será a fonte de verdade futura para autenticação, capacidades, estado administrativo e rascunhos. MDX versionado no Git continuará sendo a fonte publicada consumida pelo runtime.

Publicar será uma fronteira explícita: um change set validado produz arquivos MDX e um commit lógico. Salvar/autosave nunca altera a coleção pública.

## Consequências

- leitura autenticada continua compatível com o pipeline publicado atual;
- é necessário manter snapshot/hash publicado no banco;
- mudanças manuais no Git exigem detecção e reimportação antes de nova publicação;
- haverá consistência eventual entre commit e deployment, com estados separados;
- leitura direta de conteúdo publicado do banco fica fora do MVP.
