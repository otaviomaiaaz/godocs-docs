import { HomeIntro } from "@/components/home-intro";
import { buildNavigation } from "@/lib/docs/navigation";
import { getAllDocs } from "@/lib/docs/source";

export default async function HomePage() {
  const docs = await getAllDocs();
  return <HomeIntro groups={buildNavigation(docs)} />;
}
