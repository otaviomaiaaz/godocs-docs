// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MobileNavDrawer } from "@/components/docs/mobile-nav-drawer";
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
      title: "Configuração",
      description: "Ajustes disponíveis.",
      href: "/docs/configuracao",
      section: "Guias",
      keywords: ["preferências"],
      content: "Defina as opções necessárias.",
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

    expect(document.getElementById("site-shell")?.hasAttribute("inert")).toBe(
      true,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const combobox = await screen.findByRole("combobox");
    expect(
      (await axe.run(screen.getByRole("dialog", { name: "Pesquisar na documentação" })))
        .violations,
    ).toEqual([]);
    expect(combobox.getAttribute("aria-autocomplete")).toBe("list");
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    expect(combobox.getAttribute("aria-controls")).toBeTruthy();

    await user.type(combobox, "configuracao");
    const option = await screen.findByRole("option", { name: /Configuração/ });
    expect(combobox.getAttribute("aria-activedescendant")).toBe(option.id);
    expect(screen.getByRole("status").textContent).toContain("1 resultado");

    await user.keyboard("{Enter}");
    expect(push).toHaveBeenCalledWith("/docs/configuracao");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(document.getElementById("site-shell")?.hasAttribute("inert")).toBe(
      false,
    );

    await user.click(trigger);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fecha a busca com Escape, contém Tab e restaura o foco", async () => {
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
    combobox.focus();
    await user.tab();
    expect(document.activeElement).toBe(closeButton);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(combobox);

    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(screen.queryByRole("dialog")).toBeNull();
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
    expect(document.getElementById("site-shell")?.hasAttribute("inert")).toBe(
      true,
    );
    expect((await axe.run(dialog)).violations).toEqual([]);

    fireEvent.keyDown(document, { key: "Escape" });
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
