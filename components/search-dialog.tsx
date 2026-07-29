"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
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
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useModalBehavior } from "@/components/use-modal-behavior";
import {
  getUsefulSearchTerms,
  hasUsefulSearchQuery,
  isSearchIndex,
  normalizeSearchText,
  searchDocuments,
  type SearchIndex,
  type SearchResult,
} from "@/lib/docs/search";

type IndexState = "idle" | "loading" | "ready" | "error";
type SearchLauncherProps = {
  variant?: "header" | "hero";
};
type SearchOpenEvent = CustomEvent<{ trigger: HTMLButtonElement }>;

const OPEN_SEARCH_EVENT = "godocs:open-search";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function ShortcutHint() {
  return (
    <kbd className="search-trigger__shortcut">
      <span className="shortcut-command">⌘</span>
      <span className="shortcut-control">Ctrl</span>
      <span>K</span>
    </kbd>
  );
}

export function SearchLauncher({
  variant = "header",
}: SearchLauncherProps) {
  return (
    <button
      aria-haspopup="dialog"
      aria-label="Pesquisar na documentação"
      className={`search-trigger search-trigger--${variant}`}
      data-search-trigger={variant}
      onClick={(event) => {
        window.dispatchEvent(
          new CustomEvent(OPEN_SEARCH_EVENT, {
            detail: { trigger: event.currentTarget },
          }),
        );
      }}
      type="button"
    >
      <Search aria-hidden="true" size={variant === "hero" ? 20 : 17} strokeWidth={1.8} />
      <span className="search-trigger__label">
        {variant === "hero" ? "Pesquisar na documentação" : "Buscar"}
      </span>
      <ShortcutHint />
    </button>
  );
}

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const terms = getUsefulSearchTerms(query);
  if (terms.length === 0) return text;

  return text
    .split(/(\p{L}[\p{L}\p{N}-]*)/gu)
    .map<ReactNode>((part, index) => {
      const normalizedPart = normalizeSearchText(part);
      const isMatch = terms.some(
        (term) =>
          normalizedPart === term ||
          (term.length >= 3 && normalizedPart.startsWith(term)),
      );

      return isMatch ? <mark key={`${part}-${index}`}>{part}</mark> : part;
    });
}

function ResultOption({
  active,
  baseId,
  index,
  onChoose,
  onSelect,
  query,
  result,
}: {
  active: boolean;
  baseId: string;
  index: number;
  onChoose: (href: string) => void;
  onSelect: (index: number) => void;
  query: string;
  result: SearchResult;
}) {
  const context =
    result.kind === "section"
      ? [result.pageTitle, result.section].filter(Boolean).join(" · ")
      : (result.section ?? "Documentação");

  return (
    <button
      aria-selected={active}
      className="search-result"
      id={`${baseId}-option-${index}`}
      onClick={() => onChoose(result.href)}
      onFocus={() => onSelect(index)}
      onMouseEnter={() => onSelect(index)}
      role="option"
      type="button"
    >
      <span className="search-result__content">
        <span className="search-result__section">{context}</span>
        <strong>
          <HighlightedText query={query} text={result.title} />
        </strong>
        <small>
          <HighlightedText query={query} text={result.description} />
        </small>
      </span>
      <ArrowRight aria-hidden="true" size={17} />
    </button>
  );
}

export function SearchDialog({ showLauncher = true }: { showLauncher?: boolean }) {
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
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  const rankedResults = useMemo(
    () => (index ? searchDocuments(index, query, 12) : []),
    [index, query],
  );
  const results = useMemo(
    () => [
      ...rankedResults.filter((result) => result.kind === "page"),
      ...rankedResults.filter((result) => result.kind === "section"),
    ],
    [rankedResults],
  );
  const suggestions = useMemo(
    () => index?.entries.filter((entry) => entry.kind === "page").slice(0, 5) ?? [],
    [index],
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

  const openDialog = useCallback(
    (trigger?: HTMLElement | null) => {
      returnFocusRef.current =
        trigger ??
        (document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null);
      setIsOpen(true);
      if (indexState === "idle") void loadIndex();
    },
    [indexState, loadIndex],
  );

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
    triggerRef: returnFocusRef,
  });

  useEffect(() => {
    function handleOpen(event: Event) {
      openDialog((event as SearchOpenEvent).detail?.trigger);
    }

    function handleShortcut(event: KeyboardEvent) {
      if (
        event.key.toLocaleLowerCase("pt-BR") === "k" &&
        (event.metaKey || event.ctrlKey) &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault();
        const preferredTrigger =
          document.querySelector<HTMLElement>(
            '[data-search-trigger="header"]',
          ) ??
          document.querySelector<HTMLElement>(
            '[data-search-trigger="hero"]',
          );
        openDialog(preferredTrigger);
      }
    }

    window.addEventListener(OPEN_SEARCH_EVENT, handleOpen);
    document.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, handleOpen);
      document.removeEventListener("keydown", handleShortcut);
    };
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
  const groupedResults = [
    {
      id: "pages",
      title: "Páginas",
      results: results.filter((result) => result.kind === "page"),
    },
    {
      id: "sections",
      title: "Seções",
      results: results.filter((result) => result.kind === "section"),
    },
  ].filter((group) => group.results.length > 0);

  return (
    <>
      {showLauncher ? <SearchLauncher /> : null}

      {isOpen
        ? createPortal(
            <dialog
              aria-describedby={dialogDescriptionId}
              aria-labelledby={dialogTitleId}
              className="search-dialog"
              data-query-empty={query.trim() === ""}
              id={dialogId}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  closeDialog();
                }
              }}
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
                    placeholder="Buscar páginas e seções..."
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
                  <div className="search-discovery">
                    <header>
                      <p>Comece com uma página sugerida</p>
                      <span>
                        A pesquisa também encontra títulos de seções internas.
                      </span>
                    </header>
                    <ul>
                      {suggestions.map((suggestion) => (
                        <li key={suggestion.href}>
                          <button
                            onClick={() => chooseResult(suggestion.href)}
                            type="button"
                          >
                            <span>
                              <strong>{suggestion.title}</strong>
                              <small>
                                {suggestion.section ?? "Documentação"}
                              </small>
                            </span>
                            <ArrowRight aria-hidden="true" size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : !hasUsefulQuery ? (
                  <p className="search-hint">
                    Digite ao menos dois caracteres para pesquisar.
                  </p>
                ) : results.length === 0 ? (
                  <p aria-live="polite" className="search-hint">
                    Nenhum resultado encontrado para “{query.trim()}”.
                  </p>
                ) : (
                  <div
                    aria-label="Resultados da pesquisa"
                    className="search-results-list"
                    id={listboxId}
                    role="listbox"
                  >
                    {groupedResults.map((group) => (
                      <section
                        aria-labelledby={`${baseId}-${group.id}-title`}
                        className="search-result-group"
                        key={group.id}
                        role="group"
                      >
                        <h3 id={`${baseId}-${group.id}-title`}>
                          {group.title}
                        </h3>
                        {group.results.map((result) => {
                          const resultIndex = results.indexOf(result);

                          return (
                            <ResultOption
                              active={resultIndex === safeActiveIndex}
                              baseId={baseId}
                              index={resultIndex}
                              key={result.href}
                              onChoose={chooseResult}
                              onSelect={setActiveIndex}
                              query={query}
                              result={result}
                            />
                          );
                        })}
                      </section>
                    ))}
                  </div>
                )}
              </div>

              <footer className="search-dialog__footer">
                <span>
                  <kbd>
                    <ArrowUp aria-hidden="true" size={12} />
                    <ArrowDown aria-hidden="true" size={12} />
                  </kbd>
                  Navegar
                </span>
                <span>
                  <kbd>
                    <CornerDownLeft aria-hidden="true" size={12} />
                  </kbd>
                  Abrir
                </span>
                <span>
                  <kbd>Esc</kbd>
                  Fechar
                </span>
              </footer>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
