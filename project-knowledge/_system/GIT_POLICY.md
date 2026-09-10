# Política Git do Vault

## Objetivo

Manter o conhecimento versionado e disponível nas máquinas de desenvolvimento sem gerar alterações irrelevantes causadas pela interface do Obsidian.

## Versionar

Versionar:

- notas Markdown;
- templates;
- anexos necessários;
- arquivos `_system/`;
- configurações compartilháveis que forem explicitamente aprovadas no futuro.

## Ignorar

Como regra inicial, ignorar estados locais de interface:

```gitignore
project-knowledge/.obsidian/workspace.json
project-knowledge/.obsidian/workspace-mobile.json
project-knowledge/.obsidian/cache/
project-knowledge/.trash/
```

Não ignorar toda a pasta `.obsidian/` automaticamente se decidirmos posteriormente compartilhar configurações essenciais entre máquinas.

## Commits

Mudanças de conhecimento podem acompanhar o commit que originou aquela decisão quando fizer sentido.

Exemplo:

```text
Refina comportamento da sidebar e registra decisão de navegação
```

Evitar commits contendo apenas ruído de workspace do Obsidian.
