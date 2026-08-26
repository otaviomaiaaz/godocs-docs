"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSyncExternalStore } from "react";

import { NavigationTree } from "@/components/navigation-tree";
import type { DocNavigationGroup } from "@/lib/docs/navigation";

type DocsSidebarProps = {
  groups: DocNavigationGroup[];
};

type SidebarState = "expanded" | "collapsed";

const NAVIGATION_ID = "docs-sidebar-navigation";
const STORAGE_KEY = "godocs-docs-sidebar";
const sidebarStateListeners = new Set<() => void>();

function getDocumentSidebarState(): SidebarState | null {
  return document.documentElement.dataset.docsSidebar === "collapsed"
    ? "collapsed"
    : "expanded";
}

function getServerSidebarState(): SidebarState | null {
  return null;
}

function subscribeToSidebarState(listener: () => void) {
  sidebarStateListeners.add(listener);
  return () => {
    sidebarStateListeners.delete(listener);
  };
}

function applyDocumentSidebarState(nextState: SidebarState) {
  document.documentElement.dataset.docsSidebar = nextState;
  sidebarStateListeners.forEach((listener) => listener());
}

export function DocsSidebar({ groups }: DocsSidebarProps) {
  const sidebarStateSnapshot = useSyncExternalStore(
    subscribeToSidebarState,
    getDocumentSidebarState,
    getServerSidebarState,
  );

  if (groups.length === 0) return null;

  const sidebarState = sidebarStateSnapshot ?? "expanded";
  const isExpanded = sidebarState === "expanded";
  const isAligned = sidebarStateSnapshot !== null;
  const actionLabel = isExpanded
    ? "Recolher navegação lateral"
    : "Expandir navegação lateral";

  function handleToggle() {
    if (!isAligned) return;

    const nextState: SidebarState = isExpanded ? "collapsed" : "expanded";

    applyDocumentSidebarState(nextState);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextState);
    } catch {
      // A preferência continua válida durante a sessão atual.
    }
  }

  return (
    <aside aria-label="Navegação lateral" className="docs-sidebar">
      <div className="docs-sidebar__controls">
        <button
          aria-controls={NAVIGATION_ID}
          aria-expanded={isExpanded}
          aria-label={actionLabel}
          className="icon-button docs-sidebar__toggle"
          disabled={!isAligned}
          onClick={handleToggle}
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
        aria-label="Navegação da documentação"
        className="docs-sidebar__navigation"
        hidden={!isExpanded}
        id={NAVIGATION_ID}
      >
        <NavigationTree groups={groups} />
      </nav>
    </aside>
  );
}
