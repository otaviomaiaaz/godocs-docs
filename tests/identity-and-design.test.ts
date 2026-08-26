import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { inflateSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import OpenGraphImage from "@/app/opengraph-image";
import { GET as getShareImage } from "@/app/share-image/[...slug]/route";

const projectRoot = process.cwd();
const excludedDirectories = new Set([".git", ".next", "node_modules"]);
const publicCopyDirectories = ["app", "components", "content/docs"];
const publicCopyFiles = ["lib/site.ts", "lib/social-image.tsx"];
const searchableExtensions = new Set([
  ".css",
  ".json",
  ".md",
  ".mdx",
  ".svg",
  ".ts",
  ".tsx",
]);

type LogoManifest = {
  sourcePackage: string;
  sourcePackageSha256: string;
  headerDark: {
    file: string;
    sha256: string;
    width: number;
    height: number;
  };
  headerLight: {
    file: string;
    sha256: string;
    width: number;
    height: number;
    unchangedThroughColumn: number;
  };
  socialDark: {
    file: string;
    sha256: string;
    width: number;
    height: number;
  };
};

type DecodedPng = {
  width: number;
  height: number;
  pixels: Buffer;
};

function sha256(contents: Buffer): string {
  return createHash("sha256").update(contents).digest("hex");
}

function paethPredictor(left: number, up: number, upLeft: number): number {
  const estimate = left + up - upLeft;
  const distanceLeft = Math.abs(estimate - left);
  const distanceUp = Math.abs(estimate - up);
  const distanceUpLeft = Math.abs(estimate - upLeft);

  if (distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft) return left;
  if (distanceUp <= distanceUpLeft) return up;
  return upLeft;
}

function decodeRgbaPng(contents: Buffer): DecodedPng {
  expect(contents.subarray(0, 8).toString("hex")).toBe(
    "89504e470d0a1a0a",
  );

  let offset = 8;
  let width = 0;
  let height = 0;
  const compressedChunks: Buffer[] = [];

  while (offset < contents.length) {
    const chunkLength = contents.readUInt32BE(offset);
    const chunkType = contents.toString("ascii", offset + 4, offset + 8);
    const chunkData = contents.subarray(offset + 8, offset + 8 + chunkLength);

    if (chunkType === "IHDR") {
      width = chunkData.readUInt32BE(0);
      height = chunkData.readUInt32BE(4);
      expect(chunkData[8]).toBe(8);
      expect(chunkData[9]).toBe(6);
      expect(chunkData[12]).toBe(0);
    } else if (chunkType === "IDAT") {
      compressedChunks.push(chunkData);
    } else if (chunkType === "IEND") {
      break;
    }

    offset += chunkLength + 12;
  }

  const encoded = inflateSync(Buffer.concat(compressedChunks));
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const pixels = Buffer.alloc(height * stride);
  let encodedOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = encoded[encodedOffset];
    encodedOffset += 1;

    for (let x = 0; x < stride; x += 1) {
      const raw = encoded[encodedOffset] ?? 0;
      encodedOffset += 1;
      const destination = y * stride + x;
      const left =
        x >= bytesPerPixel ? (pixels[destination - bytesPerPixel] ?? 0) : 0;
      const up = y > 0 ? (pixels[destination - stride] ?? 0) : 0;
      const upLeft =
        y > 0 && x >= bytesPerPixel
          ? (pixels[destination - stride - bytesPerPixel] ?? 0)
          : 0;
      const predictor =
        filter === 0
          ? 0
          : filter === 1
            ? left
            : filter === 2
              ? up
              : filter === 3
                ? Math.floor((left + up) / 2)
                : paethPredictor(left, up, upLeft);

      pixels[destination] = (raw + predictor) & 0xff;
    }
  }

  return { width, height, pixels };
}

function pixelAt(image: DecodedPng, x: number, y: number) {
  const offset = (y * image.width + x) * 4;
  return image.pixels.subarray(offset, offset + 4);
}

function cssRuleBlock(css: string, selector: string): string {
  const selectorStart = css.indexOf(`${selector} {`);
  expect(selectorStart).toBeGreaterThanOrEqual(0);
  const blockStart = css.indexOf("{", selectorStart);
  const blockEnd = css.indexOf("}", blockStart);
  return css.slice(blockStart + 1, blockEnd);
}

function cssProperty(css: string, selector: string, property: string): string {
  const block = cssRuleBlock(css, selector);
  const match = block.match(
    new RegExp(`(?:^|\\n)\\s*${property.replaceAll("-", "\\-")}\\s*:\\s*([^;]+);`),
  );
  expect(match).not.toBeNull();
  return match?.[1]?.trim() ?? "";
}

function resolveCssColor(css: string, selector: string, property: string): string {
  const value = cssProperty(css, selector, property);
  const reference = value.match(/^var\((--[^)]+)\)$/);
  return reference?.[1]
    ? resolveCssColor(css, selector, reference[1])
    : value.toLowerCase();
}

function resolveComponentColor(
  css: string,
  themeSelector: string,
  componentSelector: string,
  property: string,
): string {
  const value = cssProperty(css, componentSelector, property);
  const reference = value.match(/^var\((--[^)]+)\)$/);
  return reference?.[1]
    ? resolveCssColor(css, themeSelector, reference[1])
    : value.toLowerCase();
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const linear = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return (
    0.2126 * (linear[0] ?? 0) +
    0.7152 * (linear[1] ?? 0) +
    0.0722 * (linear[2] ?? 0)
  );
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

async function findSearchableFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        return excludedDirectories.has(entry.name)
          ? []
          : findSearchableFiles(path.join(directory, entry.name));
      }

      return searchableExtensions.has(path.extname(entry.name)) &&
        !/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(entry.name)
        ? [path.join(directory, entry.name)]
        : [];
    }),
  );

  return nestedFiles.flat();
}

async function findPublicCopyFiles(): Promise<string[]> {
  const directoryFiles = await Promise.all(
    publicCopyDirectories.map((directory) =>
      findSearchableFiles(path.join(projectRoot, directory)),
    ),
  );

  return [
    ...directoryFiles.flat(),
    ...publicCopyFiles.map((file) => path.join(projectRoot, file)),
  ];
}

describe("identidade e prevenção de regressões visuais", () => {
  it("não mantém a alegação institucional nem referências ao recorte defeituoso", async () => {
    const files = await findPublicCopyFiles();
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

  it("restringe a proteção de identidade às superfícies de copy pública", async () => {
    const files = await findPublicCopyFiles();
    const relativeFiles = files.map((file) =>
      path.relative(projectRoot, file).split(path.sep).join("/"),
    );

    expect(relativeFiles).toEqual(
      expect.arrayContaining([
        "app/layout.tsx",
        "components/home-intro.tsx",
        "content/docs/o-que-e-o-godocs.mdx",
        "lib/site.ts",
        "lib/social-image.tsx",
      ]),
    );
    expect(
      relativeFiles.some((file) => file.startsWith("project-docs")),
    ).toBe(false);
    expect(
      relativeFiles.every(
        (file) =>
          publicCopyDirectories.some(
            (directory) => file === directory || file.startsWith(`${directory}/`),
          ) || publicCopyFiles.includes(file),
      ),
    ).toBe(true);
  });

  it("usa o raster oficial, preserva a mão e deriva apenas docs no tema claro", async () => {
    const manifest = JSON.parse(
      await readFile(
        path.join(
          projectRoot,
          "tests",
          "fixtures",
          "godocs-logo-reference-manifest.json",
        ),
        "utf8",
      ),
    ) as LogoManifest;
    const darkContents = await readFile(
      path.join(projectRoot, manifest.headerDark.file),
    );
    const lightContents = await readFile(
      path.join(projectRoot, manifest.headerLight.file),
    );
    const socialContents = await readFile(
      path.join(projectRoot, manifest.socialDark.file),
    );
    const dark = decodeRgbaPng(darkContents);
    const light = decodeRgbaPng(lightContents);
    const social = decodeRgbaPng(socialContents);

    expect(sha256(darkContents)).toBe(manifest.headerDark.sha256);
    expect(sha256(lightContents)).toBe(manifest.headerLight.sha256);
    expect(sha256(socialContents)).toBe(manifest.socialDark.sha256);
    expect([dark.width, dark.height]).toEqual([
      manifest.headerDark.width,
      manifest.headerDark.height,
    ]);
    expect([light.width, light.height]).toEqual([
      manifest.headerLight.width,
      manifest.headerLight.height,
    ]);
    expect([social.width, social.height]).toEqual([
      manifest.socialDark.width,
      manifest.socialDark.height,
    ]);
    expect(dark.width / dark.height).toBe(social.width / social.height);
    expect(pixelAt(dark, 0, 0)[3]).toBe(0);

    let officialOrange = 0;
    let lightOrange = 0;
    let handInterior = 0;
    let handOutline = 0;
    let handOverlap = 0;
    let darkDocsPixels = 0;
    let whiteDocsPixels = 0;

    for (let y = 0; y < dark.height; y += 1) {
      for (let x = 0; x < dark.width; x += 1) {
        const [darkRed, darkGreen, darkBlue, darkAlpha] = pixelAt(dark, x, y);
        const [lightRed, lightGreen, lightBlue, lightAlpha] = pixelAt(
          light,
          x,
          y,
        );

        if (
          darkRed === 255 &&
          darkGreen === 140 &&
          darkBlue === 66 &&
          darkAlpha > 0
        ) {
          officialOrange += 1;
        }
        if (
          lightRed === 255 &&
          lightGreen === 140 &&
          lightBlue === 66 &&
          lightAlpha > 0
        ) {
          lightOrange += 1;
        }

        if (x >= 35 && x <= 52) {
          if (
            darkRed === 26 &&
            darkGreen === 26 &&
            darkBlue === 26 &&
            darkAlpha > 0
          ) {
            handInterior += 1;
          }
          if (
            darkRed === darkGreen &&
            darkGreen === darkBlue &&
            darkRed >= 80 &&
            darkAlpha > 0
          ) {
            handOutline += 1;
          }
          if (
            darkRed === 255 &&
            darkGreen === 140 &&
            darkBlue === 66 &&
            darkAlpha > 0
          ) {
            handOverlap += 1;
          }
        }

        if (x > manifest.headerLight.unchangedThroughColumn) {
          if (
            lightRed === 26 &&
            lightGreen === 26 &&
            lightBlue === 26 &&
            lightAlpha === 255
          ) {
            darkDocsPixels += 1;
          }
          if (
            lightRed === 255 &&
            lightGreen === 255 &&
            lightBlue === 255 &&
            lightAlpha > 0
          ) {
            whiteDocsPixels += 1;
          }
        }
      }
    }

    for (let y = 0; y < dark.height; y += 1) {
      for (
        let x = 0;
        x <= manifest.headerLight.unchangedThroughColumn;
        x += 1
      ) {
        expect(pixelAt(light, x, y)).toEqual(pixelAt(dark, x, y));
      }
    }

    expect(officialOrange).toBeGreaterThan(400);
    expect(lightOrange).toBe(officialOrange);
    expect(handInterior).toBeGreaterThan(80);
    expect(handOutline).toBeGreaterThan(80);
    expect(handOverlap).toBeGreaterThan(100);
    expect(darkDocsPixels).toBeGreaterThan(700);
    expect(whiteDocsPixels).toBe(0);

    const packageCandidates = [
      path.join(projectRoot, manifest.sourcePackage),
      path.join(projectRoot, "..", manifest.sourcePackage),
    ];
    for (const candidate of packageCandidates) {
      try {
        const packageContents = await readFile(candidate);
        expect(sha256(packageContents)).toBe(manifest.sourcePackageSha256);
        break;
      } catch {
        // O pacote de origem é externo ao checkout; o manifesto preserva sua proveniência.
      }
    }
  });

  it("separa marca, acento operacional e estados em tokens semânticos", async () => {
    const [css, icon, layout] = await Promise.all([
      readFile(path.join(projectRoot, "app", "globals.css"), "utf8"),
      readFile(path.join(projectRoot, "app", "icon.svg"), "utf8"),
      readFile(path.join(projectRoot, "app", "layout.tsx"), "utf8"),
    ]);

    expect(css).toContain("--brand-logo: #ff8c42");
    expect(css).toContain("--accent-primary: #ff7600");
    expect(css).toContain("--accent-text: #a84b00");
    expect(css).toContain("--text-on-accent: #1a1a1a");
    expect(css).toContain("--background: #232222");
    expect(css).toContain("--surface: #2a2a2a");
    expect(css).toContain("--background: #efeeea");
    expect(css).toContain("--accent-subtle:");
    expect(css).toContain("--disabled-surface:");
    expect(css).not.toMatch(/--brand(?:-hover|-active|-text|-subtle|-border)?:/);
    expect(css).not.toMatch(/#ff7900|#ff963d|#b64c00/i);
    expect(icon).toContain('fill="#232222"');
    expect(icon).toContain('stroke="#FF7600"');
    expect(icon).not.toMatch(/#1b1b1b|#ff7900/i);
    expect(layout).toContain('color: "#EFEEEA"');
  });

  it("aplica o contrato de tokens do Bloco A sem recalibrar o tema escuro", async () => {
    const css = await readFile(
      path.join(projectRoot, "app", "globals.css"),
      "utf8",
    );
    const contracts = {
      ":root": {
        "--background": "#232222",
        "--surface": "#2a2a2a",
        "--surface-elevated": "#313237",
        "--surface-interactive": "#292929",
        "--surface-hover": "#313237",
        "--navigation-surface": "var(--background)",
        "--divider": "#3f3f3f",
        "--surface-border": "#4d4d4d",
        "--border-strong": "#737373",
        "--text-muted": "#a1a1a1",
      },
      'html[data-theme="light"]': {
        "--background": "#efeeea",
        "--surface": "#faf9f7",
        "--surface-elevated": "#ffffff",
        "--surface-interactive": "#e9e8e3",
        "--surface-hover": "#fff0e6",
        "--navigation-surface": "#e8e7e2",
        "--divider": "#c8c7c1",
        "--surface-border": "#b3b2ac",
        "--border-strong": "#7f807b",
        "--text-muted": "#666b70",
      },
    } as const;

    for (const [selector, tokens] of Object.entries(contracts)) {
      for (const [token, value] of Object.entries(tokens)) {
        expect(cssProperty(css, selector, token)).toBe(value);
      }

      expect(cssProperty(css, selector, "--border")).toBe(
        "var(--surface-border)",
      );
      expect(cssProperty(css, selector, "--control-border")).toBe(
        "var(--border-strong)",
      );
    }

    expect(cssProperty(css, ":root", "--radius-compact")).toBe("6px");
    expect(cssProperty(css, ":root", "--radius-sm")).toBe("8px");
    expect(cssProperty(css, ":root", "--radius-md")).toBe("12px");
    expect(cssProperty(css, ":root", "--radius-lg")).toBe("16px");
    expect(cssProperty(css, ":root", "--radius-xl")).toBe("20px");
    expect(css).toMatch(
      /\.search-trigger kbd,\s*\.search-field kbd\s*\{[^}]*border-radius:\s*var\(--radius-compact\)/,
    );
    expect(cssRuleBlock(css, ".docs-sidebar")).toContain(
      "background: var(--navigation-surface)",
    );
    expect(cssProperty(css, ":root", "--shadow-card-lift")).toBe(
      "0 8px 22px rgba(0, 0, 0, 0.1)",
    );
    expect(
      cssProperty(css, 'html[data-theme="light"]', "--shadow-card-lift"),
    ).toBe("0 8px 22px rgba(35, 25, 16, 0.05)");
    expect(css).not.toContain("--home-card-shadow");
    expect(css).not.toContain("--home-card-shadow-hover");
    expect(css).not.toContain("0 12px 28px");
  });

  it("distingue divisores, superfícies, controles e níveis de texto com contraste", async () => {
    const css = await readFile(
      path.join(projectRoot, "app", "globals.css"),
      "utf8",
    );

    for (const themeSelector of [":root", 'html[data-theme="light"]']) {
      const canvas = resolveCssColor(css, themeSelector, "--background");
      const surface = resolveCssColor(css, themeSelector, "--surface");
      const interactiveBackground = resolveCssColor(
        css,
        themeSelector,
        "--surface-interactive",
      );
      const controlBorder = resolveCssColor(
        css,
        themeSelector,
        "--control-border",
      );
      const secondary = resolveCssColor(
        css,
        themeSelector,
        "--text-secondary",
      );
      const muted = resolveCssColor(css, themeSelector, "--text-muted");
      const primary = resolveCssColor(css, themeSelector, "--text-primary");
      const accent = resolveCssColor(css, themeSelector, "--accent-text");

      expect(cssProperty(css, themeSelector, "--divider")).not.toBe(
        cssProperty(css, themeSelector, "--surface-border"),
      );
      expect(secondary).not.toBe(muted);
      expect(contrastRatio(controlBorder, surface)).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(controlBorder, interactiveBackground),
      ).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(primary, canvas)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(secondary, canvas)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(muted, canvas)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(accent, canvas)).toBeGreaterThanOrEqual(4.5);
    }

    expect(
      cssRuleBlock(
        css,
        'html[data-theme="light"] .shortcut-control',
      ),
    ).toContain("color: var(--text-secondary)");

    for (const selector of [
      ".icon-button",
      ".search-trigger",
      ".search-field",
      ".article-pagination__link",
    ]) {
      expect(cssRuleBlock(css, selector)).toContain("var(--control-border)");
    }

    expect(cssRuleBlock(css, ".doc-card")).toContain(
      "var(--surface-border)",
    );
    expect(cssRuleBlock(css, ".docs-header")).toContain("var(--divider)");
    expect(cssRuleBlock(css, ".search-dialog")).toContain(
      "var(--surface-border)",
    );
  });

  it("protege contrastes documentais e de interação nos dois temas", async () => {
    const css = await readFile(
      path.join(projectRoot, "app", "globals.css"),
      "utf8",
    );

    for (const themeSelector of [":root", 'html[data-theme="light"]']) {
      const stepForeground = resolveComponentColor(
        css,
        themeSelector,
        ".step::before",
        "color",
      );
      const stepBackground = resolveComponentColor(
        css,
        themeSelector,
        ".step::before",
        "background",
      );
      const hoverForeground = resolveComponentColor(
        css,
        themeSelector,
        ".icon-button:hover",
        "color",
      );
      const hoverBackground = resolveComponentColor(
        css,
        themeSelector,
        ".icon-button:hover",
        "background",
      );
      const focusRing = resolveCssColor(css, themeSelector, "--focus-ring");
      const surface = resolveCssColor(css, themeSelector, "--surface");

      expect(contrastRatio(stepForeground, stepBackground)).toBeGreaterThanOrEqual(
        4.5,
      );
      expect(
        contrastRatio(hoverForeground, hoverBackground),
      ).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(focusRing, surface)).toBeGreaterThanOrEqual(3);
    }
  });

  it("mantém os controles compactos latentes no alvo mínimo do projeto", async () => {
    const css = await readFile(
      path.join(projectRoot, "app", "globals.css"),
      "utf8",
    );

    expect(cssProperty(css, ".search-retry", "min-height")).toBe("44px");
    expect(cssProperty(css, ".navigation-tree__expand", "width")).toBe("44px");
    expect(cssProperty(css, ".navigation-tree__expand", "height")).toBe("44px");
    expect(
      cssProperty(css, ".code-block figcaption button", "min-height"),
    ).toBe("44px");
    expect(cssRuleBlock(css, ".search-retry:hover")).toContain(
      "var(--accent-hover)",
    );
    expect(cssRuleBlock(css, ".navigation-tree__expand:hover")).toContain(
      "var(--surface-hover)",
    );
    expect(cssRuleBlock(css, ".code-block figcaption button:hover")).toContain(
      "var(--surface-hover)",
    );
    expect(cssRuleBlock(css, ":focus-visible")).toContain(
      "outline: 2px solid var(--focus-ring)",
    );
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

    expect(css).toContain("--content-width: 44rem");
    expect(css).toContain("--duration-interaction: 200ms");
    expect(cssRuleBlock(css, ".doc-card")).toContain("min-height: 116px");
    expect(cssRuleBlock(css, ".doc-card")).toContain("padding: 18px 20px");
    expect(cssRuleBlock(css, ".doc-card")).toContain(
      "grid-template-columns: 34px minmax(0, 1fr)",
    );
    expect(cssRuleBlock(css, ".doc-card")).toContain(
      "border-radius: var(--radius-md)",
    );
    expect(cssRuleBlock(css, ".doc-card")).not.toContain("max-width");
    const homeFeatureCard = cssRuleBlock(css, ".feature-grid .doc-card");
    expect(homeFeatureCard).toContain("min-height: 108px");
    expect(homeFeatureCard).toContain("padding: 16px 18px");
    const cardDescription = cssRuleBlock(css, ".doc-card__body p");
    expect(cardDescription).toContain("height: auto");
    expect(cardDescription).toContain("overflow: visible");
    expect(cardDescription).toContain("white-space: normal");
    expect(cardDescription).not.toContain("-webkit-line-clamp");
    expect(cardDescription).not.toContain("max-height");
    expect(cardDescription).not.toContain("overflow: hidden");
    const searchDescription = cssRuleBlock(css, ".search-result small");
    expect(searchDescription).toContain("text-overflow: clip");
    expect(searchDescription).toContain("white-space: normal");
    const mobileCss = css.slice(
      css.indexOf("@media (max-width: 767px)"),
      css.indexOf("@media (max-width: 340px)"),
    );
    const mobileSearchDescription = cssRuleBlock(
      mobileCss,
      ".search-result small",
    );
    expect(mobileSearchDescription).toContain("overflow: visible");
    expect(
      cssRuleBlock(
        css,
        ".doc-card--active:hover,\n.doc-card--active:focus-visible",
      ),
    ).toContain("transform: translateY(-2px)");
    expect(cssRuleBlock(css, ".doc-card--active:active")).toContain(
      "transform: translateY(-1px)",
    );
    expect(cssRuleBlock(css, ".doc-card--coming-soon")).not.toContain(
      "transform",
    );
  });

  it("remove o track do TOC no shell intermediário e preserva o drawer", async () => {
    const css = await readFile(
      path.join(projectRoot, "app", "globals.css"),
      "utf8",
    );
    const intermediateStart = css.indexOf("@media (max-width: 1319px)");
    const compactHeaderStart = css.indexOf(
      "@media (max-width: 1279px)",
      intermediateStart,
    );
    const drawerStart = css.indexOf(
      "@media (max-width: 1023px)",
      compactHeaderStart,
    );
    const intermediateCss = css.slice(intermediateStart, compactHeaderStart);
    const drawerCss = css.slice(
      drawerStart,
      css.indexOf("@media (max-width: 767px)", drawerStart),
    );
    const intermediateQueries = [
      ...css.matchAll(/@media \(max-width: 1319px\)/g),
    ];

    expect(cssRuleBlock(css, ".article-layout")).toContain(
      "grid-template-columns: 240px minmax(560px, var(--content-width)) 220px",
    );
    expect(intermediateStart).toBeGreaterThanOrEqual(0);
    expect(compactHeaderStart).toBeGreaterThan(intermediateStart);
    expect(cssRuleBlock(intermediateCss, ".article-layout")).toContain(
      "grid-template-columns: 240px minmax(560px, var(--content-width))",
    );
    expect(cssRuleBlock(intermediateCss, ".table-of-contents")).toContain(
      "display: none",
    );
    expect(intermediateQueries).toHaveLength(2);
    const progressiveTocCss = css.slice(intermediateQueries[1]?.index ?? 0);
    expect(cssRuleBlock(progressiveTocCss, ".article-toc-mobile")).toContain(
      "display: block",
    );
    expect(cssRuleBlock(drawerCss, ".article-layout")).toContain(
      "display: block",
    );
    expect(cssRuleBlock(drawerCss, ".docs-sidebar")).toContain(
      "display: none",
    );
    expect(css).toContain('html[data-docs-sidebar="collapsed"]');
    expect(css).toContain("calc(240px - 56px - 42px)");
  });

  it("não mantém interceptação personalizada de Tab nem X fora de dialog", async () => {
    const behavior = await readFile(
      path.join(projectRoot, "components", "use-modal-behavior.ts"),
      "utf8",
    );
    const searchDialog = await readFile(
      path.join(projectRoot, "components", "search-dialog.tsx"),
      "utf8",
    );

    expect(behavior).toContain("showModal()");
    expect(behavior).toContain('addEventListener("cancel"');
    expect(behavior).not.toContain('event.key !== "Tab"');
    expect(behavior).not.toContain("querySelectorAll<HTMLElement>");
    expect(searchDialog).toContain("<dialog");
    expect(searchDialog).not.toContain("search-backdrop");
  });
});

describe("imagens sociais", () => {
  it("gera a imagem da home com o PNG oficial ampliado", async () => {
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
