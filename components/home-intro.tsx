"use client";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CircleHelp,
  FileSearch,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  LogIn,
  Star,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Brand } from "@/components/brand";
import { DocCard } from "@/components/doc-card";
import { SearchLauncher } from "@/components/search-dialog";
import type {
  DocNavigationGroup,
  DocNavigationItem,
} from "@/lib/docs/navigation";
import { SITE_DESCRIPTION } from "@/lib/site";

type HomeIntroProps = {
  features?: HomeFeature[];
  groups: DocNavigationGroup[];
};

type LinkedNavigationItem = DocNavigationItem & { href: string };

export type HomeFeature = {
  description: string;
  href?: string;
  order: number;
  slug: string;
  status: "published" | "draft";
  title: string;
};

const START_ICONS: Readonly<Record<string, LucideIcon>> = {
  "o-que-e-o-godocs": BookOpen,
  "primeiro-acesso": LogIn,
};

const FEATURE_ICONS: Readonly<Record<string, LucideIcon>> = {
  "funcionalidades/visao-geral": LayoutDashboard,
  "funcionalidades/busca-inteligente": FileSearch,
  "funcionalidades/documentos": FolderOpen,
  "funcionalidades/favoritos": Star,
  "funcionalidades/workflows": GitBranch,
  "funcionalidades/relatorios": BarChart3,
};

function collectDocumentItems(
  items: DocNavigationItem[],
): LinkedNavigationItem[] {
  return items.flatMap((item) => [
    ...(item.href ? [{ ...item, href: item.href }] : []),
    ...collectDocumentItems(item.children),
  ]);
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="home-section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{description}</span>
    </header>
  );
}

function LearningPath({ entries }: { entries: LinkedNavigationItem[] }) {
  if (entries.length === 0) return null;

  return (
    <section className="home-editorial-section">
      <SectionHeading
        description="Siga os primeiros passos para conhecer e acessar o GoDocs."
        eyebrow="01 / ORIENTAÇÃO"
        title="Comece por aqui"
      />

      <ol className="learning-path">
        {entries.map((entry, index) => {
          const Icon = START_ICONS[entry.id] ?? BookOpen;

          return (
            <li key={entry.id}>
              <Link className="learning-path__card" href={entry.href}>
                <span className="learning-path__topline">
                  <span className="learning-path__step">
                    ETAPA {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="learning-path__icon">
                    <Icon size={19} strokeWidth={1.7} />
                  </span>
                </span>
                <span className="learning-path__body">
                  <strong>{entry.label}</strong>
                  <small>{entry.description}</small>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="learning-path__arrow"
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function FeatureDirectory({ features }: { features: HomeFeature[] }) {
  if (features.length === 0) return null;

  return (
    <section className="home-editorial-section">
      <SectionHeading
        description="Acesse as principais funcionalidades disponíveis no GoDocs."
        eyebrow="02 / FUNCIONALIDADES"
        title="Conheça os recursos"
      />

      <ul className="feature-grid">
        {[...features]
          .sort((a, b) => a.order - b.order)
          .map((feature) => {
            const Icon = FEATURE_ICONS[feature.slug] ?? FolderOpen;

            return (
              <li key={feature.slug}>
                {feature.status === "published" && feature.href ? (
                  <DocCard
                    description={feature.description}
                    href={feature.href}
                    icon={Icon}
                    status="active"
                    title={feature.title}
                  />
                ) : (
                  <DocCard
                    description={feature.description}
                    icon={Icon}
                    status="comingSoon"
                    title={feature.title}
                  />
                )}
              </li>
            );
          })}
      </ul>
    </section>
  );
}

function FrequentlyAskedQuestions() {
  return (
    <section className="home-editorial-section home-faq">
      <SectionHeading
        description="Encontre respostas rápidas para as dúvidas mais comuns sobre o GoDocs."
        eyebrow="03 / DÚVIDAS"
        title="Perguntas frequentes"
      />
      <div className="home-faq__empty">
        <span aria-hidden="true" className="home-faq__icon">
          <CircleHelp size={21} strokeWidth={1.7} />
        </span>
        <p>
          Conteúdo em preparação. As perguntas frequentes serão adicionadas em
          breve.
        </p>
      </div>
    </section>
  );
}

export function HomeIntro({ features = [], groups }: HomeIntroProps) {
  const startEntries = collectDocumentItems(
    groups.find((group) => group.id === "comece-por-aqui")?.items ?? [],
  );
  const hasDocumentation = startEntries.length + features.length > 0;

  return (
    <main className="home" id="main-content">
      <section aria-labelledby="home-title" className="home-hero">
        <div aria-hidden="true" className="home-hero__ambient">
          <span />
          <span />
        </div>
        <p className="home-hero__marker">
          <span aria-hidden="true" />
          CENTRAL DE DOCUMENTAÇÃO
        </p>
        <h1 id="home-title">Documentação do GoDocs</h1>
        <p className="home-hero__description">{SITE_DESCRIPTION}</p>
        <div className="home-hero__search">
          <SearchLauncher variant="hero" />
          <div className="home-hero__search-help">
            <span>
              Pesquise páginas, recursos e seções internas dos artigos.
            </span>
            <span className="home-hero__shortcut">
              Atalho
              <kbd>
                <span className="shortcut-command">⌘ K</span>
                <span className="shortcut-control">Ctrl K</span>
              </kbd>
            </span>
          </div>
        </div>
      </section>

      {hasDocumentation ? (
        <div className="home-content">
          <LearningPath entries={startEntries} />
          <FeatureDirectory features={features} />
          <FrequentlyAskedQuestions />
        </div>
      ) : (
        <div className="home-content">
          <p className="home-empty">
            Ainda não há documentos publicados. Novos conteúdos serão
            publicados progressivamente.
          </p>
          <FrequentlyAskedQuestions />
        </div>
      )}

      <footer className="home-footer">
        <Brand />
        <p>Documentação do GoDocs</p>
      </footer>
    </main>
  );
}
