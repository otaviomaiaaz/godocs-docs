"use client";

import {
  ArrowRight,
  BookOpen,
  FileSearch,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { SearchLauncher } from "@/components/search-dialog";
import type {
  DocNavigationGroup,
  DocNavigationItem,
} from "@/lib/docs/navigation";
import { SITE_DESCRIPTION } from "@/lib/site";

type HomeIntroProps = {
  groups: DocNavigationGroup[];
  guides?: HomeGuide[];
};

type LinkedNavigationItem = DocNavigationItem & { href: string };

export type HomeGuide = {
  id: string;
  title: string;
  description: string;
  href: string;
};

type ObjectiveDefinition = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  slugs: string[];
};

const OBJECTIVES: readonly ObjectiveDefinition[] = [
  {
    id: "organizar",
    title: "Organizar documentos",
    description: "Estruture o acervo e mantenha os arquivos fáceis de consultar.",
    icon: FolderOpen,
    slugs: ["funcionalidades/documentos", "funcionalidades/favoritos"],
  },
  {
    id: "encontrar",
    title: "Encontrar informações",
    description: "Localize conteúdos e refine a consulta ao acervo.",
    icon: FileSearch,
    slugs: ["funcionalidades/busca-inteligente", "funcionalidades/relatorios"],
  },
  {
    id: "acompanhar",
    title: "Acompanhar atividades",
    description: "Consulte o panorama e os indicadores disponíveis no ambiente.",
    icon: LayoutDashboard,
    slugs: ["funcionalidades/visao-geral"],
  },
  {
    id: "automatizar",
    title: "Automatizar processos",
    description: "Acompanhe fluxos de trabalho documentados.",
    icon: GitBranch,
    slugs: ["funcionalidades/workflows"],
  },
] as const;

const START_ICONS: Readonly<Record<string, LucideIcon>> = {
  "o-que-e-o-godocs": BookOpen,
  "primeiro-acesso": LogIn,
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
        description="Uma sequência curta para entender o produto e entrar no ambiente."
        eyebrow="01 / ORIENTAÇÃO"
        title="Comece por aqui"
      />

      <ol className="learning-path">
        {entries.map((entry, index) => {
          const Icon = START_ICONS[entry.id] ?? BookOpen;

          return (
            <li key={entry.id}>
              <Link href={entry.href}>
                <span aria-hidden="true" className="learning-path__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="learning-path__icon">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <span className="learning-path__body">
                  <strong>{entry.label}</strong>
                  <small>{entry.description}</small>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="learning-path__arrow"
                  size={18}
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ObjectiveDirectory({ entries }: { entries: LinkedNavigationItem[] }) {
  const publishedBySlug = new Map(entries.map((entry) => [entry.id, entry]));
  const objectives = OBJECTIVES.map((objective) => ({
    ...objective,
    entries: objective.slugs
      .map((slug) => publishedBySlug.get(slug))
      .filter((entry): entry is LinkedNavigationItem => Boolean(entry)),
  })).filter((objective) => objective.entries.length > 0);

  if (objectives.length === 0) return null;

  return (
    <section className="home-editorial-section">
      <SectionHeading
        description="Escolha pelo que você precisa fazer, mesmo sem conhecer o nome do módulo."
        eyebrow="02 / FUNCIONALIDADES"
        title="Encontre por objetivo"
      />

      <div className="objective-directory">
        {objectives.map((objective) => {
          const Icon = objective.icon;

          return (
            <section className="objective-group" key={objective.id}>
              <div className="objective-group__heading">
                <Icon aria-hidden="true" size={19} strokeWidth={1.7} />
                <div>
                  <h3>{objective.title}</h3>
                  <p>{objective.description}</p>
                </div>
              </div>
              <ul>
                {objective.entries.map((entry) => (
                  <li key={entry.id}>
                    <Link href={entry.href}>
                      <span>
                        <strong>{entry.label}</strong>
                        <small>{entry.description}</small>
                      </span>
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function GuidesSection({ guides }: { guides: HomeGuide[] }) {
  if (guides.length === 0) return null;

  return (
    <section className="home-editorial-section">
      <SectionHeading
        description="Uma seleção editorial de procedimentos que ajudam nas tarefas recorrentes."
        eyebrow="03 / PROCEDIMENTOS"
        title="Guias mais acessados"
      />

      <ul className="featured-guides">
        {guides.map((guide, index) => (
          <li key={guide.id}>
            <Link href={guide.href}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{guide.title}</strong>
                <small>{guide.description}</small>
              </div>
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HomeIntro({ groups, guides = [] }: HomeIntroProps) {
  const startEntries = collectDocumentItems(
    groups.find((group) => group.id === "comece-por-aqui")?.items ?? [],
  );
  const featureEntries = collectDocumentItems(
    groups.find((group) => group.id === "funcionalidades")?.items ?? [],
  );
  const hasPublishedContent = startEntries.length + featureEntries.length > 0;

  return (
    <main className="home" id="main-content">
      <section aria-labelledby="home-title" className="home-hero">
        <div className="home-hero__marker" aria-hidden="true">
          <span />
          CENTRAL DE DOCUMENTAÇÃO
        </div>
        <h1 id="home-title">Documentação do GoDocs</h1>
        <p>{SITE_DESCRIPTION}</p>
        <div className="home-hero__search">
          <SearchLauncher variant="hero" />
          <small>
            Pesquise páginas, recursos e seções internas dos artigos.
          </small>
        </div>
      </section>

      {hasPublishedContent ? (
        <div className="home-content">
          <LearningPath entries={startEntries} />
          <ObjectiveDirectory entries={featureEntries} />
          <GuidesSection guides={guides} />
        </div>
      ) : (
        <p className="home-empty">
          Ainda não há documentos publicados. Use a busca para consultar novos
          conteúdos quando estiverem disponíveis.
        </p>
      )}
    </main>
  );
}
