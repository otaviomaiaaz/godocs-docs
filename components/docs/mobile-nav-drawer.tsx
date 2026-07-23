"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { NavigationTree } from "@/components/navigation-tree";
import type { DocNavigationGroup } from "@/lib/docs/navigation";

type MobileNavDrawerProps = {
  groups: DocNavigationGroup[];
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavDrawer({ groups }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
      FOCUSABLE_SELECTOR,
    );
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  if (groups.length === 0) {
    return null;
  }

  return (
    <>
      <button
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
                if (event.currentTarget === event.target) setIsOpen(false);
              }}
            >
              <div
                aria-labelledby={titleId}
                aria-modal="true"
                className="drawer"
                ref={drawerRef}
                role="dialog"
              >
                <div className="drawer__header">
                  <h2 id={titleId}>Navegação</h2>
                  <button
                    aria-label="Fechar navegação"
                    className="icon-button"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  >
                    <X aria-hidden="true" size={18} />
                  </button>
                </div>
                <nav aria-label="Documentação" className="drawer__navigation">
                  <NavigationTree
                    groups={groups}
                    onNavigate={() => setIsOpen(false)}
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
