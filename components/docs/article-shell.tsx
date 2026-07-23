import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { Pagination } from "@/components/docs/pagination";
import { TableOfContents } from "@/components/docs/table-of-contents";
import type { DocNavigationGroup } from "@/lib/docs/navigation";
import type { DocRecord } from "@/lib/docs/schema";

type ArticleShellProps = {
  doc: DocRecord;
  navigation: DocNavigationGroup[];
  previous?: DocRecord;
  next?: DocRecord;
  children: ReactNode;
};

export function ArticleShell({
  doc,
  navigation,
  previous,
  next,
  children,
}: ArticleShellProps) {
  const hasToc = doc.headings.length >= 2;

  return (
    <main className="article-page" id="main-content">
      <div
        className="article-layout"
        data-has-sidebar={navigation.length > 0}
        data-has-toc={hasToc}
      >
        <DocsSidebar groups={navigation} />

        <article className="article">
          <Breadcrumbs
            section={doc.metadata.section}
            title={doc.metadata.title}
          />
          <header className="article__header">
            <h1>{doc.metadata.title}</h1>
            <p>{doc.metadata.description}</p>
          </header>
          <div className="prose">{children}</div>
          <Pagination next={next} previous={previous} />
        </article>

        {hasToc ? <TableOfContents headings={doc.headings} /> : null}
      </div>
    </main>
  );
}
