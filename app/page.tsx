import { HomeIntro, type HomeFeature } from "@/components/home-intro";
import { buildNavigation } from "@/lib/docs/navigation";
import { getAllContentDocs } from "@/lib/docs/source";

export default async function HomePage() {
  const docs = await getAllContentDocs();
  const publishedDocs = docs.filter(
    (doc) => doc.metadata.status === "published",
  );
  const features = docs
    .filter((doc) => doc.metadata.section?.id === "funcionalidades")
    .map<HomeFeature>((doc) => ({
      description:
        doc.metadata.cardDescription ?? doc.metadata.description,
      href:
        doc.metadata.status === "published" ? doc.href : undefined,
      order: doc.metadata.order,
      slug: doc.slug,
      status: doc.metadata.status,
      title: doc.metadata.navTitle ?? doc.metadata.title,
    }));

  return (
    <HomeIntro
      features={features}
      groups={buildNavigation(publishedDocs)}
    />
  );
}
