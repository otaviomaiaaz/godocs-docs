import { afterEach, describe, expect, it, vi } from "vitest";

import { proxy } from "./proxy";

function request(
  pathname: string,
  cookie?: string,
  host: string | null = "cliente.godocs4.com.br",
) {
  const headers: Record<string, string | null> = {
    cookie: cookie ?? null,
    host,
  };
  return {
    headers: { get: (key: string) => headers[key] ?? null },
    nextUrl: { origin: "https://cliente.godocs4.com.br", pathname },
  } as unknown as Parameters<typeof proxy>[0];
}

afterEach(() => {
  delete process.env.DOCS_AUTH_ENABLED;
  delete process.env.DOCS_AUTH_API_URL;
  vi.unstubAllGlobals();
});

describe("gate de sessão da doc", () => {
  it("libera tudo quando a flag está ausente (dev local)", async () => {
    const response = await proxy(request("/primeiro-acesso"));

    expect(response.status).toBe(200);
  });

  it("manda para o /login da SPA quando não há cookie", async () => {
    process.env.DOCS_AUTH_ENABLED = "true";
    process.env.DOCS_AUTH_API_URL = "http://app:3333";

    const response = await proxy(request("/primeiro-acesso"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://cliente.godocs4.com.br/login",
    );
  });

  it("repassa o cookie para a API e libera quando a sessão vale", async () => {
    process.env.DOCS_AUTH_ENABLED = "true";
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxy(request("/primeiro-acesso", "gd_at=abc"));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://app:3333/api/v1/profile",
      expect.objectContaining({ headers: { cookie: "gd_at=abc" } }),
    );
  });

  it("bloqueia quando a API recusa a sessão", async () => {
    process.env.DOCS_AUTH_ENABLED = "true";
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

    expect((await proxy(request("/primeiro-acesso", "gd_at=velho"))).status).toBe(307);
  });

  it("falha fechado quando a API está fora do ar", async () => {
    process.env.DOCS_AUTH_ENABLED = "true";
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    expect((await proxy(request("/primeiro-acesso", "gd_at=abc"))).status).toBe(307);
  });

  it("deixa passar a busca interna do otimizador de imagem, que vem sem headers", async () => {
    process.env.DOCS_AUTH_ENABLED = "true";
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxy(
      request("/primeiro-acesso/captura.png", undefined, null),
    );

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("falha fechado quando falta a URL da API", async () => {
    process.env.DOCS_AUTH_ENABLED = "true";

    expect((await proxy(request("/primeiro-acesso", "gd_at=abc"))).status).toBe(307);
  });
});
