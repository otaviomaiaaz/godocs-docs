import type { DocRecord } from "@/lib/docs/schema";

export type SearchDocument = {
  title: string;
  description: string;
  href: string;
  section?: string;
  keywords: string[];
  content: string;
};

export type SearchResult = SearchDocument & {
  score: number;
};

export function createSearchIndex(docs: DocRecord[]): SearchDocument[] {
  return docs.map((doc) => ({
    title: doc.metadata.title,
    description: doc.metadata.description,
    href: doc.href,
    section: doc.metadata.section,
    keywords: doc.metadata.keywords,
    content: doc.searchableText,
  }));
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function searchDocuments(
  index: SearchDocument[],
  rawQuery: string,
): SearchResult[] {
  const query = normalizeSearchText(rawQuery);

  if (!query) {
    return [];
  }

  const terms = query.split(/\s+/).filter(Boolean);

  return index
    .map((document) => {
      const title = normalizeSearchText(document.title);
      const description = normalizeSearchText(document.description);
      const section = normalizeSearchText(document.section ?? "");
      const keywords = normalizeSearchText(document.keywords.join(" "));
      const content = normalizeSearchText(document.content);

      const score = terms.reduce((total, term) => {
        let termScore = 0;

        if (title.includes(term)) termScore += title === term ? 12 : 8;
        if (keywords.includes(term)) termScore += 6;
        if (description.includes(term)) termScore += 4;
        if (section.includes(term)) termScore += 2;
        if (content.includes(term)) termScore += 1;

        return total + termScore;
      }, 0);

      return { ...document, score };
    })
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "pt-BR"));
}
