"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { KeyboardEvent } from "react";

type DocCardCommonProps = {
  description: string;
  icon: LucideIcon;
  title: string;
};

type ActiveDocCardProps = DocCardCommonProps & {
  href: string;
  status: "active";
};

type ComingSoonDocCardProps = DocCardCommonProps & {
  href?: never;
  status: "comingSoon";
};

export type DocCardProps = ActiveDocCardProps | ComingSoonDocCardProps;

function handleActiveCardKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
  if (event.key !== " " && event.key !== "Spacebar") return;

  event.preventDefault();
  event.currentTarget.click();
}

export function DocCard(props: DocCardProps) {
  const { description, icon: Icon, status, title } = props;
  const content = (
    <>
      <span aria-hidden="true" className="doc-card__icon">
        <Icon size={18} strokeWidth={1.7} />
      </span>
      <span className="doc-card__body">
        <h3>{title}</h3>
        <p>{description}</p>
      </span>
      {status === "active" ? (
        <ArrowRight
          aria-hidden="true"
          className="doc-card__indicator doc-card__indicator--arrow"
          size={17}
          strokeWidth={1.7}
        />
      ) : (
        <span className="doc-card__indicator doc-card__indicator--badge">
          Em breve
        </span>
      )}
    </>
  );

  if (status === "active") {
    return (
      <Link
        className="doc-card doc-card--active"
        data-status={status}
        href={props.href}
        onKeyDown={handleActiveCardKeyDown}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      aria-label={`${title}. Em breve`}
      className="doc-card doc-card--coming-soon"
      data-status={status}
    >
      {content}
    </article>
  );
}
