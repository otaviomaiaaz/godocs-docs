import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbs,
  buildNavigation,
  getAdjacentDocs,
} from "@/lib/docs/navigation";
import type { DocFrontmatter, DocRecord } from "@/lib/docs/schema";

const section = {
  id: "primeiros-passos",
  label: "Guias",
  description: "Orientações iniciais publicadas.",
  entrySlug: "guias",
  order: 10,
};

type TestFrontmatter = Omit<
  DocFrontmatter,
  "availability" | "pageType" | "status" | "related"
> &
  Partial<
    Pick<
      DocFrontmatter,
      "availability" | "pageType" | "status" | "related"
    >
  >;

function createDocument(input: TestFrontmatter): DocRecord {
  const metadata: DocFrontmatter = {
    availability: "available",
    pageType: "reference",
    status: "published",
    related: [],
    ...input,
  };

  return {
    metadata,
    slug: metadata.slug,
    segments: metadata.slug.split("/"),
    href: `/docs/${metadata.slug}`,
    source: "",
    searchableText: "",
    headings: [],
    sections: [],
    readingMinutes: 1,
    filePath: `${metadata.slug}.mdx`,
  };
}

const entry = createDocument({
  title: "Central de guias",
  description: "Página de entrada.",
  slug: "guias",
  pageType: "hub",
  navTitle: "Guias",
  section,
  ancestors: [],
  order: 1,
  keywords: [],
});

const nested = createDocument({
  title: "Configuração detalhada",
  description: "Ajustes disponíveis.",
  slug: "guias/configuracao",
  navTitle: "Configuração",
  section,
  ancestors: [{ segment: "guias", label: "Guias", order: 1 }],
  order: 2,
  keywords: [],
});

describe("taxonomia documental", () => {
  it("usa labels e ordem explícitos sem humanizar slugs", () => {
    const groups = buildNavigation([nested, entry]);

    expect(groups[0]).toMatchObject({
      id: "primeiros-passos",
      title: "Guias",
      description: "Orientações iniciais publicadas.",
      entryHref: "/docs/guias",
    });
    expect(groups[0]?.items[0]).toMatchObject({
      label: "Configuração",
      href: "/docs/guias/configuracao",
    });
  });

  it("gera breadcrumbs para toda a hierarquia do slug", () => {
    expect(buildBreadcrumbs(nested, [entry, nested])).toEqual([
      {
        id: "section:primeiros-passos",
        label: "Guias",
        href: "/docs/guias",
      },
      {
        id: "path:guias/configuracao",
        label: "Configuração detalhada",
      },
    ]);
  });

  it("colapsa o prefixo do slug quando ele apenas repete a seção", () => {
    const functionalitySection = {
      id: "funcionalidades",
      label: "Funcionalidades",
      description: "Recursos publicados.",
      entrySlug: "funcionalidades/visao-geral",
      order: 20,
    };
    const overview = createDocument({
      title: "Visão Geral",
      description: "Indicadores do ambiente.",
      slug: "funcionalidades/visao-geral",
      navTitle: "Visão Geral",
      section: functionalitySection,
      ancestors: [
        {
          segment: "funcionalidades",
          label: "Funcionalidades",
          order: 1,
        },
      ],
      order: 1,
      keywords: [],
    });

    const groups = buildNavigation([overview]);

    expect(groups[0]?.title).toBe("Funcionalidades");
    expect(groups[0]?.items).toMatchObject([
      {
        id: "funcionalidades/visao-geral",
        label: "Visão Geral",
        href: "/docs/funcionalidades/visao-geral",
      },
    ]);
  });

  it("mantém o destino explícito da seção quando a ordem dos filhos muda", () => {
    const reordered = createDocument({
      ...nested.metadata,
      order: 0,
    });

    expect(buildNavigation([reordered, entry])[0]?.entryHref).toBe(
      "/docs/guias",
    );
  });

  it("gera breadcrumbs reais para página comum, hub e filha simulada", () => {
    const functionalitySection = {
      id: "funcionalidades",
      label: "Funcionalidades",
      description: "Recursos publicados.",
      entrySlug: "funcionalidades",
      order: 20,
    };
    const hub = createDocument({
      title: "Funcionalidades",
      description: "Entrada da seção.",
      slug: "funcionalidades",
      pageType: "hub",
      section: functionalitySection,
      ancestors: [],
      order: 0,
      keywords: [],
    });
    const documents = createDocument({
      title: "Documentos",
      description: "Entrada de documentos.",
      slug: "funcionalidades/documentos",
      pageType: "hub",
      section: functionalitySection,
      ancestors: [
        { segment: "funcionalidades", label: "Funcionalidades", order: 1 },
      ],
      order: 3,
      keywords: [],
    });
    const child = createDocument({
      title: "Organizar pastas",
      description: "Procedimento.",
      slug: "funcionalidades/documentos/pastas",
      pageType: "task",
      section: functionalitySection,
      ancestors: [
        { segment: "funcionalidades", label: "Funcionalidades", order: 1 },
        { segment: "documentos", label: "Documentos", order: 3 },
      ],
      order: 1,
      keywords: [],
    });

    expect(buildBreadcrumbs(hub, [hub, documents, child])).toEqual([
      {
        id: "section:funcionalidades",
        label: "Funcionalidades",
      },
    ]);
    expect(buildBreadcrumbs(child, [hub, documents, child])).toEqual([
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
        id: "path:funcionalidades/documentos/pastas",
        label: "Organizar pastas",
      },
    ]);
    expect(buildBreadcrumbs(nested, [entry, nested])).toHaveLength(2);
  });

  it("não cria hub artificial para Comece por aqui", () => {
    const startSection = {
      id: "comece-por-aqui",
      label: "Comece por aqui",
      description: "Orientação inicial.",
      entrySlug: "introducao",
      order: 10,
    };
    const introduction = createDocument({
      title: "Introdução",
      description: "Conheça o produto.",
      slug: "introducao",
      pageType: "reference",
      section: startSection,
      ancestors: [],
      order: 1,
      keywords: [],
    });
    const access = createDocument({
      title: "Primeiro acesso",
      description: "Acesse o produto.",
      slug: "primeiro-acesso",
      pageType: "task",
      section: startSection,
      ancestors: [],
      order: 2,
      keywords: [],
    });

    expect(buildBreadcrumbs(access, [introduction, access])).toEqual([
      {
        id: "path:primeiro-acesso",
        label: "Primeiro acesso",
      },
    ]);
  });

  it("pagina dentro do domínio e encerra antes de atravessar para outro ramo", () => {
    const functionalitySection = {
      id: "funcionalidades",
      label: "Funcionalidades",
      description: "Recursos publicados.",
      entrySlug: "funcionalidades",
      order: 20,
    };
    const hub = createDocument({
      title: "Funcionalidades",
      description: "Entrada.",
      slug: "funcionalidades",
      pageType: "hub",
      section: functionalitySection,
      ancestors: [],
      order: 0,
      keywords: [],
    });
    const overview = createDocument({
      title: "Visão Geral",
      description: "Visão Geral.",
      slug: "funcionalidades/visao-geral",
      pageType: "reference",
      section: functionalitySection,
      ancestors: [
        { segment: "funcionalidades", label: "Funcionalidades", order: 1 },
      ],
      order: 1,
      keywords: [],
    });
    const documents = createDocument({
      title: "Documentos",
      description: "Entrada de documentos.",
      slug: "funcionalidades/documentos",
      pageType: "hub",
      section: functionalitySection,
      ancestors: [
        { segment: "funcionalidades", label: "Funcionalidades", order: 1 },
      ],
      order: 2,
      keywords: [],
    });
    const firstChild = createDocument({
      title: "Pastas",
      description: "Pastas.",
      slug: "funcionalidades/documentos/pastas",
      pageType: "task",
      section: functionalitySection,
      ancestors: [
        { segment: "funcionalidades", label: "Funcionalidades", order: 1 },
        { segment: "documentos", label: "Documentos", order: 2 },
      ],
      order: 1,
      keywords: [],
    });
    const lastChild = createDocument({
      title: "Logs",
      description: "Logs.",
      slug: "funcionalidades/documentos/logs",
      pageType: "reference",
      section: functionalitySection,
      ancestors: [
        { segment: "funcionalidades", label: "Funcionalidades", order: 1 },
        { segment: "documentos", label: "Documentos", order: 2 },
      ],
      order: 2,
      keywords: [],
    });
    const favorites = createDocument({
      title: "Favoritos",
      description: "Favoritos.",
      slug: "funcionalidades/favoritos",
      pageType: "task",
      section: functionalitySection,
      ancestors: [
        { segment: "funcionalidades", label: "Funcionalidades", order: 1 },
      ],
      order: 3,
      keywords: [],
    });
    const docs = [hub, overview, documents, firstChild, lastChild, favorites];

    expect(getAdjacentDocs(docs, hub.slug)).toMatchObject({
      next: { slug: overview.slug },
    });
    expect(getAdjacentDocs(docs, overview.slug).next).toBeUndefined();
    expect(getAdjacentDocs(docs, documents.slug)).toMatchObject({
      next: { slug: firstChild.slug },
    });
    expect(getAdjacentDocs(docs, firstChild.slug)).toMatchObject({
      previous: { slug: documents.slug },
      next: { slug: lastChild.slug },
    });
    expect(getAdjacentDocs(docs, lastChild.slug).next).toBeUndefined();
    expect(getAdjacentDocs(docs, favorites.slug)).toEqual({
      previous: undefined,
      next: undefined,
    });
  });
});
