import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbs,
  buildNavigation,
  getAdjacentDocs,
} from "@/lib/docs/navigation";
import { createSearchIndex, searchDocuments } from "@/lib/docs/search";
import { anchorCompatibilityManifest } from "@/lib/docs/compatibility";
import {
  loadDocumentsFromDirectory,
  loadPublishedDocumentsFromDirectory,
} from "@/lib/docs/source";
import { validateContentDirectory } from "@/lib/docs/validation";

const contentDirectory = path.join(process.cwd(), "content", "docs");

async function loadPublishedDocs() {
  return loadPublishedDocumentsFromDirectory(contentDirectory);
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
        entrySlug: "o-que-e-o-godocs",
        order: 10,
      },
      pageType: "reference",
      order: 1,
    });
    expect(doc?.href).toBe("/docs/o-que-e-o-godocs");
    expect(doc?.source).not.toMatch(/^# /m);
    expect(doc?.headings.map((heading) => heading.title)).toEqual([
      "O que você pode fazer no GoDocs",
      "Um sistema adaptado ao seu ambiente",
      "Próximos passos",
    ]);
    expect(doc?.searchableText).toContain(
      "Gestão Eletrônica de Documentos e Processos",
    );
  });

  it("publica o hub e os treze artigos com frontmatter, rotas e sumários aprovados", async () => {
    const docs = await loadPublishedDocs();
    const firstAccess = docs.find(
      (candidate) => candidate.slug === "primeiro-acesso",
    );
    const functionalities = docs.find(
      (candidate) => candidate.slug === "funcionalidades",
    );
    const overview = docs.find(
      (candidate) => candidate.slug === "funcionalidades/visao-geral",
    );
    const smartSearch = docs.find(
      (candidate) => candidate.slug === "funcionalidades/busca-inteligente",
    );
    const documents = docs.find(
      (candidate) => candidate.slug === "funcionalidades/documentos",
    );
    const favorites = docs.find(
      (candidate) => candidate.slug === "funcionalidades/favoritos",
    );
    const workflows = docs.find(
      (candidate) => candidate.slug === "funcionalidades/workflows",
    );
    const reports = docs.find(
      (candidate) => candidate.slug === "funcionalidades/relatorios",
    );
    expect(docs).toHaveLength(14);
    expect(functionalities?.metadata).toMatchObject({
      title: "Funcionalidades",
      slug: "funcionalidades",
      pageType: "hub",
      section: {
        id: "funcionalidades",
        entrySlug: "funcionalidades",
      },
      order: 0,
    });
    expect(functionalities?.href).toBe("/docs/funcionalidades");
    expect(firstAccess?.metadata).toMatchObject({
      title: "Primeiro Acesso",
      pageType: "task",
      cardDescription: "Crie sua conta e acesse o GoDocs.",
      section: {
        id: "comece-por-aqui",
        entrySlug: "o-que-e-o-godocs",
        order: 10,
      },
      order: 2,
    });
    expect(firstAccess?.href).toBe("/docs/primeiro-acesso");
    expect(firstAccess?.headings.map((heading) => heading.title)).toEqual([
      "Localize o e-mail de convite",
      "Abra o convite",
      "Crie sua conta",
      "Preencha seus dados",
      "Crie sua senha",
      "Faça login no GoDocs",
      "Selecione o ambiente que deseja acessar",
      "Entre no GoDocs",
      "Se tiver problemas no primeiro acesso",
    ]);
    expect(firstAccess?.source).toContain("<Steps>");
    expect(firstAccess?.source).toContain("<ExpectedResult>");

    expect(overview?.metadata).toMatchObject({
      title: "Visão Geral",
      cardDescription: "Acompanhe os principais indicadores do GoDocs.",
      section: {
        id: "funcionalidades",
        label: "Funcionalidades",
        description: "Conheça os principais recursos disponíveis no GoDocs.",
        entrySlug: "funcionalidades",
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
      "Como interpretar a Visão Geral",
    ]);

    expect(smartSearch?.metadata).toMatchObject({
      title: "Busca Inteligente",
      cardDescription: "Encontre documentos com busca semântica e filtros.",
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
      "Realizando uma pesquisa",
      "Acesse a Busca Inteligente",
      "Informe o que deseja encontrar",
      "Consulte os resultados",
      "Refinando a pesquisa com filtros",
      "Entendendo os resultados",
      "Correspondência da pesquisa",
      "Consultando os detalhes do documento",
      "Match semântico",
      "Metadados",
      "Resumo gerado por IA",
      "Ações disponíveis",
      "Como a inteligência artificial participa da busca",
    ]);

    expect(documents?.metadata).toMatchObject({
      title: "Documentos",
      cardDescription: "Organize e consulte seus documentos.",
      pageType: "hub",
      section: {
        id: "funcionalidades",
        order: 20,
      },
      order: 3,
    });
    expect(documents?.href).toBe("/docs/funcionalidades/documentos");
    expect(documents?.headings.map((heading) => heading.title)).toEqual([
      "O que é a seção Documentos",
      "Conceitos importantes",
    ]);

    expect(
      docs
        .filter((doc) => doc.slug.startsWith("funcionalidades/documentos/"))
        .map((doc) => [doc.slug, doc.metadata.title, doc.metadata.pageType]),
    ).toEqual([
      [
        "funcionalidades/documentos/pastas",
        "Organizar pastas e subpastas",
        "task",
      ],
      [
        "funcionalidades/documentos/adicionar-documentos",
        "Adicionar documentos",
        "task",
      ],
      [
        "funcionalidades/documentos/filtros-e-metadados",
        "Localizar, filtrar e consultar metadados",
        "task",
      ],
      [
        "funcionalidades/documentos/gerenciar-documentos",
        "Visualizar e gerenciar documentos",
        "reference",
      ],
      [
        "funcionalidades/documentos/logs-e-acoes",
        "Logs e ações",
        "reference",
      ],
    ]);

    for (const [doc, title, order, description, cardDescription] of [
      [
        favorites,
        "Favoritos",
        4,
        "Aprenda a marcar, localizar, filtrar e acessar rapidamente documentos favoritos no GoDocs.",
        "Acesse rapidamente os documentos que você marcou como favoritos.",
      ],
      [
        workflows,
        "Workflows",
        5,
        "Aprenda a criar, acompanhar e configurar workflows, cards, fases, formulários, membros e automações no GoDocs.",
        "Crie e acompanhe processos organizados em workflows.",
      ],
      [
        reports,
        "Relatórios",
        6,
        "Consulte regras de temporalidade e dados indexados dos documentos nos relatórios do GoDocs.",
        "Consulte temporalidades e dados indexados dos documentos.",
      ],
    ] as const) {
      expect(doc?.metadata).toMatchObject({
        title,
        description,
        cardDescription,
        availability: "available",
        status: "published",
        order,
      });
      expect(doc?.source).not.toContain("Em breve");
      expect(doc?.source).not.toContain("Documentação em preparação");
    }

    for (const doc of [
      firstAccess,
      overview,
      smartSearch,
      documents,
      favorites,
      workflows,
      reports,
    ]) {
      expect(doc?.source).not.toMatch(/^# /m);
    }
  });

  it("integra os quatorze documentos disponíveis a rotas, navegação e busca públicas", async () => {
    const allDocs = await loadDocumentsFromDirectory(contentDirectory);
    const publishedDocs = await loadPublishedDocs();
    const preparing = allDocs.filter(
      (doc) => doc.metadata.availability === "coming-soon",
    );
    const publicIndex = createSearchIndex(publishedDocs);

    expect(preparing).toEqual([]);
    expect(publishedDocs).toHaveLength(14);
    expect(publicIndex.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "section",
          title: "Crie sua conta",
          href: "/docs/primeiro-acesso#crie-sua-conta",
        }),
      ]),
    );
    for (const slug of [
      "funcionalidades",
      "funcionalidades/documentos/pastas",
      "funcionalidades/documentos/adicionar-documentos",
      "funcionalidades/documentos/filtros-e-metadados",
      "funcionalidades/documentos/gerenciar-documentos",
      "funcionalidades/documentos/logs-e-acoes",
      "funcionalidades/favoritos",
      "funcionalidades/workflows",
      "funcionalidades/relatorios",
    ]) {
      expect(
        publicIndex.entries.some(
          (entry) =>
            entry.kind === "page" && entry.href === `/docs/${slug}`,
        ),
      ).toBe(true);
    }
  });

  it("deriva as duas seções e a ordem global sem repetir o prefixo da seção", async () => {
    const docs = await loadPublishedDocs();
    const navigation = buildNavigation(docs);

    expect(navigation.map((group) => group.title)).toEqual([
      "Comece por aqui",
      "Funcionalidades",
    ]);
    expect(navigation[0]).toMatchObject({
      entrySlug: "o-que-e-o-godocs",
      entryHref: "/docs/o-que-e-o-godocs",
      entryPageType: "reference",
    });
    expect(navigation[1]).toMatchObject({
      entrySlug: "funcionalidades",
      entryHref: "/docs/funcionalidades",
      entryPageType: "hub",
    });
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
      {
        label: "Documentos",
        href: "/docs/funcionalidades/documentos",
        pageType: "hub",
        children: [
          {
            label: "Organizar pastas e subpastas",
            href: "/docs/funcionalidades/documentos/pastas",
          },
          {
            label: "Adicionar documentos",
            href: "/docs/funcionalidades/documentos/adicionar-documentos",
          },
          {
            label: "Localizar, filtrar e consultar metadados",
            href: "/docs/funcionalidades/documentos/filtros-e-metadados",
          },
          {
            label: "Visualizar e gerenciar documentos",
            href: "/docs/funcionalidades/documentos/gerenciar-documentos",
          },
          {
            label: "Logs e ações",
            href: "/docs/funcionalidades/documentos/logs-e-acoes",
          },
        ],
      },
      {
        label: "Favoritos",
        href: "/docs/funcionalidades/favoritos",
      },
      {
        label: "Workflows",
        href: "/docs/funcionalidades/workflows",
      },
      {
        label: "Relatórios",
        href: "/docs/funcionalidades/relatorios",
      },
    ]);
    expect(
      navigation[1]?.items.some((item) => item.label === "Funcionalidades"),
    ).toBe(false);
    expect(docs.map((doc) => doc.slug)).toEqual([
      "o-que-e-o-godocs",
      "primeiro-acesso",
      "funcionalidades",
      "funcionalidades/documentos/pastas",
      "funcionalidades/visao-geral",
      "funcionalidades/documentos/adicionar-documentos",
      "funcionalidades/busca-inteligente",
      "funcionalidades/documentos",
      "funcionalidades/documentos/filtros-e-metadados",
      "funcionalidades/favoritos",
      "funcionalidades/documentos/gerenciar-documentos",
      "funcionalidades/documentos/logs-e-acoes",
      "funcionalidades/workflows",
      "funcionalidades/relatorios",
    ]);

    expect(getAdjacentDocs(docs, "o-que-e-o-godocs")).toMatchObject({
      next: { slug: "primeiro-acesso" },
    });
    expect(getAdjacentDocs(docs, "primeiro-acesso")).toMatchObject({
      previous: { slug: "o-que-e-o-godocs" },
    });
    expect(getAdjacentDocs(docs, "primeiro-acesso").next).toBeUndefined();
    expect(getAdjacentDocs(docs, "funcionalidades")).toMatchObject({
      next: { slug: "funcionalidades/visao-geral" },
    });
    expect(getAdjacentDocs(docs, "funcionalidades/visao-geral")).toMatchObject({
      previous: { slug: "funcionalidades" },
      next: { slug: "funcionalidades/busca-inteligente" },
    });
    expect(getAdjacentDocs(docs, "funcionalidades/documentos")).toMatchObject({
      next: { slug: "funcionalidades/documentos/pastas" },
    });
    expect(
      getAdjacentDocs(docs, "funcionalidades/documentos/pastas"),
    ).toMatchObject({
      previous: { slug: "funcionalidades/documentos" },
      next: { slug: "funcionalidades/documentos/adicionar-documentos" },
    });
    expect(
      getAdjacentDocs(docs, "funcionalidades/documentos/logs-e-acoes").next,
    ).toBeUndefined();
    expect(getAdjacentDocs(docs, "funcionalidades/relatorios")).toMatchObject({
      previous: { slug: "funcionalidades/workflows" },
    });
    expect(getAdjacentDocs(docs, "funcionalidades/relatorios").next).toBeUndefined();
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
    const functionalities = docs.find(
      (candidate) => candidate.slug === "funcionalidades",
    );

    expect(firstAccess && buildBreadcrumbs(firstAccess, docs)).toEqual([
      {
        id: "path:primeiro-acesso",
        label: "Primeiro Acesso",
      },
    ]);
    expect(
      functionalities && buildBreadcrumbs(functionalities, docs),
    ).toEqual([
      {
        id: "section:funcionalidades",
        label: "Funcionalidades",
      },
    ]);
    expect(overview && buildBreadcrumbs(overview, docs)).toEqual([
      {
        id: "section:funcionalidades",
        label: "Funcionalidades",
        href: "/docs/funcionalidades",
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
        href: "/docs/funcionalidades",
      },
      {
        id: "path:funcionalidades/busca-inteligente",
        label: "Busca Inteligente",
      },
    ]);

    for (const [slug, label] of [
      ["funcionalidades/documentos", "Documentos"],
      ["funcionalidades/favoritos", "Favoritos"],
      ["funcionalidades/workflows", "Workflows"],
      ["funcionalidades/relatorios", "Relatórios"],
    ] as const) {
      const doc = docs.find((candidate) => candidate.slug === slug);

      expect(doc && buildBreadcrumbs(doc, docs)).toEqual([
        {
          id: "section:funcionalidades",
          label: "Funcionalidades",
          href: "/docs/funcionalidades",
        },
        {
          id: `path:${slug}`,
          label,
        },
      ]);
    }

    for (const [slug, label] of [
      ["funcionalidades/documentos/pastas", "Organizar pastas e subpastas"],
      ["funcionalidades/documentos/adicionar-documentos", "Adicionar documentos"],
      [
        "funcionalidades/documentos/filtros-e-metadados",
        "Localizar, filtrar e consultar metadados",
      ],
      [
        "funcionalidades/documentos/gerenciar-documentos",
        "Visualizar e gerenciar documentos",
      ],
      ["funcionalidades/documentos/logs-e-acoes", "Logs e ações"],
    ] as const) {
      const doc = docs.find((candidate) => candidate.slug === slug);

      expect(doc && buildBreadcrumbs(doc, docs)).toEqual([
        {
          id: "section:funcionalidades",
          label: "Funcionalidades",
          href: "/docs/funcionalidades",
        },
        {
          id: "path:funcionalidades/documentos",
          label: "Documentos",
          href: "/docs/funcionalidades/documentos",
        },
        {
          id: `path:${slug}`,
          label,
        },
      ]);
    }
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
    ["filtros", "funcionalidades/documentos/filtros-e-metadados"],
    ["relevância", "funcionalidades/busca-inteligente"],
    ["autor", "funcionalidades/busca-inteligente"],
    ["proprietário", "funcionalidades/busca-inteligente"],
    ["nova pasta", "funcionalidades/documentos/pastas"],
    ["vincular a um grupo", "funcionalidades/documentos/pastas"],
    ["adicionar documento", "funcionalidades/documentos/adicionar-documentos"],
    ["metadados", "funcionalidades/documentos/filtros-e-metadados"],
    ["logs da pasta", "funcionalidades/documentos/logs-e-acoes"],
    ["visualizar documento", "funcionalidades/documentos/gerenciar-documentos"],
    ["favoritos", "funcionalidades/favoritos"],
    ["workflows", "funcionalidades/workflows"],
    ["relatórios", "funcionalidades/relatorios"],
  ])("encontra %s no artigo esperado", async (query, expectedSlug) => {
    const docs = await loadPublishedDocs();
    const results = searchDocuments(createSearchIndex(docs), query);

    expect(results[0]?.href.startsWith(`/docs/${expectedSlug}`)).toBe(true);
  });

  it("mantém slugs, taxonomia, componentes, links, fragments e assets válidos", async () => {
    const result = await validateContentDirectory(contentDirectory, {
      compatibilityManifest: anchorCompatibilityManifest,
    });

    expect(result.issues).toEqual([]);
    expect(new Set(result.documents.map((doc) => doc.slug)).size).toBe(14);
    expect(
      result.documents.filter((doc) => doc.metadata.status === "published"),
    ).toHaveLength(14);
    expect(
      result.documents.filter((doc) => doc.metadata.status === "draft"),
    ).toHaveLength(0);
    expect(
      result.documents.filter(
        (doc) => doc.metadata.availability === "coming-soon",
      ),
    ).toHaveLength(0);
    expect(
      result.documents.filter(
        (doc) => doc.metadata.availability === "available",
      ),
    ).toHaveLength(14);
  });
});
