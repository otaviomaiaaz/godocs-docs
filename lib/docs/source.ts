import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

import { parseDocumentText } from "@/lib/docs/headings";
import { parseDocFrontmatter, type DocRecord } from "@/lib/docs/schema";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content", "docs");
const DOCUMENT_EXTENSION = /\.mdx?$/i;

async function findDocumentFiles(directory: string): Promise<string[]> {
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

export async function loadDocumentsFromDirectory(
  directory: string,
): Promise<DocRecord[]> {
  const files = await findDocumentFiles(directory);
  const docs = await Promise.all(
    files.map(async (filePath) => {
      const rawFile = await readFile(filePath, "utf8");
      const { data, content } = matter(rawFile);
      const metadata = parseDocFrontmatter(data, filePath);
      const parsed = parseDocumentText(content);

      return {
        metadata,
        slug: metadata.slug,
        segments: metadata.slug.split("/"),
        href: `/docs/${metadata.slug}`,
        source: content,
        searchableText: parsed.searchableText,
        headings: parsed.headings,
        filePath,
      } satisfies DocRecord;
    }),
  );

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
    const sectionComparison = (a.metadata.section ?? "").localeCompare(
      b.metadata.section ?? "",
      "pt-BR",
    );

    return (
      sectionComparison ||
      a.metadata.order - b.metadata.order ||
      a.metadata.title.localeCompare(b.metadata.title, "pt-BR")
    );
  });
}

export const getAllDocs = cache(() => loadDocumentsFromDirectory(CONTENT_DIRECTORY));

export const getDocBySlug = cache(async (slug: string) => {
  const docs = await getAllDocs();
  return docs.find((doc) => doc.slug === slug);
});
