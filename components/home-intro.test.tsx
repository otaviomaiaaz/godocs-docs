// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { HomeIntro } from "@/components/home-intro";

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
                description:
                  "Conheça a plataforma e entenda como ela centraliza documentos, organiza informações e apoia os processos da organização.",
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
    const description = screen.getByText(
      "Conheça a plataforma e entenda como ela centraliza documentos, organiza informações e apoia os processos da organização.",
    );
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
});
