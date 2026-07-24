// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { HomeIntro } from "@/components/home-intro";
import { buildNavigation } from "@/lib/docs/navigation";
import { loadDocumentsFromDirectory } from "@/lib/docs/source";

afterEach(cleanup);

describe("home orientada ao conteúdo", () => {
  it("preserva exatamente o estado vazio sem cards", () => {
    render(<HomeIntro groups={[]} />);

    expect(screen.getByText("Ainda não há documentos publicados.")).toBeTruthy();
    expect(
      screen.getByText("Guias, conceitos e instruções para utilizar o GoDocs."),
    ).toBeTruthy();
    expect(
      screen.queryByText(
        new RegExp(["documentação", "oficial"].join(" "), "i"),
      ),
    ).toBeNull();
    expect(screen.queryByRole("navigation", { name: "Seções da documentação" })).toBeNull();
  });

  it("remove a mensagem progressiva e usa apenas páginas reais da coleção", () => {
    render(
      <HomeIntro
        groups={[
          {
            id: "comece-por-aqui",
            title: "Comece por aqui",
            description: "Conteúdos introdutórios para conhecer o GoDocs.",
            order: 10,
            entryHref: "/docs/o-que-e-o-godocs",
            items: [
              {
                id: "o-que-e-o-godocs",
                label: "O que é o GoDocs?",
                description: "Explicação inicial do sistema.",
                href: "/docs/o-que-e-o-godocs",
                children: [],
              },
            ],
          },
        ]}
      />,
    );

    expect(
      screen.queryByText("Ainda não há documentos publicados."),
    ).toBeNull();
    expect(
      screen.getByRole("link", { name: /O que é o GoDocs\?/ }).getAttribute("href"),
    ).toBe("/docs/o-que-e-o-godocs");
    const description = screen.getByText("Explicação inicial do sistema.");
    expect(description.textContent?.endsWith("...")).toBe(false);
    expect(description.textContent?.endsWith("…")).toBe(false);
    expect(
      description.closest(".home-section__pages")?.getAttribute("data-count"),
    ).toBe("1");
    expect(screen.queryByText("Abrir seção")).toBeNull();
  });

  it("limita os cards e permite expandir e recolher a seção", async () => {
    const user = userEvent.setup();
    const items = Array.from({ length: 7 }, (_, index) => ({
      id: `pagina-${index + 1}`,
      label: `Página ${index + 1}`,
      description: `Descrição ${index + 1}.`,
      href: `/docs/pagina-${index + 1}`,
      children: [],
    }));

    render(
      <HomeIntro
        groups={[
          {
            id: "secao",
            title: "Seção real",
            description: "Conteúdo publicado.",
            order: 1,
            entryHref: items[0]?.href,
            items,
          },
        ]}
      />,
    );

    expect(screen.queryByText("Página 7")).toBeNull();
    const expand = screen.getByRole("button", { name: "Mostrar mais" });
    expect(expand.getAttribute("aria-expanded")).toBe("false");

    await user.click(expand);
    expect(screen.getByText("Página 7")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Mostrar menos" }).getAttribute(
        "aria-expanded",
      ),
    ).toBe("true");

    await user.click(screen.getByRole("button", { name: "Mostrar menos" }));
    expect(screen.queryByText("Página 7")).toBeNull();
  });

  it("renderiza as seções e os quatro cards publicados com a mesma estrutura", async () => {
    const docs = await loadDocumentsFromDirectory(
      path.join(process.cwd(), "content", "docs"),
    );

    render(<HomeIntro groups={buildNavigation(docs)} />);

    const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(sectionHeadings.map((heading) => heading.textContent)).toEqual([
      "Comece por aqui",
      "Funcionalidades",
    ]);
    expect(
      screen.getByText("Conheça os principais recursos disponíveis no GoDocs."),
    ).toBeTruthy();

    const expectedCards = [
      ["O que é o GoDocs?", "/docs/o-que-e-o-godocs"],
      ["Primeiro Acesso", "/docs/primeiro-acesso"],
      ["Visão Geral", "/docs/funcionalidades/visao-geral"],
      ["Busca Inteligente", "/docs/funcionalidades/busca-inteligente"],
    ] as const;

    expectedCards.forEach(([name, href]) => {
      const card = screen.getByRole("link", { name: new RegExp(name) });
      expect(card.getAttribute("href")).toBe(href);
      expect(card.className).toBe("home-page-card");
      expect(card.querySelector("svg")).toBeTruthy();
      expect(card.querySelector(".home-page-card__arrow")).toBeTruthy();
    });

    const sections = document.querySelectorAll(".home-section");
    expect(sections).toHaveLength(2);
    sections.forEach((section) => {
      expect(section.querySelector(".home-section__heading")).toBeTruthy();
      expect(
        section.querySelector(".home-section__pages")?.getAttribute(
          "data-count",
        ),
      ).toBe("2");
    });
  });
});
