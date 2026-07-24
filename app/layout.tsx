import "@fontsource-variable/inter";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import "./globals.css";

import { DocsHeader } from "@/components/docs-header";
import { buildNavigation } from "@/lib/docs/navigation";
import { getAllDocs } from "@/lib/docs/source";
import {
  absoluteUrl,
  SITE_DESCRIPTION,
  SITE_HOME_TITLE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: SITE_HOME_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: SITE_HOME_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_HOME_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/opengraph-image")],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#232222" },
    { media: "(prefers-color-scheme: light)", color: "#F7F7F6" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const docs = await getAllDocs();
  const navigation = buildNavigation(docs);

  return (
    <html
      data-scroll-behavior="smooth"
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-initialization"
          src="/theme-initialization.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <div id="site-shell">
          <a className="skip-link" href="#main-content">
            Pular para o conteúdo
          </a>
          <DocsHeader navigation={navigation} />
          {children}
        </div>
      </body>
    </html>
  );
}
