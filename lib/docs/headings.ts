import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import type { DocHeading } from "@/lib/docs/schema";

export type ParsedDocumentText = {
  headings: DocHeading[];
  searchableText: string;
};

export function parseDocumentText(source: string): ParsedDocumentText {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const slugger = new GithubSlugger();
  const headings: DocHeading[] = [];

  visit(tree, "heading", (node) => {
    const title = toString(node).trim();

    if (!title) {
      return;
    }

    const id = slugger.slug(title);

    if (node.depth === 1) {
      throw new Error(
        "O corpo do documento não deve conter H1; use o campo title do frontmatter.",
      );
    }

    if (node.depth === 2 || node.depth === 3) {
      headings.push({ depth: node.depth, id, title });
    }
  });

  return {
    headings,
    searchableText: toString(tree).replace(/\s+/g, " ").trim(),
  };
}
