import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

type BreadcrumbsProps = {
  section?: string;
  title: string;
};

function humanizeSection(section: string): string {
  return section
    .split(/[-_/]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1))
    .join(" ");
}

export function Breadcrumbs({ section, title }: BreadcrumbsProps) {
  return (
    <nav aria-label="Caminho da página" className="breadcrumbs">
      <ol>
        <li>
          <Link aria-label="Página inicial" href="/">
            <Home aria-hidden="true" size={14} />
          </Link>
        </li>
        {section ? (
          <>
            <li aria-hidden="true">
              <ChevronRight size={13} />
            </li>
            <li>{humanizeSection(section)}</li>
          </>
        ) : null}
        <li aria-hidden="true">
          <ChevronRight size={13} />
        </li>
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}
