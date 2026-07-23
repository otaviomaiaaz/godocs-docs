import { getAllDocs, getDocBySlug } from "@/lib/docs/source";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { createSocialImage } from "@/lib/social-image";

type ShareImageRouteContext = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return docs.map((doc) => ({ slug: doc.segments }));
}

export async function GET(
  _request: Request,
  { params }: ShareImageRouteContext,
) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug.join("/"));

  return createSocialImage({
    eyebrow: doc?.metadata.section?.label ?? "DOCUMENTAÇÃO OFICIAL",
    title: doc?.metadata.title ?? SITE_NAME,
    description: doc?.metadata.description ?? SITE_DESCRIPTION,
  });
}
