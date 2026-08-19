// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Brand } from "@/components/brand";
import { MobileNavDrawer } from "@/components/docs/mobile-nav-drawer";
import { DocsHeader } from "@/components/docs-header";
import { NavigationTree } from "@/components/navigation-tree";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  createSearchEntry,
  type SearchIndex,
} from "@/lib/docs/search";

const push = vi.fn();
const pathname = { value: "/" };

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
  useRouter: () => ({ push }),
}));

const searchIndex: SearchIndex = {
  version: 2,
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

function expectComboboxPopupState(
  combobox: HTMLElement,
  expanded: boolean,
) {
  const controls = combobox.getAttribute("aria-controls");

  expect(combobox.getAttribute("aria-expanded")).toBe(String(expanded));

  if (expanded) {
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls ?? "")).toBeTruthy();
  } else {
    expect(controls).toBeNull();
  }
}

beforeEach(() => {
  push.mockReset();
  pathname.value = "/";
  window.localStorage.clear();
  installMatchMedia();
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0,
    writable: true,
  });
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
    expect(dialog.getAttribute("data-query-empty")).toBe("true");
    expect(document.getElementById("site-shell")?.hasAttribute("inert")).toBe(
      false,
    );
    expect((await axe.run(dialog)).violations).toEqual([]);
    expect(combobox.getAttribute("aria-autocomplete")).toBe("list");
    await screen.findByText("Comece com uma página sugerida");
    expectComboboxPopupState(combobox, false);

    expect(screen.queryByText("PESQUISA LOCAL")).toBeNull();
    expect(screen.queryByText("navegar")).toBeNull();

    await user.type(combobox, "GoDocs");
    expect(dialog.getAttribute("data-query-empty")).toBe("false");
    const option = await screen.findByRole("option", { name: /O que é o GoDocs/ });
    expectComboboxPopupState(combobox, true);
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

  it("abre com Cmd+K", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => searchIndex,
      })),
    );
    const user = userEvent.setup();

    renderInSiteShell(<SearchDialog />);
    await user.keyboard("{Meta>}k{/Meta}");

    expect(await screen.findByRole("combobox")).toBeTruthy();
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
    const combobox = await screen.findByRole("combobox");
    expect(screen.getByText("Carregando índice de pesquisa...")).toBeTruthy();
    expectComboboxPopupState(combobox, false);

    resolveFetch?.({
      ok: true,
      json: async () => ({ version: 2, entries: [] }),
    });
    expect(
      await screen.findByText("Nenhum conteúdo disponível para pesquisa."),
    ).toBeTruthy();
    expectComboboxPopupState(combobox, false);
  });

  it("mantém o popup do combobox fechado para consulta curta e sem resultados", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => searchIndex,
      })),
    );
    const user = userEvent.setup();

    renderInSiteShell(<SearchDialog />);
    await user.click(
      screen.getByRole("button", { name: "Pesquisar na documentação" }),
    );

    const combobox = await screen.findByRole("combobox");
    await screen.findByText("Comece com uma página sugerida");
    expectComboboxPopupState(combobox, false);

    await user.type(combobox, "a");
    expect(
      await screen.findByText("Digite ao menos dois caracteres para pesquisar."),
    ).toBeTruthy();
    expectComboboxPopupState(combobox, false);

    await user.clear(combobox);
    await user.type(combobox, "inexistente");
    expect(
      await screen.findByText('Nenhum resultado encontrado para “inexistente”.'),
    ).toBeTruthy();
    expectComboboxPopupState(combobox, false);
  });

  it("foca o campo de forma estável e preserva a navegação nativa por Tab", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => searchIndex,
      })),
    );
    const user = userEvent.setup();

    renderInSiteShell(
      <StrictMode>
        <SearchDialog />
      </StrictMode>,
    );
    const trigger = screen.getByRole("button", {
      name: "Pesquisar na documentação",
    });
    await user.click(trigger);

    const combobox = await screen.findByRole("combobox");
    expect(document.activeElement).toBe(combobox);

    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Fechar pesquisa" }),
    );
  });

  it("fecha a busca com Escape e restaura o foco sem deixar X órfão", async () => {
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
    expect(document.activeElement).toBe(await screen.findByRole("combobox"));

    await user.keyboard("{Escape}");

    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByRole("button", { name: "Fechar pesquisa" })).toBeNull();
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

    fireEvent.keyDown(document, { key: "Escape" });
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
    expectComboboxPopupState(screen.getByRole("combobox"), false);
    retry.focus();
    expect(document.activeElement).toBe(retry);
    await user.keyboard("{Enter}");

    await screen.findByText("Comece com uma página sugerida");
    expectComboboxPopupState(screen.getByRole("combobox"), false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("expande e recolhe ramos da navegação por teclado", async () => {
    const user = userEvent.setup();

    renderInSiteShell(
      <nav aria-label="Navegação da documentação">
        <NavigationTree
          groups={[
            {
              id: "funcionalidades",
              title: "Funcionalidades",
              description: "Funcionalidades publicadas.",
              order: 1,
              items: [
                {
                  id: "funcionalidades",
                  label: "Funcionalidades",
                  href: "/docs/funcionalidades",
                  pageType: "hub",
                  children: [
                    {
                      id: "funcionalidades/documentos",
                      label: "Documentos",
                      href: "/docs/funcionalidades/documentos",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ]}
        />
      </nav>,
    );

    const expand = screen.getByRole("button", {
      name: "Expandir Funcionalidades",
    });
    const hubLink = screen.getByRole("link", { name: "Funcionalidades" });
    expect(hubLink.getAttribute("href")).toBe("/docs/funcionalidades");
    expect(hubLink).not.toBe(expand);
    expect(expand.getAttribute("aria-expanded")).toBe("false");
    expand.focus();
    expect(document.activeElement).toBe(expand);

    await user.keyboard("{Enter}");
    expect(expand.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getByRole("link", { name: "Documentos" }),
    ).toBeTruthy();

    await user.keyboard(" ");
    expect(expand.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "Documentos" })).toBeNull();
  });

  it("respeita o recolhimento manual do ramo ativo até uma nova navegação", async () => {
    pathname.value = "/docs/funcionalidades/documentos";
    const user = userEvent.setup();
    const groups = [
      {
        id: "funcionalidades",
        title: "Funcionalidades",
        description: "Funcionalidades publicadas.",
        order: 1,
        items: [
          {
            id: "funcionalidades/documentos",
            label: "Documentos",
            href: "/docs/funcionalidades/documentos",
            pageType: "hub" as const,
            children: [
              {
                id: "funcionalidades/documentos/pastas",
                label: "Pastas",
                href: "/docs/funcionalidades/documentos/pastas",
                children: [],
              },
              {
                id: "funcionalidades/documentos/logs-e-acoes",
                label: "Logs e ações",
                href: "/docs/funcionalidades/documentos/logs-e-acoes",
                children: [],
              },
            ],
          },
        ],
      },
    ];
    const renderTree = () => (
      <nav aria-label="Navegação da documentação">
        <NavigationTree groups={groups} />
      </nav>
    );
    const view = renderInSiteShell(renderTree());

    const toggle = screen.getByRole("button", { name: "Recolher Documentos" });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getByRole("link", { name: "Documentos" }).getAttribute("aria-current"),
    ).toBe("page");

    await user.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "Pastas" })).toBeNull();
    expect(
      screen.getByRole("link", { name: "Documentos" }).getAttribute("aria-current"),
    ).toBe("page");

    view.rerender(renderTree());
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    pathname.value = "/docs/funcionalidades/documentos/logs-e-acoes";
    view.rerender(renderTree());

    await waitFor(() =>
      expect(
        screen
          .getByRole("button", { name: "Recolher Documentos" })
          .getAttribute("aria-expanded"),
      ).toBe("true"),
    );
    expect(
      screen.getByRole("link", { name: "Logs e ações" }).getAttribute("aria-current"),
    ).toBe("page");
  });

  it("torna o hub explícito da seção navegável e marca a página atual", () => {
    pathname.value = "/docs/funcionalidades";

    renderInSiteShell(
      <nav aria-label="Navegação da documentação">
        <NavigationTree
          groups={[
            {
              id: "funcionalidades",
              title: "Funcionalidades",
              description: "Funcionalidades publicadas.",
              order: 1,
              entrySlug: "funcionalidades",
              entryHref: "/docs/funcionalidades",
              entryPageType: "hub",
              items: [
                {
                  id: "funcionalidades/visao-geral",
                  label: "Visão Geral",
                  href: "/docs/funcionalidades/visao-geral",
                  pageType: "reference",
                  children: [],
                },
              ],
            },
          ]}
        />
      </nav>,
    );

    expect(
      screen
        .getByRole("link", { name: "Funcionalidades" })
        .getAttribute("aria-current"),
    ).toBe("page");
    expect(
      screen.getByRole("link", { name: "Visão Geral" }).hasAttribute(
        "aria-current",
      ),
    ).toBe(false);
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
    expect(screen.getByRole("list", { name: "Guias" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Guias" })).toBeNull();

    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(document.getElementById("site-shell")?.hasAttribute("inert")).toBe(
      false,
    );
  });

  it("fecha o drawer ao entrar no breakpoint desktop", async () => {
    let viewportListener:
      | ((event: MediaQueryListEvent) => void)
      | undefined;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(
          (
            eventName: string,
            listener: (event: MediaQueryListEvent) => void,
          ) => {
            if (
              query === "(min-width: 1024px)" &&
              eventName === "change"
            ) {
              viewportListener = listener;
            }
          },
        ),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
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

    await user.click(
      screen.getByRole("button", {
        name: "Abrir navegação da documentação",
      }),
    );
    expect(screen.getByRole("dialog", { name: "Navegação" })).toBeTruthy();
    expect(viewportListener).toBeTypeOf("function");

    await act(async () => {
      viewportListener?.({ matches: true } as MediaQueryListEvent);
    });

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Navegação" }),
      ).toBeNull(),
    );
    expect(
      screen.queryByRole("button", { name: "Fechar navegação" }),
    ).toBeNull();
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
    const images = Array.from(brand.querySelectorAll("img"));
    const sources = images.map((image) => image.getAttribute("src"));
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
    expect(sources.every((source) => !source?.includes("/_next/image"))).toBe(
      true,
    );
    expect(
      images.every(
        (image) =>
          image.getAttribute("width") === "150" &&
          image.getAttribute("height") === "58",
      ),
    ).toBe(true);
    expect(screen.queryByText("Documentação")).toBeNull();
    expect(screen.queryByText("Docs")).toBeNull();
  });

  it("mantém o header da home reduzido a marca e tema", async () => {
    renderInSiteShell(
      <DocsHeader
        navigation={[
          {
            id: "comece-por-aqui",
            title: "Comece por aqui",
            description: "Conteúdos introdutórios.",
            order: 10,
            entryHref: "/docs/o-que-e-o-godocs",
            items: [],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("link", { name: "GoDocs — página inicial" }),
    ).toBeTruthy();
    expect(
      await screen.findByRole("button", { name: "Ativar tema claro" }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Pesquisar na documentação" }),
    ).toBeNull();
    expect(
      screen.queryByRole("button", {
        name: "Abrir navegação da documentação",
      }),
    ).toBeNull();

    const header = document.querySelector(".docs-header");
    expect(header?.getAttribute("data-scrolled")).toBeNull();

    window.scrollY = 24;
    fireEvent.scroll(window);
    await waitFor(() =>
      expect(header?.getAttribute("data-scrolled")).toBe("true"),
    );
  });

  it("preserva busca, tema e menu móvel condicional no header interno", async () => {
    pathname.value = "/docs/o-que-e-o-godocs";
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
