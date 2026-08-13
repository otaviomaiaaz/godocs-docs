"use client";

import { ChevronDown } from "lucide-react";
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { DocHeading } from "@/lib/docs/schema";

type TableOfContentsProps = {
  headings: DocHeading[];
  variant?: "desktop" | "mobile";
};

type HeadingGroup = {
  heading: DocHeading;
  children: DocHeading[];
};

const MOBILE_DISCLOSURE_MIN_HEADINGS = 16;
const SCROLL_POSITION_TOLERANCE = 2;

function buildHeadingGroups(headings: DocHeading[]): HeadingGroup[] {
  const groups: HeadingGroup[] = [];

  for (const heading of headings) {
    const currentGroup = groups.at(-1);

    if (heading.depth === 3 && currentGroup?.heading.depth === 2) {
      currentGroup.children.push(heading);
      continue;
    }

    groups.push({ heading, children: [] });
  }

  return groups;
}

function parsePixelValue(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getActiveHeadingOffset(element: HTMLElement): number {
  const rootStyles = window.getComputedStyle(document.documentElement);
  const headingStyles = window.getComputedStyle(element);

  return (
    parsePixelValue(rootStyles.scrollPaddingTop) +
    parsePixelValue(headingStyles.scrollMarginTop) +
    SCROLL_POSITION_TOLERANCE
  );
}

function getParentHeadingId(headings: DocHeading[], headingId: string): string {
  let parentId = "";

  for (const heading of headings) {
    if (heading.depth === 2) {
      parentId = heading.id;
    }

    if (heading.id === headingId) {
      return heading.depth === 3 ? parentId : "";
    }
  }

  return "";
}

export function TableOfContents({
  headings,
  variant = "desktop",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(
    () => new Set(),
  );
  const navRef = useRef<HTMLElement>(null);
  const headingGroups = useMemo(() => buildHeadingGroups(headings), [headings]);
  // With the required 44px targets, 16 flat rows plus the summary nearly fill
  // the 844px reference viewport. Longer hierarchical TOCs disclose H3s on demand.
  const usesProgressiveDisclosure =
    variant === "mobile" &&
    headings.length >= MOBILE_DISCLOSURE_MIN_HEADINGS &&
    headingGroups.some((group) => group.children.length > 0);
  const activeParentId = useMemo(
    () => getParentHeadingId(headings, activeId),
    [activeId, headings],
  );
  const activateHeading = useCallback(
    (headingId: string) => {
      setActiveId(headingId);

      if (!usesProgressiveDisclosure) return;

      const parentId = getParentHeadingId(headings, headingId);
      if (!parentId) return;

      setExpandedGroupIds((currentIds) => {
        if (currentIds.has(parentId)) return currentIds;

        const nextIds = new Set(currentIds);
        nextIds.add(parentId);
        return nextIds;
      });
    },
    [headings, usesProgressiveDisclosure],
  );

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    let frame = 0;
    let hashFrame = 0;
    const updateActiveHeading = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const reachedPageEnd =
          Math.ceil(window.scrollY + window.innerHeight) >=
          document.documentElement.scrollHeight - 2;

        if (reachedPageEnd) {
          activateHeading(elements.at(-1)?.id ?? "");
          return;
        }

        const passed = elements.filter(
          (element) =>
            element.getBoundingClientRect().top <=
            getActiveHeadingOffset(element),
        );
        activateHeading(passed.at(-1)?.id ?? elements[0]?.id ?? "");
      });
    };

    const updateFromHash = (scrollToHeading = false) => {
      const hashId = decodeURIComponent(window.location.hash.slice(1));
      const hashElement = elements.find((element) => element.id === hashId);

      if (hashElement) {
        activateHeading(hashId);

        if (scrollToHeading && typeof hashElement.scrollIntoView === "function") {
          window.cancelAnimationFrame(hashFrame);
          hashFrame = window.requestAnimationFrame(() => {
            hashFrame = window.requestAnimationFrame(() => {
              hashElement.scrollIntoView({ block: "start" });
              activateHeading(hashId);
            });
          });
        }
      }
    };

    const handleHashChange = () => updateFromHash();

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(updateActiveHeading, {
            rootMargin: `-${getActiveHeadingOffset(elements[0])}px 0px -65% 0px`,
            threshold: [0, 1],
          });

    elements.forEach((element) => observer?.observe(element));
    updateFromHash(true);
    updateActiveHeading();
    if (!observer) {
      window.addEventListener("scroll", updateActiveHeading, {
        passive: true,
      });
    }
    window.addEventListener("resize", updateActiveHeading);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(hashFrame);
      observer?.disconnect();
      if (!observer) {
        window.removeEventListener("scroll", updateActiveHeading);
      }
      window.removeEventListener("resize", updateActiveHeading);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [activateHeading, headings]);

  useEffect(() => {
    if (variant !== "desktop") return;

    const nav = navRef.current;
    const container = nav?.closest<HTMLElement>(".table-of-contents");
    const activeLink = Array.from(
      nav?.querySelectorAll<HTMLAnchorElement>("a[data-toc-id]") ?? [],
    ).find((link) => link.dataset.tocId === activeId);

    if (!container || !activeLink) return;

    const containerBounds = container.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();

    if (linkBounds.top < containerBounds.top + 8) {
      container.scrollTop -= containerBounds.top + 8 - linkBounds.top;
    } else if (linkBounds.bottom > containerBounds.bottom - 8) {
      container.scrollTop += linkBounds.bottom - containerBounds.bottom + 8;
    }
  }, [activeId, variant]);

  function handleLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    headingId: string,
  ) {
    activateHeading(headingId);

    if (variant === "mobile") {
      const details = event.currentTarget.closest("details");

      if (details) {
        details.open = false;
      }
    }
  }

  function toggleGroup(groupId: string) {
    setExpandedGroupIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(groupId)) {
        nextIds.delete(groupId);
      } else {
        nextIds.add(groupId);
      }

      return nextIds;
    });
  }

  function renderLink(heading: DocHeading) {
    return (
      <a
        aria-current={activeId === heading.id ? "location" : undefined}
        data-toc-id={heading.id}
        href={`#${heading.id}`}
        onClick={(event) => handleLinkClick(event, heading.id)}
      >
        {heading.title}
      </a>
    );
  }

  const flatLinks = (
    <ol>
      {headings.map((heading) => (
        <li
          className={heading.depth === 3 ? "is-nested" : undefined}
          data-active-parent={
            heading.id === activeParentId ? "true" : undefined
          }
          key={heading.id}
        >
          {renderLink(heading)}
        </li>
      ))}
    </ol>
  );

  const progressiveLinks = (
    <ol>
      {headingGroups.map(({ heading, children }) => {
        const hasChildren = children.length > 0;
        const isExpanded = expandedGroupIds.has(heading.id);
        const subsectionsId = `toc-${variant}-${heading.id}-subsections`;

        return (
          <li
            className={heading.depth === 3 ? "is-nested" : undefined}
            data-active-parent={
              heading.id === activeParentId ? "true" : undefined
            }
            key={heading.id}
          >
            {hasChildren ? (
              <>
                <div className="article-toc-mobile__group-row">
                  {renderLink(heading)}
                  <button
                    aria-controls={subsectionsId}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? "Ocultar" : "Mostrar"} subseções de ${heading.title}`}
                    className="article-toc-mobile__group-toggle"
                    onClick={() => toggleGroup(heading.id)}
                    type="button"
                  >
                    <span>{isExpanded ? "Ocultar" : "Mostrar"}</span>
                    <ChevronDown aria-hidden="true" size={15} />
                  </button>
                </div>
                <ol
                  className="article-toc-mobile__subsections"
                  hidden={!isExpanded}
                  id={subsectionsId}
                >
                  {children.map((child) => (
                    <li className="is-nested" key={child.id}>
                      {renderLink(child)}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              renderLink(heading)
            )}
          </li>
        );
      })}
    </ol>
  );

  const links = usesProgressiveDisclosure ? progressiveLinks : flatLinks;

  if (variant === "mobile") {
    return (
      <details className="article-toc-mobile">
        <summary>
          <span>Nesta página</span>
          <ChevronDown aria-hidden="true" size={17} />
        </summary>
        <nav aria-label="Nesta página" ref={navRef}>
          {links}
        </nav>
      </details>
    );
  }

  return (
    <aside aria-label="Sumário desta página" className="table-of-contents">
      <nav aria-label="Nesta página" ref={navRef}>
        <h2>Nesta página</h2>
        {links}
      </nav>
    </aside>
  );
}
