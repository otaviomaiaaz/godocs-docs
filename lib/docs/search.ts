import type { DocRecord } from "@/lib/docs/schema";

export type SearchIndexEntry = {
  title: string;
  description: string;
  href: string;
  section?: string;
  normalized: {
    title: string;
    description: string;
    section: string;
    keywords: string;
    content: string;
  };
};

export type SearchIndex = {
  version: 1;
  entries: SearchIndexEntry[];
};

export type SearchResult = Pick<
  SearchIndexEntry,
  "title" | "description" | "href" | "section"
> & {
  score: number;
};

export type SearchEntrySource = {
  title: string;
  description: string;
  href: string;
  section?: string;
  keywords?: string[];
  content: string;
};

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim();
}

export function createSearchEntry(source: SearchEntrySource): SearchIndexEntry {
  return {
    title: source.title,
    description: source.description,
    href: source.href,
    section: source.section,
    normalized: {
      title: normalizeSearchText(source.title),
      description: normalizeSearchText(source.description),
      section: normalizeSearchText(source.section ?? ""),
      keywords: normalizeSearchText((source.keywords ?? []).join(" ")),
      content: normalizeSearchText(source.content),
    },
  };
}

export function createSearchIndex(docs: DocRecord[]): SearchIndex {
  return {
    version: 1,
    entries: docs.map((doc) =>
      createSearchEntry({
        title: doc.metadata.title,
        description: doc.metadata.description,
        href: doc.href,
        section: doc.metadata.section?.label,
        keywords: doc.metadata.keywords,
        content: doc.searchableText,
      }),
    ),
  };
}

export function isSearchIndex(value: unknown): value is SearchIndex {
  if (!value || typeof value !== "object") return false;

  const candidate = value as { version?: unknown; entries?: unknown };
  if (candidate.version !== 1 || !Array.isArray(candidate.entries)) return false;

  return candidate.entries.every((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const item = entry as Partial<SearchIndexEntry>;
    const normalized = item.normalized as
      | Partial<SearchIndexEntry["normalized"]>
      | undefined;

    return (
      typeof item.title === "string" &&
      typeof item.description === "string" &&
      typeof item.href === "string" &&
      (item.section === undefined || typeof item.section === "string") &&
      typeof normalized?.title === "string" &&
      typeof normalized.description === "string" &&
      typeof normalized.section === "string" &&
      typeof normalized.keywords === "string" &&
      typeof normalized.content === "string"
    );
  });
}

export function searchDocuments(
  index: SearchIndex,
  rawQuery: string,
  limit = 10,
): SearchResult[] {
  const query = normalizeSearchText(rawQuery);

  if (!query || limit <= 0) {
    return [];
  }

  const terms = query.split(" ").filter(Boolean);

  return index.entries
    .map((document) => {
      const fields = document.normalized;
      const score = terms.reduce((total, term) => {
        let termScore = 0;

        if (fields.title.includes(term)) {
          termScore += fields.title === term ? 12 : 8;
        }
        if (fields.keywords.includes(term)) termScore += 6;
        if (fields.description.includes(term)) termScore += 4;
        if (fields.section.includes(term)) termScore += 2;
        if (fields.content.includes(term)) termScore += 1;

        return total + termScore;
      }, 0);

      return {
        title: document.title,
        description: document.description,
        href: document.href,
        section: document.section,
        score,
      };
    })
    .filter((document) => document.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.title.localeCompare(b.title, "pt-BR"),
    )
    .slice(0, limit);
}
