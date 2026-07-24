import { describe, expect, it } from "vitest";

import {
  createSearchEntry,
  getUsefulSearchTerms,
  hasUsefulSearchQuery,
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
      headings: ["Preferências do ambiente"],
      keywords: ["preferências"],
      content: "Defina as opções necessárias.",
    }),
    createSearchEntry({
      title: "Pesquisa",
      description: "Localize informações.",
      href: "/docs/pesquisa",
      content: "Consulte os documentos publicados.",
    }),
    createSearchEntry({
      title: "O que é o GoDocs?",
      description:
        "Conheça a plataforma e entenda como ela centraliza documentos.",
      href: "/docs/o-que-e-o-godocs",
      section: "Comece por aqui",
      headings: ["Gestão eletrônica", "Principais recursos"],
      keywords: ["GoDocs", "GED", "documentos"],
      content:
        "O GoDocs é uma plataforma de Gestão Eletrônica de Documentos e Processos.",
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
    expect(normalizeSearchText("  Gestão eletrônica!  ")).toBe(
      "gestao eletronica",
    );
  });

  it("remove pontuação e exige ao menos um termo útil com dois caracteres", () => {
    expect(getUsefulSearchTerms(" L' ")).toEqual([]);
    expect(getUsefulSearchTerms("  gestão, eletrônica  ")).toEqual([
      "gestao",
      "eletronica",
    ]);
    expect(hasUsefulSearchQuery("'")).toBe(false);
    expect(hasUsefulSearchQuery("GoDocs")).toBe(true);
  });

  it("ignora consultas vazias, curtas ou formadas somente por pontuação", () => {
    for (const query of ["L", "'", "L'", "   "]) {
      expect(searchDocuments(index, query)).toEqual([]);
    }
  });

  it("retorna vazio para termo inexistente e não usa substring irrestrita", () => {
    expect(searchDocuments(index, "zzzz")).toEqual([]);
    expect(searchDocuments(index, "odos")).toEqual([]);
  });

  it("prioriza título sobre correspondência apenas no conteúdo", () => {
    const results = searchDocuments(index, "configuracao");
    expect(results[0]?.href).toBe("/docs/configuracao");
  });

  it.each([
    ["GoDocs"],
    ["documentos"],
    ["gestão eletrônica"],
    ["gestao eletronica"],
    ["plataforma documentos"],
  ])("encontra o artigo real com a consulta %s", (query) => {
    const results = searchDocuments(index, query);
    expect(results[0]?.href).toBe("/docs/o-que-e-o-godocs");
  });

  it("exige que consultas com mais de um termo atendam ao conjunto completo", () => {
    expect(searchDocuments(index, "gestão zzzz")).toEqual([]);
  });

  it("limita e ordena os resultados antes da renderização", () => {
    const results = searchDocuments(largeIndex, "configuracao", 7);
    expect(results).toHaveLength(7);
    expect(results.map((result) => result.score)).toEqual(
      [...results.map((result) => result.score)].sort((a, b) => b - a),
    );
  });

});
