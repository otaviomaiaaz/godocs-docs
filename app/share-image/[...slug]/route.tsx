import { getAllDocs, getDocBySlug } from "@/lib/docs/source";
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

  if (!doc) {
    return new Response(null, { status: 404 });
  }

  return createSocialImage({
    eyebrow: doc.metadata.section?.label ?? "GoDocs Docs",
    title: doc.metadata.title,
    description: doc.metadata.description,
  });
}
