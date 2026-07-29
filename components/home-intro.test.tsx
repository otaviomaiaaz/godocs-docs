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
  const features = docs
    .filter((doc) => doc.metadata.section?.id === "funcionalidades")
    .map<HomeFeature>((doc) => ({
      description:
        doc.metadata.cardDescription ?? doc.metadata.description,
      href:
        doc.metadata.status === "published" ? doc.href : undefined,
      order: doc.metadata.order,
      slug: doc.slug,
      status: doc.metadata.status,
      title: doc.metadata.navTitle ?? doc.metadata.title,
    }));

  return {
    features,
    groups: buildNavigation(publishedDocs),
  };
}

describe("home orientada ao conteúdo", () => {
  it("mantém o estado vazio útil, com hero, busca global e FAQ compacto", () => {
    render(<HomeIntro groups={[]} />);

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
    ] as const) {
      expect(
        within(featureGrid as HTMLElement)
          .getByRole("link", { name: new RegExp(name) })
          .getAttribute("href"),
      ).toBe(href);
    }

    for (const draftTitle of ["Favoritos", "Workflows", "Relatórios"]) {
      const card = within(featureGrid as HTMLElement).getByLabelText(
        `${draftTitle}. Em breve`,
      );
      expect(card.tagName).toBe("ARTICLE");
      expect(card.getAttribute("tabindex")).toBeNull();
    }

    expect(
      within(featureGrid as HTMLElement).getAllByText("Em breve"),
    ).toHaveLength(3);
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
    const redesignCss = css.slice(css.indexOf("/* Home redesign v3 */"));

    expect(redesignCss).toMatch(
      /\.docs-header\[data-home="true"\]\s+\.docs-header__inner\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto;/,
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
  });
});
