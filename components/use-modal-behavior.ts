"use client";

import { useEffect, type RefObject } from "react";

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
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();

    const focusFrame = window.requestAnimationFrame(() => {
      const firstFocusable = dialog.querySelector<HTMLElement>(
        FOCUSABLE_SELECTOR,
      );
      (initialFocusRef?.current ?? firstFocusable ?? dialog)?.focus();
    });

    function handleCancel(event: Event) {
      event.preventDefault();
      onClose();
    }

    dialog.addEventListener("cancel", handleCancel);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      dialog.removeEventListener("cancel", handleCancel);
      if (dialog.open) dialog.close();
      trigger?.focus();
    };
  }, [dialogRef, initialFocusRef, isOpen, onClose, triggerRef]);
}
