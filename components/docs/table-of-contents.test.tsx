// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TableOfContents } from "@/components/docs/table-of-contents";
import type { DocHeading } from "@/lib/docs/schema";

const longHeadings: DocHeading[] = [
  { depth: 2, id: "como-funciona", title: "Como funciona" },
  { depth: 2, id: "visao-geral", title: "Visão geral" },
  { depth: 2, id: "utilizando", title: "Utilizando um workflow" },
  { depth: 3, id: "fluxo", title: "Fluxo" },
  { depth: 3, id: "kanban", title: "Kanban" },
  { depth: 3, id: "lista", title: "Lista" },
  { depth: 2, id: "automacoes", title: "Automações" },
  { depth: 3, id: "criando-automacao", title: "Criando uma automação" },
  { depth: 2, id: "criando-workflow", title: "Criando um workflow" },
  { depth: 2, id: "configuracoes", title: "Configurações do workflow" },
  { depth: 3, id: "geral", title: "Geral" },
  { depth: 3, id: "fases", title: "Fases" },
  { depth: 3, id: "formulario-inicial", title: "Formulário inicial" },
  { depth: 3, id: "campos-das-fases", title: "Campos das fases" },
  { depth: 3, id: "membros", title: "Membros" },
  { depth: 3, id: "formulario-publico", title: "Formulário público" },
  { depth: 3, id: "integracao-via-api", title: "Integração via API" },
  { depth: 2, id: "duvidas", title: "Dúvidas e situações comuns" },
  { depth: 3, id: "duvida-1", title: "Dúvida 1" },
  { depth: 3, id: "duvida-2", title: "Dúvida 2" },
  { depth: 3, id: "duvida-3", title: "Dúvida 3" },
  { depth: 3, id: "duvida-4", title: "Dúvida 4" },
  { depth: 3, id: "duvida-5", title: "Dúvida 5" },
  { depth: 3, id: "duvida-6", title: "Dúvida 6" },
];

function setScrollState({
  innerHeight,
  scrollHeight,
  scrollY,
}: {
  innerHeight: number;
  scrollHeight: number;
  scrollY: number;
}) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
}

function renderArticleHeadings(headings: DocHeading[]) {
  return headings.map((heading) =>
    heading.depth === 2 ? (
      <h2 id={heading.id} key={heading.id} style={{ scrollMarginTop: "92px" }}>
        {heading.title}
      </h2>
    ) : (
      <h3 id={heading.id} key={heading.id} style={{ scrollMarginTop: "92px" }}>
        {heading.title}
      </h3>
    ),
  );
}

function mockHeadingPositions(positions: Map<string, number>) {
  return vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function getBoundingClientRect(this: HTMLElement) {
      const top = positions.get(this.id) ?? 0;

      return {
        bottom: top + 30,
        height: 30,
        left: 0,
        right: 100,
        toJSON: () => ({}),
        top,
        width: 100,
        x: 0,
        y: top,
      };
    });
}

describe("TableOfContents", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    setScrollState({ innerHeight: 500, scrollHeight: 1_000, scrollY: 500 });
  });

  afterEach(() => {
    cleanup();
    document.documentElement.style.scrollPaddingTop = "";
    window.history.replaceState(null, "", "/");
    vi.restoreAllMocks();
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

  it("reduz a carga inicial de TOCs longos sem remover destinos", async () => {
    setScrollState({ innerHeight: 844, scrollHeight: 5_000, scrollY: 0 });
    const user = userEvent.setup();
    const { container } = render(
      <TableOfContents headings={longHeadings} variant="mobile" />,
    );

    await user.click(screen.getByText("Nesta página"));

    expect(screen.getAllByRole("link")).toHaveLength(7);
    expect(container.querySelectorAll("a[data-toc-id]")).toHaveLength(24);

    const toggle = screen.getByRole("button", {
      name: "Mostrar subseções de Utilizando um workflow",
    });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    await user.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    await user.keyboard(" ");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await user.keyboard("{Enter}");
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getByRole("link", { name: "Kanban" }).getAttribute("href"),
    ).toBe("#kanban");
    expect(screen.getAllByRole("link")).toHaveLength(10);
    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("mantém Kanban ativo após o clique usando os offsets reais da âncora", async () => {
    setScrollState({ innerHeight: 844, scrollHeight: 10_000, scrollY: 500 });
    document.documentElement.style.scrollPaddingTop = "92px";
    const positions = new Map(
      longHeadings.map((heading, index) => [heading.id, index < 4 ? 100 : 500]),
    );
    positions.set("kanban", 184.5);
    mockHeadingPositions(positions);
    const user = userEvent.setup();
    const { container } = render(
      <>
        {renderArticleHeadings(longHeadings)}
        <TableOfContents headings={longHeadings} variant="mobile" />
      </>,
    );

    await user.click(screen.getByText("Nesta página"));
    expect(
      screen
        .getByRole("button", {
          name: "Ocultar subseções de Utilizando um workflow",
        })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    await user.click(screen.getByRole("link", { name: "Kanban" }));
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() =>
      expect(
        container
          .querySelector('a[data-toc-id="kanban"]')
          ?.getAttribute("aria-current"),
      ).toBe("location"),
    );
    expect(container.querySelector("details")?.open).toBe(false);
    expect(window.location.hash).toBe("#kanban");
    expect(
      container
        .querySelector('a[data-toc-id="fluxo"]')
        ?.getAttribute("aria-current"),
    ).toBeNull();
  });

  it("revela o grupo ativo em link direto e acompanha o scroll manual", async () => {
    setScrollState({ innerHeight: 844, scrollHeight: 10_000, scrollY: 500 });
    document.documentElement.style.scrollPaddingTop = "92px";
    window.history.replaceState(null, "", "/#kanban");
    const positions = new Map(
      longHeadings.map((heading, index) => [heading.id, index < 4 ? 100 : 500]),
    );
    positions.set("kanban", 184.5);
    mockHeadingPositions(positions);
    const user = userEvent.setup();
    render(
      <>
        {renderArticleHeadings(longHeadings)}
        <TableOfContents headings={longHeadings} variant="mobile" />
      </>,
    );

    await user.click(screen.getByText("Nesta página"));

    const workflowToggle = await screen.findByRole("button", {
      name: "Ocultar subseções de Utilizando um workflow",
    });
    expect(workflowToggle.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getByRole("link", { name: "Kanban" }).getAttribute("aria-current"),
    ).toBe("location");

    for (const heading of longHeadings) {
      positions.set(heading.id, 500);
    }
    for (const heading of longHeadings.slice(0, 11)) {
      positions.set(heading.id, 100);
    }
    positions.set("geral", 184.5);
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: "Geral" }).getAttribute(
          "aria-current",
        ),
      ).toBe("location"),
    );
    expect(
      screen
        .getByRole("button", {
          name: "Ocultar subseções de Configurações do workflow",
        })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });
});
