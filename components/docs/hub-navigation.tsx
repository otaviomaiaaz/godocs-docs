import { ArrowRight } from "lucide-react";
import Link from "next/link";

export type HubNavigationItem = {
  description: string;
  href: string;
  slug: string;
  title: string;
};

type HubNavigationProps = {
  items: HubNavigationItem[];
  title: string;
};

export function HubNavigation({ items, title }: HubNavigationProps) {
  return (
    <section aria-labelledby="hub-navigation-title" className="hub-navigation">
      <h2 id="hub-navigation-title">{title}</h2>
      <ul className="hub-navigation__list">
        {items.map((item) => (
          <li key={item.slug}>
            <Link className="hub-navigation__link" href={item.href}>
              <span className="hub-navigation__copy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </span>
              <ArrowRight aria-hidden="true" className="hub-navigation__arrow" size={18} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
