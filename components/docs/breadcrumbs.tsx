import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

import type { DocBreadcrumb } from "@/lib/docs/navigation";

type BreadcrumbsProps = {
  items: DocBreadcrumb[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Caminho da página" className="breadcrumbs">
      <ol>
        <li>
          <Link aria-label="Página inicial" href="/">
            <Home aria-hidden="true" size={14} />
          </Link>
        </li>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="breadcrumbs__segment" key={item.id}>
              <ChevronRight aria-hidden="true" size={13} />
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
