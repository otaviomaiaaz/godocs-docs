import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { ArticleShell } from "@/components/docs/article-shell";
import {
  HubNavigation,
  type HubNavigationItem,
} from "@/components/docs/hub-navigation";
import { mdxComponents } from "@/components/docs/mdx-components";
import {
  buildBreadcrumbs,
  buildNavigation,
  getAdjacentDocs,
} from "@/lib/docs/navigation";
import { getAllDocs, getDocBySlug } from "@/lib/docs/source";
import type { DocRecord } from "@/lib/docs/schema";
import { absoluteUrl, SITE_LOCALE, SITE_NAME } from "@/lib/site";

type DocPageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = true;

export function getHubNavigationItems(
  children: DocRecord[],
): HubNavigationItem[] {
  return children.map((child) => ({
    description: child.metadata.cardDescription ?? child.metadata.description,
    href: child.href,
    slug: child.slug,
    title: child.metadata.navTitle ?? child.metadata.title,
  }));
}

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return docs.map((doc) => ({ slug: doc.segments }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug.join("/"));

  if (!doc) {
    return { title: "Página não encontrada" };
  }

  const canonical = absoluteUrl(doc.href);
  const socialImage = absoluteUrl(`/share-image/${doc.slug}`);

  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      locale: SITE_LOCALE,
      url: canonical,
      siteName: SITE_NAME,
      title: doc.metadata.title,
      description: doc.metadata.description,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: doc.metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.metadata.title,
      description: doc.metadata.description,
      images: [socialImage],
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.join("/");
  const doc = await getDocBySlug(normalizedSlug);

  if (!doc) notFound();

  const docs = await getAllDocs();
  const navigation = buildNavigation(docs);
  const { previous, next } = getAdjacentDocs(docs, doc.slug);
  const related = doc.metadata.related
    .map((relatedSlug) =>
      docs.find((candidate) => candidate.slug === relatedSlug),
    )
    .filter((candidate): candidate is (typeof docs)[number] =>
      Boolean(candidate),
    );
  const hubChildren =
    doc.metadata.pageType === "hub"
      ? docs
          .filter(
            (candidate) =>
              candidate.segments.length === doc.segments.length + 1 &&
              candidate.segments.every(
                (segment, index) =>
                  index === doc.segments.length || segment === doc.segments[index],
              ),
          )
          .sort((first, second) => first.metadata.order - second.metadata.order)
      : [];

  return (
    <ArticleShell
      breadcrumbs={buildBreadcrumbs(doc, docs)}
      doc={doc}
      navigation={navigation}
      next={next}
      previous={previous}
      related={related}
    >
      <MDXRemote
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
        source={doc.source}
      />
      {hubChildren.length > 0 ? (
        <HubNavigation
          items={getHubNavigationItems(hubChildren)}
          title={`Explore ${doc.metadata.title}`}
          variant={doc.slug === "funcionalidades" ? "functionalities" : undefined}
        />
      ) : null}
    </ArticleShell>
  );
}
