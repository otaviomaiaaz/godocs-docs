import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  createSearchBaseline,
  SEARCH_BENCHMARK_QUERIES,
} from "@/lib/docs/search-baseline";
import { loadPublishedDocumentsFromDirectory } from "@/lib/docs/source";

const contentDirectory = path.join(process.cwd(), "content", "docs");

describe("baseline determinístico da busca", () => {
  it("registra as métricas essenciais do conteúdo público após o Lote 2", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const baseline = createSearchBaseline(docs);

    expect(baseline).toMatchObject({
      documents: 14,
      entries: 141,
      pages: 14,
      sections: 127,
      rawBytes: 276_446,
      gzipBytes: 35_862,
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
    ["logs da pasta", "/docs/funcionalidades/documentos/logs-e-acoes"],
    ["metadados", "/docs/funcionalidades/documentos/filtros-e-metadados"],
    ["favoritos", "/docs/funcionalidades/favoritos"],
    ["primeiro acesso", "/docs/primeiro-acesso"],
  ])("preserva destinos úteis para %s", async (query, expectedPrefix) => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const baseline = createSearchBaseline(docs);
    const result = baseline.queries.find((entry) => entry.query === query);

    expect(result?.results[0]?.startsWith(expectedPrefix)).toBe(true);
  });
});
