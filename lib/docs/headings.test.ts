import { describe, expect, it } from "vitest";

import { parseDocumentText } from "@/lib/docs/headings";

describe("parseDocumentText", () => {
  it("extrai títulos navegáveis e texto pesquisável de MDX", () => {
    const parsed = parseDocumentText(`
## Configuração inicial

Texto com **ênfase**.

### Opções avançadas

<Callout variant="info">Conteúdo adicional.</Callout>
`);

    expect(parsed.headings).toEqual([
      { depth: 2, id: "configuração-inicial", title: "Configuração inicial" },
      { depth: 3, id: "opções-avançadas", title: "Opções avançadas" },
    ]);
    expect(parsed.searchableText).toContain("Texto com ênfase");
  });

  it("cria trechos de seção legíveis sem duplicar a pontuação de listas", () => {
    const parsed = parseDocumentText(`
## Criar uma pasta

Siga estas etapas:

- Clique em Adicionar.
- Selecione Nova Pasta.
`);

    expect(parsed.sections).toEqual([
      {
        depth: 2,
        id: "criar-uma-pasta",
        title: "Criar uma pasta",
        text: "Siga estas etapas: Clique em Adicionar. Selecione Nova Pasta.",
      },
    ]);
    expect(parsed.sections[0]?.text).not.toContain("..");
  });

  it("impede um segundo H1 no corpo do artigo", () => {
    expect(() => parseDocumentText("# Título duplicado")).toThrow(
      "não deve conter H1",
    );
  });
});
