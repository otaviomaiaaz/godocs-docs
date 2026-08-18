import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { AnchorCompatibility } from "@/components/docs/anchor-compatibility";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { Pagination } from "@/components/docs/pagination";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { CalendarDays, Clock3, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";
import type {
  DocBreadcrumb,
  DocNavigationGroup,
} from "@/lib/docs/navigation";
import type { DocRecord } from "@/lib/docs/schema";

type ArticleShellProps = {
  doc: DocRecord;
  navigation: DocNavigationGroup[];
  breadcrumbs: DocBreadcrumb[];
  previous?: DocRecord;
  next?: DocRecord;
  related?: DocRecord[];
  children: ReactNode;
};

export function ArticleShell({
  doc,
  navigation,
  breadcrumbs,
  previous,
  next,
  related = [],
  children,
}: ArticleShellProps) {
  const hasToc = doc.headings.length >= 2;

  return (
    <main className="article-page" id="main-content">
      <AnchorCompatibility slug={doc.slug} />
      <div
        className="article-layout"
        data-has-sidebar={navigation.length > 0}
        data-has-toc={hasToc}
      >
        <DocsSidebar groups={navigation} />

        <article className="article">
          <Breadcrumbs items={breadcrumbs} />
          <header className="article__header">
            <h1>{doc.metadata.title}</h1>
            <p>{doc.metadata.description}</p>
            <ul aria-label="Metadados do artigo" className="article-metadata">
              <li>
                <Clock3 aria-hidden="true" size={15} />
                {doc.readingMinutes} min de leitura
              </li>
              {doc.metadata.updatedAt ? (
                <li>
                  <CalendarDays aria-hidden="true" size={15} />
                  <time dateTime={doc.metadata.updatedAt}>
                    Atualizado em{" "}
                    {new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(`${doc.metadata.updatedAt}T00:00:00Z`))}
                  </time>
                </li>
              ) : null}
              {doc.metadata.version ? (
                <li>
                  <Tag aria-hidden="true" size={15} />
                  Versão {doc.metadata.version}
                </li>
              ) : null}
              {doc.metadata.permission ? (
                <li>
                  <ShieldCheck aria-hidden="true" size={15} />
                  {doc.metadata.permission}
                </li>
              ) : null}
            </ul>
          </header>
          {hasToc ? (
            <TableOfContents headings={doc.headings} variant="mobile" />
          ) : null}
          <div className="prose">{children}</div>
          {related.length > 0 ? (
            <nav aria-label="Páginas relacionadas" className="article-related">
              <h2>Páginas relacionadas</h2>
              <ul>
                {related.map((relatedDoc) => (
                  <li key={relatedDoc.slug}>
                    <Link href={relatedDoc.href}>
                      <strong>{relatedDoc.metadata.title}</strong>
                      <span>{relatedDoc.metadata.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <Pagination next={next} previous={previous} />
        </article>

        {hasToc ? <TableOfContents headings={doc.headings} /> : null}
      </div>
    </main>
  );
}
