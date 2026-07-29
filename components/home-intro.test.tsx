// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFile } from "node:fs/promises";
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

  it("renderiza os cards publicados, as seis funcionalidades na ordem e a FAQ vazia", async () => {
    const docs = await loadDocumentsFromDirectory(
      path.join(process.cwd(), "content", "docs"),
    );

    render(<HomeIntro groups={buildNavigation(docs)} />);

    const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(sectionHeadings.map((heading) => heading.textContent)).toEqual([
      "Comece por aqui",
      "Funcionalidades",
      "Perguntas frequentes",
    ]);
    expect(
      screen.getByText("Conheça os principais recursos disponíveis no GoDocs."),
    ).toBeTruthy();

    const expectedCards = [
      [
        "O que é o GoDocs?",
        "Explicação inicial do sistema.",
        "/docs/o-que-e-o-godocs",
      ],
      [
        "Primeiro Acesso",
        "Crie sua conta e acesse o GoDocs.",
        "/docs/primeiro-acesso",
      ],
      [
        "Visão Geral",
        "Acompanhe os principais indicadores do GoDocs.",
        "/docs/funcionalidades/visao-geral",
      ],
      [
        "Busca Inteligente",
        "Encontre documentos com busca semântica e filtros.",
        "/docs/funcionalidades/busca-inteligente",
      ],
      [
        "Documentos",
        "Organize e consulte seus documentos.",
        "/docs/funcionalidades/documentos",
      ],
      [
        "Favoritos",
        "Acesse rapidamente seus documentos favoritos.",
        "/docs/funcionalidades/favoritos",
      ],
      [
        "Workflows",
        "Acompanhe processos e fluxos de trabalho.",
        "/docs/funcionalidades/workflows",
      ],
      [
        "Relatórios",
        "Consulte indicadores e informações consolidadas.",
        "/docs/funcionalidades/relatorios",
      ],
    ] as const;

    expectedCards.forEach(([name, description, href]) => {
      const card = screen.getByRole("link", { name: new RegExp(name) });
      expect(card.getAttribute("href")).toBe(href);
      expect(card.classList.contains("doc-card--active")).toBe(true);
      expect(card.getAttribute("data-status")).toBe("active");
      expect(card.querySelector(".doc-card__icon svg")).toBeTruthy();
      expect(card.querySelector(".doc-card__body p")?.textContent).toBe(
        description,
      );
      expect(
        card.querySelector(".doc-card__indicator--arrow"),
      ).toBeTruthy();
    });

    const features = screen.getByRole("region", { name: "Funcionalidades" });
    const featureCards = Array.from(
      features.querySelectorAll(".doc-card"),
    );
    expect(
      featureCards.map((card) => card.querySelector("h3")?.textContent),
    ).toEqual([
      "Visão Geral",
      "Busca Inteligente",
      "Documentos",
      "Favoritos",
      "Workflows",
      "Relatórios",
    ]);
    expect(featureCards).toHaveLength(6);
    expect(within(features).getAllByRole("link")).toHaveLength(6);
    expect(within(features).queryByText("Em breve")).toBeNull();
    expect(
      featureCards.map(
        (card) => card.querySelector(".doc-card__body p")?.textContent,
      ),
    ).toEqual([
      "Acompanhe os principais indicadores do GoDocs.",
      "Encontre documentos com busca semântica e filtros.",
      "Organize e consulte seus documentos.",
      "Acesse rapidamente seus documentos favoritos.",
      "Acompanhe processos e fluxos de trabalho.",
      "Consulte indicadores e informações consolidadas.",
    ]);

    featureCards.forEach((card) => {
      expect(card.tagName).toBe("A");
      expect(card.getAttribute("data-status")).toBe("active");
      expect(card.querySelector(".doc-card__indicator--arrow")).toBeTruthy();
      expect(card.querySelector(".doc-card__indicator--badge")).toBeNull();
    });

    const faq = screen.getByRole("region", { name: "Perguntas frequentes" });
    expect(
      within(faq).getByText(
        "Encontre respostas rápidas para as dúvidas mais comuns sobre o GoDocs.",
      ),
    ).toBeTruthy();
    expect(
      within(faq).getByText(
        "Conteúdo em preparação. As perguntas frequentes serão adicionadas em breve.",
      ),
    ).toBeTruthy();
    expect(within(faq).queryAllByRole("button")).toHaveLength(0);
    expect(faq.querySelectorAll("details")).toHaveLength(0);

    const documentationNavigation = screen.getByRole("navigation", {
      name: "Seções da documentação",
    });
    expect(
      within(documentationNavigation).queryByText("Perguntas frequentes"),
    ).toBeNull();

    const sections = document.querySelectorAll(".home-section");
    expect(sections).toHaveLength(3);
    expect(
      screen
        .getByRole("region", { name: "Comece por aqui" })
        .querySelector(".home-section__pages")
        ?.getAttribute("data-count"),
    ).toBe("2");
    expect(
      features
        .querySelector(".home-section__pages")
        ?.getAttribute("data-count"),
    ).toBe("6");
  });

  it("mantém três colunas no desktop, duas no tablet e uma no mobile", async () => {
    const css = await readFile(
      path.join(process.cwd(), "app", "globals.css"),
      "utf8",
    );
    const tabletStart = css.indexOf("@media (max-width: 1023px)");
    const mobileStart = css.indexOf("@media (max-width: 767px)");
    const narrowMobileStart = css.indexOf("@media (max-width: 340px)");
    const reducedMotionStart = css.indexOf(
      "@media (prefers-reduced-motion: reduce)",
    );
    const tabletCss = css.slice(tabletStart, mobileStart);
    const mobileCss = css.slice(mobileStart, narrowMobileStart);
    const reducedMotionCss = css.slice(reducedMotionStart);

    expect(css).toMatch(
      /\.home-section__pages--features\s*\{\s*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/,
    );
    expect(tabletCss).toMatch(
      /\.home-section__pages\s*\{\s*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
    );
    expect(mobileCss).toMatch(
      /\.home-section__pages,\s*\.home-section__pages\[data-count\]\s*\{[^}]*grid-template-columns:\s*1fr;/,
    );
    expect(reducedMotionCss).toContain(
      "animation-duration: 0.01ms !important",
    );
    expect(reducedMotionCss).toContain(
      "transition-duration: 0.01ms !important",
    );
    expect(reducedMotionCss).toMatch(
      /\.home__content,\s*\.home-section,\s*\.home-card-item,\s*\.home-faq__empty\s*\{[^}]*animation:\s*none !important;/,
    );
    expect(reducedMotionCss).toMatch(
      /\.doc-card--active:hover,\s*\.doc-card--active:focus-visible,\s*\.doc-card--active:active\s*\{[^}]*transform:\s*none;/,
    );
  });
});
