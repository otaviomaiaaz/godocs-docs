import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbs,
  buildNavigation,
} from "@/lib/docs/navigation";
import type { DocFrontmatter, DocRecord } from "@/lib/docs/schema";

const section = {
  id: "primeiros-passos",
  label: "Primeiros passos",
  description: "Orientações iniciais publicadas.",
  order: 10,
};

type TestFrontmatter = Omit<
  DocFrontmatter,
  "availability" | "status" | "related"
> &
  Partial<
    Pick<DocFrontmatter, "availability" | "status" | "related">
  >;

function createDocument(input: TestFrontmatter): DocRecord {
  const metadata: DocFrontmatter = {
    availability: "available",
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
      title: "Primeiros passos",
      description: "Orientações iniciais publicadas.",
      entryHref: "/docs/guias",
    });
    expect(groups[0]?.items[0]).toMatchObject({
      id: "guias",
      label: "Guias",
      href: "/docs/guias",
    });
    expect(groups[0]?.items[0]?.children[0]).toMatchObject({
      label: "Configuração",
      href: "/docs/guias/configuracao",
    });
  });

  it("gera breadcrumbs para toda a hierarquia do slug", () => {
    expect(buildBreadcrumbs(nested, [entry, nested])).toEqual([
      {
        id: "section:primeiros-passos",
        label: "Primeiros passos",
        href: "/docs/guias",
      },
      {
        id: "path:guias",
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
});
