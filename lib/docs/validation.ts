import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { buildNavigation } from "@/lib/docs/navigation";
import {
  findDocumentFiles,
  loadDocumentFile,
} from "@/lib/docs/source";
import type { DocRecord } from "@/lib/docs/schema";

const ALLOWED_MDX_COMPONENTS = new Set([
  "Callout",
  "CodeBlock",
  "ExpectedResult",
  "Figure",
  "Info",
  "KeyboardShortcut",
  "Permissions",
  "RelatedLinks",
  "Requirements",
  "Step",
  "Steps",
  "Tip",
  "Warning",
]);
const EXTERNAL_PROTOCOL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const LOCAL_ASSET_EXTENSION =
  /\.(?:avif|gif|jpe?g|png|svg|webp|ico|pdf|mp4|webm)$/i;

export type ContentValidationIssue = {
  filePath: string;
  category:
    | "frontmatter"
    | "slug"
    | "mdx"
    | "component"
    | "link"
    | "fragment"
    | "asset"
    | "taxonomy";
  message: string;
};

export type ContentValidationResult = {
  documents: DocRecord[];
  issues: ContentValidationIssue[];
};

type Reference = {
  kind: "link" | "image";
  url: string;
};

function issue(
  filePath: string,
  category: ContentValidationIssue["category"],
  message: string,
): ContentValidationIssue {
  return { filePath, category, message };
}

function describeLoadError(error: unknown): {
  category: ContentValidationIssue["category"];
  message: string;
} {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Frontmatter inválido")) {
    return { category: "frontmatter", message };
  }
  if (message.includes("H1")) {
    return { category: "mdx", message };
  }

  return { category: "mdx", message };
}

function collectReferencesAndComponents(
  source: string,
  filePath: string,
  issues: ContentValidationIssue[],
): Reference[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const references: Reference[] = [];

  visit(tree, (node) => {
    if (node.type === "link") {
      references.push({ kind: "link", url: node.url });
      return;
    }

    if (node.type === "image") {
      references.push({ kind: "image", url: node.url });
      return;
    }

    if (node.type === "mdxjsEsm") {
      issues.push(
        issue(
          filePath,
          "component",
          "imports e exports não são permitidos em documentos MDX",
        ),
      );
      return;
    }

    if (
      node.type !== "mdxJsxFlowElement" &&
      node.type !== "mdxJsxTextElement"
    ) {
      return;
    }

    const componentName = node.name;
    if (
      componentName &&
      /^[A-Z]/.test(componentName) &&
      !ALLOWED_MDX_COMPONENTS.has(componentName)
    ) {
      issues.push(
        issue(
          filePath,
          "component",
          `componente MDX <${componentName}> não é permitido`,
        ),
      );
    }

    if (componentName === "Figure") {
      const attributes = new Map(
        node.attributes
          .filter((attribute) => attribute.type === "mdxJsxAttribute")
          .map((attribute) => [attribute.name, attribute.value]),
      );

      for (const requiredAttribute of ["src", "alt", "width", "height"]) {
        if (!attributes.has(requiredAttribute)) {
          issues.push(
            issue(
              filePath,
              "component",
              `<Figure> exige o atributo ${requiredAttribute}`,
            ),
          );
        }
      }

      const figureSource = attributes.get("src");
      if (typeof figureSource === "string") {
        references.push({ kind: "image", url: figureSource });
      }
    }

    if (componentName !== "img") return;

    const sourceAttribute = node.attributes.find(
      (attribute) =>
        attribute.type === "mdxJsxAttribute" && attribute.name === "src",
    );

    if (
      sourceAttribute?.type === "mdxJsxAttribute" &&
      typeof sourceAttribute.value === "string"
    ) {
      references.push({ kind: "image", url: sourceAttribute.value });
    }
  });

  return references;
}

function splitReference(url: string): {
  pathname: string;
  fragment?: string;
} {
  const withoutQuery = url.split("?")[0] ?? "";
  const hashIndex = withoutQuery.indexOf("#");

  if (hashIndex < 0) return { pathname: withoutQuery };

  return {
    pathname: withoutQuery.slice(0, hashIndex),
    fragment: withoutQuery.slice(hashIndex + 1),
  };
}

function decodeFragment(fragment: string): string {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

function resolveDocumentSlug(currentSlug: string, pathname: string): string | null {
  if (!pathname) return currentSlug;
  if (pathname === "/") return null;

  if (pathname.startsWith("/docs/")) {
    return pathname.slice("/docs/".length).replace(/\/$/, "");
  }

  if (pathname.startsWith("/")) return null;
  if (LOCAL_ASSET_EXTENSION.test(pathname)) return null;

  const currentDirectory = path.posix.dirname(currentSlug);
  return path.posix
    .normalize(path.posix.join(currentDirectory, pathname))
    .replace(/\.(?:md|mdx)$/i, "")
    .replace(/^\.\//, "")
    .replace(/\/$/, "");
}

async function validateAsset(
  reference: Reference,
  doc: DocRecord,
  publicDirectory: string,
  workspaceDirectory: string,
  issues: ContentValidationIssue[],
) {
  const { pathname } = splitReference(reference.url);
  if (!pathname || EXTERNAL_PROTOCOL.test(pathname) || pathname.startsWith("data:")) {
    return;
  }

  const resolvedPath = pathname.startsWith("/")
    ? path.resolve(publicDirectory, `.${pathname}`)
    : path.resolve(path.dirname(doc.filePath), pathname);
  const relativeToWorkspace = path.relative(workspaceDirectory, resolvedPath);

  if (
    relativeToWorkspace.startsWith("..") ||
    path.isAbsolute(relativeToWorkspace)
  ) {
    issues.push(
      issue(
        doc.filePath,
        "asset",
        `asset "${reference.url}" aponta para fora do repositório`,
      ),
    );
    return;
  }

  try {
    await access(resolvedPath);
  } catch {
    issues.push(
      issue(
        doc.filePath,
        "asset",
        `asset local "${reference.url}" não existe em ${resolvedPath}`,
      ),
    );
  }
}

function validateLink(
  reference: Reference,
  doc: DocRecord,
  docsBySlug: Map<string, DocRecord>,
  issues: ContentValidationIssue[],
) {
  if (EXTERNAL_PROTOCOL.test(reference.url)) return;

  const { pathname, fragment } = splitReference(reference.url);
  const targetSlug = resolveDocumentSlug(doc.slug, pathname);

  if (targetSlug === null) return;

  const target = docsBySlug.get(targetSlug);
  if (!target) {
    issues.push(
      issue(
        doc.filePath,
        "link",
        `link interno "${reference.url}" aponta para documento inexistente "${targetSlug}"`,
      ),
    );
    return;
  }

  if (
    doc.metadata.status === "published" &&
    target.metadata.status !== "published"
  ) {
    issues.push(
      issue(
        doc.filePath,
        "link",
        `link interno "${reference.url}" aponta para documento não publicado "${targetSlug}"`,
      ),
    );
    return;
  }

  if (!fragment) return;
  const fragmentId = decodeFragment(fragment);

  if (!target.headings.some((heading) => heading.id === fragmentId)) {
    issues.push(
      issue(
        doc.filePath,
        "fragment",
        `fragmento "#${fragment}" do link "${reference.url}" não existe em ${target.filePath}`,
      ),
    );
  }
}

function validateTaxonomy(
  documents: DocRecord[],
  issues: ContentValidationIssue[],
) {
  const sections = new Map<
    string,
    { label: string; description: string; order: number; filePath: string }
  >();
  const ancestors = new Map<
    string,
    { label: string; order: number; filePath: string }
  >();

  documents.forEach((doc) => {
    const section = doc.metadata.section;
    if (section) {
      const current = sections.get(section.id);
      if (
        current &&
        (current.label !== section.label ||
          current.description !== section.description ||
          current.order !== section.order)
      ) {
        issues.push(
          issue(
            doc.filePath,
            "taxonomy",
            `section "${section.id}" diverge de ${current.filePath}; label, description e order devem ser idênticos`,
          ),
        );
      } else if (!current) {
        sections.set(section.id, { ...section, filePath: doc.filePath });
      }
    }

    doc.metadata.ancestors.forEach((ancestor, index) => {
      const groupId = section?.id ?? "__root__";
      const ancestorPath = doc.segments.slice(0, index + 1).join("/");
      const key = `${groupId}:${ancestorPath}`;
      const current = ancestors.get(key);

      if (
        current &&
        (current.label !== ancestor.label || current.order !== ancestor.order)
      ) {
        issues.push(
          issue(
            doc.filePath,
            "taxonomy",
            `ancestor "${ancestorPath}" diverge de ${current.filePath}; label e order devem ser idênticos`,
          ),
        );
      } else if (!current) {
        ancestors.set(key, { ...ancestor, filePath: doc.filePath });
      }
    });
  });

  try {
    buildNavigation(documents);
  } catch (error) {
    issues.push(
      issue(
        "content/docs",
        "taxonomy",
        error instanceof Error ? error.message : String(error),
      ),
    );
  }
}

export async function validateContentDirectory(
  contentDirectory: string,
  options: {
    publicDirectory?: string;
    workspaceDirectory?: string;
  } = {},
): Promise<ContentValidationResult> {
  const workspaceDirectory = path.resolve(
    options.workspaceDirectory ?? process.cwd(),
  );
  const publicDirectory = path.resolve(
    options.publicDirectory ?? path.join(workspaceDirectory, "public"),
  );
  const files = await findDocumentFiles(contentDirectory);
  const issues: ContentValidationIssue[] = [];
  const documents: DocRecord[] = [];
  const referencesByFile = new Map<string, Reference[]>();

  for (const filePath of files) {
    try {
      const rawFile = await readFile(filePath, "utf8");
      const { content } = matter(rawFile);
      referencesByFile.set(
        filePath,
        collectReferencesAndComponents(content, filePath, issues),
      );

      try {
        await compile(content, {
          development: false,
          remarkPlugins: [remarkGfm],
        });
      } catch (error) {
        issues.push(
          issue(
            filePath,
            "mdx",
            `falha ao compilar MD/MDX: ${
              error instanceof Error ? error.message : String(error)
            }`,
          ),
        );
      }

      documents.push(await loadDocumentFile(filePath));
    } catch (error) {
      const described = describeLoadError(error);
      issues.push(issue(filePath, described.category, described.message));
    }
  }

  const docsBySlug = new Map<string, DocRecord>();
  documents.forEach((doc) => {
    const existing = docsBySlug.get(doc.slug);
    if (existing) {
      issues.push(
        issue(
          doc.filePath,
          "slug",
          `slug duplicado "${doc.slug}" também declarado em ${existing.filePath}`,
        ),
      );
      return;
    }

    docsBySlug.set(doc.slug, doc);
  });

  validateTaxonomy(documents, issues);

  for (const doc of documents) {
    for (const relatedSlug of doc.metadata.related) {
      const related = docsBySlug.get(relatedSlug);
      if (!related) {
        issues.push(
          issue(
            doc.filePath,
            "link",
            `related aponta para documento inexistente "${relatedSlug}"`,
          ),
        );
      } else if (
        doc.metadata.status === "published" &&
        related.metadata.status !== "published"
      ) {
        issues.push(
          issue(
            doc.filePath,
            "link",
            `related aponta para documento não publicado "${relatedSlug}"`,
          ),
        );
      }
    }

    for (const reference of referencesByFile.get(doc.filePath) ?? []) {
      if (reference.kind === "image") {
        await validateAsset(
          reference,
          doc,
          publicDirectory,
          workspaceDirectory,
          issues,
        );
      } else {
        validateLink(reference, doc, docsBySlug, issues);
      }
    }
  }

  return { documents, issues };
}
