import { describe, expect, it } from "vitest";

import { generateMetadata } from "@/app/docs/[...slug]/page";
import { metadata } from "@/app/layout";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { absoluteUrl, SITE_URL } from "@/lib/site";

describe("SEO e indexação", () => {
  it("configura metadados globais e canonical da home", () => {
    expect(metadata).toMatchObject({
      metadataBase: SITE_URL,
      title: {
        default: "GoDocs Docs",
        template: "%s | GoDocs Docs",
      },
      description: "Guias, conceitos e instruções para utilizar o GoDocs.",
      alternates: {
        canonical: absoluteUrl("/"),
      },
      openGraph: {
        type: "website",
        locale: "pt_BR",
        url: absoluteUrl("/"),
        title: "Documentação do GoDocs",
      },
      twitter: {
        card: "summary_large_image",
        title: "Documentação do GoDocs",
      },
    });
  });

  it("deriva canonical, Open Graph e Twitter do frontmatter do artigo", async () => {
    const articleMetadata = await generateMetadata({
      params: Promise.resolve({ slug: ["o-que-e-o-godocs"] }),
    });

    expect(articleMetadata).toMatchObject({
      title: "O que é o GoDocs?",
      description:
        "Conheça a plataforma e entenda como ela centraliza documentos, organiza informações e apoia os processos da organização.",
      alternates: {
        canonical: absoluteUrl("/docs/o-que-e-o-godocs"),
      },
      openGraph: {
        type: "article",
        locale: "pt_BR",
        url: absoluteUrl("/docs/o-que-e-o-godocs"),
      },
      twitter: {
        card: "summary_large_image",
      },
    });
  });

  it("publica somente a home e documentos reais no sitemap", async () => {
    const entries = await sitemap();

    expect(entries.map((entry) => entry.url)).toEqual([
      absoluteUrl("/"),
      absoluteUrl("/docs/o-que-e-o-godocs"),
      absoluteUrl("/docs/primeiro-acesso"),
      absoluteUrl("/docs/funcionalidades/visao-geral"),
      absoluteUrl("/docs/funcionalidades/busca-inteligente"),
    ]);
    expect(entries.some((entry) => entry.url.includes("fixtures"))).toBe(false);
  });

  it("permite páginas públicas e referencia o sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: absoluteUrl("/sitemap.xml"),
      host: SITE_URL.origin,
    });
  });
});
