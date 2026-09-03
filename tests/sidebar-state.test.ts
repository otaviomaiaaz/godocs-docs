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

  it("reutiliza a árvore real no rail e no preview sem persistência externa", async () => {
    const sidebar = await readProjectFile(
      "components",
      "docs",
      "docs-sidebar.tsx",
    );

    expect(sidebar.match(/<NavigationTree/g)).toHaveLength(1);
    expect(sidebar).toContain("compact={isCompact}");
    expect(sidebar).toContain("onNavigate={closePreview}");
    expect(sidebar).toContain(
      'data-preview={isPreviewOpen ? "open" : "closed"}',
    );
    expect(sidebar).toContain("showIcons");
    expect(sidebar).toContain("const HOVER_INTENT_DELAY = 110");
    expect(sidebar).toContain("const COMPACT_CONTENT_DELAY = 110");
    expect(sidebar).toContain("schedulePreviewOpen()");
    expect(sidebar).toContain("cancelScheduledOpen()");
    expect(sidebar).toContain("scheduleCompactTransition()");
    expect(sidebar).not.toMatch(/localStorage|sessionStorage|setExpanded/);
  });
});
