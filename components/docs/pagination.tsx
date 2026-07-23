import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { DocRecord } from "@/lib/docs/schema";

type PaginationProps = {
  previous?: DocRecord;
  next?: DocRecord;
};

export function Pagination({ previous, next }: PaginationProps) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="Paginação da documentação" className="article-pagination">
      {previous ? (
        <Link className="article-pagination__link" href={previous.href}>
          <ArrowLeft aria-hidden="true" size={17} />
          <span>
            <small>Anterior</small>
            <strong>{previous.metadata.title}</strong>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          className="article-pagination__link article-pagination__link--next"
          href={next.href}
        >
          <span>
            <small>Próxima</small>
            <strong>{next.metadata.title}</strong>
          </span>
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      ) : null}
    </nav>
  );
}
