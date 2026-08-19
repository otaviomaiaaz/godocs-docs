// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import DocPage from "./page";

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
});
