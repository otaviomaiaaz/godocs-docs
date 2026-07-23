"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { NavigationTree } from "@/components/navigation-tree";
import { useModalBehavior } from "@/components/use-modal-behavior";
import type { DocNavigationGroup } from "@/lib/docs/navigation";

type MobileNavDrawerProps = {
  groups: DocNavigationGroup[];
};

export function MobileNavDrawer({ groups }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const baseId = useId();
  const drawerId = `${baseId}-drawer`;
  const titleId = `${baseId}-title`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  useModalBehavior({
    dialogRef: drawerRef,
    isOpen,
    onClose: closeDrawer,
    triggerRef,
  });

  if (groups.length === 0) {
    return null;
  }

  return (
    <>
      <button
        aria-controls={drawerId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Abrir navegação da documentação"
        className="icon-button mobile-nav-trigger"
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <Menu aria-hidden="true" size={19} />
      </button>

      {isOpen
        ? createPortal(
            <div
              className="drawer-backdrop"
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) closeDrawer();
              }}
            >
              <div
                aria-labelledby={titleId}
                aria-modal="true"
                className="drawer"
                id={drawerId}
                ref={drawerRef}
                role="dialog"
                tabIndex={-1}
              >
                <div className="drawer__header">
                  <h2 id={titleId}>Navegação</h2>
                  <button
                    aria-label="Fechar navegação"
                    className="icon-button"
                    onClick={closeDrawer}
                    type="button"
                  >
                    <X aria-hidden="true" size={18} />
                  </button>
                </div>
                <nav aria-label="Documentação" className="drawer__navigation">
                  <NavigationTree
                    groups={groups}
                    onNavigate={closeDrawer}
                  />
                </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
