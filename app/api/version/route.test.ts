import { describe, expect, it } from "vitest";

import { readableVersion } from "./route";

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
