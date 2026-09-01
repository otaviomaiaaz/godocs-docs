// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookOpen } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DocCard } from "@/components/doc-card";

afterEach(cleanup);

describe("DocCard", () => {
  it("ativa o link com Enter e Space", async () => {
    const user = userEvent.setup();

    render(
      <DocCard
        description="Explicação inicial."
        href="/docs/inicio"
        icon={BookOpen}
        status="active"
        title="Início"
      />,
    );

    const link = screen.getByRole("link", { name: /Início/ });
    const directChildren = Array.from(link.children);
    const activationSpy = vi.fn((event: Event) => event.preventDefault());
    link.addEventListener("click", activationSpy);
    link.focus();

    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(activationSpy).toHaveBeenCalledTimes(2);
    expect(directChildren).toHaveLength(2);
    expect(directChildren[0]?.classList.contains("doc-card__icon")).toBe(true);
    expect(directChildren[1]?.classList.contains("doc-card__body")).toBe(true);
    expect(
      link.querySelector(".doc-card__actions > .doc-card__indicator--arrow"),
    ).toBeTruthy();
    expect(
      link.querySelector(".doc-card__body > p")?.textContent,
    ).toBe("Explicação inicial.");
  });

  it("mantém o estado futuro como link completo com selo e seta", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DocCard
        description="Conteúdo em preparação."
        href="/docs/proximo-guia"
        icon={BookOpen}
        status="comingSoon"
        title="Próximo guia"
        variant="feature"
      />,
    );

    const card = container.querySelector(".doc-card");
    const link = screen.getByRole("link", { name: /Próximo guia.*Em breve/ });
    const activationSpy = vi.fn((event: Event) => event.preventDefault());
    link.addEventListener("click", activationSpy);
    link.focus();

    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(activationSpy).toHaveBeenCalledTimes(2);
    expect(card?.tagName).toBe("A");
    expect(card?.getAttribute("href")).toBe("/docs/proximo-guia");
    expect(card?.getAttribute("data-status")).toBe("comingSoon");
    expect(screen.getByText("Em breve")).toBeTruthy();
    expect(screen.queryByText("Acessar")).toBeNull();
    expect(
      card?.querySelector(
        ".doc-card__actions > .doc-card__indicator--badge",
      ),
    ).toBeTruthy();
    expect(card?.querySelector(".doc-card__body > p")?.textContent).toBe(
      "Conteúdo em preparação.",
    );
    expect(
      card?.querySelector(".doc-card__indicator--arrow"),
    ).toBeTruthy();
  });

  it("mantém a ação visual de recurso dentro do mesmo link ativo", () => {
    const { container } = render(
      <DocCard
        description="Explicação do recurso."
        href="/docs/recurso"
        icon={BookOpen}
        status="active"
        title="Recurso"
        variant="feature"
      />,
    );

    const card = container.querySelector(".doc-card--feature");

    expect(card?.tagName).toBe("A");
    expect(card?.querySelector(".doc-card__access")?.textContent).toContain(
      "Acessar",
    );
    expect(
      card?.querySelector(".doc-card__access-underline"),
    ).toBeTruthy();
    expect(
      card?.querySelector(".doc-card__access .doc-card__indicator--arrow"),
    ).toBeTruthy();
  });
});
