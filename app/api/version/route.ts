import { NextResponse } from "next/server";

import { DOCUMENTED_VERSION } from "@/lib/site";

export const dynamic = "force-dynamic";

export type VersionInfo = {
  documented: string | null;
  product: string | null;
};

export async function GET() {
  return NextResponse.json<VersionInfo>({
    documented: DOCUMENTED_VERSION,
    product: await productVersion(),
  });
}

async function productVersion(): Promise<string | null> {
  const baseUrl = process.env.DOCS_AUTH_API_URL;
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/api/v1/info`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;

    const body: unknown = await response.json();
    return readVersion(body);
  } catch {
    return null;
  }
}

function readVersion(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;

  const root = body as { version?: unknown; data?: { version?: unknown } };
  const raw = root.data?.version ?? root.version;
  return typeof raw === "string" ? raw.replace(/^v/, "") : null;
}
