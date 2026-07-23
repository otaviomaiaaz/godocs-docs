// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HomeIntro } from "@/components/home-intro";

afterEach(cleanup);

describe("home orientada ao conteúdo", () => {
  it("preserva exatamente o estado vazio sem cards", () => {
    render(<HomeIntro groups={[]} />);

    expect(
      screen.getByText("Novos conteúdos serão publicados progressivamente."),
    ).toBeTruthy();
    expect(screen.queryByRole("navigation", { name: "Seções da documentação" })).toBeNull();
  });

  it("remove a mensagem progressiva e usa apenas páginas reais da coleção", () => {
    render(
      <HomeIntro
        groups={[
          {
            id: "guias",
            title: "Guias",
            description: "Orientações publicadas.",
            order: 1,
            entryHref: "/docs/guias",
            items: [
              {
                id: "guias",
                label: "Comece pelos guias",
                description: "Página de entrada dos guias.",
                href: "/docs/guias",
                children: [],
              },
            ],
          },
        ]}
      />,
    );

    expect(
      screen.queryByText("Novos conteúdos serão publicados progressivamente."),
    ).toBeNull();
    expect(
      screen.getByRole("link", { name: /Comece pelos guias/ }).getAttribute("href"),
    ).toBe("/docs/guias");
  });
});
