import "@fontsource-variable/inter";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import "./globals.css";

import { DocsHeader } from "@/components/docs-header";
import { buildNavigation } from "@/lib/docs/navigation";
import { createSearchIndex } from "@/lib/docs/search";
import { getAllDocs } from "@/lib/docs/source";

export const metadata: Metadata = {
  title: {
    default: "GoDocs Docs",
    template: "%s | GoDocs Docs",
  },
  description: "Documentação oficial do GoDocs.",
  applicationName: "GoDocs Docs",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1B1B1B" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const docs = await getAllDocs();
  const navigation = buildNavigation(docs);
  const searchIndex = createSearchIndex(docs);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script
          id="theme-initialization"
          src="/theme-initialization.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Pular para o conteúdo
        </a>
        <DocsHeader navigation={navigation} searchIndex={searchIndex} />
        {children}
      </body>
    </html>
  );
}
