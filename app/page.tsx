import {
  HomeIntro,
  type HomeGuide,
} from "@/components/home-intro";
import { buildNavigation } from "@/lib/docs/navigation";
import { getAllDocs } from "@/lib/docs/source";

const GUIDE_DEFINITIONS = [
  {
    slug: "funcionalidades/documentos",
    heading: "Criando uma nova pasta",
    title: "Criar uma pasta",
  },
  {
    slug: "funcionalidades/documentos",
    heading: "Adicionar documento",
    title: "Adicionar um documento",
  },
  {
    slug: "funcionalidades/documentos",
    heading: "Mover pasta",
    title: "Mover uma pasta",
  },
  {
    slug: "funcionalidades/documentos",
    heading: "Vincular a um grupo",
    title: "Vincular uma pasta a um grupo",
  },
  {
    slug: "funcionalidades/documentos",
    heading: "Visualizar logs da pasta",
    title: "Consultar logs da pasta",
  },
] as const;

export default async function HomePage() {
  const docs = await getAllDocs();
  const guides = GUIDE_DEFINITIONS.flatMap<HomeGuide>((definition) => {
    const doc = docs.find((candidate) => candidate.slug === definition.slug);
    const section = doc?.sections.find(
      (candidate) => candidate.title === definition.heading,
    );

    if (!doc || !section) return [];

    const firstSentence =
      section.text.split(/(?<=[.!?])\s+/)[0] || doc.metadata.description;

    return [
      {
        id: `${doc.slug}:${section.id}`,
        title: definition.title,
        description: firstSentence,
        href: `${doc.href}#${section.id}`,
      },
    ];
  });

  return <HomeIntro groups={buildNavigation(docs)} guides={guides} />;
}
