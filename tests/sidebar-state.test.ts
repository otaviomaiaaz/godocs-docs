import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

async function readProjectFile(...segments: string[]) {
  return readFile(path.join(projectRoot, ...segments), "utf8");
}

describe("contrato de estado da sidebar documental", () => {
  it("mantém o bootstrap de tema e remove o bootstrap persistente da sidebar", async () => {
    const rootLayout = await readProjectFile("app", "layout.tsx");

    expect(rootLayout).toContain('id="theme-initialization"');
    expect(rootLayout).toContain('src="/theme-initialization.js"');
    expect(rootLayout).not.toMatch(/sidebar-initialization|SIDEBAR_INITIALIZATION/);
  });

  it("hospeda o estado no menor layout estável compartilhado por /docs", async () => {
    const docsLayout = await readProjectFile("app", "docs", "layout.tsx");
    const stateProvider = await readProjectFile(
      "components",
      "docs",
      "docs-sidebar-state.tsx",
    );

    expect(docsLayout).toContain("<DocsSidebarStateProvider>");
    expect(stateProvider).toContain(
      'useState<DocsSidebarState>("expanded")',
    );
    expect(stateProvider).toContain("dataset.docsSidebar = sidebarState");
    expect(stateProvider).not.toMatch(
      /localStorage|sessionStorage|document\.cookie|URLSearchParams/,
    );
  });

  it("reutiliza a árvore real no overlay e não expande ao navegar", async () => {
    const sidebar = await readProjectFile(
      "components",
      "docs",
      "docs-sidebar.tsx",
    );

    expect(sidebar.match(/<NavigationTree/g)).toHaveLength(1);
    expect(sidebar).toContain("onNavigate={closeGhostMenu}");
    expect(sidebar).toContain(
      "inert={!isExpanded && !isGhostMenuOpen ? true : undefined}",
    );
    expect(sidebar).toContain(
      'data-ghost-menu={isGhostMenuOpen ? "open" : "closed"}',
    );
    expect(sidebar).not.toMatch(/localStorage|sessionStorage|setExpanded/);
  });
});
