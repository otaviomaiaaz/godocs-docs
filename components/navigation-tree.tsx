"use client";

import {
  BarChart3,
  ChevronRight,
  Compass,
  FileText,
  Files,
  Search,
  Star,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type CSSProperties,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type {
  DocNavigationGroup,
  DocNavigationItem,
} from "@/lib/docs/navigation";

type NavigationTreeProps = {
  groups: DocNavigationGroup[];
  compact?: boolean;
  onNavigate?: () => void;
  showIcons?: boolean;
};

type NavigationAnimationOrder = {
  groupIndexes: Map<string, number>;
  itemIndexes: Map<string, number>;
};

function buildNavigationAnimationOrder(
  groups: DocNavigationGroup[],
): NavigationAnimationOrder {
  const groupIndexes = new Map<string, number>();
  const itemIndexes = new Map<string, number>();
  let nextIndex = 0;

  function indexItems(items: DocNavigationItem[]) {
    for (const item of items) {
      itemIndexes.set(item.id, nextIndex);
      nextIndex += 1;
      indexItems(item.children);
    }
  }

  for (const group of groups) {
    if (group.title) {
      groupIndexes.set(group.id, nextIndex);
      nextIndex += 1;
    }

    indexItems(group.items);
  }

  return { groupIndexes, itemIndexes };
}

function branchContainsPath(item: DocNavigationItem, pathname: string): boolean {
  return (
    item.href === pathname ||
    item.children.some((child) => branchContainsPath(child, pathname))
  );
}

function NavigationIcon({ item }: { item: DocNavigationItem }) {
  const key = item.id.split("/").at(-1) ?? item.id;
  const props = {
    "aria-hidden": true,
    className: "navigation-tree__icon",
    size: 17,
    strokeWidth: 1.8,
  } as const;

  switch (key) {
    case "busca-inteligente":
      return <Search {...props} />;
    case "documentos":
      return <Files {...props} />;
    case "favoritos":
      return <Star {...props} />;
    case "relatorios":
      return <BarChart3 {...props} />;
    case "visao-geral":
      return <Compass {...props} />;
    case "workflows":
      return <Workflow {...props} />;
    default:
      return <FileText {...props} />;
  }
}

function NavigationItem({
  compact,
  depth,
  item,
  animationIndex,
  animationOrder,
  pathname,
  onNavigate,
  showIcons,
}: {
  compact: boolean;
  depth: number;
  item: DocNavigationItem;
  animationIndex: number;
  animationOrder: NavigationAnimationOrder;
  pathname: string;
  onNavigate?: () => void;
  showIcons: boolean;
}) {
  const branchIsActive = branchContainsPath(item, pathname);
  const [isOpen, setIsOpen] = useState(branchIsActive);
  const previousPathnameRef = useRef(pathname);
  const baseId = useId();
  const childrenId = `${baseId}-children`;
  const tooltipId = `${baseId}-tooltip`;
  const hasChildren = item.children.length > 0;
  const displaysIcon = showIcons && depth === 0;

  useEffect(() => {
    if (previousPathnameRef.current !== pathname && branchIsActive) {
      setIsOpen(true);
    }

    previousPathnameRef.current = pathname;
  }, [branchIsActive, pathname]);

  return (
    <li
      className="navigation-tree__item"
      data-depth={depth}
      style={
        { "--navigation-item-index": animationIndex } as CSSProperties
      }
    >
      <div
        className="navigation-tree__row"
        data-has-children={hasChildren ? "true" : "false"}
      >
        {item.href ? (
          <Link
            aria-current={item.href === pathname ? "page" : undefined}
            aria-describedby={compact && displaysIcon ? tooltipId : undefined}
            aria-label={compact && displaysIcon ? item.label : undefined}
            className="navigation-tree__link"
            href={item.href}
            onClick={onNavigate}
          >
            {displaysIcon ? <NavigationIcon item={item} /> : null}
            <span className="navigation-tree__label">{item.label}</span>
          </Link>
        ) : (
          <span className="navigation-tree__branch-label">
            {displaysIcon ? <NavigationIcon item={item} /> : null}
            <span className="navigation-tree__label">{item.label}</span>
          </span>
        )}

        {hasChildren ? (
          <button
            aria-controls={childrenId}
            aria-expanded={isOpen}
            aria-hidden={compact ? "true" : undefined}
            aria-label={`${isOpen ? "Recolher" : "Expandir"} ${item.label}`}
            className="navigation-tree__expand"
            inert={compact ? true : undefined}
            onClick={() => setIsOpen((open) => !open)}
            tabIndex={compact ? -1 : undefined}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={15} />
          </button>
        ) : null}
      </div>

      {compact && displaysIcon ? (
        <span
          className="navigation-tree__tooltip"
          id={tooltipId}
          role="tooltip"
        >
          {item.label}
        </span>
      ) : null}

      {hasChildren ? (
        <div
          aria-hidden={!isOpen || compact ? "true" : undefined}
          className="navigation-tree__children-shell"
          data-state={isOpen && !compact ? "open" : "closed"}
          id={childrenId}
          inert={!isOpen || compact ? true : undefined}
        >
          <ul className="navigation-tree__children">
            {item.children.map((child, index) => (
              <NavigationItem
                compact={compact}
                depth={depth + 1}
                item={child}
                animationIndex={
                  animationOrder.itemIndexes.get(child.id) ?? index
                }
                animationOrder={animationOrder}
                key={child.id}
                onNavigate={onNavigate}
                pathname={pathname}
                showIcons={showIcons}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

export function NavigationTree({
  compact = false,
  groups,
  onNavigate,
  showIcons = false,
}: NavigationTreeProps) {
  const pathname = usePathname();
  const baseId = useId();
  const animationOrder = buildNavigationAnimationOrder(groups);

  return (
    <div
      className={`navigation-tree${showIcons ? " navigation-tree--sidebar" : ""}`}
      data-compact={compact ? "true" : "false"}
    >
      {groups.map((group) => {
        const titleId = group.title ? `${baseId}-${group.id}-title` : undefined;

        return (
          <div className="navigation-tree__group" key={group.id}>
            {group.title ? (
              <div
                aria-hidden={compact ? "true" : undefined}
                className="navigation-tree__group-title-shell"
                inert={compact ? true : undefined}
                style={
                  {
                    "--navigation-item-index":
                      animationOrder.groupIndexes.get(group.id) ?? 0,
                  } as CSSProperties
                }
              >
                {group.entryHref && group.entryPageType === "hub" ? (
                  <Link
                    aria-current={
                      group.entryHref === pathname ? "page" : undefined
                    }
                    className="navigation-tree__group-title navigation-tree__group-title--link"
                    href={group.entryHref}
                    id={titleId}
                    onClick={onNavigate}
                    tabIndex={compact ? -1 : undefined}
                  >
                    {group.title}
                  </Link>
                ) : (
                  <div className="navigation-tree__group-title" id={titleId}>
                    {group.title}
                  </div>
                )}
              </div>
            ) : null}
            <ul
              aria-labelledby={!compact ? titleId : undefined}
              aria-label={compact && group.title ? group.title : undefined}
              className="navigation-tree__list"
            >
              {group.items.map((item, index) => (
                <NavigationItem
                  compact={compact}
                  depth={0}
                  item={item}
                  animationIndex={
                    animationOrder.itemIndexes.get(item.id) ?? index
                  }
                  animationOrder={animationOrder}
                  key={item.id}
                  onNavigate={onNavigate}
                  pathname={pathname}
                  showIcons={showIcons}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
