"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  type FocusEvent,
  type KeyboardEvent,
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
const GHOST_MENU_CLOSE_DELAY = 120;

export function DocsSidebar({ groups }: DocsSidebarProps) {
  const pathname = usePathname();
  const { sidebarState, setSidebarState } = useDocsSidebarState();
  const [ghostMenuPathname, setGhostMenuPathname] = useState<string | null>(
    null,
  );
  const closeTimeoutRef = useRef<number | null>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dismissedByEscapeRef = useRef(false);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    },
    [],
  );

  if (groups.length === 0) return null;

  const isExpanded = sidebarState === "expanded";
  const isGhostMenuOpen = !isExpanded && ghostMenuPathname === pathname;
  const actionLabel = isExpanded
    ? "Recolher navegação"
    : "Expandir navegação";

  function cancelScheduledClose() {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function openGhostMenu() {
    if (isExpanded || dismissedByEscapeRef.current) return;

    cancelScheduledClose();
    setGhostMenuPathname(pathname);
  }

  function closeGhostMenu() {
    cancelScheduledClose();
    setGhostMenuPathname(null);
  }

  function scheduleGhostMenuClose() {
    cancelScheduledClose();
    closeTimeoutRef.current = window.setTimeout(() => {
      if (navigationRef.current?.contains(document.activeElement)) {
        closeTimeoutRef.current = null;
        return;
      }

      setGhostMenuPathname(null);
      closeTimeoutRef.current = null;
    }, GHOST_MENU_CLOSE_DELAY);
  }

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    const nextState = isExpanded ? "collapsed" : "expanded";

    dismissedByEscapeRef.current = false;
    setSidebarState(nextState);

    if (nextState === "collapsed" && event.detail === 0) {
      setGhostMenuPathname(pathname);
    } else {
      closeGhostMenu();
    }
  }

  function handlePointerEnter(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;

    dismissedByEscapeRef.current = false;
    openGhostMenu();
  }

  function handlePointerLeave(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch" || !isGhostMenuOpen) return;
    scheduleGhostMenuClose();
  }

  function handleFocus(event: FocusEvent<HTMLElement>) {
    if (event.target === toggleRef.current || isGhostMenuOpen) {
      openGhostMenu();
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (
      !event.currentTarget.contains(event.relatedTarget as Node | null)
    ) {
      dismissedByEscapeRef.current = false;
      closeGhostMenu();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || !isGhostMenuOpen) return;

    event.preventDefault();
    event.stopPropagation();
    dismissedByEscapeRef.current = true;
    closeGhostMenu();
    toggleRef.current?.focus({ preventScroll: true });
  }

  return (
    <aside
      aria-label="Navegação lateral"
      className="docs-sidebar"
      data-sidebar-state={sidebarState}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="docs-sidebar__controls"
        onPointerEnter={handlePointerEnter}
      >
        <button
          aria-controls={NAVIGATION_ID}
          aria-expanded={isExpanded}
          aria-label={actionLabel}
          className="icon-button docs-sidebar__toggle"
          onClick={handleToggle}
          ref={toggleRef}
          title={actionLabel}
          type="button"
        >
          <PanelLeftClose
            aria-hidden="true"
            className="docs-sidebar__toggle-icon docs-sidebar__toggle-icon--collapse"
            size={18}
          />
          <PanelLeftOpen
            aria-hidden="true"
            className="docs-sidebar__toggle-icon docs-sidebar__toggle-icon--expand"
            size={18}
          />
        </button>
      </div>
      <nav
        aria-hidden={!isExpanded && !isGhostMenuOpen ? "true" : undefined}
        aria-label="Navegação da documentação"
        className="docs-sidebar__navigation"
        data-ghost-menu={isGhostMenuOpen ? "open" : "closed"}
        id={NAVIGATION_ID}
        inert={!isExpanded && !isGhostMenuOpen ? true : undefined}
        onPointerEnter={handlePointerEnter}
        ref={navigationRef}
      >
        <NavigationTree groups={groups} onNavigate={closeGhostMenu} />
      </nav>
    </aside>
  );
}
