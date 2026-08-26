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
  variant?: "functionalities";
};

export function HubNavigation({ items, title, variant }: HubNavigationProps) {
  return (
    <section
      aria-labelledby="hub-navigation-title"
      className={
        variant === "functionalities"
          ? "hub-navigation hub-navigation--functionalities"
          : "hub-navigation"
      }
    >
      <h2 id="hub-navigation-title">{title}</h2>
      <ul className="hub-navigation__list">
        {items.map((item, index) => (
          <li
            className={
              items.length % 2 === 1 && index === items.length - 1
                ? "hub-navigation__item hub-navigation__item--wide"
                : "hub-navigation__item"
            }
            key={item.slug}
          >
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
