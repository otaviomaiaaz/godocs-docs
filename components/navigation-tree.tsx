"use client";

import {
  BarChart3,
  BookOpenText,
  ChevronRight,
  Compass,
  FileText,
  Files,
  LogIn,
  Search,
  Star,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useId, useMemo, useState } from "react";

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
  visibleItemCount: number;
};

type BranchOverride = {
  isOpen: boolean;
  pathname: string;
};

const NAVIGATION_CASCADE_BASE_STEP_MS = 9;
const NAVIGATION_CASCADE_MAX_STAGGER_MS = 85;

function getNavigationCascadeStep(visibleItemCount: number) {
  if (visibleItemCount <= 1) return NAVIGATION_CASCADE_BASE_STEP_MS;

  return Math.min(
    NAVIGATION_CASCADE_BASE_STEP_MS,
    NAVIGATION_CASCADE_MAX_STAGGER_MS / (visibleItemCount - 1),
  );
}

function buildNavigationAnimationOrder(
  groups: DocNavigationGroup[],
  openBranchIds: ReadonlySet<string>,
): NavigationAnimationOrder {
  const groupIndexes = new Map<string, number>();
  const itemIndexes = new Map<string, number>();
  let nextIndex = 0;

  function indexItems(items: DocNavigationItem[]) {
    for (const item of items) {
      itemIndexes.set(item.id, nextIndex);
      nextIndex += 1;

      if (openBranchIds.has(item.id)) {
        indexItems(item.children);
      }
    }
  }

  for (const group of groups) {
    if (group.title) {
      groupIndexes.set(group.id, nextIndex);
      nextIndex += 1;
    }

    indexItems(group.items);
  }

  return { groupIndexes, itemIndexes, visibleItemCount: nextIndex };
}

function branchContainsPath(item: DocNavigationItem, pathname: string): boolean {
  return (
    item.href === pathname ||
    item.children.some((child) => branchContainsPath(child, pathname))
  );
}

function collectActiveBranchIds(
  groups: DocNavigationGroup[],
  pathname: string,
) {
  const activeBranchIds = new Set<string>();

  function collect(items: DocNavigationItem[]) {
    for (const item of items) {
      if (item.children.length > 0 && branchContainsPath(item, pathname)) {
        activeBranchIds.add(item.id);
      }

      collect(item.children);
    }
  }

  for (const group of groups) {
    collect(group.items);
  }

  return activeBranchIds;
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
    case "o-que-e-o-godocs":
      return <BookOpenText {...props} />;
    case "primeiro-acesso":
      return <LogIn {...props} />;
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
  childIndex,
  depth,
  item,
  animationIndex,
  animationOrder,
  openBranchIds,
  pathname,
  onNavigate,
  onToggleBranch,
  showIcons,
}: {
  compact: boolean;
  childIndex: number;
  depth: number;
  item: DocNavigationItem;
  animationIndex?: number;
  animationOrder: NavigationAnimationOrder;
  openBranchIds: ReadonlySet<string>;
  pathname: string;
  onNavigate?: () => void;
  onToggleBranch: (itemId: string) => void;
  showIcons: boolean;
}) {
  const baseId = useId();
  const childrenId = `${baseId}-children`;
  const hasChildren = item.children.length > 0;
  const displaysIcon = showIcons && depth === 0;
  const isOpen = openBranchIds.has(item.id);

  return (
    <li
      className="navigation-tree__item"
      data-cascade-index={animationIndex}
      data-depth={depth}
      style={
        {
          "--navigation-child-index": childIndex,
          ...(animationIndex === undefined
            ? {}
            : { "--navigation-item-index": animationIndex }),
        } as CSSProperties
      }
    >
      <div
        className="navigation-tree__row"
        data-has-children={hasChildren ? "true" : "false"}
      >
        {item.href ? (
          <Link
            aria-current={item.href === pathname ? "page" : undefined}
            aria-label={compact && displaysIcon ? item.label : undefined}
            className="navigation-tree__link"
            href={item.href}
            onClick={onNavigate}
          >
            {displaysIcon ? <NavigationIcon item={item} /> : null}
            <span className="navigation-tree__label navigation-tree__cascade">
              {item.label}
            </span>
          </Link>
        ) : (
          <span className="navigation-tree__branch-label">
            {displaysIcon ? <NavigationIcon item={item} /> : null}
            <span className="navigation-tree__label navigation-tree__cascade">
              {item.label}
            </span>
          </span>
        )}

        {hasChildren ? (
          <button
            aria-controls={childrenId}
            aria-expanded={isOpen}
            aria-hidden={compact ? "true" : undefined}
            aria-label={`${isOpen ? "Recolher" : "Expandir"} ${item.label}`}
            className="navigation-tree__expand navigation-tree__cascade"
            inert={compact ? true : undefined}
            onClick={() => onToggleBranch(item.id)}
            tabIndex={compact ? -1 : undefined}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={15} />
          </button>
        ) : null}
      </div>

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
                childIndex={index}
                compact={compact}
                depth={depth + 1}
                item={child}
                animationIndex={animationOrder.itemIndexes.get(child.id)}
                animationOrder={animationOrder}
                key={child.id}
                onNavigate={onNavigate}
                onToggleBranch={onToggleBranch}
                openBranchIds={openBranchIds}
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
  const [branchOverrides, setBranchOverrides] = useState<
    Map<string, BranchOverride>
  >(() => new Map());
  const openBranchIds = useMemo(() => {
    const next = collectActiveBranchIds(groups, pathname);

    for (const [itemId, override] of branchOverrides) {
      if (override.isOpen) {
        next.add(itemId);
      } else if (override.pathname === pathname) {
        next.delete(itemId);
      }
    }

    return next;
  }, [branchOverrides, groups, pathname]);
  const animationOrder = useMemo(
    () => buildNavigationAnimationOrder(groups, openBranchIds),
    [groups, openBranchIds],
  );
  const cascadeStep = getNavigationCascadeStep(
    animationOrder.visibleItemCount,
  );
  function toggleBranch(itemId: string) {
    setBranchOverrides((current) => {
      const next = new Map(current);
      next.set(itemId, {
        isOpen: !openBranchIds.has(itemId),
        pathname,
      });
      return next;
    });
  }

  return (
    <div
      className={`navigation-tree${showIcons ? " navigation-tree--sidebar" : ""}`}
      data-compact={compact ? "true" : "false"}
      data-cascade-step-ms={cascadeStep.toFixed(3)}
      data-visible-item-count={animationOrder.visibleItemCount}
      style={
        {
          "--navigation-cascade-step": `${cascadeStep}ms`,
        } as CSSProperties
      }
    >
      {groups.map((group) => {
        const titleId = group.title ? `${baseId}-${group.id}-title` : undefined;

        return (
          <div className="navigation-tree__group" key={group.id}>
            {group.title ? (
              <div
                aria-hidden={compact ? "true" : undefined}
                className="navigation-tree__group-title-shell navigation-tree__cascade"
                data-cascade-index={
                  animationOrder.groupIndexes.get(group.id)
                }
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
                  childIndex={index}
                  compact={compact}
                  depth={0}
                  item={item}
                  animationIndex={animationOrder.itemIndexes.get(item.id)}
                  animationOrder={animationOrder}
                  key={item.id}
                  onNavigate={onNavigate}
                  onToggleBranch={toggleBranch}
                  openBranchIds={openBranchIds}
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
