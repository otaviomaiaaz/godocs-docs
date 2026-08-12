"use client";

import { ChevronDown } from "lucide-react";
import {
  type MouseEvent,
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

const ACTIVE_HEADING_OFFSET = 132;

export function TableOfContents({
  headings,
  variant = "desktop",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);
  const activeParentId = useMemo(() => {
    let parentId = "";

    for (const heading of headings) {
      if (heading.depth === 2) {
        parentId = heading.id;
      }

      if (heading.id === activeId) {
        return heading.depth === 3 ? parentId : "";
      }
    }

    return "";
  }, [activeId, headings]);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    let frame = 0;
    const updateActiveHeading = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const reachedPageEnd =
          Math.ceil(window.scrollY + window.innerHeight) >=
          document.documentElement.scrollHeight - 2;

        if (reachedPageEnd) {
          setActiveId(elements.at(-1)?.id ?? "");
          return;
        }

        const passed = elements.filter(
          (element) =>
            element.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET,
        );
        setActiveId(passed.at(-1)?.id ?? elements[0]?.id ?? "");
      });
    };

    const updateFromHash = () => {
      const hashId = decodeURIComponent(window.location.hash.slice(1));

      if (elements.some((element) => element.id === hashId)) {
        setActiveId(hashId);
      }
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(updateActiveHeading, {
            rootMargin: `-${ACTIVE_HEADING_OFFSET}px 0px -65% 0px`,
            threshold: [0, 1],
          });

    elements.forEach((element) => observer?.observe(element));
    updateFromHash();
    updateActiveHeading();
    if (!observer) {
      window.addEventListener("scroll", updateActiveHeading, {
        passive: true,
      });
    }
    window.addEventListener("resize", updateActiveHeading);
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      if (!observer) {
        window.removeEventListener("scroll", updateActiveHeading);
      }
      window.removeEventListener("resize", updateActiveHeading);
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, [headings]);

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
    setActiveId(headingId);

    if (variant === "mobile") {
      const details = event.currentTarget.closest("details");

      if (details) {
        details.open = false;
      }
    }
  }

  const links = (
    <ol>
      {headings.map((heading) => (
        <li
          className={heading.depth === 3 ? "is-nested" : undefined}
          data-active-parent={
            heading.id === activeParentId ? "true" : undefined
          }
          key={heading.id}
        >
          <a
            aria-current={activeId === heading.id ? "location" : undefined}
            data-toc-id={heading.id}
            href={`#${heading.id}`}
            onClick={(event) => handleLinkClick(event, heading.id)}
          >
            {heading.title}
          </a>
        </li>
      ))}
    </ol>
  );

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
