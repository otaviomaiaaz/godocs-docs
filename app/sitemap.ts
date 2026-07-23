import type { MetadataRoute } from "next";

import { getAllDocs } from "@/lib/docs/source";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getAllDocs();

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docs.map((doc) => ({
      url: absoluteUrl(doc.href),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
