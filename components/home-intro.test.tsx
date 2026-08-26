// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { HomeIntro, type HomeFeature } from "@/components/home-intro";
import { buildNavigation } from "@/lib/docs/navigation";
import { loadDocumentsFromDirectory } from "@/lib/docs/source";

afterEach(cleanup);

const contentDirectory = path.join(process.cwd(), "content", "docs");

async function loadHomeData() {
  const docs = await loadDocumentsFromDirectory(contentDirectory);
  const publishedDocs = docs.filter(
    (doc) => doc.metadata.status === "published",
  );
  const features = publishedDocs
    .filter(
      (doc) =>
        doc.metadata.section?.id === "funcionalidades" &&
        doc.metadata.ancestors.length === 1,
    )
    .map<HomeFeature>((doc) => ({
      availability: doc.metadata.availability,
      description:
        doc.metadata.cardDescription ?? doc.metadata.description,
      href: doc.href,
      order: doc.metadata.order,
      slug: doc.slug,
      title: doc.metadata.navTitle ?? doc.metadata.title,
    }));

  return {
    features,
    groups: buildNavigation(publishedDocs),
  };
}

describe("home orientada ao conteúdo", () => {
  it("mantém o estado vazio útil, com hero, busca global e FAQ compacto", () => {
    const { container } = render(<HomeIntro groups={[]} />);

    expect(
      screen.getByText(/Ainda não há documentos publicados\./),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Encontre orientações para acessar, organizar documentos e utilizar os recursos do sistema.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Pesquisar na documentação" }),
    ).toBeTruthy();
    expect(screen.queryByText("CENTRAL DE DOCUMENTAÇÃO")).toBeNull();
    expect(screen.queryByText("Atalho")).toBeNull();
    expect(
      container.querySelectorAll(
        ".home-hero .search-trigger__shortcut",
      ),
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(["Perguntas frequentes"]);
    expect(
      screen.getByText(
        "Conteúdo em preparação. As perguntas frequentes serão adicionadas em breve.",
      ),
    ).toBeTruthy();
  });

  it("renderiza a trilha real e os seis recursos na ordem editorial", async () => {
    const data = await loadHomeData();
    render(<HomeIntro features={data.features} groups={data.groups} />);

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual([
      "Comece por aqui",
      "Conheça os recursos",
      "Perguntas frequentes",
    ]);

    const learningPath = document.querySelector(".learning-path");
    expect(learningPath).toBeTruthy();
    expect(
      within(learningPath as HTMLElement)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/docs/o-que-e-o-godocs", "/docs/primeiro-acesso"]);

    const featureGrid = document.querySelector(".feature-grid");
    expect(featureGrid).toBeTruthy();
    expect(
      within(featureGrid as HTMLElement)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Visão Geral",
      "Busca Inteligente",
      "Documentos",
      "Favoritos",
      "Workflows",
      "Relatórios",
    ]);

    for (const [name, href] of [
      ["Visão Geral", "/docs/funcionalidades/visao-geral"],
      ["Busca Inteligente", "/docs/funcionalidades/busca-inteligente"],
      ["Documentos", "/docs/funcionalidades/documentos"],
      ["Favoritos", "/docs/funcionalidades/favoritos"],
      ["Workflows", "/docs/funcionalidades/workflows"],
      ["Relatórios", "/docs/funcionalidades/relatorios"],
    ] as const) {
      expect(
        within(featureGrid as HTMLElement)
          .getByRole("link", { name: new RegExp(name) })
          .getAttribute("href"),
      ).toBe(href);
    }

    for (const publishedTitle of ["Favoritos", "Workflows", "Relatórios"]) {
      const card = within(featureGrid as HTMLElement).getByRole(
        "link",
        { name: new RegExp(publishedTitle) },
      );
      expect(card.getAttribute("data-status")).toBe("active");
      expect(
        card.querySelector(".doc-card__indicator--arrow"),
      ).toBeTruthy();
    }

    expect(
      within(featureGrid as HTMLElement).queryByText("Em breve"),
    ).toBeNull();
    expect(
      (featureGrid as HTMLElement).querySelectorAll(".doc-card__icon"),
    ).toHaveLength(6);
    expect(screen.queryByText("Guias mais acessados")).toBeNull();
    expect(screen.queryByText("Organizar documentos")).toBeNull();
  });

  it("mantém FAQ sem perguntas fictícias e remove os guias por popularidade", async () => {
    const data = await loadHomeData();
    render(<HomeIntro features={data.features} groups={data.groups} />);

    expect(screen.getByText("03 / DÚVIDAS")).toBeTruthy();
    expect(
      screen.getByText(
        "Encontre respostas rápidas para as dúvidas mais comuns sobre o GoDocs.",
      ),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: /pergunta/i })).toBeNull();
    expect(screen.queryByText("Guias mais acessados")).toBeNull();
  });

  it("mantém composição responsiva, header contextual e redução de movimento", async () => {
    const css = await readFile(
      path.join(process.cwd(), "app", "globals.css"),
      "utf8",
    );
    const redesignCss = css.slice(css.indexOf("/* Home refinement v4 */"));

    expect(redesignCss).toMatch(
      /\.docs-header\[data-home="true"\]\s+\.docs-header__inner\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto;/,
    );
    expect(redesignCss).toMatch(
      /\.docs-header\[data-home="true"\]\s*\{[^}]*background:\s*transparent;/,
    );
    expect(redesignCss).toMatch(
      /\.docs-header\[data-home="true"\]\[data-scrolled="true"\]/,
    );
    expect(redesignCss).toMatch(
      /\.learning-path\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
    );
    expect(redesignCss).toMatch(
      /\.feature-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/,
    );
    expect(redesignCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.feature-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
    );
    expect(redesignCss).toMatch(
      /@media \(max-width: 767px\)[\s\S]*?\.learning-path,[\s\S]*?\.feature-grid\s*\{[^}]*grid-template-columns:\s*1fr;/,
    );
    expect(redesignCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transform:\s*none;/,
    );
    expect(redesignCss).not.toContain(".featured-guides");
    expect(redesignCss).not.toContain("-webkit-line-clamp");
  });
});
