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
  href: string;
  status: "comingSoon";
};

export type DocCardProps = ActiveDocCardProps | ComingSoonDocCardProps;

function handleCardKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
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
      <div className="doc-card__body">
        <div className="doc-card__title-row">
          <h3>{title}</h3>
          <span className="doc-card__actions">
            {status === "comingSoon" ? (
              <span className="doc-card__indicator doc-card__indicator--badge">
                Em breve
              </span>
            ) : null}
            <ArrowRight
              aria-hidden="true"
              className="doc-card__indicator doc-card__indicator--arrow"
              size={17}
              strokeWidth={1.7}
            />
          </span>
        </div>
        <p>{description}</p>
      </div>
    </>
  );

  return (
    <Link
      className={`doc-card doc-card--${status === "active" ? "active" : "coming-soon"}`}
      data-status={status}
      href={props.href}
      onKeyDown={handleCardKeyDown}
    >
      {content}
    </Link>
  );
}
