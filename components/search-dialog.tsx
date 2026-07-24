"use client";

import {
  ArrowRight,
  FileText,
  LoaderCircle,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
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

import { useModalBehavior } from "@/components/use-modal-behavior";
import {
  hasUsefulSearchQuery,
  isSearchIndex,
  searchDocuments,
  type SearchIndex,
} from "@/lib/docs/search";

type IndexState = "idle" | "loading" | "ready" | "error";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [indexState, setIndexState] = useState<IndexState>("idle");
  const router = useRouter();
  const baseId = useId();
  const dialogId = `${baseId}-dialog`;
  const dialogTitleId = `${baseId}-title`;
  const dialogDescriptionId = `${baseId}-description`;
  const inputId = `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;
  const statusId = `${baseId}-status`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  const results = useMemo(
    () => (index ? searchDocuments(index, query, 10) : []),
    [index, query],
  );
  const hasUsefulQuery = hasUsefulSearchQuery(query);
  const safeActiveIndex =
    results.length > 0 ? Math.min(activeIndex, results.length - 1) : 0;
  const activeResult = results[safeActiveIndex];
  const activeOptionId = activeResult
    ? `${baseId}-option-${safeActiveIndex}`
    : undefined;

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const loadIndex = useCallback(async () => {
    if (requestRef.current) return;

    const controller = new AbortController();
    requestRef.current = controller;
    setIndexState("loading");

    try {
      const response = await fetch("/search-index.json", {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Falha ao carregar o índice (${response.status})`);
      }

      const payload: unknown = await response.json();
      if (!isSearchIndex(payload)) {
        throw new Error("O índice de pesquisa recebido é inválido");
      }

      setIndex(payload);
      setIndexState("ready");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setIndexState("error");
    } finally {
      requestRef.current = null;
    }
  }, []);

  const openDialog = useCallback(() => {
    setIsOpen(true);
    if (indexState === "idle") void loadIndex();
  }, [indexState, loadIndex]);

  const retryIndex = useCallback(() => {
    setIndex(null);
    void loadIndex();
  }, [loadIndex]);

  const chooseResult = useCallback(
    (href: string) => {
      closeDialog();
      router.push(href);
    },
    [closeDialog, router],
  );

  useModalBehavior({
    dialogRef,
    initialFocusRef: inputRef,
    isOpen,
    onClose: closeDialog,
    triggerRef,
  });

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

  useEffect(
    () => () => {
      requestRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    if (!isOpen || !activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView({ block: "nearest" });
  }, [activeOptionId, isOpen]);

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
      const result = results[safeActiveIndex];
      if (result) chooseResult(result.href);
    }
  }

  const resultAnnouncement =
    indexState === "ready" && hasUsefulQuery
      ? `${results.length} ${
          results.length === 1 ? "resultado encontrado" : "resultados encontrados"
        }`
      : "";

  return (
    <>
      <button
        aria-controls={dialogId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Pesquisar na documentação"
        className="search-trigger"
        onClick={openDialog}
        ref={triggerRef}
        type="button"
      >
        <Search aria-hidden="true" size={17} strokeWidth={1.8} />
        <span className="search-trigger__label">Buscar</span>
        <kbd className="search-trigger__shortcut">
          <span className="shortcut-command">⌘</span>
          <span className="shortcut-control">Ctrl</span>
          <span>K</span>
        </kbd>
      </button>

      {isOpen
        ? createPortal(
            <dialog
              aria-describedby={dialogDescriptionId}
              aria-labelledby={dialogTitleId}
              className="search-dialog"
              id={dialogId}
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) closeDialog();
              }}
              ref={dialogRef}
            >
              <div className="search-dialog__toolbar">
                <h2 className="sr-only" id={dialogTitleId}>
                  Pesquisar na documentação
                </h2>
                <div className="search-field">
                  <Search aria-hidden="true" size={19} strokeWidth={1.8} />
                  <label className="sr-only" htmlFor={inputId}>
                    Termo de pesquisa
                  </label>
                  <input
                    aria-activedescendant={activeOptionId}
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-describedby={statusId}
                    aria-expanded={isOpen}
                    autoComplete="off"
                    id={inputId}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Buscar na documentação..."
                    ref={inputRef}
                    role="combobox"
                    type="search"
                    value={query}
                  />
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
                Pesquise nos documentos publicados. Use as setas para navegar
                nos resultados, Enter para abrir e Tab para percorrer os
                controles.
              </p>

              <p
                aria-live="polite"
                className="sr-only"
                id={statusId}
                role="status"
              >
                {resultAnnouncement}
              </p>

              <div className="search-dialog__results">
                  {indexState === "idle" || indexState === "loading" ? (
                    <div aria-live="polite" className="search-empty">
                      <span aria-hidden="true" className="search-empty__icon">
                        <LoaderCircle
                          className="search-loading-icon"
                          size={22}
                          strokeWidth={1.6}
                        />
                      </span>
                      <p>Carregando índice de pesquisa...</p>
                    </div>
                  ) : indexState === "error" ? (
                    <div className="search-empty">
                      <span aria-hidden="true" className="search-empty__icon">
                        <FileText size={22} strokeWidth={1.6} />
                      </span>
                      <p>Não foi possível carregar a pesquisa.</p>
                      <button
                        className="search-retry"
                        onClick={retryIndex}
                        type="button"
                      >
                        <RotateCcw aria-hidden="true" size={15} />
                        Tentar novamente
                      </button>
                    </div>
                  ) : !index || index.entries.length === 0 ? (
                    <div className="search-empty">
                      <span aria-hidden="true" className="search-empty__icon">
                        <FileText size={22} strokeWidth={1.6} />
                      </span>
                      <p>Nenhum conteúdo disponível para pesquisa.</p>
                    </div>
                  ) : query.trim() === "" ? (
                    <p className="search-hint">Digite um termo para pesquisar.</p>
                  ) : !hasUsefulQuery ? (
                    <p className="search-hint">
                      Digite ao menos dois caracteres para pesquisar.
                    </p>
                  ) : results.length === 0 ? (
                    <p className="search-hint">
                      Nenhum resultado encontrado para “{query.trim()}”.
                    </p>
                  ) : null}
                  <div
                    aria-label="Resultados da pesquisa"
                    className="search-results-list"
                    id={listboxId}
                    role="listbox"
                  >
                    {indexState === "ready" && hasUsefulQuery
                      ? results.map((result, resultIndex) => (
                        <button
                          aria-selected={resultIndex === safeActiveIndex}
                          className="search-result"
                          id={`${baseId}-option-${resultIndex}`}
                          key={result.href}
                          onClick={() => chooseResult(result.href)}
                          onFocus={() => setActiveIndex(resultIndex)}
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
                        ))
                      : null}
                  </div>
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
