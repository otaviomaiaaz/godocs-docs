import type { DocRecord } from "@/lib/docs/schema";

export type DocNavigationItem = {
  id: string;
  label: string;
  href?: string;
  children: DocNavigationItem[];
};

export type DocNavigationGroup = {
  id: string;
  title?: string;
  items: DocNavigationItem[];
};

type MutableNavigationItem = {
  id: string;
  label: string;
  href?: string;
  order: number;
  children: Map<string, MutableNavigationItem>;
};

function humanizeIdentifier(value: string): string {
  return value
    .split(/[-_/]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1))
    .join(" ");
}

function finalizeItem(item: MutableNavigationItem): DocNavigationItem {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    children: Array.from(item.children.values())
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "pt-BR"))
      .map(finalizeItem),
  };
}

export function buildNavigation(docs: DocRecord[]): DocNavigationGroup[] {
  const groups = new Map<string, { title?: string; items: Map<string, MutableNavigationItem> }>();

  docs.forEach((doc) => {
    const groupId = doc.metadata.section ?? "__root__";
    const group = groups.get(groupId) ?? {
      title: doc.metadata.section
        ? humanizeIdentifier(doc.metadata.section)
        : undefined,
      items: new Map<string, MutableNavigationItem>(),
    };

    groups.set(groupId, group);

    let level = group.items;

    doc.segments.forEach((segment, index) => {
      const path = doc.segments.slice(0, index + 1).join("/");
      const isDocument = index === doc.segments.length - 1;
      const current = level.get(segment) ?? {
        id: path,
        label: humanizeIdentifier(segment),
        order: doc.metadata.order,
        children: new Map<string, MutableNavigationItem>(),
      };

      current.order = Math.min(current.order, doc.metadata.order);

      if (isDocument) {
        current.label = doc.metadata.title;
        current.href = doc.href;
      }

      level.set(segment, current);
      level = current.children;
    });
  });

  return Array.from(groups.entries()).map(([id, group]) => ({
    id,
    title: group.title,
    items: Array.from(group.items.values())
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "pt-BR"))
      .map(finalizeItem),
  }));
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
