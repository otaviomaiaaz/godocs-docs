"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { KeyboardEvent, PointerEvent } from "react";

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

type DocCardVariant = "default" | "feature";

function handleCardKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
  if (event.key !== " " && event.key !== "Spacebar") return;

  event.preventDefault();
  event.currentTarget.click();
}

function supportsPointerTilt(pointerType: string) {
  return (
    pointerType === "mouse" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function handleFeaturePointerMove(event: PointerEvent<HTMLAnchorElement>) {
  if (!supportsPointerTilt(event.pointerType)) return;

  const bounds = event.currentTarget.getBoundingClientRect();
  const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
  const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

  event.currentTarget.style.setProperty(
    "--doc-card-tilt-x",
    `${(-pointerY * 9).toFixed(2)}deg`,
  );
  event.currentTarget.style.setProperty(
    "--doc-card-tilt-y",
    `${(pointerX * 9).toFixed(2)}deg`,
  );
}

function resetFeaturePointerTilt(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.setProperty("--doc-card-tilt-x", "0deg");
  event.currentTarget.style.setProperty("--doc-card-tilt-y", "0deg");
}

export function DocCard(
  props: DocCardProps & { variant?: DocCardVariant },
) {
  const { description, icon: Icon, status, title } = props;
  const variant = props.variant ?? "default";
  const isFeatureCard = variant === "feature";
  const content = (
    <>
      <span aria-hidden="true" className="doc-card__icon">
        <Icon size={18} strokeWidth={1.7} />
      </span>
      <div className="doc-card__body">
        <div className="doc-card__title-row">
          <h3>{title}</h3>
          {status === "comingSoon" || !isFeatureCard ? (
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
          ) : null}
        </div>
        <p>{description}</p>
        {status === "active" && isFeatureCard ? (
          <span className="doc-card__access">
            <span className="doc-card__access-copy">
              Acessar
              <span aria-hidden="true" className="doc-card__access-underline" />
            </span>
            <ArrowRight
              aria-hidden="true"
              className="doc-card__indicator doc-card__indicator--arrow"
              size={17}
              strokeWidth={1.7}
            />
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <Link
      className={`doc-card doc-card--${status === "active" ? "active" : "coming-soon"}${isFeatureCard ? " doc-card--feature" : ""}`}
      data-status={status}
      href={props.href}
      onKeyDown={handleCardKeyDown}
      onPointerLeave={isFeatureCard ? resetFeaturePointerTilt : undefined}
      onPointerMove={
        isFeatureCard && status === "active"
          ? handleFeaturePointerMove
          : undefined
      }
    >
      {content}
    </Link>
  );
}
