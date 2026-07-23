import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { ArticleShell } from "@/components/docs/article-shell";
import { mdxComponents } from "@/components/docs/mdx-components";
import {
  buildBreadcrumbs,
  buildNavigation,
  getAdjacentDocs,
} from "@/lib/docs/navigation";
import { getAllDocs, getDocBySlug } from "@/lib/docs/source";

type DocPageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = true;

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

  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
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

  return (
    <ArticleShell
      breadcrumbs={buildBreadcrumbs(doc, docs)}
      doc={doc}
      navigation={navigation}
      next={next}
      previous={previous}
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
    </ArticleShell>
  );
}
