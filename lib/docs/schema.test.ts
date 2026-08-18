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
});
