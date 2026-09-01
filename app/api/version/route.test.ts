import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

afterEach(() => {
  delete process.env.DOCS_AUTH_API_URL;
  vi.unstubAllGlobals();
});

async function body() {
  return (await GET()).json();
}

describe("rota de versão", () => {
  it("lê a versão do produto da resposta da API", async () => {
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({ message: "ok", data: { version: "4.5.0" } }),
      ),
    );

    expect((await body()).product).toBe("4.5.0");
  });

  it("aceita a versão na raiz da resposta e tira o v inicial", async () => {
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ version: "v4.5.0" })));

    expect((await body()).product).toBe("4.5.0");
  });

  it("devolve nulo sem quebrar quando a API está fora do ar", async () => {
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    expect((await body()).product).toBeNull();
  });

  it("devolve nulo quando a API responde erro", async () => {
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));

    expect((await body()).product).toBeNull();
  });

  it("devolve nulo sem endereço da API configurado", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect((await body()).product).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignora um corpo em formato inesperado", async () => {
    process.env.DOCS_AUTH_API_URL = "http://app:3333";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ data: { version: 42 } })));

    expect((await body()).product).toBeNull();
  });
});
