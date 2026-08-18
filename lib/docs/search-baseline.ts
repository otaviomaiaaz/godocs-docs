import { gzipSync } from "node:zlib";

import {
  createSearchIndex,
  searchDocuments,
  SEARCH_RESULT_LIMIT,
  SEARCH_SNIPPET_LENGTH,
} from "@/lib/docs/search";
import type { DocRecord } from "@/lib/docs/schema";

export const SEARCH_BENCHMARK_QUERIES = [
  "workflow",
  "criar workflow",
  "automação",
  "membros",
  "logs da pasta",
  "metadados",
  "favoritos",
  "primeiro acesso",
] as const;

export function createSearchBaseline(docs: DocRecord[]) {
  const index = createSearchIndex(docs);
  const serialized = JSON.stringify(index);

  return {
    documents: docs.length,
    entries: index.entries.length,
    pages: index.entries.filter((entry) => entry.kind === "page").length,
    sections: index.entries.filter((entry) => entry.kind === "section").length,
    rawBytes: Buffer.byteLength(serialized),
    gzipBytes: gzipSync(serialized).byteLength,
    resultLimit: SEARCH_RESULT_LIMIT,
    snippetCharacters: SEARCH_SNIPPET_LENGTH,
    queries: SEARCH_BENCHMARK_QUERIES.map((query) => ({
      query,
      results: searchDocuments(index, query, SEARCH_RESULT_LIMIT).map(
        (result) => result.href,
      ),
    })),
  };
}
