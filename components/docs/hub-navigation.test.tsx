// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HubNavigation, type HubNavigationItem } from "@/components/docs/hub-navigation";

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
});
