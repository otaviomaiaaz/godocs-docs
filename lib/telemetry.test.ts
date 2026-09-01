import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildLogPayload,
  isPageRequest,
  recordDocOpen,
  resolveOrigin,
  sessionIdFrom,
} from "./telemetry";

afterEach(() => {
  delete process.env.OTEL_ENABLED;
  delete process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  delete process.env.OTEL_DEPLOYMENT_ENVIRONMENT;
  vi.unstubAllGlobals();
});

describe("isPageRequest", () => {
  it("conta uma rota de artigo", () => {
    expect(isPageRequest("/funcionalidades/workflows")).toBe(true);
  });

  it("não conta asset nem rota do bundle", () => {
    expect(isPageRequest("/primeiro-acesso/captura.png")).toBe(false);
    expect(isPageRequest("/_next/image")).toBe(false);
  });
});

describe("resolveOrigin", () => {
  const host = "app.godocs4.com.br";

  it("usa o parâmetro explícito quando existe", () => {
    expect(resolveOrigin(null, host, "sidebar", "/docs")).toBe("sidebar");
  });

  it("sem referer é URL direta", () => {
    expect(resolveOrigin(null, host, null, "/docs")).toBe("url-direta");
  });

  it("referer dentro da própria doc é link interno", () => {
    expect(
      resolveOrigin(`https://${host}/docs/funcionalidades`, host, null, "/docs"),
    ).toBe("link-interno");
  });

  it("referer no mesmo host fora da doc é o app", () => {
    expect(resolveOrigin(`https://${host}/w/1/documentos`, host, null, "/docs")).toBe(
      "app",
    );
  });

  it("referer de outro host é externa", () => {
    expect(resolveOrigin("https://google.com/", host, null, "/docs")).toBe("externa");
  });
});

describe("sessionIdFrom", () => {
  it("deriva um identificador opaco e estável", async () => {
    const first = await sessionIdFrom("gd_rt=abc; outra=1");
    const second = await sessionIdFrom("outra=1; gd_rt=abc");

    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{24}$/);
    expect(first).not.toContain("abc");
  });

  it("devolve nulo sem cookie de sessão", async () => {
    expect(await sessionIdFrom(null)).toBeNull();
    expect(await sessionIdFrom("outra=1")).toBeNull();
  });
});

describe("buildLogPayload", () => {
  it("carrega rota, origem, sessão e ambiente", () => {
    const payload = buildLogPayload(
      { route: "/docs/primeiro-acesso", origin: "sidebar", sessionId: "abc123" },
      "stage",
    );
    const resource = payload.resourceLogs[0].resource.attributes;
    const attributes = payload.resourceLogs[0].scopeLogs[0].logRecords[0].attributes;

    expect(resource).toContainEqual({
      key: "deployment.environment",
      value: { stringValue: "stage" },
    });
    expect(attributes).toContainEqual({
      key: "doc.route",
      value: { stringValue: "/docs/primeiro-acesso" },
    });
    expect(attributes).toContainEqual({
      key: "doc.origin",
      value: { stringValue: "sidebar" },
    });
    expect(attributes).toContainEqual({
      key: "session.id",
      value: { stringValue: "abc123" },
    });
  });
});

describe("recordDocOpen", () => {
  const event = { route: "/docs/x", origin: "sidebar", sessionId: "abc" };

  it("não envia nada com a telemetria desligada", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    recordDocOpen(event);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("não envia nada sem endpoint", () => {
    process.env.OTEL_ENABLED = "true";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    recordDocOpen(event);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posta em /v1/logs quando configurada", () => {
    process.env.OTEL_ENABLED = "true";
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT = "http://collector:4318/";
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    recordDocOpen(event);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://collector:4318/v1/logs",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("engole falha do collector sem estourar", () => {
    process.env.OTEL_ENABLED = "true";
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT = "http://collector:4318";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    expect(() => recordDocOpen(event)).not.toThrow();
  });
});
