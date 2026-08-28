# EDITOR-0005 — Owner, convite e autorização administrativa

- **Status:** Aceito no E0
- **Data:** 28/08/2026

## Contexto

O Editor exigirá leitura autenticada, autoria administrativa e recuperação segura da primeira capacidade administrativa. Ocultar controles não impede chamadas diretas à camada de mutação.

## Decisão

Os papéis são `user`, `docs_admin` e `owner`:

- `user` consulta a documentação autenticada;
- `docs_admin` cria, edita, reorganiza, envia para lixeira e publica conteúdo conforme os lotes autorizados;
- `owner` é o administrador inicial, responsável também por convite, papéis, status e recuperação administrativa.

O primeiro owner é criado por bootstrap server-side único durante a implantação, a partir de identidade aprovada em configuração privada. O procedimento deve ser idempotente, transacional, auditável e inacessível ao browser.

Não existe cadastro público. Convites e criação de usuários pertencem ao fluxo administrativo futuro. Toda mutação valida sessão, status e papel no servidor e nas políticas da camada de dados.

## Guardrails

- nenhum usuário escolhe ou altera seu próprio papel pelo client;
- conta convidada sem elevação nasce como `user`;
- a transação rejeita alterações que deixem zero owner ativo ou zero perfil com capacidade administrativa;
- owner não pode desativar ou rebaixar a si mesmo; transferência exige destinatário ativo e confirmação explícita;
- tentativas diretas sem capacidade recebem negação e são cobertas por testes negativos.
