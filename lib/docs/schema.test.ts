import { describe, expect, it } from "vitest";

import { parseDocFrontmatter } from "@/lib/docs/schema";

function frontmatter(pageType: unknown) {
  return {
    title: "Página",
    description: "Descrição válida.",
    slug: "pagina",
    pageType,
    order: 1,
  };
}

describe("schema documental", () => {
  it.each(["hub", "task", "reference"] as const)(
    "aceita pageType %s e propaga o valor tipado",
    (pageType) => {
      expect(parseDocFrontmatter(frontmatter(pageType), "pagina.mdx").pageType).toBe(
        pageType,
      );
    },
  );

  it("rejeita pageType fora do enum fechado", () => {
    expect(() =>
      parseDocFrontmatter(frontmatter("landing"), "pagina.mdx"),
    ).toThrow("pageType");
  });

  it("aceita related ausente ou vazio", () => {
    expect(parseDocFrontmatter(frontmatter("reference"), "pagina.mdx").related).toEqual(
      [],
    );
    expect(
      parseDocFrontmatter(
        { ...frontmatter("reference"), related: [] },
        "pagina.mdx",
      ).related,
    ).toEqual([]);
  });

  it("aceita um ou quatro destinos related distintos", () => {
    expect(
      parseDocFrontmatter(
        { ...frontmatter("reference"), related: ["pagina-a"] },
        "pagina.mdx",
      ).related,
    ).toEqual(["pagina-a"]);
    expect(
      parseDocFrontmatter(
        {
          ...frontmatter("reference"),
          related: ["pagina-a", "pagina-b", "pagina-c", "pagina-d"],
        },
        "pagina.mdx",
      ).related,
    ).toEqual(["pagina-a", "pagina-b", "pagina-c", "pagina-d"]);
  });

  it("rejeita mais de quatro destinos related", () => {
    expect(() =>
      parseDocFrontmatter(
        {
          ...frontmatter("reference"),
          related: ["um", "dois", "tres", "quatro", "cinco"],
        },
        "pagina.mdx",
      ),
    ).toThrow("related");
  });

  it("rejeita destinos related duplicados ou autorreferentes", () => {
    expect(() =>
      parseDocFrontmatter(
        { ...frontmatter("reference"), related: ["destino", "destino"] },
        "pagina.mdx",
      ),
    ).toThrow("related");
    expect(() =>
      parseDocFrontmatter(
        { ...frontmatter("reference"), related: ["pagina"] },
        "pagina.mdx",
      ),
    ).toThrow("related");
  });
});
