import { afterEach, describe, expect, it } from "vitest";

import { GET, readableVersion } from "./route";

describe("GET", () => {
  afterEach(() => {
    delete process.env.DOCS_VERSION;
    delete process.env.API_VERSION;
    delete process.env.WEB_VERSION;
  });

  it("reporta as três versões que a stack resolveu", async () => {
    process.env.DOCS_VERSION = "2797e43aa1b2c3d4e5f60718293a4b5c6d7e8f90";
    process.env.API_VERSION = "v2.1.0";
    process.env.WEB_VERSION = "b23c719b5e8f820c34907f3b5396483d1ced7c8f";

    expect(await (await GET()).json()).toEqual({
      docs: "2797e43",
      api: "2.1.0",
      web: "b23c719",
    });
  });

  it("omite o que a stack não resolveu, sem quebrar", async () => {
    process.env.DOCS_VERSION = "v1.4.0";

    expect(await (await GET()).json()).toMatchObject({
      docs: "1.4.0",
      api: null,
      web: null,
    });
  });
});

describe("readableVersion", () => {
  it("abrevia o sha completo que o stage pina", () => {
    expect(readableVersion("2797e43aa1b2c3d4e5f60718293a4b5c6d7e8f90")).toBe("2797e43");
  });

  it("mantém a tag inteira da release, sem o v", () => {
    expect(readableVersion("v1.4.0")).toBe("1.4.0");
  });

  it("ignora o fallback de canal e o vazio", () => {
    expect(readableVersion("latest")).toBeNull();
    expect(readableVersion("")).toBeNull();
    expect(readableVersion(undefined)).toBeNull();
  });

  it("passa adiante um pin manual de rollback", () => {
    expect(readableVersion("stage")).toBe("stage");
  });
});
