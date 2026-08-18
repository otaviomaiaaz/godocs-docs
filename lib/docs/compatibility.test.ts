import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  anchorCompatibilityManifest,
  resolveCompatibleAnchor,
  validateAnchorCompatibilityManifest,
  type AnchorCompatibilityEntry,
} from "@/lib/docs/compatibility";
import { createSearchIndex } from "@/lib/docs/search";
import { loadPublishedDocumentsFromDirectory } from "@/lib/docs/source";

const contentDirectory = path.join(process.cwd(), "content", "docs");

describe("compatibilidade de anchors", () => {
  it("mantém as 79 origens aprovadas com destinos publicados e válidos", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);

    expect(anchorCompatibilityManifest).toHaveLength(79);
    expect(
      anchorCompatibilityManifest.filter(
        (entry) => entry.from.slug === "funcionalidades/documentos",
      ),
    ).toHaveLength(30);
    expect(
      anchorCompatibilityManifest.filter(
        (entry) => entry.from.slug === "funcionalidades/workflows",
      ),
    ).toHaveLength(49);
    expect(validateAnchorCompatibilityManifest(docs)).toEqual([]);
  });

  it("resolve alias entre páginas sem alterar o manifesto público", () => {
    const fixture: readonly AnchorCompatibilityEntry[] = [
      {
        from: { slug: "antiga", fragment: "passo" },
        to: { slug: "nova", fragment: "procedimento" },
      },
    ];

    expect(resolveCompatibleAnchor("antiga", "passo", fixture)).toEqual({
      slug: "nova",
      fragment: "procedimento",
    });
    expect(resolveCompatibleAnchor("antiga", "typo", fixture)).toBeUndefined();
  });

  it("preserva alias histórico sem exigir o heading antigo na página de origem", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const source = docs.find(
      (doc) => doc.slug === "funcionalidades/documentos",
    );
    const target = docs.find(
      (doc) => doc.slug === "funcionalidades/workflows",
    );
    const historicalFragment = "criando-uma-nova-pasta";
    const canonicalFragment = "como-um-workflow-funciona";

    expect(source).toBeDefined();
    expect(target).toBeDefined();

    const migratedSource = {
      ...source!,
      sections: source!.sections.filter(
        (section) => section.id !== historicalFragment,
      ),
    };
    const fixture: readonly AnchorCompatibilityEntry[] = [
      {
        from: { slug: migratedSource.slug, fragment: historicalFragment },
        to: { slug: target!.slug, fragment: canonicalFragment },
      },
    ];

    expect(
      migratedSource.sections.some(
        (section) => section.id === historicalFragment,
      ),
    ).toBe(false);
    expect(
      resolveCompatibleAnchor(migratedSource.slug, historicalFragment, fixture),
    ).toEqual({ slug: target!.slug, fragment: canonicalFragment });
    expect(
      validateAnchorCompatibilityManifest([migratedSource, target!], fixture),
    ).toEqual([]);
  });

  it("não transforma aliases em entradas independentes da busca", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const index = createSearchIndex(docs);
    const canonicalHrefs = new Set(index.entries.map((entry) => entry.href));

    expect(canonicalHrefs.size).toBe(index.entries.length);
    expect(
      index.entries.some((entry) =>
        anchorCompatibilityManifest.some(
          (alias) =>
            alias.from.fragment !== alias.to.fragment &&
            entry.href.endsWith(`#${alias.from.fragment}`),
        ),
      ),
    ).toBe(false);
  });

  it("rejeita manifesto malformado e destino inexistente", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const issues = validateAnchorCompatibilityManifest(docs, [
      {
        from: { slug: "/url-invalida/", fragment: "" },
        to: { slug: "destino-inexistente", fragment: "fragmento" },
      },
    ]);

    expect(issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("origem inválida"),
        expect.stringContaining("URL de destino não está publicada"),
      ]),
    );
  });
});
