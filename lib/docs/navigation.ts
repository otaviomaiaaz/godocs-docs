import type { DocRecord } from "@/lib/docs/schema";

export type DocNavigationItem = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  children: DocNavigationItem[];
};

export type DocNavigationGroup = {
  id: string;
  title?: string;
  description?: string;
  order: number;
  entryHref?: string;
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
  order: number;
  children: Map<string, MutableNavigationItem>;
};

type MutableNavigationGroup = {
  title?: string;
  description?: string;
  order: number;
  entryHref?: string;
  entryOrder: number;
  items: Map<string, MutableNavigationItem>;
};

function finalizeItem(item: MutableNavigationItem): DocNavigationItem {
  return {
    id: item.id,
    label: item.label,
    description: item.description,
    href: item.href,
    children: Array.from(item.children.values())
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "pt-BR"))
      .map(finalizeItem),
  };
}

export function buildNavigation(docs: DocRecord[]): DocNavigationGroup[] {
  const groups = new Map<string, MutableNavigationGroup>();

  docs.forEach((doc) => {
    const section = doc.metadata.section;
    const groupId = section?.id ?? "__root__";
    const group = groups.get(groupId) ?? {
      title: section?.label,
      description: section?.description,
      order: section?.order ?? Number.MAX_SAFE_INTEGER,
      entryOrder: Number.MAX_SAFE_INTEGER,
      items: new Map<string, MutableNavigationItem>(),
    };

    if (doc.metadata.order < group.entryOrder) {
      group.entryHref = doc.href;
      group.entryOrder = doc.metadata.order;
    }

    groups.set(groupId, group);

    let level = group.items;

    doc.segments.forEach((segment, index) => {
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
        current.description = doc.metadata.description;
        current.href = doc.href;
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
    .map(([id, group]) => ({
      id,
      title: group.title,
      description: group.description,
      order: group.order,
      entryHref: group.entryHref,
      items: Array.from(group.items.values())
        .sort(
          (a, b) =>
            a.order - b.order || a.label.localeCompare(b.label, "pt-BR"),
        )
        .map(finalizeItem),
    }));
}

export function buildBreadcrumbs(
  doc: DocRecord,
  docs: DocRecord[],
): DocBreadcrumb[] {
  const breadcrumbs: DocBreadcrumb[] = [];
  const section = doc.metadata.section;

  if (section) {
    const entry = docs.find((candidate) => candidate.metadata.section?.id === section.id);
    breadcrumbs.push({
      id: `section:${section.id}`,
      label: section.label,
      href: entry?.slug === doc.slug ? undefined : entry?.href,
    });
  }

  doc.segments.forEach((segment, index) => {
    const isDocument = index === doc.segments.length - 1;
    const slug = doc.segments.slice(0, index + 1).join("/");
    const ancestorDoc = docs.find((candidate) => candidate.slug === slug);
    const label = isDocument
      ? doc.metadata.title
      : doc.metadata.ancestors[index]?.label;

    if (!label) {
      return;
    }

    if (
      !isDocument &&
      breadcrumbs.at(-1)?.label.toLocaleLowerCase("pt-BR") ===
        label.toLocaleLowerCase("pt-BR")
    ) {
      return;
    }

    breadcrumbs.push({
      id: `path:${slug || segment}`,
      label,
      href: isDocument ? undefined : ancestorDoc?.href,
    });
  });

  return breadcrumbs;
}

export function getAdjacentDocs(
  docs: DocRecord[],
  slug: string,
): { previous?: DocRecord; next?: DocRecord } {
  const index = docs.findIndex((doc) => doc.slug === slug);

  if (index < 0) {
    return {};
  }

  return {
    previous: docs[index - 1],
    next: docs[index + 1],
  };
}
