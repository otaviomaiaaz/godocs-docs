import { describe, expect, it } from "vitest";

import {
  normalizeSearchText,
  searchDocuments,
  type SearchDocument,
} from "@/lib/docs/search";

const index: SearchDocument[] = [
  {
    title: "Configuração",
    description: "Ajustes disponíveis.",
    href: "/docs/configuracao",
    section: "fundamentos",
    keywords: ["preferências"],
    content: "Defina as opções necessárias.",
  },
  {
    title: "Pesquisa",
    description: "Localize informações.",
    href: "/docs/pesquisa",
    keywords: [],
    content: "Consulte os documentos publicados.",
  },
];

describe("busca local", () => {
  it("normaliza caixa e acentos", () => {
    expect(normalizeSearchText("  CONFIGURAÇÃO  ")).toBe("configuracao");
  });

  it("prioriza correspondências no título", () => {
    const results = searchDocuments(index, "configuracao");
    expect(results[0]?.href).toBe("/docs/configuracao");
  });

  it("retorna vazio sem termo", () => {
    expect(searchDocuments(index, "   ")).toEqual([]);
  });
});
