import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  createSearchIndex,
  createSearchEntry,
  getUsefulSearchTerms,
  hasUsefulSearchQuery,
  normalizeSearchText,
  SEARCH_RESULTS_PER_DOCUMENT,
  searchDocuments,
  type SearchIndex,
} from "@/lib/docs/search";
import { loadPublishedDocumentsFromDirectory } from "@/lib/docs/source";

const contentDirectory = path.join(process.cwd(), "content", "docs");

const index: SearchIndex = {
  version: 2,
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
    createSearchEntry({
      title: "O que é o GoDocs?",
      description:
        "Conheça a plataforma e entenda como ela centraliza documentos.",
      href: "/docs/o-que-e-o-godocs",
      section: "Comece por aqui",
      keywords: ["GoDocs", "GED", "documentos"],
      content:
        "O GoDocs é uma plataforma de Gestão Eletrônica de Documentos e Processos.",
    }),
  ],
};

const largeIndex: SearchIndex = {
  version: 2,
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

  it("ignora conectivos e termos interrogativos em consultas naturais", () => {
    expect(getUsefulSearchTerms("Como criar um documento?")).toEqual([
      "criar",
      "documento",
    ]);
    expect(getUsefulSearchTerms("Quem pode acessar o workflow?")).toEqual([
      "acessar",
      "workflow",
    ]);
    expect(getUsefulSearchTerms("Enviar solicitação sem login")).toEqual([
      "enviar",
      "solicitacao",
      "sem",
      "login",
    ]);
    expect(getUsefulSearchTerms("com login")).toEqual(["login"]);
  });

  it.each(["como", "quem", "de", "para", "como que", "o que"])(
    "não retorna documentos para consulta formada somente por stopwords: %s",
    (query) => {
      expect(getUsefulSearchTerms(query)).toEqual([]);
      expect(hasUsefulSearchQuery(query)).toBe(false);
      expect(searchDocuments(index, query)).toEqual([]);
    },
  );

  it("preserva a intenção de busca sem login no conteúdo publicado", async () => {
    const documents = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const searchIndex = createSearchIndex(documents);

    for (const query of ["sem login", "enviar solicitação sem login"]) {
      expect(searchDocuments(searchIndex, query)[0]?.href).toMatch(
        /^\/docs\/funcionalidades\/workflows\/formulario-publico/,
      );
    }
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

  it("preenche o limite após aplicar a diversidade sobre o ranking completo", () => {
    const repeatedDocumentIndex: SearchIndex = {
      version: 2,
      entries: [
        ...Array.from({ length: SEARCH_RESULTS_PER_DOCUMENT + 5 }, (_, index) =>
          createSearchEntry({
            kind: "section",
            title: `Configuração prioritária ${index}`,
            description: "Ajustes disponíveis.",
            href: `/docs/configuracao#secao-${index}`,
            content: "Configuração.",
          }),
        ),
        ...["alternativa-a", "alternativa-b", "alternativa-c"].flatMap(
          (documentSlug) =>
            Array.from({ length: SEARCH_RESULTS_PER_DOCUMENT }, (_, index) =>
              createSearchEntry({
                kind: "section",
                title: `Alternativa ${documentSlug} ${index}`,
                description: "Ajustes disponíveis.",
                href: `/docs/${documentSlug}#secao-${index}`,
                content: "Configuração.",
              }),
            ),
        ),
      ],
    };

    const results = searchDocuments(repeatedDocumentIndex, "configuracao", 12);
    const resultCountsByDocument = results.reduce<Record<string, number>>(
      (counts, result) => {
        const documentHref = result.href.split("#", 1)[0] ?? result.href;
        counts[documentHref] = (counts[documentHref] ?? 0) + 1;
        return counts;
      },
      {},
    );

    expect(results).toHaveLength(12);
    expect(resultCountsByDocument).toEqual({
      "/docs/configuracao": SEARCH_RESULTS_PER_DOCUMENT,
      "/docs/alternativa-a": SEARCH_RESULTS_PER_DOCUMENT,
      "/docs/alternativa-b": SEARCH_RESULTS_PER_DOCUMENT,
      "/docs/alternativa-c": SEARCH_RESULTS_PER_DOCUMENT,
    });
    expect(
      results
        .slice(0, SEARCH_RESULTS_PER_DOCUMENT)
        .every((result) => result.href.startsWith("/docs/configuracao#")),
    ).toBe(true);
  });

});
