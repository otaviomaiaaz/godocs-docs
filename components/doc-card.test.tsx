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
      link.querySelector(".doc-card__title-row > .doc-card__indicator--arrow"),
    ).toBeTruthy();
    expect(
      link.querySelector(".doc-card__body > p")?.textContent,
    ).toBe("Explicação inicial.");
  });

  it("renderiza o estado futuro sem link ou foco interativo", () => {
    const { container } = render(
      <DocCard
        description="Conteúdo em preparação."
        icon={BookOpen}
        status="comingSoon"
        title="Próximo guia"
      />,
    );

    const card = container.querySelector(".doc-card");

    expect(screen.queryByRole("link")).toBeNull();
    expect(card?.tagName).toBe("ARTICLE");
    expect(card?.getAttribute("aria-label")).toBe("Próximo guia. Em breve");
    expect(card?.getAttribute("tabindex")).toBeNull();
    expect(screen.getByText("Em breve")).toBeTruthy();
    expect(
      card?.querySelector(
        ".doc-card__title-row > .doc-card__indicator--badge",
      ),
    ).toBeTruthy();
    expect(card?.querySelector(".doc-card__body > p")?.textContent).toBe(
      "Conteúdo em preparação.",
    );
  });
});
