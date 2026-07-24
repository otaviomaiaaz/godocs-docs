// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Brand } from "@/components/brand";
import { MobileNavDrawer } from "@/components/docs/mobile-nav-drawer";
import { DocsHeader } from "@/components/docs-header";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  createSearchEntry,
  type SearchIndex,
} from "@/lib/docs/search";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push }),
}));

const searchIndex: SearchIndex = {
  version: 1,
  entries: [
    createSearchEntry({
      title: "O que é o GoDocs?",
      description:
        "Conheça a plataforma e entenda como ela centraliza documentos, organiza informações e apoia os processos da organização.",
      href: "/docs/o-que-e-o-godocs",
      section: "Comece por aqui",
      keywords: ["GoDocs", "GED", "documentos"],
      content: "Gestão Eletrônica de Documentos e Processos.",
    }),
    createSearchEntry({
      title: "Pesquisa",
      description: "Localize informações.",
      href: "/docs/pesquisa",
      content: "Consulte os documentos publicados.",
    }),
  ],
};

function installMatchMedia(matches = true) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function renderInSiteShell(component: React.ReactNode) {
  const siteShell = document.createElement("div");
  siteShell.id = "site-shell";
  document.body.append(siteShell);
  return render(component, { container: siteShell });
}

beforeEach(() => {
  push.mockReset();
  window.localStorage.clear();
  installMatchMedia();
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute("open");
    },
  });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("data-theme");
});

describe("fluxos interativos", () => {
  it("carrega a busca apenas ao abrir e expõe o padrão combobox/listbox", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => searchIndex,
    }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderInSiteShell(<SearchDialog />);
    expect(fetchMock).not.toHaveBeenCalled();

    const trigger = screen.getByRole("button", {
      name: "Pesquisar na documentação",
    });
    await user.click(trigger);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const combobox = await screen.findByRole("combobox");
    const dialog = screen.getByRole("dialog", {
      name: "Pesquisar na documentação",
    });
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(document.getElementById("site-shell")?.hasAttribute("inert")).toBe(
      false,
    );
    expect((await axe.run(dialog)).violations).toEqual([]);
    expect(combobox.getAttribute("aria-autocomplete")).toBe("list");
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    expect(combobox.getAttribute("aria-controls")).toBeTruthy();

    expect(screen.queryByText("PESQUISA LOCAL")).toBeNull();
    expect(screen.queryByText("navegar")).toBeNull();

    await user.type(combobox, "GoDocs");
    const option = await screen.findByRole("option", { name: /O que é o GoDocs/ });
    expect(combobox.getAttribute("aria-activedescendant")).toBe(option.id);
    expect(screen.getByRole("status").textContent).toContain("1 resultado");

    await user.keyboard("{Enter}");
    expect(push).toHaveBeenCalledWith("/docs/o-que-e-o-godocs");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(screen.queryByRole("button", { name: "Fechar pesquisa" })).toBeNull();

    await user.click(trigger);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("abre com Ctrl+K e navega pelos resultados com setas", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => searchIndex,
      })),
    );
    const user = userEvent.setup();

    renderInSiteShell(<SearchDialog />);
    await user.keyboard("{Control>}k{/Control}");

    const combobox = await screen.findByRole("combobox");
    await user.type(combobox, "documentos");
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(2);

    await user.keyboard("{ArrowDown}");
    expect(combobox.getAttribute("aria-activedescendant")).toBe(options[1]?.id);
    await user.keyboard("{ArrowUp}");
    expect(combobox.getAttribute("aria-activedescendant")).toBe(options[0]?.id);
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledWith("/docs/o-que-e-o-godocs");
  });

  it("mantém compactos os estados de carregamento e índice vazio", async () => {
    let resolveFetch: ((value: {
      ok: true;
      json: () => Promise<SearchIndex>;
    }) => void) | undefined;
    const fetchPromise = new Promise<{
      ok: true;
      json: () => Promise<SearchIndex>;
    }>((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal("fetch", vi.fn(() => fetchPromise));
    const user = userEvent.setup();

    renderInSiteShell(<SearchDialog />);
    await user.click(
      screen.getByRole("button", { name: "Pesquisar na documentação" }),
    );
    expect(screen.getByText("Carregando índice de pesquisa...")).toBeTruthy();

    resolveFetch?.({
      ok: true,
      json: async () => ({ version: 1, entries: [] }),
    });
    expect(
      await screen.findByText("Nenhum conteúdo disponível para pesquisa."),
    ).toBeTruthy();
  });

  it("fecha a busca pelo cancel nativo, não deixa X órfão e restaura o foco", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => searchIndex,
      })),
    );
    const user = userEvent.setup();

    renderInSiteShell(<SearchDialog />);
    const trigger = screen.getByRole("button", {
      name: "Pesquisar na documentação",
    });
    await user.click(trigger);
    await screen.findByRole("combobox");

    const closeButton = screen.getByRole("button", { name: "Fechar pesquisa" });
    const combobox = screen.getByRole("combobox");
    const dialog = screen.getByRole("dialog", {
      name: "Pesquisar na documentação",
    });
    expect(document.activeElement).toBe(combobox);
    expect(dialog.contains(closeButton)).toBe(true);

    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByRole("button", { name: "Fechar pesquisa" })).toBeNull();
  });

  it("permite recuperar uma falha no carregamento do índice", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => searchIndex,
      });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderInSiteShell(<SearchDialog />);
    await user.click(
      screen.getByRole("button", { name: "Pesquisar na documentação" }),
    );
    const retry = await screen.findByRole("button", {
      name: "Tentar novamente",
    });
    await user.click(retry);

    await screen.findByText("Digite um termo para pesquisar.");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("mantém o drawer modal, fecha por teclado e não introduz violações axe", async () => {
    const user = userEvent.setup();
    renderInSiteShell(
      <MobileNavDrawer
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
                label: "Guias",
                href: "/docs/guias",
                children: [],
              },
            ],
          },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Abrir navegação da documentação",
    });
    expect(trigger.getAttribute("aria-controls")).toBeTruthy();
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Navegação" });
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(document.getElementById("site-shell")?.hasAttribute("inert")).toBe(
      false,
    );
    expect((await axe.run(dialog)).violations).toEqual([]);

    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(document.getElementById("site-shell")?.hasAttribute("inert")).toBe(
      false,
    );
  });

  it("persiste e comunica a troca de tema", async () => {
    const user = userEvent.setup();
    renderInSiteShell(<ThemeToggle />);

    const toggle = await screen.findByRole("button", {
      name: "Ativar tema claro",
    });
    await user.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("godocs-theme")).toBe("light");
    expect(toggle.getAttribute("aria-label")).toBe("Ativar tema escuro");
  });
});

describe("marca", () => {
  it("usa as variantes PNG oficiais sem wordmark textual", () => {
    render(<Brand />);

    const brand = screen.getByRole("link", { name: "GoDocs — página inicial" });
    expect(brand.getAttribute("href")).toBe("/");
    const sources = Array.from(brand.querySelectorAll("img")).map((image) =>
      image.getAttribute("src"),
    );
    expect(sources).toHaveLength(2);
    expect(sources.some((source) => source?.includes("godocs-logo-official-dark.png"))).toBe(
      true,
    );
    expect(
      sources.some((source) => source?.includes("godocs-logo-official-light.png")),
    ).toBe(true);
    const defectiveAssetName = ["godocs", "logo.png"].join("-");
    expect(sources.some((source) => source?.includes(defectiveAssetName))).toBe(
      false,
    );
    expect(screen.queryByText("Documentação")).toBeNull();
    expect(screen.queryByText("Docs")).toBeNull();
  });

  it("preserva busca, tema e menu móvel condicional no header", async () => {
    renderInSiteShell(
      <DocsHeader
        navigation={[
          {
            id: "comece-por-aqui",
            title: "Comece por aqui",
            description: "Conteúdos introdutórios.",
            order: 10,
            entryHref: "/docs/o-que-e-o-godocs",
            items: [
              {
                id: "o-que-e-o-godocs",
                label: "O que é o GoDocs?",
                href: "/docs/o-que-e-o-godocs",
                children: [],
              },
            ],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Pesquisar na documentação" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Abrir navegação da documentação",
      }),
    ).toBeTruthy();
    expect(
      await screen.findByRole("button", { name: "Ativar tema claro" }),
    ).toBeTruthy();
  });
});
