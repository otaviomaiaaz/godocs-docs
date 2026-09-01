const SERVICE_NAME = "godocs4-docs";
const PAGE_EXTENSION = /\.[a-z0-9]+$/i;

export type DocOpenEvent = {
  route: string;
  origin: string;
  sessionId: string | null;
};

export function isPageRequest(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return false;
  return !PAGE_EXTENSION.test(pathname);
}

export function resolveOrigin(
  referer: string | null,
  host: string | null,
  explicit: string | null,
  basePath: string,
): string {
  if (explicit) return explicit;
  if (!referer) return "url-direta";

  let parsed: URL;
  try {
    parsed = new URL(referer);
  } catch {
    return "desconhecida";
  }

  if (host && parsed.host !== host) return "externa";
  if (parsed.pathname === basePath || parsed.pathname.startsWith(`${basePath}/`)) {
    return "link-interno";
  }
  return "app";
}

export async function sessionIdFrom(cookie: string | null): Promise<string | null> {
  if (!cookie) return null;

  const match = /(?:^|;\s*)(gd_rt|gd_at)=([^;]+)/.exec(cookie);
  if (!match) return null;

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(match[2]),
  );
  return Array.from(new Uint8Array(digest).slice(0, 12))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function buildLogPayload(event: DocOpenEvent, environment: string) {
  const attributes = [
    { key: "doc.route", value: { stringValue: event.route } },
    { key: "doc.origin", value: { stringValue: event.origin } },
    { key: "session.id", value: { stringValue: event.sessionId ?? "anonima" } },
  ];

  return {
    resourceLogs: [
      {
        resource: {
          attributes: [
            {
              key: "service.name",
              value: { stringValue: process.env.OTEL_SERVICE_NAME || SERVICE_NAME },
            },
            {
              key: "deployment.environment",
              value: { stringValue: environment },
            },
          ],
        },
        scopeLogs: [
          {
            scope: { name: "docs.open" },
            logRecords: [
              {
                timeUnixNano: `${Date.now() * 1_000_000}`,
                severityNumber: 9,
                severityText: "INFO",
                body: { stringValue: "docs.open" },
                attributes,
              },
            ],
          },
        ],
      },
    ],
  };
}

export function recordDocOpen(event: DocOpenEvent): void {
  if (process.env.OTEL_ENABLED !== "true") return;

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint) return;

  const payload = buildLogPayload(
    event,
    process.env.OTEL_DEPLOYMENT_ENVIRONMENT || "unknown",
  );

  void fetch(`${endpoint.replace(/\/$/, "")}/v1/logs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  }).catch(() => undefined);
}
