// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";

import { HubNavigation, type HubNavigationItem } from "@/components/docs/hub-navigation";
import { getAllDocs } from "@/lib/docs/source";

const items: HubNavigationItem[] = [
  {
    description: "Crie uma estrutura para guardar seus arquivos.",
    href: "/docs/funcionalidades/documentos/pastas",
    slug: "funcionalidades/documentos/pastas",
    title: "Organizar pastas e subpastas",
  },
  {
    description: "Adicione arquivos à seção Documentos.",
    href: "/docs/funcionalidades/documentos/adicionar-documentos",
    slug: "funcionalidades/documentos/adicionar-documentos",
    title: "Adicionar documentos",
  },
  {
    description: "Encontre documentos por busca, filtros e metadados.",
    href: "/docs/funcionalidades/documentos/localizar-documentos",
    slug: "funcionalidades/documentos/localizar-documentos",
    title: "Localizar, filtrar e consultar metadados",
  },
  {
    description: "Abra, consulte informações e gerencie arquivos enviados.",
    href: "/docs/funcionalidades/documentos/gerenciar-documentos",
    slug: "funcionalidades/documentos/gerenciar-documentos",
    title: "Visualizar e gerenciar documentos",
  },
  {
    description: "Consulte o histórico de ações realizadas nos documentos.",
    href: "/docs/funcionalidades/documentos/logs-e-acoes",
    slug: "funcionalidades/documentos/logs-e-acoes",
    title: "Logs e ações",
  },
];

const workflowItems: HubNavigationItem[] = [
  ["cards-kanban-e-lista", "Cards, Kanban e Lista"],
  ["automacoes", "Automações"],
  ["criar-e-configurar", "Criar e configurar"],
  ["fases-e-transicoes", "Fases e transições"],
  ["formularios-e-campos", "Formulários e campos"],
  ["membros-e-papeis", "Membros e papéis"],
  ["formulario-publico", "Formulário público e acompanhamento"],
].map(([segment, title]) => ({
  description: `Descrição de ${title}.`,
  href: `/docs/funcionalidades/workflows/${segment}`,
  slug: `funcionalidades/workflows/${segment}`,
  title,
}));

describe("HubNavigation", () => {
  afterEach(cleanup);

  it("renders the five canonical child destinations as whole-card links in order", () => {
    render(<HubNavigation items={items} title="Explore Documentos" />);

    expect(screen.getByRole("heading", { name: "Explore Documentos", level: 2 })).toBeTruthy();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
    expect(links.map((link) => link.textContent?.replace(/\s+/g, " ").trim())).toEqual(
      items.map((item) => `${item.title}${item.description}`),
    );
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      items.map((item) => item.href),
    );
    expect(screen.getByRole("list").getAttribute("class")).toBe("hub-navigation__list");
    expect(screen.getAllByRole("listitem").at(-1)?.getAttribute("class")).toContain(
      "hub-navigation__item--wide",
    );
  });

  it("renders the seven canonical Workflows destinations in order", () => {
    render(<HubNavigation items={workflowItems} title="Explore Workflows" />);

    expect(screen.getByRole("heading", { name: "Explore Workflows", level: 2 })).toBeTruthy();
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(
      workflowItems.map((item) => item.href),
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getAllByRole("listitem").at(-1)?.getAttribute("class")).toContain(
      "hub-navigation__item--wide",
    );
  });

  it("keeps an even Funcionalidades directory equivalent, without a wide card", async () => {
    const docs = await getAllDocs();
    const functionalityItems = docs
      .filter(
        (doc) =>
          doc.segments.length === 2 && doc.segments[0] === "funcionalidades",
      )
      .sort((first, second) => first.metadata.order - second.metadata.order)
      .map((doc) => ({
        description: doc.metadata.cardDescription ?? doc.metadata.description,
        href: doc.href,
        slug: doc.slug,
        title: doc.metadata.navTitle ?? doc.metadata.title,
      }));

    const { container } = render(
      <HubNavigation
        items={functionalityItems}
        title="Explore Funcionalidades"
        variant="functionalities"
      />,
    );

    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(
      screen
        .getAllByRole("listitem")
        .some((item) => item.classList.contains("hub-navigation__item--wide")),
    ).toBe(false);
    expect(screen.getByRole("region").className).toContain(
      "hub-navigation--functionalities",
    );
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll(".hub-navigation__arrow")).toHaveLength(6);
    expect(
      [...container.querySelectorAll(".hub-navigation__arrow")].every(
        (arrow) => arrow.getAttribute("aria-hidden") === "true",
      ),
    ).toBe(true);

    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });
});
