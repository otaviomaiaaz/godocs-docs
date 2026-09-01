import { describe, expect, it } from "vitest";

import {
  generateMetadata,
  generateStaticParams,
} from "@/app/(docs)/[...slug]/page";
import { metadata } from "@/app/layout";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { absoluteUrl, SITE_URL } from "@/lib/site";

const expectedDocumentPaths = [
  "/o-que-e-o-godocs",
  "/primeiro-acesso",
  "/funcionalidades",
  "/funcionalidades/workflows/cards-kanban-e-lista",
  "/funcionalidades/documentos/pastas",
  "/funcionalidades/visao-geral",
  "/funcionalidades/documentos/adicionar-documentos",
  "/funcionalidades/workflows/automacoes",
  "/funcionalidades/busca-inteligente",
  "/funcionalidades/workflows/criar-e-configurar",
  "/funcionalidades/documentos",
  "/funcionalidades/documentos/filtros-e-metadados",
  "/funcionalidades/workflows/fases-e-transicoes",
  "/funcionalidades/favoritos",
  "/funcionalidades/documentos/gerenciar-documentos",
  "/funcionalidades/workflows/formularios-e-campos",
  "/funcionalidades/documentos/logs-e-acoes",
  "/funcionalidades/workflows",
  "/funcionalidades/workflows/membros-e-papeis",
  "/funcionalidades/relatorios",
  "/funcionalidades/workflows/formulario-publico",
] as const;

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
        canonical: absoluteUrl("/o-que-e-o-godocs"),
      },
      openGraph: {
        type: "article",
        locale: "pt_BR",
        url: absoluteUrl("/o-que-e-o-godocs"),
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
        canonical: absoluteUrl("/funcionalidades"),
      },
      openGraph: {
        url: absoluteUrl("/funcionalidades"),
        images: [
          expect.objectContaining({
            url: absoluteUrl("/share-image/funcionalidades"),
          }),
        ],
      },
    });
  });

  it("publica somente a home e documentos reais, incluindo as filhas de Workflows, no sitemap", async () => {
    const entries = await sitemap();
    expect(entries.map((entry) => entry.url)).toEqual([
      absoluteUrl("/"),
      ...expectedDocumentPaths.map(absoluteUrl),
    ]);
    expect(entries.some((entry) => entry.url.includes("fixtures"))).toBe(false);
  });

  it("gera estaticamente os vinte e um documentos publicados", async () => {
    const params = await generateStaticParams();

    expect(params).toEqual(
      expectedDocumentPaths.map((path) => ({ slug: path.slice("/".length).split("/") })),
    );
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
