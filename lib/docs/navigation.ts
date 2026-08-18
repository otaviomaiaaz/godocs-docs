import type { DocPageType, DocRecord } from "@/lib/docs/schema";

export type DocNavigationItem = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  pageType?: DocPageType;
  children: DocNavigationItem[];
};

export type DocNavigationGroup = {
  id: string;
  title?: string;
  description?: string;
  order: number;
  entrySlug?: string;
  entryHref?: string;
  entryPageType?: DocPageType;
  items: DocNavigationItem[];
};

export type DocBreadcrumb = {
  id: string;
  label: string;
  href?: string;
};

type MutableNavigationItem = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  pageType?: DocPageType;
  order: number;
  children: Map<string, MutableNavigationItem>;
};

type MutableNavigationGroup = {
  title?: string;
  description?: string;
  order: number;
  entrySlug?: string;
  items: Map<string, MutableNavigationItem>;
};

function finalizeItem(item: MutableNavigationItem): DocNavigationItem {
  return {
    id: item.id,
    label: item.label,
    description: item.description,
    href: item.href,
    pageType: item.pageType,
    children: Array.from(item.children.values())
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "pt-BR"))
      .map(finalizeItem),
  };
}

export function buildNavigation(docs: DocRecord[]): DocNavigationGroup[] {
  const groups = new Map<string, MutableNavigationGroup>();
  const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));

  docs.forEach((doc) => {
    const section = doc.metadata.section;
    const groupId = section?.id ?? "__root__";
    const group = groups.get(groupId) ?? {
      title: section?.label,
      description: section?.description,
      order: section?.order ?? Number.MAX_SAFE_INTEGER,
      entrySlug: section?.entrySlug,
      items: new Map<string, MutableNavigationItem>(),
    };

    if (section && group.entrySlug !== section.entrySlug) {
      throw new Error(
        `Taxonomia inconsistente em ${doc.filePath}: section.entrySlug diverge dentro de "${section.id}"`,
      );
    }

    groups.set(groupId, group);

    if (
      section &&
      doc.slug === section.entrySlug &&
      doc.metadata.pageType === "hub"
    ) {
      return;
    }

    let level = group.items;
    const sectionEntry = section ? docsBySlug.get(section.entrySlug) : undefined;
    const entrySegments = sectionEntry?.segments ?? [];
    const collapsibleHubPrefix =
      sectionEntry?.metadata.pageType === "hub" &&
      entrySegments.every((segment, index) => doc.segments[index] === segment);
    const collapsesLegacySectionPrefix =
      section !== undefined &&
      doc.segments[0] === section.id &&
      doc.metadata.ancestors[0]?.label.toLocaleLowerCase("pt-BR") ===
        section.label.toLocaleLowerCase("pt-BR");
    const collapsedPrefixLength = collapsibleHubPrefix
      ? entrySegments.length
      : collapsesLegacySectionPrefix
        ? 1
        : 0;

    doc.segments.forEach((segment, index) => {
      if (index < collapsedPrefixLength) {
        return;
      }

      const path = doc.segments.slice(0, index + 1).join("/");
      const isDocument = index === doc.segments.length - 1;
      const ancestor = doc.metadata.ancestors[index];
      const label = isDocument
        ? (doc.metadata.navTitle ?? doc.metadata.title)
        : ancestor?.label;
      const order = isDocument ? doc.metadata.order : ancestor?.order;

      if (!label || order === undefined) {
        throw new Error(
          `Taxonomia incompleta em ${doc.filePath}: falta label ou order para "${path}"`,
        );
      }

      const current = level.get(segment) ?? {
        id: path,
        label,
        order,
        children: new Map<string, MutableNavigationItem>(),
      };

      current.order = Math.min(current.order, order);

      if (isDocument) {
        current.label = label;
        current.description =
          doc.metadata.cardDescription ?? doc.metadata.description;
        current.href = doc.href;
        current.pageType = doc.metadata.pageType;
      }

      level.set(segment, current);
      level = current.children;
    });
  });

  return Array.from(groups.entries())
    .sort(
      ([aId, a], [bId, b]) =>
        a.order - b.order ||
        (a.title ?? aId).localeCompare(b.title ?? bId, "pt-BR"),
    )
    .map(([id, group]) => {
      const entry = group.entrySlug
        ? docsBySlug.get(group.entrySlug)
        : undefined;

      if (group.entrySlug && !entry) {
        throw new Error(
          `Taxonomia incompleta: destino explícito "${group.entrySlug}" da seção "${id}" não foi publicado`,
        );
      }

      return {
        id,
        title: group.title,
        description: group.description,
        order: group.order,
        entrySlug: group.entrySlug,
        entryHref: entry?.href,
        entryPageType: entry?.metadata.pageType,
        items: Array.from(group.items.values())
          .sort(
            (a, b) =>
              a.order - b.order || a.label.localeCompare(b.label, "pt-BR"),
          )
          .map(finalizeItem),
      };
    });
}

export function buildBreadcrumbs(
  doc: DocRecord,
  docs: DocRecord[],
): DocBreadcrumb[] {
  const breadcrumbs: DocBreadcrumb[] = [];
  const section = doc.metadata.section;
  const docsBySlug = new Map(docs.map((candidate) => [candidate.slug, candidate]));
  const sectionEntry = section ? docsBySlug.get(section.entrySlug) : undefined;

  if (section && sectionEntry?.metadata.pageType === "hub") {
    breadcrumbs.push({
      id: `section:${section.id}`,
      label: section.label,
      href: sectionEntry.slug === doc.slug ? undefined : sectionEntry.href,
    });
  }

  doc.metadata.ancestors.forEach((ancestor, index) => {
    const slug = doc.segments.slice(0, index + 1).join("/");
    if (slug === sectionEntry?.slug) return;
    const ancestorDoc = docsBySlug.get(slug);
    breadcrumbs.push({
      id: `path:${slug}`,
      label: ancestor.label,
      href: ancestorDoc?.href,
    });
  });

  if (sectionEntry?.slug !== doc.slug) {
    breadcrumbs.push({
      id: `path:${doc.slug}`,
      label: doc.metadata.title,
    });
  }

  return breadcrumbs;
}

function flattenNavigationItem(item: DocNavigationItem): string[] {
  return [
    ...(item.href ? [item.href.slice("/docs/".length)] : []),
    ...item.children.flatMap(flattenNavigationItem),
  ];
}

function getPaginationDomains(
  docs: DocRecord[],
): string[][] {
  const domains: string[][] = [];

  for (const group of buildNavigation(docs)) {
    let siblingDomain: string[] = [];

    if (group.entryPageType === "hub" && group.entrySlug) {
      siblingDomain.push(group.entrySlug);
    }

    for (const item of group.items) {
      if (item.children.length > 0) {
        if (siblingDomain.length > 0) domains.push(siblingDomain);
        domains.push(flattenNavigationItem(item));
        siblingDomain = [];
      } else {
        siblingDomain.push(...flattenNavigationItem(item));
      }
    }

    if (siblingDomain.length > 0) domains.push(siblingDomain);
  }

  return domains;
}

export function getAdjacentDocs(
  docs: DocRecord[],
  slug: string,
): { previous?: DocRecord; next?: DocRecord } {
  const domain = getPaginationDomains(docs).find((candidate) =>
    candidate.includes(slug),
  );
  const index = domain?.indexOf(slug) ?? -1;

  if (!domain || index < 0) {
    return {};
  }

  const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));

  return {
    previous: docsBySlug.get(domain[index - 1] ?? ""),
    next: docsBySlug.get(domain[index + 1] ?? ""),
  };
}
