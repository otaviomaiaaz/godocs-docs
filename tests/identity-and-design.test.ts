import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import OpenGraphImage from "@/app/opengraph-image";
import { GET as getShareImage } from "@/app/share-image/[...slug]/route";

const projectRoot = process.cwd();
const excludedDirectories = new Set([".git", ".next", "node_modules"]);
const searchableExtensions = new Set([
  ".css",
  ".json",
  ".md",
  ".svg",
  ".ts",
  ".tsx",
]);

async function findSearchableFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        return excludedDirectories.has(entry.name)
          ? []
          : findSearchableFiles(path.join(directory, entry.name));
      }

      return searchableExtensions.has(path.extname(entry.name))
        ? [path.join(directory, entry.name)]
        : [];
    }),
  );

  return nestedFiles.flat();
}

describe("identidade e prevenção de regressões visuais", () => {
  it("não mantém a alegação institucional nem referências ao recorte defeituoso", async () => {
    const files = await findSearchableFiles(projectRoot);
    const officialClaim = ["documentação", "oficial"].join(" ");
    const defectiveAsset = ["godocs", "logo.png"].join("-");
    const violations: string[] = [];

    for (const file of files) {
      const contents = await readFile(file, "utf8");
      const normalized = contents.toLocaleLowerCase("pt-BR");

      if (
        normalized.includes(officialClaim) ||
        normalized.includes(defectiveAsset)
      ) {
        violations.push(path.relative(projectRoot, file));
      }
    }

    expect(violations).toEqual([]);
  });

  it("mantém duas variantes vetoriais transparentes da marca", async () => {
    const variants = [
      "godocs-wordmark-on-dark.svg",
      "godocs-wordmark-on-light.svg",
    ];

    for (const variant of variants) {
      const contents = await readFile(
        path.join(projectRoot, "public", "brand", variant),
        "utf8",
      );

      expect(contents).toContain("<svg");
      expect(contents).toContain("<path");
      expect(contents).not.toContain("<image");
      expect(contents).not.toContain("<rect");
      expect(contents.toLocaleLowerCase("pt-BR")).not.toContain("cursor");
    }
  });

  it("centraliza a escala tipográfica e a aplica aos papéis principais", async () => {
    const css = await readFile(
      path.join(projectRoot, "app", "globals.css"),
      "utf8",
    );

    for (const token of [
      "--type-home-title",
      "--type-article-title",
      "--type-lead",
      "--type-h2",
      "--type-h3",
      "--type-body",
      "--type-card-title",
      "--type-card-description",
      "--type-navigation",
    ]) {
      expect(css).toContain(`${token}:`);
      expect(css).toContain(`var(${token})`);
    }

    expect(css).toContain("--content-width: 70ch");
    expect(css).not.toContain("-webkit-line-clamp");
  });
});

describe("imagens sociais", () => {
  it("gera a imagem da home com o novo ativo vetorial", async () => {
    const response = await OpenGraphImage();
    const body = await response.arrayBuffer();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/png");
    expect(body.byteLength).toBeGreaterThan(1_000);
  });

  it("gera imagem somente para artigo real", async () => {
    const realResponse = await getShareImage(new Request("http://localhost"), {
      params: Promise.resolve({ slug: ["o-que-e-o-godocs"] }),
    });
    const missingResponse = await getShareImage(
      new Request("http://localhost"),
      {
        params: Promise.resolve({ slug: ["pagina-inexistente"] }),
      },
    );

    expect(realResponse.status).toBe(200);
    expect(realResponse.headers.get("content-type")).toContain("image/png");
    expect((await realResponse.arrayBuffer()).byteLength).toBeGreaterThan(
      1_000,
    );
    expect(missingResponse.status).toBe(404);
  });
});
