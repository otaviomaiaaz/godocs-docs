import { describe, expect, it } from "vitest";

import {
  generateMetadata,
  generateStaticParams,
} from "@/app/docs/[...slug]/page";
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
      description:
        "Encontre orientações para acessar, organizar documentos e utilizar os recursos do sistema.",
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

  it("publica canonical e imagem social do hub de Funcionalidades", async () => {
    const hubMetadata = await generateMetadata({
      params: Promise.resolve({ slug: ["funcionalidades"] }),
    });

    expect(hubMetadata).toMatchObject({
      title: "Funcionalidades",
      alternates: {
        canonical: absoluteUrl("/docs/funcionalidades"),
      },
      openGraph: {
        url: absoluteUrl("/docs/funcionalidades"),
        images: [
          expect.objectContaining({
            url: absoluteUrl("/share-image/funcionalidades"),
          }),
        ],
      },
    });
  });

  it("publica somente a home e documentos reais no sitemap", async () => {
    const entries = await sitemap();

    expect(entries.map((entry) => entry.url)).toEqual([
      absoluteUrl("/"),
      absoluteUrl("/docs/o-que-e-o-godocs"),
      absoluteUrl("/docs/primeiro-acesso"),
      absoluteUrl("/docs/funcionalidades"),
      absoluteUrl("/docs/funcionalidades/documentos/pastas"),
      absoluteUrl("/docs/funcionalidades/visao-geral"),
      absoluteUrl("/docs/funcionalidades/documentos/adicionar-documentos"),
      absoluteUrl("/docs/funcionalidades/busca-inteligente"),
      absoluteUrl("/docs/funcionalidades/documentos"),
      absoluteUrl("/docs/funcionalidades/documentos/filtros-e-metadados"),
      absoluteUrl("/docs/funcionalidades/favoritos"),
      absoluteUrl("/docs/funcionalidades/documentos/gerenciar-documentos"),
      absoluteUrl("/docs/funcionalidades/documentos/logs-e-acoes"),
      absoluteUrl("/docs/funcionalidades/workflows"),
      absoluteUrl("/docs/funcionalidades/relatorios"),
    ]);
    expect(entries.some((entry) => entry.url.includes("fixtures"))).toBe(false);
  });

  it("gera estaticamente os quatorze documentos publicados", async () => {
    const params = await generateStaticParams();

    expect(params).toEqual([
      { slug: ["o-que-e-o-godocs"] },
      { slug: ["primeiro-acesso"] },
      { slug: ["funcionalidades"] },
      { slug: ["funcionalidades", "documentos", "pastas"] },
      { slug: ["funcionalidades", "visao-geral"] },
      {
        slug: ["funcionalidades", "documentos", "adicionar-documentos"],
      },
      { slug: ["funcionalidades", "busca-inteligente"] },
      { slug: ["funcionalidades", "documentos"] },
      {
        slug: ["funcionalidades", "documentos", "filtros-e-metadados"],
      },
      { slug: ["funcionalidades", "favoritos"] },
      {
        slug: ["funcionalidades", "documentos", "gerenciar-documentos"],
      },
      { slug: ["funcionalidades", "documentos", "logs-e-acoes"] },
      { slug: ["funcionalidades", "workflows"] },
      { slug: ["funcionalidades", "relatorios"] },
    ]);
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
