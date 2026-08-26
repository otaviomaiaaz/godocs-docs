// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import DocPage, { getHubNavigationItems } from "./page";
import { getAllDocs } from "@/lib/docs/source";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  usePathname: () => "/docs/funcionalidades/workflows",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: () => null,
}));

describe("DocPage", () => {
  afterEach(cleanup);

  it("renders the canonical Workflows hub navigation on the published route", async () => {
    render(
      await DocPage({
        params: Promise.resolve({ slug: ["funcionalidades", "workflows"] }),
      }),
    );

    const navigation = screen
      .getByRole("heading", { level: 2, name: "Explore Workflows" })
      .closest("section");

    expect(navigation).toBeTruthy();
    expect(within(navigation as HTMLElement).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "/docs/funcionalidades/workflows/cards-kanban-e-lista",
      "/docs/funcionalidades/workflows/automacoes",
      "/docs/funcionalidades/workflows/criar-e-configurar",
      "/docs/funcionalidades/workflows/fases-e-transicoes",
      "/docs/funcionalidades/workflows/formularios-e-campos",
      "/docs/funcionalidades/workflows/membros-e-papeis",
      "/docs/funcionalidades/workflows/formulario-publico",
    ]);
  });

  it("derives the six direct published Funcionalidades destinations in canonical order", async () => {
    const docs = await getAllDocs();
    const functionalityHub = docs.find((doc) => doc.slug === "funcionalidades");
    expect(functionalityHub).toBeTruthy();
    if (!functionalityHub) throw new Error("Hub Funcionalidades não encontrado");

    const directChildren = docs
      .filter(
        (candidate) =>
          candidate.segments.length === functionalityHub.segments.length + 1 &&
          candidate.segments.every(
            (segment, index) =>
              index === functionalityHub.segments.length ||
              segment === functionalityHub.segments[index],
          ),
      )
      .sort((first, second) => first.metadata.order - second.metadata.order);

    render(
      await DocPage({
        params: Promise.resolve({ slug: ["funcionalidades"] }),
      }),
    );

    const navigation = screen
      .getByRole("heading", { level: 2, name: "Explore Funcionalidades" })
      .closest("section");

    expect(navigation).toBeTruthy();
    const links = within(navigation as HTMLElement).getAllByRole("link");
    expect(links).toHaveLength(6);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      directChildren.map((child) => child.href),
    );
    expect(links.map((link) => link.textContent?.replace(/\s+/g, " ").trim())).toEqual(
      getHubNavigationItems(directChildren).map(
        (item) => `${item.title}${item.description}`,
      ),
    );
    expect(within(navigation as HTMLElement).queryByRole("link", { name: /configurações/i })).toBeNull();
    expect(
      within(navigation as HTMLElement)
        .getAllByRole("listitem")
        .some((item) => item.classList.contains("hub-navigation__item--wide")),
    ).toBe(false);
    expect(functionalityHub.source).not.toContain(
      "/docs/funcionalidades/visao-geral",
    );
  });

  it("uses the normalized navigation and card-description fallbacks", async () => {
    const docs = await getAllDocs();
    const overview = docs.find(
      (doc) => doc.slug === "funcionalidades/visao-geral",
    );
    const publicForm = docs.find(
      (doc) => doc.slug === "funcionalidades/workflows/formulario-publico",
    );
    expect(overview).toBeTruthy();
    expect(publicForm).toBeTruthy();
    if (!overview || !publicForm) {
      throw new Error("Metadados publicados de fallback não encontrados");
    }

    const [preferredDescription] = getHubNavigationItems([overview]);
    const [preferredTitle] = getHubNavigationItems([publicForm]);
    const [fallback] = getHubNavigationItems([
      {
        ...overview,
        metadata: {
          ...overview.metadata,
          cardDescription: undefined,
          navTitle: undefined,
        },
      },
    ]);

    expect(preferredDescription).toMatchObject({
      description: overview.metadata.cardDescription,
      href: overview.href,
      title: overview.metadata.navTitle,
    });
    expect(preferredTitle).toMatchObject({
      title: publicForm.metadata.navTitle,
    });
    expect(fallback).toMatchObject({
      description: overview.metadata.description,
      href: overview.href,
      title: overview.metadata.title,
    });
  });
});
