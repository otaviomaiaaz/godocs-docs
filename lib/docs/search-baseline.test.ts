import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  createSearchBaseline,
  SEARCH_BENCHMARK_QUERIES,
} from "@/lib/docs/search-baseline";
import { loadPublishedDocumentsFromDirectory } from "@/lib/docs/source";

const contentDirectory = path.join(process.cwd(), "content", "docs");

describe("baseline determinístico da busca", () => {
  it("reproduz as métricas essenciais do conteúdo público do Lote 1", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const baseline = createSearchBaseline(docs);

    expect(baseline).toMatchObject({
      documents: 9,
      entries: 134,
      pages: 9,
      sections: 125,
      rawBytes: 271_847,
      gzipBytes: 36_557,
      resultLimit: 12,
      snippetCharacters: 220,
    });
    expect(baseline.queries.map(({ query }) => query)).toEqual(
      SEARCH_BENCHMARK_QUERIES,
    );
  });

  it.each([
    ["workflow", "/docs/funcionalidades/workflows"],
    ["criar workflow", "/docs/funcionalidades/workflows"],
    ["automação", "/docs/funcionalidades/workflows"],
    ["membros", "/docs/funcionalidades/workflows"],
    ["logs da pasta", "/docs/funcionalidades/documentos"],
    ["metadados", "/docs/funcionalidades/documentos"],
    ["favoritos", "/docs/funcionalidades/favoritos"],
    ["primeiro acesso", "/docs/primeiro-acesso"],
  ])("preserva destinos úteis para %s", async (query, expectedPrefix) => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const baseline = createSearchBaseline(docs);
    const result = baseline.queries.find((entry) => entry.query === query);

    expect(result?.results[0]?.startsWith(expectedPrefix)).toBe(true);
  });
});
