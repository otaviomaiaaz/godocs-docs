import { NextResponse } from "next/server";

import { createSearchIndex } from "@/lib/docs/search";
import { getAllDocs } from "@/lib/docs/source";

export const dynamic = "force-static";

export async function GET() {
  const docs = await getAllDocs();

  return NextResponse.json(createSearchIndex(docs), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
