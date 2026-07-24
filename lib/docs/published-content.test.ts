import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbs,
  buildNavigation,
  getAdjacentDocs,
} from "@/lib/docs/navigation";
import { createSearchIndex, searchDocuments } from "@/lib/docs/search";
import { loadDocumentsFromDirectory } from "@/lib/docs/source";
import { validateContentDirectory } from "@/lib/docs/validation";

const contentDirectory = path.join(process.cwd(), "content", "docs");

async function loadPublishedDocs() {
  return loadDocumentsFromDirectory(contentDirectory);
}

describe("conteúdo publicado", () => {
  it("preserva o artigo introdutório sem regressões", async () => {
    const docs = await loadPublishedDocs();
    const doc = docs.find((candidate) => candidate.slug === "o-que-e-o-godocs");

    expect(doc?.metadata).toMatchObject({
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
    expect(doc?.href).toBe("/docs/o-que-e-o-godocs");
    expect(doc?.source).not.toMatch(/^# /m);
    expect(doc?.headings.map((heading) => heading.title)).toEqual([
      "Para que serve o GoDocs?",
      "Principais recursos",
      "Para quem o GoDocs é indicado?",
    ]);
    expect(doc?.searchableText).toContain(
      "Gestão Eletrônica de Documentos e Processos",
    );
  });

  it("publica os três novos artigos com frontmatter, rotas e sumários aprovados", async () => {
    const docs = await loadPublishedDocs();
    const firstAccess = docs.find(
      (candidate) => candidate.slug === "primeiro-acesso",
    );
    const overview = docs.find(
      (candidate) => candidate.slug === "funcionalidades/visao-geral",
    );
    const smartSearch = docs.find(
      (candidate) => candidate.slug === "funcionalidades/busca-inteligente",
    );

    expect(docs).toHaveLength(4);
    expect(firstAccess?.metadata).toMatchObject({
      title: "Primeiro Acesso",
      cardDescription:
        "Aprenda a criar sua conta, fazer login e acessar seu ambiente no GoDocs.",
      section: {
        id: "comece-por-aqui",
        order: 10,
      },
      order: 2,
    });
    expect(firstAccess?.href).toBe("/docs/primeiro-acesso");
    expect(firstAccess?.headings.map((heading) => heading.title)).toEqual([
      "1. Localize o e-mail de convite",
      "2. Acesse e aceite o convite",
      "3. Crie sua conta",
      "Preencha seus dados",
      "Crie sua senha",
      "4. Faça login no GoDocs",
      "5. Selecione o ambiente que deseja acessar",
      "6. Entre no GoDocs",
    ]);

    expect(overview?.metadata).toMatchObject({
      title: "Visão Geral",
      cardDescription:
        "Conheça os indicadores, gráficos e informações da página inicial do GoDocs.",
      section: {
        id: "funcionalidades",
        label: "Funcionalidades",
        description: "Conheça os principais recursos disponíveis no GoDocs.",
        order: 20,
      },
      ancestors: [
        {
          segment: "funcionalidades",
          label: "Funcionalidades",
          order: 1,
        },
      ],
      order: 1,
    });
    expect(overview?.href).toBe("/docs/funcionalidades/visao-geral");
    expect(overview?.headings.map((heading) => heading.title)).toEqual([
      "Principais indicadores",
      "Documentos indexados",
      "Meus Grupos de Acesso",
      "Tipo de documento",
      "Grupos que mais acessam",
      "Como utilizar a Visão Geral",
    ]);

    expect(smartSearch?.metadata).toMatchObject({
      title: "Busca Inteligente",
      cardDescription:
        "Encontre documentos com pesquisa semântica e filtros avançados.",
      section: {
        id: "funcionalidades",
        order: 20,
      },
      order: 2,
    });
    expect(smartSearch?.href).toBe(
      "/docs/funcionalidades/busca-inteligente",
    );
    expect(smartSearch?.headings.map((heading) => heading.title)).toEqual([
      "Visão geral",
      "Como funciona",
      "Como utilizar",
    ]);

    for (const doc of [firstAccess, overview, smartSearch]) {
      expect(doc?.source).not.toMatch(/^# /m);
    }
  });

  it("deriva as duas seções e a ordem global sem repetir o prefixo da seção", async () => {
    const docs = await loadPublishedDocs();
    const navigation = buildNavigation(docs);

    expect(navigation.map((group) => group.title)).toEqual([
      "Comece por aqui",
      "Funcionalidades",
    ]);
    expect(navigation[0]?.items).toMatchObject([
      {
        label: "O que é o GoDocs?",
        href: "/docs/o-que-e-o-godocs",
      },
      {
        label: "Primeiro Acesso",
        href: "/docs/primeiro-acesso",
      },
    ]);
    expect(navigation[1]?.items).toMatchObject([
      {
        label: "Visão Geral",
        href: "/docs/funcionalidades/visao-geral",
      },
      {
        label: "Busca Inteligente",
        href: "/docs/funcionalidades/busca-inteligente",
      },
    ]);
    expect(
      navigation[1]?.items.some((item) => item.label === "Funcionalidades"),
    ).toBe(false);
    expect(docs.map((doc) => doc.slug)).toEqual([
      "o-que-e-o-godocs",
      "primeiro-acesso",
      "funcionalidades/visao-geral",
      "funcionalidades/busca-inteligente",
    ]);

    docs.forEach((doc, index) => {
      const adjacent = getAdjacentDocs(docs, doc.slug);
      expect(adjacent.previous?.slug).toBe(docs[index - 1]?.slug);
      expect(adjacent.next?.slug).toBe(docs[index + 1]?.slug);
    });
  });

  it("gera breadcrumbs sem duplicar a seção Funcionalidades", async () => {
    const docs = await loadPublishedDocs();
    const firstAccess = docs.find(
      (candidate) => candidate.slug === "primeiro-acesso",
    );
    const overview = docs.find(
      (candidate) => candidate.slug === "funcionalidades/visao-geral",
    );
    const smartSearch = docs.find(
      (candidate) => candidate.slug === "funcionalidades/busca-inteligente",
    );

    expect(firstAccess && buildBreadcrumbs(firstAccess, docs)).toEqual([
      {
        id: "section:comece-por-aqui",
        label: "Comece por aqui",
        href: "/docs/o-que-e-o-godocs",
      },
      {
        id: "path:primeiro-acesso",
        label: "Primeiro Acesso",
      },
    ]);
    expect(overview && buildBreadcrumbs(overview, docs)).toEqual([
      {
        id: "section:funcionalidades",
        label: "Funcionalidades",
      },
      {
        id: "path:funcionalidades/visao-geral",
        label: "Visão Geral",
      },
    ]);
    expect(smartSearch && buildBreadcrumbs(smartSearch, docs)).toEqual([
      {
        id: "section:funcionalidades",
        label: "Funcionalidades",
        href: "/docs/funcionalidades/visao-geral",
      },
      {
        id: "path:funcionalidades/busca-inteligente",
        label: "Busca Inteligente",
      },
    ]);
  });

  it.each([
    ["primeiro acesso", "primeiro-acesso"],
    ["convite", "primeiro-acesso"],
    ["criar conta", "primeiro-acesso"],
    ["senha", "primeiro-acesso"],
    ["workspace", "primeiro-acesso"],
    ["visão geral", "funcionalidades/visao-geral"],
    ["documentos indexados", "funcionalidades/visao-geral"],
    ["grupos de acesso", "funcionalidades/visao-geral"],
    ["busca inteligente", "funcionalidades/busca-inteligente"],
    ["IA semântica", "funcionalidades/busca-inteligente"],
    ["filtros", "funcionalidades/busca-inteligente"],
    ["relevância", "funcionalidades/busca-inteligente"],
    ["autor", "funcionalidades/busca-inteligente"],
    ["proprietário", "funcionalidades/busca-inteligente"],
  ])("encontra %s no artigo esperado", async (query, expectedSlug) => {
    const docs = await loadPublishedDocs();
    const results = searchDocuments(createSearchIndex(docs), query);

    expect(results[0]?.href).toBe(`/docs/${expectedSlug}`);
  });

  it("mantém slugs, taxonomia, componentes, links, fragments e assets válidos", async () => {
    const result = await validateContentDirectory(contentDirectory);

    expect(result.issues).toEqual([]);
    expect(new Set(result.documents.map((doc) => doc.slug)).size).toBe(4);
  });
});
