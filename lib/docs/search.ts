import type { DocRecord } from "@/lib/docs/schema";

export const SEARCH_RESULT_LIMIT = 12;
export const SEARCH_RESULTS_PER_DOCUMENT = 3;
export const SEARCH_SNIPPET_LENGTH = 220;

const SEARCH_QUERY_NOISE_TERMS = new Set([
  "a",
  "ao",
  "aos",
  "as",
  "com",
  "como",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "na",
  "nas",
  "no",
  "nos",
  "o",
  "os",
  "ou",
  "para",
  "pode",
  "por",
  "que",
  "quem",
  "um",
  "uma",
]);

export type SearchIndexEntry = {
  kind: "page" | "section";
  title: string;
  description: string;
  href: string;
  section?: string;
  pageTitle?: string;
  normalized: {
    title: string;
    description: string;
    section: string;
    keywords: string;
    content: string;
  };
};

export type SearchIndex = {
  version: 2;
  entries: SearchIndexEntry[];
};

export type SearchResult = Pick<
  SearchIndexEntry,
  "kind" | "title" | "description" | "href" | "section" | "pageTitle"
> & {
  score: number;
};

export type SearchEntrySource = {
  kind?: "page" | "section";
  title: string;
  description: string;
  href: string;
  section?: string;
  pageTitle?: string;
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
    .filter(
      (term) => term.length >= 2 && !SEARCH_QUERY_NOISE_TERMS.has(term),
    );
}

export function hasUsefulSearchQuery(value: string): boolean {
  return getUsefulSearchTerms(value).length > 0;
}

export function createSearchEntry(source: SearchEntrySource): SearchIndexEntry {
  return {
    kind: source.kind ?? "page",
    title: source.title,
    description: source.description,
    href: source.href,
    section: source.section,
    pageTitle: source.pageTitle,
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
    version: 2,
    entries: docs.flatMap((doc) => [
      createSearchEntry({
        kind: "page",
        title: doc.metadata.title,
        description: doc.metadata.description,
        href: doc.href,
        section: doc.metadata.section?.label,
        keywords: doc.metadata.keywords,
        content: doc.searchableText,
      }),
      ...doc.sections.map((section) =>
        createSearchEntry({
          kind: "section",
          title: section.title,
          description:
            section.text.slice(0, SEARCH_SNIPPET_LENGTH) ||
            doc.metadata.description,
          href: `${doc.href}#${section.id}`,
          section: doc.metadata.section?.label,
          pageTitle: doc.metadata.title,
          keywords: doc.metadata.keywords,
          content: section.text,
        }),
      ),
    ]),
  };
}

export function isSearchIndex(value: unknown): value is SearchIndex {
  if (!value || typeof value !== "object") return false;

  const candidate = value as { version?: unknown; entries?: unknown };
  if (candidate.version !== 2 || !Array.isArray(candidate.entries)) return false;

  return candidate.entries.every((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const item = entry as Partial<SearchIndexEntry>;
    const normalized = item.normalized as
      | Partial<SearchIndexEntry["normalized"]>
      | undefined;

    return (
      (item.kind === "page" || item.kind === "section") &&
      typeof item.title === "string" &&
      typeof item.description === "string" &&
      typeof item.href === "string" &&
      (item.section === undefined || typeof item.section === "string") &&
      (item.pageTitle === undefined || typeof item.pageTitle === "string") &&
      typeof normalized?.title === "string" &&
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

function getDocumentHref(href: string): string {
  return href.split("#", 1)[0] ?? href;
}

function limitResultsPerDocument(
  results: SearchResult[],
  limit: number,
): SearchResult[] {
  const resultCountByDocument = new Map<string, number>();

  return results.filter((result) => {
    const documentHref = getDocumentHref(result.href);
    const resultCount = resultCountByDocument.get(documentHref) ?? 0;

    if (resultCount >= limit) return false;

    resultCountByDocument.set(documentHref, resultCount + 1);
    return true;
  });
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

  const rankedResults = index.entries
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
        kind: document.kind,
        title: document.title,
        description: document.description,
        href: document.href,
        section: document.section,
        pageTitle: document.pageTitle,
        score,
      };
    })
    .filter((document): document is SearchResult => document !== null)
    .sort(
      (a, b) =>
        b.score - a.score || a.title.localeCompare(b.title, "pt-BR"),
    );

  return limitResultsPerDocument(
    rankedResults,
    SEARCH_RESULTS_PER_DOCUMENT,
  )
    .slice(0, limit);
}
