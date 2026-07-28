"use client";

import {
  BarChart3,
  BookOpen,
  FileText,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  LogIn,
  MessageCircleQuestion,
  Search,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useId, useState } from "react";

import { DocCard } from "@/components/doc-card";
import type {
  DocNavigationGroup,
  DocNavigationItem,
} from "@/lib/docs/navigation";
import { SITE_DESCRIPTION } from "@/lib/site";

type HomeIntroProps = {
  groups: DocNavigationGroup[];
};

type LinkedNavigationItem = DocNavigationItem & { href: string };
type FeatureCardDefinition = {
  description: string;
  icon: LucideIcon;
  id: string;
  title: string;
};
type FaqItem = {
  answer: string;
  id: string;
  question: string;
};

const INITIAL_PAGES_PER_SECTION = 6;
const FEATURE_CARDS: readonly FeatureCardDefinition[] = [
  {
    id: "funcionalidades/visao-geral",
    title: "Visão Geral",
    description: "Acompanhe os principais indicadores do GoDocs.",
    icon: LayoutDashboard,
  },
  {
    id: "funcionalidades/busca-inteligente",
    title: "Busca Inteligente",
    description: "Encontre documentos com busca semântica e filtros.",
    icon: Search,
  },
  {
    id: "funcionalidades/documentos",
    title: "Documentos",
    description: "Organize e consulte seus documentos.",
    icon: FolderOpen,
  },
  {
    id: "funcionalidades/favoritos",
    title: "Favoritos",
    description: "Acesse rapidamente seus documentos favoritos.",
    icon: Star,
  },
  {
    id: "funcionalidades/workflows",
    title: "Workflows",
    description: "Acompanhe processos e fluxos de trabalho.",
    icon: GitBranch,
  },
  {
    id: "funcionalidades/relatorios",
    title: "Relatórios",
    description: "Consulte indicadores e informações consolidadas.",
    icon: BarChart3,
  },
];
const START_CARD_ICONS: Readonly<Record<string, LucideIcon>> = {
  "o-que-e-o-godocs": BookOpen,
  "primeiro-acesso": LogIn,
};
const faqs: FaqItem[] = [];

function collectDocumentItems(
  items: DocNavigationItem[],
): LinkedNavigationItem[] {
  return items.flatMap((item) => [
    ...(item.href ? [{ ...item, href: item.href }] : []),
    ...collectDocumentItems(item.children),
  ]);
}

function HomeAmbient() {
  return (
    <div aria-hidden="true" className="home__ambient">
      <span className="home__orb" />
      <span className="home__line home__line--one" />
      <span className="home__line home__line--two" />
    </div>
  );
}

function HomeSection({ group }: { group: DocNavigationGroup }) {
  const entries = collectDocumentItems(group.items);
  const [isExpanded, setIsExpanded] = useState(false);
  const pagesId = `${useId()}-pages`;
  const headingId = `home-section-${group.id}-title`;
  const hasMore = entries.length > INITIAL_PAGES_PER_SECTION;
  const visibleEntries = isExpanded
    ? entries
    : entries.slice(0, INITIAL_PAGES_PER_SECTION);

  return (
    <section aria-labelledby={headingId} className="home-section">
      <div className="home-section__heading">
        <div>
          {group.title ? <h2 id={headingId}>{group.title}</h2> : null}
          {group.description ? <p>{group.description}</p> : null}
        </div>
      </div>

      <ul
        className={`home-section__pages${
          group.id === "comece-por-aqui"
            ? " home-section__pages--start"
            : ""
        }`}
        data-count={visibleEntries.length}
        id={pagesId}
      >
        {visibleEntries.map((item) => {
          const Icon = START_CARD_ICONS[item.id] ?? FileText;

          return (
            <li className="home-card-item" key={item.id}>
              <DocCard
                description={item.description ?? ""}
                href={item.href}
                icon={Icon}
                status="active"
                title={item.label}
              />
            </li>
          );
        })}
      </ul>

      {hasMore ? (
        <button
          aria-controls={pagesId}
          aria-expanded={isExpanded}
          className="home-section__expand"
          onClick={() => setIsExpanded((current) => !current)}
          type="button"
        >
          {isExpanded ? "Mostrar menos" : "Mostrar mais"}
        </button>
      ) : null}
    </section>
  );
}

function FeaturesSection({ group }: { group: DocNavigationGroup }) {
  const publishedEntries = new Map(
    collectDocumentItems(group.items).map((item) => [item.id, item]),
  );
  const headingId = "home-section-features-title";

  return (
    <section aria-labelledby={headingId} className="home-section">
      <div className="home-section__heading">
        <div>
          <h2 id={headingId}>Funcionalidades</h2>
          <p>{group.description}</p>
        </div>
      </div>

      <ul
        className="home-section__pages home-section__pages--features"
        data-count={FEATURE_CARDS.length}
      >
        {FEATURE_CARDS.map((card) => {
          const publishedEntry = publishedEntries.get(card.id);

          return (
            <li className="home-card-item" key={card.id}>
              {publishedEntry ? (
                <DocCard
                  description={card.description}
                  href={publishedEntry.href}
                  icon={card.icon}
                  status="active"
                  title={card.title}
                />
              ) : (
                <DocCard
                  description={card.description}
                  icon={card.icon}
                  status="comingSoon"
                  title={card.title}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FaqSection() {
  const headingId = "home-faq-title";

  return (
    <section
      aria-labelledby={headingId}
      className="home-section home-faq"
    >
      <div className="home-section__heading">
        <div>
          <h2 id={headingId}>Perguntas frequentes</h2>
          <p>
            Encontre respostas rápidas para as dúvidas mais comuns sobre o
            GoDocs.
          </p>
        </div>
      </div>

      {faqs.length > 0 ? (
        <div className="home-faq__list">
          {faqs.map((faq) => (
            <details key={faq.id}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      ) : (
        <div className="home-faq__empty">
          <span aria-hidden="true" className="home-faq__icon">
            <MessageCircleQuestion size={20} strokeWidth={1.8} />
          </span>
          <p>
            Conteúdo em preparação. As perguntas frequentes serão adicionadas
            em breve.
          </p>
        </div>
      )}
    </section>
  );
}

export function HomeIntro({ groups }: HomeIntroProps) {
  if (groups.length === 0) {
    return (
      <main className="home" id="main-content">
        <HomeAmbient />

        <section aria-labelledby="home-title" className="home__content">
          <p className="eyebrow home__eyebrow">
            <span aria-hidden="true" />
            GODOCS DOCS
          </p>
          <h1 id="home-title">Documentação do GoDocs</h1>
          <p className="home__description">{SITE_DESCRIPTION}</p>
          <p className="home__status">
            <span aria-hidden="true" className="home__status-marker" />
            Ainda não há documentos publicados.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="home home--contentful" id="main-content">
      <HomeAmbient />

      <section aria-labelledby="home-title" className="home__content">
        <p className="eyebrow home__eyebrow">
          <span aria-hidden="true" />
          GODOCS DOCS
        </p>
        <h1 id="home-title">Documentação do GoDocs</h1>
        <p className="home__description">{SITE_DESCRIPTION}</p>
      </section>

      <div className="home-sections">
        <nav
          aria-label="Seções da documentação"
          className="home-sections__navigation"
        >
          {groups.map((group) =>
            group.id === "funcionalidades" ? (
              <FeaturesSection group={group} key={group.id} />
            ) : (
              <HomeSection group={group} key={group.id} />
            ),
          )}
        </nav>

        <FaqSection />
      </div>
    </main>
  );
}
