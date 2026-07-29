"use client";

import { useLayoutEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type UseModalBehaviorOptions = {
  isOpen: boolean;
  onClose: () => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
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
  useLayoutEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();

    const firstFocusable =
      dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (initialFocusRef?.current ?? firstFocusable ?? dialog)?.focus({
      preventScroll: true,
    });

    function handleCancel(event: Event) {
      event.preventDefault();
      onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    }

    dialog.addEventListener("cancel", handleCancel);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      document.removeEventListener("keydown", handleKeyDown);
      if (dialog.open) dialog.close();
      trigger?.focus({ preventScroll: true });
    };
  }, [dialogRef, initialFocusRef, isOpen, onClose, triggerRef]);
}
