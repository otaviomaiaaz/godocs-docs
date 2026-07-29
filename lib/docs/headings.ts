import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

import type {
  DocHeading,
  DocSearchSection,
} from "@/lib/docs/schema";

function formatListText(items: Array<Parameters<typeof toString>[0]>): string {
  return items
    .map((item) => toString(item).trim())
    .filter(Boolean)
    .map((item) => (/[.!?]$/.test(item) ? item : `${item}.`))
    .join(" ");
}

export type ParsedDocumentText = {
  headings: DocHeading[];
  sections: DocSearchSection[];
  searchableText: string;
};

export function parseDocumentText(source: string): ParsedDocumentText {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const slugger = new GithubSlugger();
  const headings: DocHeading[] = [];
  const sections: DocSearchSection[] = [];

  tree.children.forEach((node, index) => {
    if (node.type !== "heading") return;

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

    if (node.depth < 2 || node.depth > 4) return;
    const depth = node.depth as 2 | 3 | 4;

    const sectionNodes = [];
    for (let cursor = index + 1; cursor < tree.children.length; cursor += 1) {
      const candidate = tree.children[cursor];
      if (
        candidate?.type === "heading" &&
        candidate.depth <= node.depth
      ) {
        break;
      }

      if (candidate) sectionNodes.push(candidate);
    }

    sections.push({
      depth,
      id,
      title,
      text: sectionNodes
        .map((sectionNode) =>
          sectionNode.type === "list"
            ? formatListText(sectionNode.children)
            : toString(sectionNode),
        )
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    });
  });

  return {
    headings,
    sections,
    searchableText: toString(tree).replace(/\s+/g, " ").trim(),
  };
}
