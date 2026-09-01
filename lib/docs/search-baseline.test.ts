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
      rawBytes: 244_996,
      gzipBytes: 28_978,
      resultLimit: 12,
      snippetCharacters: 220,
    });
    expect(baseline.queries.map(({ query }) => query)).toEqual(
      SEARCH_BENCHMARK_QUERIES,
    );
  });

  it.each([
    ["workflow", "/funcionalidades/workflows"],
    ["criar workflow", "/funcionalidades/workflows"],
    ["automação", "/funcionalidades/workflows"],
    ["membros", "/funcionalidades/workflows"],
    ["kanban", "/funcionalidades/workflows/cards-kanban-e-lista"],
    ["lista", "/funcionalidades/workflows/cards-kanban-e-lista"],
    ["novo card", "/funcionalidades/workflows/cards-kanban-e-lista"],
    ["enviar e-mail", "/funcionalidades/workflows/automacoes"],
    ["arquivar workflow", "/funcionalidades/workflows/criar-e-configurar"],
    ["fase", "/funcionalidades/workflows/fases-e-transicoes"],
    ["transição", "/funcionalidades/workflows/fases-e-transicoes"],
    ["formulário", "/funcionalidades/workflows/formularios-e-campos"],
    ["campo obrigatório", "/funcionalidades/workflows/formularios-e-campos"],
    ["membro restrito", "/funcionalidades/workflows/membros-e-papeis"],
    ["formulário público", "/funcionalidades/workflows/formulario-publico"],
    ["protocolo", "/funcionalidades/workflows/formulario-publico"],
    ["link de acompanhamento", "/funcionalidades/workflows/formulario-publico"],
    ["logs da pasta", "/funcionalidades/documentos/logs-e-acoes"],
    ["metadados", "/funcionalidades/documentos/filtros-e-metadados"],
    ["favoritos", "/funcionalidades/favoritos"],
    ["primeiro acesso", "/primeiro-acesso"],
  ])("preserva destinos úteis para %s", async (query, expectedPrefix) => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const result = searchDocuments(createSearchIndex(docs), query);

    expect(result[0]?.href.startsWith(expectedPrefix)).toBe(true);
  });
});
