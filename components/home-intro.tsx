"use client";

import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

import type {
  DocNavigationGroup,
  DocNavigationItem,
} from "@/lib/docs/navigation";

type HomeIntroProps = {
  groups: DocNavigationGroup[];
};

type LinkedNavigationItem = DocNavigationItem & { href: string };
const INITIAL_PAGES_PER_SECTION = 6;

function collectDocumentItems(
  items: DocNavigationItem[],
): LinkedNavigationItem[] {
  return items.flatMap((item) => [
    ...(item.href ? [{ ...item, href: item.href }] : []),
    ...collectDocumentItems(item.children),
  ]);
}

function HomeAmbient() {
  return (
    <div aria-hidden="true" className="home__ambient">
      <span className="home__orb" />
      <span className="home__line home__line--one" />
      <span className="home__line home__line--two" />
    </div>
  );
}

function HomeSection({ group }: { group: DocNavigationGroup }) {
  const entries = collectDocumentItems(group.items);
  const [isExpanded, setIsExpanded] = useState(false);
  const pagesId = `${useId()}-pages`;
  const hasMore = entries.length > INITIAL_PAGES_PER_SECTION;
  const visibleEntries = isExpanded
    ? entries
    : entries.slice(0, INITIAL_PAGES_PER_SECTION);

  return (
    <section className="home-section">
      <div className="home-section__heading">
        <div>
          {group.title ? <h2>{group.title}</h2> : null}
          {group.description ? <p>{group.description}</p> : null}
        </div>
      </div>

      <ul className="home-section__pages" id={pagesId}>
        {visibleEntries.map((item) => (
          <li key={item.id}>
            <Link className="home-page-card" href={item.href}>
              <FileText aria-hidden="true" size={20} strokeWidth={1.7} />
              <span>
                <strong>{item.label}</strong>
                {item.description ? <small>{item.description}</small> : null}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="home-page-card__arrow"
                size={16}
              />
            </Link>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button
          aria-controls={pagesId}
          aria-expanded={isExpanded}
          className="home-section__expand"
          onClick={() => setIsExpanded((current) => !current)}
          type="button"
        >
          {isExpanded ? "Mostrar menos" : "Mostrar mais"}
        </button>
      ) : null}
    </section>
  );
}

export function HomeIntro({ groups }: HomeIntroProps) {
  if (groups.length === 0) {
    return (
      <main className="home" id="main-content">
        <HomeAmbient />

        <section aria-labelledby="home-title" className="home__content">
          <p className="eyebrow home__eyebrow">
            <span aria-hidden="true" />
            DOCUMENTAÇÃO OFICIAL
          </p>
          <h1 id="home-title">Documentação do GoDocs</h1>
          <p className="home__description">
            Encontre guias, conceitos e instruções para utilizar o GoDocs.
          </p>
          <p className="home__status">
            <span aria-hidden="true" className="home__status-marker" />
            Ainda não há documentos publicados.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="home home--contentful" id="main-content">
      <HomeAmbient />

      <section aria-labelledby="home-title" className="home__content">
        <p className="eyebrow home__eyebrow">
          <span aria-hidden="true" />
          DOCUMENTAÇÃO OFICIAL
        </p>
        <h1 id="home-title">Documentação do GoDocs</h1>
        <p className="home__description">
          Encontre guias, conceitos e instruções para utilizar o GoDocs.
        </p>
      </section>

      <nav aria-label="Seções da documentação" className="home-sections">
        {groups.map((group) => (
          <HomeSection group={group} key={group.id} />
        ))}
      </nav>
    </main>
  );
}
