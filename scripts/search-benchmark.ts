import { performance } from "node:perf_hooks";
import { gzipSync } from "node:zlib";

import {
  createSearchEntry,
  searchDocuments,
  type SearchIndex,
} from "../lib/docs/search";

const DOCUMENT_COUNT = 1_500;
const QUERY_COUNT = 300;
const representativeParagraph =
  "Configuração documentação permissões pesquisa navegação seção conteúdo " +
  "procedimento referência operação recurso plataforma instruções usuário. ";

const buildStartedAt = performance.now();
const index: SearchIndex = {
  version: 2,
  entries: Array.from({ length: DOCUMENT_COUNT }, (_, indexPosition) =>
    createSearchEntry({
      title: `Documento ${indexPosition + 1}`,
      description: `Descrição objetiva do documento ${indexPosition + 1}.`,
      href: `/docs/secao-${indexPosition % 20}/documento-${indexPosition + 1}`,
      section: `Seção ${(indexPosition % 20) + 1}`,
      keywords: [
        `termo-${indexPosition % 50}`,
        `grupo-${indexPosition % 10}`,
      ],
      content: representativeParagraph.repeat(12),
    }),
  ),
};
const buildMilliseconds = performance.now() - buildStartedAt;
const serialized = JSON.stringify(index);
const durations: number[] = [];

for (let queryIndex = 0; queryIndex < QUERY_COUNT; queryIndex += 1) {
  const query =
    queryIndex % 3 === 0
      ? "configuracao"
      : queryIndex % 3 === 1
        ? `documento ${(queryIndex % DOCUMENT_COUNT) + 1}`
        : `termo-${queryIndex % 50}`;
  const startedAt = performance.now();
  searchDocuments(index, query, 10);
  durations.push(performance.now() - startedAt);
}

durations.sort((a, b) => a - b);
const percentile = (value: number) =>
  durations[Math.min(durations.length - 1, Math.floor(durations.length * value))] ??
  0;
const p95 = percentile(0.95);

console.log(
  JSON.stringify(
    {
      documents: DOCUMENT_COUNT,
      queries: QUERY_COUNT,
      indexBuildMs: Number(buildMilliseconds.toFixed(2)),
      indexBytes: Buffer.byteLength(serialized),
      indexGzipBytes: gzipSync(serialized).byteLength,
      queryMedianMs: Number(percentile(0.5).toFixed(2)),
      queryP95Ms: Number(p95.toFixed(2)),
      recommendation:
        p95 <= 16
          ? "Busca linear é suficiente; Web Worker ou índice invertido não se justificam."
          : "Reavaliar índice invertido ou Web Worker antes de ampliar a coleção.",
    },
    null,
    2,
  ),
);
