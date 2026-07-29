"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import type { DocHeading } from "@/lib/docs/schema";

type TableOfContentsProps = {
  headings: DocHeading[];
  variant?: "desktop" | "mobile";
};

export function TableOfContents({
  headings,
  variant = "desktop",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

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
          (element) => element.getBoundingClientRect().top <= 132,
        );
        setActiveId(passed.at(-1)?.id ?? elements[0]?.id ?? "");
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  const links = (
    <ol>
      {headings.map((heading) => (
        <li
          className={heading.depth === 3 ? "is-nested" : undefined}
          key={heading.id}
        >
          <a
            aria-current={activeId === heading.id ? "location" : undefined}
            href={`#${heading.id}`}
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
        <nav aria-label="Nesta página">{links}</nav>
      </details>
    );
  }

  return (
    <aside className="table-of-contents">
      <nav aria-label="Nesta página">
        <h2>Nesta página</h2>
        {links}
      </nav>
    </aside>
  );
}
