"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

import type {
  DocNavigationGroup,
  DocNavigationItem,
} from "@/lib/docs/navigation";

type NavigationTreeProps = {
  groups: DocNavigationGroup[];
  onNavigate?: () => void;
};

function branchContainsPath(item: DocNavigationItem, pathname: string): boolean {
  return (
    item.href === pathname ||
    item.children.some((child) => branchContainsPath(child, pathname))
  );
}

function NavigationItem({
  item,
  pathname,
  onNavigate,
}: {
  item: DocNavigationItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const branchIsActive = branchContainsPath(item, pathname);
  const [isOpen, setIsOpen] = useState(branchIsActive);
  const isExpanded = isOpen;

  const hasChildren = item.children.length > 0;

  return (
    <li className="navigation-tree__item">
      <div className="navigation-tree__row">
        {item.href ? (
          <Link
            aria-current={item.href === pathname ? "page" : undefined}
            className="navigation-tree__link"
            href={item.href}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        ) : (
          <span className="navigation-tree__branch-label">{item.label}</span>
        )}

        {hasChildren ? (
          <button
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "Recolher" : "Expandir"} ${item.label}`}
            className="navigation-tree__expand"
            onClick={() => setIsOpen((open) => !open)}
            type="button"
          >
            <ChevronRight
              aria-hidden="true"
              className={isExpanded ? "is-open" : undefined}
              size={15}
            />
          </button>
        ) : null}
      </div>

      {hasChildren && isExpanded ? (
        <ul className="navigation-tree__children">
          {item.children.map((child) => (
              <NavigationItem
                item={child}
                key={`${child.id}-${pathname}`}
              onNavigate={onNavigate}
              pathname={pathname}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function NavigationTree({ groups, onNavigate }: NavigationTreeProps) {
  const pathname = usePathname();
  const baseId = useId();

  return (
    <div className="navigation-tree">
      {groups.map((group) => {
        const titleId = group.title ? `${baseId}-${group.id}-title` : undefined;

        return (
          <div className="navigation-tree__group" key={group.id}>
            {group.title ? (
              group.entryHref && group.entryPageType === "hub" ? (
                <Link
                  aria-current={
                    group.entryHref === pathname ? "page" : undefined
                  }
                  className="navigation-tree__group-title navigation-tree__group-title--link"
                  href={group.entryHref}
                  id={titleId}
                  onClick={onNavigate}
                >
                  {group.title}
                </Link>
              ) : (
                <div className="navigation-tree__group-title" id={titleId}>
                  {group.title}
                </div>
              )
            ) : null}
            <ul aria-labelledby={titleId} className="navigation-tree__list">
              {group.items.map((item) => (
                <NavigationItem
                  item={item}
                  key={`${item.id}-${pathname}`}
                  onNavigate={onNavigate}
                  pathname={pathname}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
