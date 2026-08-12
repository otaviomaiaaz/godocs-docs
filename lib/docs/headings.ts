import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

import type {
  DocHeading,
  DocSearchSection,
} from "@/lib/docs/schema";

type ParsedNode = {
  type: string;
  depth?: number;
  name?: string | null;
  attributes?: Array<{
    type: string;
    name?: string;
    value?: unknown;
  }>;
  children?: ParsedNode[];
};

type StructuralHeading = {
  depth: 2 | 3 | 4;
  id: string;
  title: string;
};

function formatListText(items: Array<Parameters<typeof toString>[0]>): string {
  return items
    .map((item) => toString(item).trim())
    .filter(Boolean)
    .map((item) => (/[.!?]$/.test(item) ? item : `${item}.`))
    .join(" ");
}

function getStringAttribute(node: ParsedNode, name: string): string | undefined {
  const attribute = node.attributes?.find(
    (candidate) =>
      candidate.type === "mdxJsxAttribute" && candidate.name === name,
  );

  return typeof attribute?.value === "string" ? attribute.value.trim() : undefined;
}

function getStepHeading(node: ParsedNode): StructuralHeading | null {
  if (node.type !== "mdxJsxFlowElement" || node.name !== "Step") {
    return null;
  }

  const title = getStringAttribute(node, "title");
  const id = getStringAttribute(node, "id");
  const rawDepth = getStringAttribute(node, "headingLevel");
  const depth = Number(rawDepth);

  if (!title || !id || !rawDepth) {
    throw new Error(
      "<Step> exige title, id e headingLevel para participar da estrutura documental.",
    );
  }

  if (depth !== 2 && depth !== 3 && depth !== 4) {
    throw new Error("<Step> aceita headingLevel 2, 3 ou 4.");
  }

  return { depth, id, title };
}

function normalizeExtractedText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function extractNodeText(node: ParsedNode): string {
  const stepHeading = getStepHeading(node);

  if (stepHeading) {
    return normalizeExtractedText(
      [stepHeading.title, ...(node.children ?? []).map(extractNodeText)].join(" "),
    );
  }

  if (node.type === "mdxJsxFlowElement" && node.name === "Steps") {
    return normalizeExtractedText((node.children ?? []).map(extractNodeText).join(" "));
  }

  if (node.type === "list") {
    return formatListText(
      (node.children ?? []) as Array<Parameters<typeof toString>[0]>,
    );
  }

  return toString(node as Parameters<typeof toString>[0]);
}

export type ParsedDocumentText = {
  headings: DocHeading[];
  sections: DocSearchSection[];
  searchableText: string;
};

export function parseDocumentText(source: string): ParsedDocumentText {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source) as ParsedNode;
  const slugger = new GithubSlugger();
  const headings: DocHeading[] = [];
  const sections: DocSearchSection[] = [];
  const ids = new Set<string>();

  function addHeading(
    heading: StructuralHeading,
    sectionNodes: ParsedNode[],
  ) {
    if (ids.has(heading.id)) {
      throw new Error(`ID de heading duplicado: "${heading.id}".`);
    }
    ids.add(heading.id);

    if (heading.depth === 2 || heading.depth === 3) {
      headings.push({
        depth: heading.depth,
        id: heading.id,
        title: heading.title,
      });
    }

    sections.push({
      ...heading,
      text: normalizeExtractedText(sectionNodes.map(extractNodeText).join(" ")),
    });
  }

  function walk(nodes: ParsedNode[]) {
    nodes.forEach((node, index) => {
      if (node.type === "heading") {
        const title = extractNodeText(node).trim();

        if (node.depth === 1) {
          throw new Error(
            "O corpo do documento não deve conter H1; use o campo title do frontmatter.",
          );
        }

        if (title) {
          const id = slugger.slug(title);

          if (node.depth === 2 || node.depth === 3 || node.depth === 4) {
            const sectionNodes: ParsedNode[] = [];

            for (let cursor = index + 1; cursor < nodes.length; cursor += 1) {
              const candidate = nodes[cursor];
              if (
                candidate?.type === "heading" &&
                candidate.depth !== undefined &&
                candidate.depth <= node.depth
              ) {
                break;
              }

              if (candidate) sectionNodes.push(candidate);
            }

            addHeading({ depth: node.depth, id, title }, sectionNodes);
          } else if (ids.has(id)) {
            throw new Error(`ID de heading duplicado: "${id}".`);
          } else {
            ids.add(id);
          }
        }
      } else {
        const stepHeading = getStepHeading(node);
        if (stepHeading) {
          addHeading(stepHeading, node.children ?? []);
        }
      }

      if (node.children) {
        walk(node.children);
      }
    });
  }

  const rootChildren = tree.children ?? [];
  walk(rootChildren);

  return {
    headings,
    sections,
    searchableText: normalizeExtractedText(
      rootChildren.map(extractNodeText).join(" "),
    ),
  };
}
