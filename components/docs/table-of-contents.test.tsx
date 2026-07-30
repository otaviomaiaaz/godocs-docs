// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TableOfContents } from "@/components/docs/table-of-contents";

describe("TableOfContents", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 1_000,
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("mantém a última seção ativa quando a página chega ao fim", async () => {
    render(
      <>
        <h2 id="secao-inicial">Seção inicial</h2>
        <h2 id="secao-final">Seção final</h2>
        <TableOfContents
          headings={[
            { depth: 2, id: "secao-inicial", title: "Seção inicial" },
            { depth: 2, id: "secao-final", title: "Seção final" },
          ]}
        />
      </>,
    );

    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: "Seção final" }).getAttribute(
          "aria-current",
        ),
      ).toBe("location"),
    );
  });

  it("renderiza h3 aninhado, identifica o h2 pai e fecha o índice mobile", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <h2 id="funcionalidades-da-pasta">Funcionalidades da pasta</h2>
        <h3 id="adicionar-documento">Adicionar documento</h3>
        <TableOfContents
          headings={[
            {
              depth: 2,
              id: "funcionalidades-da-pasta",
              title: "Funcionalidades da pasta",
            },
            {
              depth: 3,
              id: "adicionar-documento",
              title: "Adicionar documento",
            },
          ]}
          variant="mobile"
        />
      </>,
    );

    const details = container.querySelector("details");
    expect(details).toBeTruthy();
    await user.click(screen.getByText("Nesta página"));
    expect(details?.open).toBe(true);

    const nestedLink = screen.getByRole("link", {
      name: "Adicionar documento",
    });
    expect(nestedLink.closest("li")?.classList.contains("is-nested")).toBe(
      true,
    );
    await user.click(nestedLink);

    expect(details?.open).toBe(false);
    expect(
      screen
        .getByRole("link", { name: "Funcionalidades da pasta" })
        .closest("li")
        ?.getAttribute("data-active-parent"),
    ).toBe("true");
  });
});
