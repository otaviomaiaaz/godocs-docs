import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

import { parseDocumentText } from "@/lib/docs/headings";
import { parseDocFrontmatter, type DocRecord } from "@/lib/docs/schema";

const CONTENT_DIRECTORY =
  process.env.GODOCS_FIXTURE_MODE === "filled"
    ? path.join(process.cwd(), "tests", "fixtures", "content-filled")
    : path.join(process.cwd(), "content", "docs");
const DOCUMENT_EXTENSION = /\.mdx?$/i;

export async function findDocumentFiles(directory: string): Promise<string[]> {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findDocumentFiles(entryPath);
      }

      return DOCUMENT_EXTENSION.test(entry.name) ? [entryPath] : [];
    }),
  );

  return files.flat().sort((a, b) => a.localeCompare(b));
}

export async function loadDocumentFile(filePath: string): Promise<DocRecord> {
  const rawFile = await readFile(filePath, "utf8");
  const { data, content } = matter(rawFile);
  const metadata = parseDocFrontmatter(data, filePath);

  try {
    const parsed = parseDocumentText(content);

    return {
      metadata,
      slug: metadata.slug,
      segments: metadata.slug.split("/"),
      href: `/docs/${metadata.slug}`,
      source: content,
      searchableText: parsed.searchableText,
      headings: parsed.headings,
      sections: parsed.sections,
      readingMinutes: Math.max(
        1,
        Math.ceil(parsed.searchableText.split(/\s+/).filter(Boolean).length / 200),
      ),
      filePath,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Conteúdo inválido em ${filePath}: ${message}`, {
      cause: error,
    });
  }
}

export async function loadDocumentsFromDirectory(
  directory: string,
): Promise<DocRecord[]> {
  const files = await findDocumentFiles(directory);
  const docs = await Promise.all(files.map(loadDocumentFile));

  const slugs = new Map<string, string>();

  docs.forEach((doc) => {
    const existingFile = slugs.get(doc.slug);

    if (existingFile) {
      throw new Error(
        `Slug duplicado "${doc.slug}" em ${existingFile} e ${doc.filePath}`,
      );
    }

    slugs.set(doc.slug, doc.filePath);
  });

  return docs.sort((a, b) => {
    const sectionOrder =
      (a.metadata.section?.order ?? Number.MAX_SAFE_INTEGER) -
      (b.metadata.section?.order ?? Number.MAX_SAFE_INTEGER);
    const sectionLabelComparison = (a.metadata.section?.label ?? "").localeCompare(
      b.metadata.section?.label ?? "",
      "pt-BR",
    );

    return (
      sectionOrder ||
      sectionLabelComparison ||
      a.metadata.order - b.metadata.order ||
      a.metadata.title.localeCompare(b.metadata.title, "pt-BR")
    );
  });
}

export async function loadPublishedDocumentsFromDirectory(
  directory: string,
): Promise<DocRecord[]> {
  const docs = await loadDocumentsFromDirectory(directory);
  return docs.filter((doc) => doc.metadata.status === "published");
}

export const getAllDocs = cache(() =>
  loadPublishedDocumentsFromDirectory(CONTENT_DIRECTORY),
);

export const getDocBySlug = cache(async (slug: string) => {
  const docs = await getAllDocs();
  return docs.find((doc) => doc.slug === slug);
});
