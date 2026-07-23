import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

import type {
  DocNavigationGroup,
  DocNavigationItem,
} from "@/lib/docs/navigation";

type HomeIntroProps = {
  groups: DocNavigationGroup[];
};

type LinkedNavigationItem = DocNavigationItem & { href: string };

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
            Novos conteúdos serão publicados progressivamente.
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
        {groups.map((group) => {
          const entries = collectDocumentItems(group.items);

          return (
            <section className="home-section" key={group.id}>
              <div className="home-section__heading">
                <div>
                  {group.title ? <h2>{group.title}</h2> : null}
                  {group.description ? <p>{group.description}</p> : null}
                </div>
                {group.entryHref && group.title ? (
                  <Link className="home-section__entry" href={group.entryHref}>
                    Abrir seção
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                ) : null}
              </div>

              <ul className="home-section__pages">
                {entries.map((item) => (
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
            </section>
          );
        })}
      </nav>
    </main>
  );
}
