"use client";

import { ArrowRight, FileText, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import {
  searchDocuments,
  type SearchDocument,
} from "@/lib/docs/search";

type SearchDialogProps = {
  index: SearchDocument[];
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

export function SearchDialog({ index }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchDocuments(index, query), [index, query]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const openDialog = useCallback(() => setIsOpen(true), []);

  const chooseResult = useCallback(
    (href: string) => {
      closeDialog();
      router.push(href);
    },
    [closeDialog, router],
  );

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        event.key.toLocaleLowerCase("pt-BR") === "k" &&
        (event.metaKey || event.ctrlKey) &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault();
        openDialog();
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [openDialog]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => inputRef.current?.focus());

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
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

    document.addEventListener("keydown", handleDialogKeyDown);

    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [closeDialog, isOpen]);

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current === 0 ? results.length - 1 : current - 1,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const result = results[activeIndex];
      if (result) chooseResult(result.href);
    }
  }

  return (
    <>
      <button
        aria-label="Pesquisar na documentação"
        aria-haspopup="dialog"
        className="search-trigger"
        onClick={openDialog}
        ref={triggerRef}
        type="button"
      >
        <Search aria-hidden="true" size={17} strokeWidth={1.8} />
        <span className="search-trigger__label">Pesquisar na documentação...</span>
        <span className="search-trigger__mobile-label">Buscar</span>
        <kbd className="search-trigger__shortcut">
          <span className="shortcut-command">⌘</span>
          <span className="shortcut-control">Ctrl</span>
          <span>K</span>
        </kbd>
      </button>

      {isOpen
        ? createPortal(
            <div
              className="search-backdrop"
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) closeDialog();
              }}
            >
              <div
                aria-describedby={dialogDescriptionId}
                aria-labelledby={dialogTitleId}
                aria-modal="true"
                className="search-dialog"
                ref={dialogRef}
                role="dialog"
              >
                <div className="search-dialog__heading">
                  <div>
                    <p className="eyebrow">PESQUISA LOCAL</p>
                    <h2 id={dialogTitleId}>Pesquisar na documentação</h2>
                  </div>
                  <button
                    aria-label="Fechar pesquisa"
                    className="icon-button"
                    onClick={closeDialog}
                    type="button"
                  >
                    <X aria-hidden="true" size={18} />
                  </button>
                </div>

                <p className="sr-only" id={dialogDescriptionId}>
                  Pesquise nos documentos publicados. Use as setas para navegar nos
                  resultados e Enter para abrir.
                </p>

                <div className="search-field">
                  <Search aria-hidden="true" size={19} strokeWidth={1.8} />
                  <label className="sr-only" htmlFor={`${dialogTitleId}-input`}>
                    Termo de pesquisa
                  </label>
                  <input
                    autoComplete="off"
                    id={`${dialogTitleId}-input`}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Pesquisar na documentação..."
                    ref={inputRef}
                    type="search"
                    value={query}
                  />
                  <kbd>Esc</kbd>
                </div>

                <div aria-live="polite" className="search-dialog__results">
                  {index.length === 0 ? (
                    <div className="search-empty">
                      <span aria-hidden="true" className="search-empty__icon">
                        <FileText size={22} strokeWidth={1.6} />
                      </span>
                      <p>Nenhum conteúdo disponível para pesquisa.</p>
                    </div>
                  ) : query.trim() === "" ? (
                    <p className="search-hint">Digite um termo para pesquisar.</p>
                  ) : results.length === 0 ? (
                    <p className="search-hint">
                      Nenhum resultado encontrado para “{query.trim()}”.
                    </p>
                  ) : (
                    <ul aria-label="Resultados da pesquisa" role="listbox">
                      {results.map((result, resultIndex) => (
                        <li key={result.href}>
                          <button
                            aria-selected={resultIndex === activeIndex}
                            className="search-result"
                            onClick={() => chooseResult(result.href)}
                            onMouseEnter={() => setActiveIndex(resultIndex)}
                            role="option"
                            type="button"
                          >
                            <span>
                              {result.section ? (
                                <span className="search-result__section">
                                  {result.section}
                                </span>
                              ) : null}
                              <strong>{result.title}</strong>
                              <small>{result.description}</small>
                            </span>
                            <ArrowRight aria-hidden="true" size={17} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="search-dialog__footer" aria-hidden="true">
                  <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
                  <span><kbd>↵</kbd> abrir</span>
                  <span><kbd>Esc</kbd> fechar</span>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
