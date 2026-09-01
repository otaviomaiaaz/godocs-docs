import { NextResponse, type NextRequest } from "next/server";

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

  return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl.origin));
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
