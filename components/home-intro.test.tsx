// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { HomeIntro } from "@/components/home-intro";
import { buildNavigation } from "@/lib/docs/navigation";
import { loadPublishedDocumentsFromDirectory } from "@/lib/docs/source";

afterEach(cleanup);

const contentDirectory = path.join(process.cwd(), "content", "docs");

describe("home orientada ao conteúdo", () => {
  it("mantém o estado vazio útil, com hero e busca global", () => {
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
    expect(screen.queryAllByRole("heading", { level: 2 })).toHaveLength(0);
    expect(screen.queryByText("GODOCS DOCS")).toBeNull();
    expect(screen.queryByText("Perguntas frequentes")).toBeNull();
  });

  it("organiza somente páginas publicadas em jornada e objetivos", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    render(<HomeIntro groups={buildNavigation(docs)} />);

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(["Comece por aqui", "Encontre por objetivo"]);

    const learningPath = document.querySelector(".learning-path");
    expect(learningPath).toBeTruthy();
    expect(
      within(learningPath as HTMLElement)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/docs/o-que-e-o-godocs", "/docs/primeiro-acesso"]);

    for (const [name, href] of [
      ["Visão Geral", "/docs/funcionalidades/visao-geral"],
      ["Busca Inteligente", "/docs/funcionalidades/busca-inteligente"],
      ["Documentos", "/docs/funcionalidades/documentos"],
    ] as const) {
      expect(
        screen.getByRole("link", { name: new RegExp(name) }).getAttribute("href"),
      ).toBe(href);
    }

    for (const draftTitle of ["Favoritos", "Workflows", "Relatórios"]) {
      expect(screen.queryByText(draftTitle)).toBeNull();
    }

    expect(screen.getByText("Organizar documentos")).toBeTruthy();
    expect(screen.getByText("Encontrar informações")).toBeTruthy();
    expect(screen.getByText("Acompanhar atividades")).toBeTruthy();
    expect(screen.queryByText("Automatizar processos")).toBeNull();
  });

  it("publica guias editoriais apenas com destinos profundos reais", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    render(
      <HomeIntro
        groups={buildNavigation(docs)}
        guides={[
          {
            id: "documentos:criar",
            title: "Criar uma pasta",
            description: "As pastas ajudam a organizar os documentos.",
            href: "/docs/funcionalidades/documentos#criando-uma-nova-pasta",
          },
          {
            id: "documentos:logs",
            title: "Consultar logs da pasta",
            description: "Os logs apresentam o histórico das ações realizadas.",
            href: "/docs/funcionalidades/documentos#visualizar-logs-da-pasta",
          },
        ]}
      />,
    );

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual([
      "Comece por aqui",
      "Encontre por objetivo",
      "Guias mais acessados",
    ]);
    expect(
      screen.getByRole("link", { name: /Criar uma pasta/ }).getAttribute("href"),
    ).toBe("/docs/funcionalidades/documentos#criando-uma-nova-pasta");
    expect(
      screen
        .getByRole("link", { name: /Consultar logs da pasta/ })
        .getAttribute("href"),
    ).toBe(
      "/docs/funcionalidades/documentos#visualizar-logs-da-pasta",
    );
  });

  it("mantém composição editorial responsiva e reduz movimento", async () => {
    const css = await readFile(
      path.join(process.cwd(), "app", "globals.css"),
      "utf8",
    );
    const evolvedCss = css.slice(css.indexOf("/* Product experience evolution */"));

    expect(evolvedCss).toMatch(
      /\.home-editorial-section\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*250px\)\s*minmax\(0,\s*1fr\);/,
    );
    expect(evolvedCss).toMatch(
      /\.objective-directory\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
    );
    expect(evolvedCss).toMatch(
      /@media \(max-width: 767px\)[\s\S]*?\.home-editorial-section\s*\{[^}]*display:\s*block;/,
    );
    expect(evolvedCss).toMatch(
      /@media \(max-width: 767px\)[\s\S]*?\.objective-directory,[\s\S]*?grid-template-columns:\s*1fr;/,
    );
    expect(evolvedCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transform:\s*none;/,
    );
  });
});
