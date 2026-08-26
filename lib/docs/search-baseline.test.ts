import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  createSearchBaseline,
  SEARCH_BENCHMARK_QUERIES,
} from "@/lib/docs/search-baseline";
import { createSearchIndex, searchDocuments } from "@/lib/docs/search";
import { loadPublishedDocumentsFromDirectory } from "@/lib/docs/source";

const contentDirectory = path.join(process.cwd(), "content", "docs");

describe("baseline determinístico da busca", () => {
  it("registra as métricas essenciais do conteúdo público após o Bloco D", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const baseline = createSearchBaseline(docs);

    expect(baseline).toMatchObject({
      documents: 21,
      entries: 146,
      pages: 21,
      sections: 125,
      rawBytes: 248_918,
      gzipBytes: 29_229,
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
    ["kanban", "/docs/funcionalidades/workflows/cards-kanban-e-lista"],
    ["lista", "/docs/funcionalidades/workflows/cards-kanban-e-lista"],
    ["novo card", "/docs/funcionalidades/workflows/cards-kanban-e-lista"],
    ["enviar e-mail", "/docs/funcionalidades/workflows/automacoes"],
    ["arquivar workflow", "/docs/funcionalidades/workflows/criar-e-configurar"],
    ["fase", "/docs/funcionalidades/workflows/fases-e-transicoes"],
    ["transição", "/docs/funcionalidades/workflows/fases-e-transicoes"],
    ["formulário", "/docs/funcionalidades/workflows/formularios-e-campos"],
    ["campo obrigatório", "/docs/funcionalidades/workflows/formularios-e-campos"],
    ["membro restrito", "/docs/funcionalidades/workflows/membros-e-papeis"],
    ["formulário público", "/docs/funcionalidades/workflows/formulario-publico"],
    ["protocolo", "/docs/funcionalidades/workflows/formulario-publico"],
    ["link de acompanhamento", "/docs/funcionalidades/workflows/formulario-publico"],
    ["logs da pasta", "/docs/funcionalidades/documentos/logs-e-acoes"],
    ["metadados", "/docs/funcionalidades/documentos/filtros-e-metadados"],
    ["favoritos", "/docs/funcionalidades/favoritos"],
    ["primeiro acesso", "/docs/primeiro-acesso"],
  ])("preserva destinos úteis para %s", async (query, expectedPrefix) => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const result = searchDocuments(createSearchIndex(docs), query);

    expect(result[0]?.href.startsWith(expectedPrefix)).toBe(true);
  });
});
