import type { DocRecord } from "@/lib/docs/schema";

export type SearchIndexEntry = {
  title: string;
  description: string;
  href: string;
  section?: string;
  normalized: {
    title: string;
    headings: string;
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
  headings?: string[];
  keywords?: string[];
  content: string;
};

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getUsefulSearchTerms(value: string): string[] {
  return normalizeSearchText(value)
    .split(" ")
    .filter((term) => term.length >= 2);
}

export function hasUsefulSearchQuery(value: string): boolean {
  return getUsefulSearchTerms(value).length > 0;
}

export function createSearchEntry(source: SearchEntrySource): SearchIndexEntry {
  return {
    title: source.title,
    description: source.description,
    href: source.href,
    section: source.section,
    normalized: {
      title: normalizeSearchText(source.title),
      headings: normalizeSearchText((source.headings ?? []).join(" ")),
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
        headings: doc.headings.map((heading) => heading.title),
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
      typeof normalized.headings === "string" &&
      typeof normalized.description === "string" &&
      typeof normalized.section === "string" &&
      typeof normalized.keywords === "string" &&
      typeof normalized.content === "string"
    );
  });
}

type SearchField = {
  value: string;
  exactWordScore: number;
  prefixScore: number;
  phraseScore: number;
};

function scoreTermInField(
  field: SearchField,
  term: string,
): number {
  const paddedValue = ` ${field.value} `;
  const paddedTerm = ` ${term} `;

  if (paddedValue.includes(paddedTerm)) {
    return field.exactWordScore;
  }

  if (
    field.value.startsWith(term) ||
    field.value.includes(` ${term}`)
  ) {
    return field.prefixScore;
  }

  return 0;
}

function containsPhrase(value: string, terms: string[]): boolean {
  if (terms.length < 2 || !value) return false;

  return ` ${value} `.includes(` ${terms.join(" ")} `);
}

export function searchDocuments(
  index: SearchIndex,
  rawQuery: string,
  limit = 10,
): SearchResult[] {
  const terms = getUsefulSearchTerms(rawQuery);

  if (terms.length === 0 || limit <= 0) {
    return [];
  }

  return index.entries
    .map<SearchResult | null>((document) => {
      const fields = document.normalized;
      const weightedFields: SearchField[] = [
        {
          value: fields.title,
          exactWordScore: 80,
          prefixScore: 56,
          phraseScore: 72,
        },
        {
          value: fields.headings,
          exactWordScore: 48,
          prefixScore: 34,
          phraseScore: 42,
        },
        {
          value: fields.keywords,
          exactWordScore: 48,
          prefixScore: 34,
          phraseScore: 42,
        },
        {
          value: fields.description,
          exactWordScore: 28,
          prefixScore: 20,
          phraseScore: 26,
        },
        {
          value: fields.section,
          exactWordScore: 18,
          prefixScore: 12,
          phraseScore: 14,
        },
        {
          value: fields.content,
          exactWordScore: 10,
          prefixScore: 7,
          phraseScore: 8,
        },
      ];
      const termScores = terms.map((term) =>
        weightedFields.reduce(
          (total, field) => total + scoreTermInField(field, term),
          0,
        ),
      );

      if (termScores.some((termScore) => termScore === 0)) {
        return null;
      }

      const phraseScore = weightedFields.reduce(
        (total, field) =>
          total + (containsPhrase(field.value, terms) ? field.phraseScore : 0),
        0,
      );
      const score =
        termScores.reduce((total, termScore) => total + termScore, 0) +
        phraseScore +
        (terms.length > 1 ? 20 : 0);

      return {
        title: document.title,
        description: document.description,
        href: document.href,
        section: document.section,
        score,
      };
    })
    .filter((document): document is SearchResult => document !== null)
    .sort(
      (a, b) =>
        b.score - a.score || a.title.localeCompare(b.title, "pt-BR"),
    )
    .slice(0, limit);
}
