# Regras do Zettelkasten — GoDocs Docs

## Fluxo

```text
00-inbox
   ↓
processar
   ↓
10-zettels / 30-project-notes / 40-sources
   ↓
criar conexões
   ↓
20-mocs
   ↓
aplicar ao projeto
   ↓
promover para fonte canônica quando necessário
```

## Tipos de nota

### Inbox

Captura rápida e temporária.

Use para:

- ideia ainda não processada;
- observação rápida;
- dúvida;
- possível problema;
- lembrete de investigação.

Inbox não é memória permanente.

### Zettel

Conhecimento permanente e atômico.

Um Zettel deve expressar uma ideia reutilizável que continue fazendo sentido fora da tarefa onde nasceu.

### MOC

Map of Content.

Organiza links para um domínio do conhecimento, sem duplicar o conteúdo das notas.

### Project Note

Material ligado a uma execução ou iniciativa específica.

Exemplos:

- planejamento de lote;
- auditoria;
- experimento;
- checklist;
- investigação;
- protótipo.

### Source

Registro de uma fonte consultada.

Serve para separar:

```text
o que a fonte diz
```

de:

```text
o que concluímos a partir dela
```

## Convenção de IDs

Zettels permanentes usam:

```text
YYYYMMDDHHmm
```

Exemplo:

```text
202609101044
```

O ID é estável. O título pode evoluir.

## Títulos

Prefira títulos que expressem uma ideia.

Bom:

```text
Estado ativo e estado expandido da sidebar são independentes
```

Ruim:

```text
Sidebar
Notas sidebar
UX
Ideias
```

## Status

Valores iniciais:

```text
draft
active
superseded
archived
```

### draft

Ainda está sendo formulada ou validada.

### active

Conhecimento atual e utilizável.

### superseded

Foi substituída por entendimento mais recente.

Não apagar silenciosamente quando o histórico ainda for útil.

### archived

Não participa mais do trabalho ativo.

## Links

Não há obrigação de quantidade.

Uma conexão deve existir quando ajuda a explicar significado.

Exemplo:

```markdown
## Conexões

- [[Navegação deve preservar contexto sem retirar controle do usuário]]
- [[Sidebar retrátil reduz densidade durante leitura]]
```

## Tags

Tags classificam propriedades amplas.

Links representam relações conceituais.

Evite transformar tags em uma segunda árvore de pastas.

Use poucas tags e mantenha vocabulário consistente.

## Regra de processamento da Inbox

Para cada item:

1. ainda é relevante?
2. é apenas uma tarefa?
3. é uma fonte?
4. contém conhecimento reutilizável?
5. precisa virar Zettel?
6. precisa ser conectado a um MOC?
7. precisa atualizar uma fonte canônica?

O objetivo é manter `00-inbox/` pequeno.
