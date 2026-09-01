import { NextResponse, type NextRequest } from "next/server";

import { SITE_BASE_PATH } from "@/lib/site";

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/data|brand/|theme-initialization\\.js|favicon\\.ico|icon\\.svg).*)",
  ],
};

const LOGIN_PATH = "/login";

export async function proxy(request: NextRequest) {
  if (process.env.DOCS_AUTH_ENABLED !== "true") return NextResponse.next();

  if (request.headers.get("host") === null) return NextResponse.next();

  const cookie = request.headers.get("cookie");
  if (cookie && (await hasValidSession(cookie))) return NextResponse.next();

  const login = new URL(LOGIN_PATH, request.nextUrl.origin);
  login.searchParams.set(
    "redirect",
    `${SITE_BASE_PATH}${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(login);
}

async function hasValidSession(cookie: string): Promise<boolean> {
  const baseUrl = process.env.DOCS_AUTH_API_URL;
  if (!baseUrl) return false;

  try {
    const response = await fetch(`${baseUrl}/api/v1/profile`, {
      headers: { cookie },
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}
