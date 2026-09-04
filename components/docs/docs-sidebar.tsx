"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useDocsSidebarState } from "@/components/docs/docs-sidebar-state";
import { NavigationTree } from "@/components/navigation-tree";
import type { DocNavigationGroup } from "@/lib/docs/navigation";

type DocsSidebarProps = {
  groups: DocNavigationGroup[];
};

const NAVIGATION_ID = "docs-sidebar-navigation";
const HOVER_INTENT_DELAY = 130;
const PREVIEW_CLOSE_DELAY = 240;
const HOVER_CAPABILITY_QUERY = "(hover: hover) and (pointer: fine)";
const PREVIEW_INTENT_SELECTOR =
  ".docs-sidebar__toggle, .navigation-tree__row, .navigation-tree__group-title--link";

export function DocsSidebar({ groups }: DocsSidebarProps) {
  const pathname = usePathname();
  const { sidebarState, setSidebarState } = useDocsSidebarState();
  const [previewPathname, setPreviewPathname] = useState<string | null>(null);
  const openTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dismissedByEscapeRef = useRef(false);
  const previewOpenedByFocusRef = useRef(false);
  const isExpanded = sidebarState === "expanded";
  const isPreviewOpen = !isExpanded && previewPathname === pathname;
  const isCompact = !isExpanded && !isPreviewOpen;
  const actionLabel = isExpanded
    ? "Recolher navegação"
    : "Expandir navegação";

  useEffect(
    () => () => {
      if (openTimeoutRef.current !== null) {
        window.clearTimeout(openTimeoutRef.current);
      }

      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isPreviewOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      event.stopPropagation();
      cancelScheduledOpen();
      cancelScheduledClose();
      dismissedByEscapeRef.current = true;
      previewOpenedByFocusRef.current = false;
      setPreviewPathname(null);
      toggleRef.current?.focus({ preventScroll: true });
    }

    document.addEventListener("keydown", handleEscape, true);

    return () => document.removeEventListener("keydown", handleEscape, true);
  }, [isPreviewOpen]);

  if (groups.length === 0) return null;

  function cancelScheduledOpen() {
    if (openTimeoutRef.current !== null) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  }

  function cancelScheduledClose() {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function supportsHoverPreview() {
    return window.matchMedia(HOVER_CAPABILITY_QUERY).matches;
  }

  function openPreview(source: "focus" | "pointer") {
    if (isExpanded || dismissedByEscapeRef.current) return;

    cancelScheduledOpen();
    cancelScheduledClose();
    previewOpenedByFocusRef.current = source === "focus";
    setPreviewPathname(pathname);
  }

  function closePreview() {
    cancelScheduledOpen();
    cancelScheduledClose();
    previewOpenedByFocusRef.current = false;
    setPreviewPathname(null);
  }

  function schedulePreviewOpen() {
    if (isExpanded || isPreviewOpen || dismissedByEscapeRef.current) return;

    cancelScheduledOpen();
    cancelScheduledClose();
    openTimeoutRef.current = window.setTimeout(() => {
      openTimeoutRef.current = null;
      openPreview("pointer");
    }, HOVER_INTENT_DELAY);
  }

  function schedulePreviewClose() {
    cancelScheduledClose();
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;

      if (
        previewOpenedByFocusRef.current &&
        document.activeElement &&
        eventTargetContains(document.activeElement)
      ) {
        return;
      }

      setPreviewPathname(null);
    }, PREVIEW_CLOSE_DELAY);
  }

  function eventTargetContains(target: Element) {
    return toggleRef.current?.closest("aside")?.contains(target) ?? false;
  }

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    const nextState = isExpanded ? "collapsed" : "expanded";

    cancelScheduledOpen();
    cancelScheduledClose();
    dismissedByEscapeRef.current = false;
    setSidebarState(nextState);

    if (nextState === "collapsed" && event.detail === 0) {
      previewOpenedByFocusRef.current = true;
      setPreviewPathname(pathname);
    } else if (nextState === "collapsed") {
      previewOpenedByFocusRef.current = false;
      setPreviewPathname(null);
    } else {
      previewOpenedByFocusRef.current = false;
      setPreviewPathname(null);
    }
  }

  function handlePointerEnter(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch" || !supportsHoverPreview()) return;

    if (
      !isPreviewOpen &&
      event.target instanceof Element &&
      !event.target.closest(PREVIEW_INTENT_SELECTOR)
    ) {
      return;
    }

    dismissedByEscapeRef.current = false;
    if (isPreviewOpen) {
      cancelScheduledClose();
      return;
    }

    schedulePreviewOpen();
  }

  function handlePointerLeave(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;

    dismissedByEscapeRef.current = false;
    cancelScheduledOpen();
    if (!isPreviewOpen) return;
    schedulePreviewClose();
  }

  function handleFocus(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.target)) return;
    cancelScheduledOpen();
    openPreview("focus");
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      dismissedByEscapeRef.current = false;
      closePreview();
    }
  }

  return (
    <aside
      aria-label="Navegação lateral"
      className="docs-sidebar"
      data-preview={isPreviewOpen ? "open" : "closed"}
      data-sidebar-state={sidebarState}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="docs-sidebar__controls">
        <button
          aria-controls={NAVIGATION_ID}
          aria-expanded={isExpanded}
          aria-label={actionLabel}
          className="icon-button docs-sidebar__toggle"
          onClick={handleToggle}
          ref={toggleRef}
          type="button"
        >
          <ChevronLeft
            aria-hidden="true"
            className="docs-sidebar__toggle-icon"
            size={16}
            strokeWidth={1.8}
          />
        </button>
      </div>
      <nav
        aria-label="Navegação da documentação"
        className="docs-sidebar__navigation"
        id={NAVIGATION_ID}
      >
        <NavigationTree
          compact={isCompact}
          groups={groups}
          onNavigate={closePreview}
          showIcons
        />
      </nav>
    </aside>
  );
}
