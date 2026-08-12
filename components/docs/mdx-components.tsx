import {
  AlertCircle,
  AlertTriangle,
  CircleCheck,
  Info as InfoIcon,
  KeyRound,
  Link2,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
} from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { DocumentFigure } from "@/components/docs/document-figure";

type CalloutVariant = "info" | "tip" | "warning" | "danger";

const calloutIcons = {
  info: InfoIcon,
  tip: CircleCheck,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const calloutLabels: Record<CalloutVariant, string> = {
  info: "Informação",
  tip: "Dica",
  warning: "Atenção",
  danger: "Importante",
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
  const label = title ?? calloutLabels[variant];

  return (
    <div aria-label={label} className="callout" data-variant={variant} role="note">
      <Icon aria-hidden="true" size={19} />
      <div>
        {title ? <strong>{title}</strong> : null}
        {children}
      </div>
    </div>
  );
}

export function Info({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <Callout title={title} variant="info">
      {children}
    </Callout>
  );
}

export function Tip({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <Callout title={title} variant="tip">
      {children}
    </Callout>
  );
}

export function Warning({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <Callout title={title} variant="warning">
      {children}
    </Callout>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="steps">{children}</ol>;
}

type StepHeadingLevel = 2 | 3 | 4;

const stepHeadingTags = {
  2: "h2",
  3: "h3",
  4: "h4",
} as const;

export function Step({
  children,
  headingLevel,
  id,
  result,
  title,
}: {
  children: ReactNode;
  headingLevel: StepHeadingLevel | `${StepHeadingLevel}`;
  id: string;
  result?: ReactNode;
  title: string;
}) {
  const normalizedHeadingLevel = Number(headingLevel) as StepHeadingLevel;
  const Heading = stepHeadingTags[normalizedHeadingLevel];

  if (!Heading) {
    throw new Error("Step aceita headingLevel 2, 3 ou 4.");
  }

  return (
    <li className="step">
      <div>
        <Heading className="step__title" id={id}>
          {title}
        </Heading>
        <div className="step__content">{children}</div>
        {result ? (
          <div className="step__result">
            <CircleCheck aria-hidden="true" size={16} />
            <span>{result}</span>
          </div>
        ) : null}
      </div>
    </li>
  );
}

function EditorialPanel({
  children,
  icon: Icon,
  kind,
  title,
}: {
  children: ReactNode;
  icon: typeof ListChecks;
  kind: "requirements" | "permissions" | "result";
  title: string;
}) {
  return (
    <aside aria-label={title} className="editorial-panel" data-kind={kind}>
      <header>
        <Icon aria-hidden="true" size={18} />
        <strong>{title}</strong>
      </header>
      <div>{children}</div>
    </aside>
  );
}

export function Requirements({ children }: { children: ReactNode }) {
  return (
    <EditorialPanel icon={ListChecks} kind="requirements" title="Pré-requisitos">
      {children}
    </EditorialPanel>
  );
}

export function Permissions({ children }: { children: ReactNode }) {
  return (
    <EditorialPanel
      icon={ShieldCheck}
      kind="permissions"
      title="Permissões necessárias"
    >
      {children}
    </EditorialPanel>
  );
}

export function ExpectedResult({ children }: { children: ReactNode }) {
  return (
    <EditorialPanel
      icon={CircleCheck}
      kind="result"
      title="Resultado esperado"
    >
      {children}
    </EditorialPanel>
  );
}

export function KeyboardShortcut({ children }: { children: ReactNode }) {
  return (
    <span className="keyboard-shortcut">
      <KeyRound aria-hidden="true" size={15} />
      <kbd>{children}</kbd>
    </span>
  );
}

export function RelatedLinks({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="Links relacionados" className="related-links">
      <header>
        <Link2 aria-hidden="true" size={17} />
        <strong>Links relacionados</strong>
      </header>
      <div>{children}</div>
    </nav>
  );
}

function MdxLink({
  href = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
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
    <div aria-label="Tabela com rolagem horizontal" className="table-scroll" tabIndex={0}>
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
  Info,
  Tip,
  Warning,
  Steps,
  Step,
  Requirements,
  Permissions,
  ExpectedResult,
  KeyboardShortcut,
  RelatedLinks,
  Figure: DocumentFigure,
  CodeBlock,
};
