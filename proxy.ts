import { NextResponse, type NextRequest } from "next/server";

import { SITE_BASE_PATH } from "@/lib/site";
import {
  isPageRequest,
  recordDocOpen,
  resolveOrigin,
  sessionIdFrom,
} from "@/lib/telemetry";

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/data|brand/|theme-initialization\\.js|favicon\\.ico|icon\\.svg).*)",
  ],
};

const LOGIN_PATH = "/login";
const SESSION_COOKIES = ["gd_at", "gd_rt", "gd_csrf"];
const AUTH_UNAVAILABLE_MESSAGE =
  "Serviço de autenticação temporariamente indisponível. Tente novamente.";

type SessionCheck = "valid" | "rejected" | "unknown";

const refreshesInFlight = new Map<string, Promise<string[] | null>>();

export async function proxy(request: NextRequest) {
  if (process.env.DOCS_AUTH_ENABLED !== "true") return NextResponse.next();

  if (request.headers.get("host") === null) return NextResponse.next();

  const cookie = request.headers.get("cookie");
  const session = cookie ? await checkSession(cookie) : "rejected";
  if (session === "valid") {
    await trackOpen(request, cookie as string);
    return NextResponse.next();
  }

  if (session === "unknown") return authenticationUnavailable();

  if (session === "rejected" && cookie) {
    const renewed = await renewSession(cookie);
    if (renewed) {
      await trackOpen(request, cookie);
      const response = NextResponse.next();
      for (const value of renewed) response.headers.append("set-cookie", value);
      return response;
    }
  }

  const login = new URL(LOGIN_PATH, request.nextUrl.origin);
  login.searchParams.set(
    "redirect",
    `${SITE_BASE_PATH}${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  const response = NextResponse.redirect(login);
  if (session === "rejected") expireHostOnlySession(response);
  return response;
}

function authenticationUnavailable(): NextResponse {
  return new NextResponse(AUTH_UNAVAILABLE_MESSAGE, {
    status: 503,
    headers: {
      "cache-control": "private, no-store",
      "content-type": "text/plain; charset=utf-8",
      "retry-after": "5",
    },
  });
}

function expireHostOnlySession(response: NextResponse): void {
  for (const name of SESSION_COOKIES) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
}

async function trackOpen(request: NextRequest, cookie: string) {
  if (!isPageRequest(request.nextUrl.pathname)) return;

  recordDocOpen({
    route: `${SITE_BASE_PATH}${request.nextUrl.pathname}`,
    origin: resolveOrigin(
      request.headers.get("referer"),
      request.headers.get("host"),
      request.nextUrl.searchParams.get("origem"),
      SITE_BASE_PATH,
    ),
    sessionId: await sessionIdFrom(cookie),
  });
}

async function checkSession(cookie: string): Promise<SessionCheck> {
  const baseUrl = process.env.DOCS_AUTH_API_URL;
  if (!baseUrl) return "unknown";

  try {
    const response = await fetch(`${baseUrl}/api/v1/profile`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (response.ok) return "valid";
    return response.status === 401 || response.status === 403
      ? "rejected"
      : "unknown";
  } catch {
    return "unknown";
  }
}

function renewSession(cookie: string): Promise<string[] | null> {
  const pending = refreshesInFlight.get(cookie);
  if (pending) return pending;

  const attempt = requestRefresh(cookie);
  refreshesInFlight.set(cookie, attempt);
  void attempt.then(() => refreshesInFlight.delete(cookie));
  return attempt;
}

async function requestRefresh(cookie: string): Promise<string[] | null> {
  const baseUrl = process.env.DOCS_AUTH_API_URL;
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/api/v1/refresh`, {
      method: "POST",
      headers: { cookie },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const renewed = response.headers.getSetCookie();
    return renewed.length > 0 ? renewed : null;
  } catch {
    return null;
  }
}
