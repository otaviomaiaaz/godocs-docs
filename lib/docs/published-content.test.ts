import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbs,
  buildNavigation,
  getAdjacentDocs,
} from "@/lib/docs/navigation";
import { createSearchIndex, searchDocuments } from "@/lib/docs/search";
import { loadDocumentFile } from "@/lib/docs/source";

const documentPath = path.join(
  process.cwd(),
  "content",
  "docs",
  "o-que-e-o-godocs.mdx",
);

describe("primeiro documento publicado", () => {
  it("carrega metadados, conteúdo e headings do MDX real", async () => {
    const doc = await loadDocumentFile(documentPath);

    expect(doc.metadata).toMatchObject({
      title: "O que é o GoDocs?",
      navTitle: "O que é o GoDocs?",
      description:
        "Conheça a plataforma e entenda como ela centraliza documentos, organiza informações e apoia os processos da organização.",
      cardDescription: "Explicação inicial do sistema.",
      slug: "o-que-e-o-godocs",
      section: {
        id: "comece-por-aqui",
        label: "Comece por aqui",
        description: "Conteúdos introdutórios para conhecer o GoDocs.",
        order: 10,
      },
      order: 1,
    });
    expect(doc.href).toBe("/docs/o-que-e-o-godocs");
    expect(doc.source).not.toMatch(/^# /m);
    expect(doc.headings.map((heading) => heading.title)).toEqual([
      "Para que serve o GoDocs?",
      "Principais recursos",
      "Para quem o GoDocs é indicado?",
    ]);
    expect(doc.searchableText).toContain(
      "Gestão Eletrônica de Documentos e Processos",
    );
  });

  it("alimenta navegação, breadcrumb, busca e paginação sem itens vazios", async () => {
    const doc = await loadDocumentFile(documentPath);
    const navigation = buildNavigation([doc]);
    const results = searchDocuments(createSearchIndex([doc]), "GoDocs");

    expect(navigation[0]).toMatchObject({
      id: "comece-por-aqui",
      title: "Comece por aqui",
      entryHref: "/docs/o-que-e-o-godocs",
    });
    expect(navigation[0]?.items[0]).toMatchObject({
      label: "O que é o GoDocs?",
      description: "Explicação inicial do sistema.",
      href: "/docs/o-que-e-o-godocs",
    });
    expect(buildBreadcrumbs(doc, [doc])).toEqual([
      {
        id: "section:comece-por-aqui",
        label: "Comece por aqui",
      },
      {
        id: "path:o-que-e-o-godocs",
        label: "O que é o GoDocs?",
      },
    ]);
    expect(results[0]?.href).toBe("/docs/o-que-e-o-godocs");
    expect(getAdjacentDocs([doc], doc.slug)).toEqual({});
  });
});
