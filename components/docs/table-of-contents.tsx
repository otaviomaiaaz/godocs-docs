"use client";

import { useEffect, useState } from "react";

import type { DocHeading } from "@/lib/docs/schema";

type TableOfContentsProps = {
  headings: DocHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: [0, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <aside className="table-of-contents">
      <nav aria-label="Nesta página">
        <h2>Nesta página</h2>
        <ol>
          {headings.map((heading) => (
            <li className={heading.depth === 3 ? "is-nested" : undefined} key={heading.id}>
              <a
                aria-current={activeId === heading.id ? "location" : undefined}
                href={`#${heading.id}`}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
