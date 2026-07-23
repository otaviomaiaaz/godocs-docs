import { describe, expect, it } from "vitest";

import {
  createSearchEntry,
  normalizeSearchText,
  searchDocuments,
  type SearchIndex,
} from "@/lib/docs/search";

const index: SearchIndex = {
  version: 1,
  entries: [
    createSearchEntry({
      title: "Configuração",
      description: "Ajustes disponíveis.",
      href: "/docs/configuracao",
      section: "Fundamentos",
      keywords: ["preferências"],
      content: "Defina as opções necessárias.",
    }),
    createSearchEntry({
      title: "Pesquisa",
      description: "Localize informações.",
      href: "/docs/pesquisa",
      content: "Consulte os documentos publicados.",
    }),
  ],
};

const largeIndex: SearchIndex = {
  version: 1,
  entries: Array.from({ length: 20 }, (_, position) =>
    createSearchEntry({
      title: `Configuração ${position}`,
      description: "Ajustes disponíveis.",
      href: `/docs/configuracao-${position}`,
      content: "Configuração.",
    }),
  ),
};

describe("busca local", () => {
  it("normaliza caixa e acentos", () => {
    expect(normalizeSearchText("  CONFIGURAÇÃO  ")).toBe("configuracao");
  });

  it("prioriza correspondências no título", () => {
    const results = searchDocuments(index, "configuracao");
    expect(results[0]?.href).toBe("/docs/configuracao");
  });

  it("limita e ordena os resultados antes da renderização", () => {
    const results = searchDocuments(largeIndex, "configuracao", 7);
    expect(results).toHaveLength(7);
    expect(results.map((result) => result.score)).toEqual(
      [...results.map((result) => result.score)].sort((a, b) => b - a),
    );
  });

  it("retorna vazio sem termo", () => {
    expect(searchDocuments(index, "   ")).toEqual([]);
  });
});
