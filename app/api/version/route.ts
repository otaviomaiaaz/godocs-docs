import { NextResponse } from "next/server";

import { APP_VERSION } from "@/lib/site";

export const dynamic = "force-dynamic";

export type VersionInfo = {
  version: string;
};

const FULL_SHA = /^[0-9a-f]{40}$/i;

export function readableVersion(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value || value === "latest") return null;

  const normalized = value.replace(/^v/, "");
  return FULL_SHA.test(normalized) ? normalized.slice(0, 7) : normalized;
}

export async function GET() {
  return NextResponse.json<VersionInfo>({
    version: readableVersion(process.env.DOCS_VERSION) ?? APP_VERSION,
  });
}
