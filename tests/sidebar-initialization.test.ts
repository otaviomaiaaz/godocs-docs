import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it, vi } from "vitest";

import { SIDEBAR_INITIALIZATION_SCRIPT } from "@/lib/sidebar-initialization";

const projectRoot = process.cwd();

async function runInitialization(options?: {
  storedValue?: string | null;
  storageError?: boolean;
}) {
  const dataset = { theme: "dark" } as Record<string, string>;
  const getItem = vi.fn(() => {
    if (options?.storageError) throw new Error("storage indisponível");
    return options?.storedValue ?? null;
  });

  vm.runInNewContext(SIDEBAR_INITIALIZATION_SCRIPT, {
    document: { documentElement: { dataset } },
    localStorage: { getItem },
  });

  return { dataset, getItem };
}

describe("bootstrap pré-pintura da sidebar", () => {
  it("é renderizado inline no head sem depender de arquivo externo", async () => {
    const layout = await readFile(
      path.join(projectRoot, "app", "layout.tsx"),
      "utf8",
    );

    expect(layout).toContain(
      "dangerouslySetInnerHTML={{ __html: SIDEBAR_INITIALIZATION_SCRIPT }}",
    );
    expect(layout).toContain('id="sidebar-initialization"');
    expect(layout).not.toContain('src="/sidebar-initialization.js"');
    expect(layout).not.toContain(
      'id="sidebar-initialization"\n          src=',
    );
  });

  it.each([
    ["sem chave", null, "expanded"],
    ["expanded salvo", "expanded", "expanded"],
    ["collapsed salvo", "collapsed", "collapsed"],
    ["valor inválido", "unexpected", "expanded"],
  ])("resolve %s para %s", async (_label, storedValue, expected) => {
    const { dataset, getItem } = await runInitialization({ storedValue });

    expect(getItem).toHaveBeenCalledOnce();
    expect(getItem).toHaveBeenCalledWith("godocs-docs-sidebar");
    expect(dataset.docsSidebar).toBe(expected);
    expect(dataset.theme).toBe("dark");
    expect(Object.keys(dataset).sort()).toEqual(["docsSidebar", "theme"]);
  });

  it("usa expanded quando localStorage lança erro", async () => {
    const { dataset, getItem } = await runInitialization({
      storageError: true,
    });

    expect(getItem).toHaveBeenCalledOnce();
    expect(dataset.docsSidebar).toBe("expanded");
    expect(dataset.theme).toBe("dark");
  });

  it("permanece idempotente e controla somente a sidebar", async () => {
    const dataset = { theme: "light" } as Record<string, string>;
    const getItem = vi.fn(() => "collapsed");
    const context = {
      document: { documentElement: { dataset } },
      localStorage: { getItem },
    };

    vm.runInNewContext(SIDEBAR_INITIALIZATION_SCRIPT, context);
    vm.runInNewContext(SIDEBAR_INITIALIZATION_SCRIPT, context);

    expect(dataset).toEqual({ docsSidebar: "collapsed", theme: "light" });
    expect(getItem).toHaveBeenCalledTimes(2);
    expect(SIDEBAR_INITIALIZATION_SCRIPT).not.toMatch(
      /godocs-theme|drawer|branch/i,
    );
  });
});
