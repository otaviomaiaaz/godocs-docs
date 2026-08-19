// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ArticleShell } from "@/components/docs/article-shell";
import { mdxComponents } from "@/components/docs/mdx-components";
import { DocsHeader } from "@/components/docs-header";
import {
  buildBreadcrumbs,
  buildNavigation,
  getAdjacentDocs,
} from "@/lib/docs/navigation";
import { getAllDocs } from "@/lib/docs/source";

const pathname = { value: "/" };

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
  useRouter: () => ({ push: vi.fn() }),
}));

type PageScenario = {
  breakpoint: "desktop" | "mobile";
  height: number;
  slug: string;
  theme: "dark" | "light";
  width: number;
};

const scenarios: PageScenario[] = [
  {
    breakpoint: "desktop",
    height: 900,
    slug: "primeiro-acesso",
    theme: "dark",
    width: 1440,
  },
  {
    breakpoint: "mobile",
    height: 844,
    slug: "funcionalidades/workflows",
    theme: "light",
    width: 390,
  },
  {
    breakpoint: "desktop",
    height: 900,
    slug: "funcionalidades/workflows/criar-e-configurar",
    theme: "dark",
    width: 1440,
  },
  {
    breakpoint: "mobile",
    height: 844,
    slug: "funcionalidades/workflows/fases-e-transicoes",
    theme: "light",
    width: 390,
  },
];

function mediaQueryMatches(query: string, scenario: PageScenario): boolean {
  if (query === "(prefers-color-scheme: dark)") {
    return scenario.theme === "dark";
  }

  const minWidth = query.match(/min-width:\s*(\d+)px/);
  if (minWidth?.[1] && scenario.width < Number(minWidth[1])) {
    return false;
  }

  const maxWidth = query.match(/max-width:\s*(\d+)px/);
  if (maxWidth?.[1] && scenario.width > Number(maxWidth[1])) {
    return false;
  }

  return Boolean(minWidth || maxWidth);
}

function installBrowserLayout(scenario: PageScenario) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: scenario.width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: scenario.height,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: mediaQueryMatches(query, scenario),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function applyResponsiveVisibility(container: HTMLElement, breakpoint: PageScenario["breakpoint"]) {
  const selectors =
    breakpoint === "desktop"
      ? [".article-toc-mobile", ".mobile-nav-trigger"]
      : [".docs-sidebar", ".table-of-contents"];

  for (const selector of selectors) {
    const element = container.querySelector<HTMLElement>(selector);
    expect(element, `superfície responsiva ausente: ${selector}`).toBeTruthy();
    element?.setAttribute("hidden", "");
  }

  if (breakpoint === "mobile") {
    const mobileToc = container.querySelector<HTMLDetailsElement>(
      ".article-toc-mobile",
    );
    expect(mobileToc).toBeTruthy();
    if (mobileToc) mobileToc.open = true;
  }
}

function expectCoherentArticleOutline(container: HTMLElement) {
  const headings = Array.from(
    container.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4, h5, h6"),
  ).filter((heading) => !heading.closest("[hidden]"));
  const article = container.querySelector("article");
  const articleHeadings = Array.from(
    article?.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4, h5, h6") ?? [],
  );
  const h1 = articleHeadings.filter((heading) => heading.tagName === "H1");

  expect(article).toBeTruthy();
  expect(h1).toHaveLength(1);
  expect(headings[0]).toBe(h1[0]);
  expect(container.querySelector(".docs-sidebar h1, .docs-sidebar h2, .docs-sidebar h3")).toBeNull();

  for (let index = 1; index < articleHeadings.length; index += 1) {
    const previousLevel = Number(articleHeadings[index - 1]?.tagName.slice(1));
    const currentLevel = Number(articleHeadings[index]?.tagName.slice(1));
    expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
  }

  const contentHeadings = Array.from(
    container.querySelectorAll<HTMLHeadingElement>(
      ".prose h2[id], .prose h3[id], .prose h4[id]",
    ),
  );
  expect(contentHeadings.length).toBeGreaterThan(1);
  expect(new Set(contentHeadings.map((heading) => heading.id)).size).toBe(
    contentHeadings.length,
  );
}

async function renderDocumentPage(scenario: PageScenario) {
  installBrowserLayout(scenario);
  document.documentElement.dataset.theme = scenario.theme;
  pathname.value = `/docs/${scenario.slug}`;

  const docs = await getAllDocs();
  const doc = docs.find((candidate) => candidate.slug === scenario.slug);
  expect(doc).toBeTruthy();
  if (!doc) throw new Error(`Documento não encontrado: ${scenario.slug}`);

  const navigation = buildNavigation(docs);
  const { previous, next } = getAdjacentDocs(docs, doc.slug);
  const related = doc.metadata.related
    .map((relatedSlug) => docs.find((candidate) => candidate.slug === relatedSlug))
    .filter((candidate): candidate is (typeof docs)[number] => Boolean(candidate));
  const content = await MDXRemote({
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
    source: doc.source,
  });

  const view = render(
    <div id="site-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <DocsHeader navigation={navigation} />
      <ArticleShell
        breadcrumbs={buildBreadcrumbs(doc, docs)}
        doc={doc}
        navigation={navigation}
        next={next}
        previous={previous}
        related={related}
      >
        {content}
      </ArticleShell>
    </div>,
  );

  applyResponsiveVisibility(view.container, scenario.breakpoint);
  return { ...view, doc };
}

beforeEach(() => {
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0),
  });
  Object.defineProperty(window, "cancelAnimationFrame", {
    configurable: true,
    value: (handle: number) => window.clearTimeout(handle),
  });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  pathname.value = "/";
  document.documentElement.removeAttribute("data-theme");
  vi.restoreAllMocks();
});

describe("acessibilidade de páginas documentais completas", () => {
  it.each(scenarios)(
    "$slug em $theme/$breakpoint preserva Axe, landmarks e outline",
    async (scenario) => {
      const { container, doc } = await renderDocumentPage(scenario);
      const main = screen.getByRole("main");

      expect(main.id).toBe("main-content");
      expect(within(main).getByRole("article")).toBeTruthy();
      expect(
        screen.getByRole("navigation", { name: "Caminho da página" }),
      ).toBeTruthy();
      expect(
        screen.getByRole("navigation", { name: "Nesta página" }),
      ).toBeTruthy();
      expect(document.documentElement.dataset.theme).toBe(scenario.theme);
      expect(window.innerWidth).toBe(scenario.width);

      expectCoherentArticleOutline(container);

      if (scenario.slug === "primeiro-acesso") {
        expect(container.querySelectorAll(".step__title").length).toBeGreaterThan(1);
        expect(container.querySelector(".step__title")?.tagName).toBe("H2");
      } else if (scenario.slug === "funcionalidades/workflows") {
        expect(doc.metadata.pageType).toBe("hub");
        expect(doc.headings.length).toBeGreaterThanOrEqual(2);
        expect(doc.headings.length).toBeLessThan(8);
      } else if (scenario.slug === "funcionalidades/workflows/criar-e-configurar") {
        expect(doc.headings.length).toBeGreaterThanOrEqual(3);
        expect(container.querySelector(".prose h4[id]")).toBeTruthy();
        expect(
          screen.getAllByRole("note", { name: "Exclusão permanente" }),
        ).toHaveLength(1);
      } else {
        expect(doc.headings.length).toBeGreaterThanOrEqual(10);
        expect(
          screen.getAllByRole("note", { name: "Exclusão permanente" }),
        ).toHaveLength(1);
      }

      const results = await axe.run(container, {
        rules: {
          // JSDOM não possui pintura confiável; o contraste é medido em teste CSS dedicado.
          "color-contrast": { enabled: false },
        },
      });
      expect(results.violations).toEqual([]);
    },
  );
});
