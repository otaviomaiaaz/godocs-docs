import { describe, expect, it } from "vitest";

import { getCompatibleAnchorUrl } from "@/components/docs/anchor-compatibility";

describe("compatibilidade client-side de anchors", () => {
  it("prepara location.replace somente quando o destino canônico muda", () => {
    const manifest = [
      {
        from: { slug: "funcionalidades/documentos", fragment: "legado" },
        to: {
          slug: "funcionalidades/documentos/pastas",
          fragment: "criar-pasta",
        },
      },
    ] as const;

    expect(
      getCompatibleAnchorUrl(
        "funcionalidades/documentos",
        "#legado",
        manifest,
      ),
    ).toBe(
      "/docs/funcionalidades/documentos/pastas#criar-pasta",
    );
    expect(
      getCompatibleAnchorUrl(
        "funcionalidades/documentos",
        "#typo",
        manifest,
      ),
    ).toBeUndefined();
  });
});
