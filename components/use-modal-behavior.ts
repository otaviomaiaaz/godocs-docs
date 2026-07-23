"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type UseModalBehaviorOptions = {
  isOpen: boolean;
  onClose: () => void;
  dialogRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
};

export function useModalBehavior({
  isOpen,
  onClose,
  dialogRef,
  triggerRef,
  initialFocusRef,
}: UseModalBehaviorOptions) {
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const siteShell = document.getElementById("site-shell");
    const previousOverflow = document.body.style.overflow;
    const previousInert = siteShell?.hasAttribute("inert") ?? false;

    document.body.style.overflow = "hidden";
    siteShell?.setAttribute("inert", "");

    const focusFrame = window.requestAnimationFrame(() => {
      const firstFocusable = dialog?.querySelector<HTMLElement>(
        FOCUSABLE_SELECTOR,
      );
      (initialFocusRef?.current ?? firstFocusable ?? dialog)?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (siteShell && !previousInert) siteShell.removeAttribute("inert");
      trigger?.focus();
    };
  }, [dialogRef, initialFocusRef, isOpen, onClose, triggerRef]);
}
