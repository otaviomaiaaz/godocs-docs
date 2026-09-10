# Contrato de Conhecimento — GoDocs Docs

**Versão:** 0.1
**Status:** fundação inicial

## 1. Objetivo

O Obsidian + Zettelkasten será utilizado como **cérebro de conhecimento do desenvolvimento do GoDocs Docs**.

Sua função é tornar conhecimento importante:

- persistente;
- pesquisável;
- conectado;
- reutilizável;
- compreensível fora do contexto de um chat específico;
- útil para pessoas e agentes como o Codex.

## 2. O que pertence ao Obsidian

Registrar no Vault quando o conteúdo representar conhecimento que possa ser reutilizado ou conectado, como:

- decisões e seus motivos;
- aprendizados;
- princípios de arquitetura;
- padrões de UX/UI;
- descobertas técnicas;
- problemas recorrentes;
- trade-offs;
- hipóteses;
- riscos;
- pesquisas;
- referências;
- ideias de produto;
- padrões editoriais;
- relações entre diferentes partes do projeto.

## 3. O que não deve ser duplicado

O Vault não deve manter uma segunda versão concorrente de informações que já possuem uma fonte canônica.

Exemplos:

| Informação | Fonte oficial |
|---|---|
| Regras de agentes/Codex | `AGENTS.md` |
| Produto e princípios editoriais | `PRODUCT.md` |
| Design System | `DESIGN.md` |
| Conteúdo publicado | `content/docs/` |
| Arquitetura formal do redesign | documento canônico correspondente em `project-docs/` |
| Estado operacional atual | `project-docs/daily_stats.md` |
| Contexto consolidado de transferência | `project-docs/Memória.md` |
| Estado real da implementação | código + Git |

Uma nota do Obsidian pode explicar, relacionar ou contextualizar uma regra canônica, mas não substituí-la.

## 4. Regra de promoção

Conhecimento nasce no fluxo:

```text
captura
→ análise
→ Zettel / Project Note
→ conexão
→ validação
→ promoção para fonte canônica, quando necessário
```

Uma informação deve ser promovida quando deixa de ser apenas conhecimento de apoio e passa a governar o projeto.

Exemplos:

```text
aprendizado de UX
→ Zettel

decisão aprovada de Design System
→ Zettel + atualização de DESIGN.md

nova regra permanente para Codex
→ Zettel + atualização de AGENTS.md

fato funcional validado do GoDocs
→ documentação correspondente em content/docs/

estado operacional do projeto
→ daily_stats.md
```

## 5. Regra de autoridade

Em caso de conflito:

1. solicitação/decisão explícita atual;
2. estado real do repositório e do sistema;
3. fonte canônica especializada;
4. conhecimento do Obsidian;
5. chats, rascunhos e referências históricas.

O Obsidian ajuda a interpretar o projeto. Ele não deve contradizer silenciosamente sua realidade.

## 6. Atomicidade

Cada Zettel deve responder principalmente a **uma ideia**.

Evitar:

```text
Sidebar.md
```

com dezenas de decisões misturadas.

Preferir:

```text
Estado ativo e estado expandido da sidebar são independentes
```

e conectá-la a outras notas.

## 7. Conexões

Uma nota permanente deve procurar responder:

- Com o que esta ideia se relaciona?
- O que ela explica?
- O que ela contradiz ou limita?
- Onde ela é aplicada?
- Qual decisão depende dela?

Links devem possuir significado, e não existir apenas para aumentar o grafo.

## 8. Governança do Codex

Quando uma tarefa exigir contexto histórico, arquitetural ou decisões relacionadas, o Codex poderá consultar `project-knowledge/`.

Porém:

- fontes canônicas continuam tendo precedência;
- o Codex não deve transformar uma hipótese do Vault em regra oficial;
- notas `draft` ou `inbox` não são decisões aprovadas;
- referências externas não são fatos do produto;
- conhecimento relevante descoberto durante implementação deve ser registrado quando possuir valor duradouro.

## 9. Git

O Vault faz parte do repositório para permitir continuidade entre máquinas e histórico de alterações.

Estados pessoais de interface do Obsidian não devem gerar ruído no Git.

A política detalhada está em `_system/GIT_POLICY.md`.

## 10. Critério de qualidade

Uma nota permanente deve ser:

- compreensível isoladamente;
- específica;
- curta o suficiente para representar uma ideia;
- completa o suficiente para ser útil;
- escrita com palavras próprias;
- conectada quando houver relação real;
- identificada por tipo e status;
- livre de informação inventada.
