import {
  AlertCircle,
  AlertTriangle,
  CircleCheck,
  Info,
} from "lucide-react";
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
} from "react";

import { CodeBlock } from "@/components/docs/code-block";

type CalloutVariant = "info" | "tip" | "warning" | "danger";

const calloutIcons = {
  info: Info,
  tip: CircleCheck,
  warning: AlertTriangle,
  danger: AlertCircle,
};

export function Callout({
  children,
  title,
  variant = "info",
}: {
  children: ReactNode;
  title?: string;
  variant?: CalloutVariant;
}) {
  const Icon = calloutIcons[variant];

  return (
    <aside className="callout" data-variant={variant}>
      <Icon aria-hidden="true" size={19} />
      <div>
        {title ? <strong>{title}</strong> : null}
        {children}
      </div>
    </aside>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="steps">{children}</ol>;
}

export function Step({ children, title }: { children: ReactNode; title: string }) {
  return (
    <li className="step">
      <div>
        <strong>{title}</strong>
        {children}
      </div>
    </li>
  );
}

export function Figure({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="article-figure">
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function MdxLink({ href = "", children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  const externalProps = /^https?:\/\//.test(href)
    ? { rel: "noreferrer", target: "_blank" }
    : {};

  return (
    <a href={href} {...externalProps} {...props}>
      {children}
    </a>
  );
}

function ResponsiveTable(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-scroll" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

function Preformatted(props: HTMLAttributes<HTMLPreElement>) {
  return <pre className="mdx-pre" {...props} />;
}

export const mdxComponents = {
  a: MdxLink,
  table: ResponsiveTable,
  pre: Preformatted,
  Callout,
  Steps,
  Step,
  Figure,
  CodeBlock,
};
