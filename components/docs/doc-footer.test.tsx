// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(cleanup);

import { DocFooter, formatUpdatedAt } from "./doc-footer";

describe("formatUpdatedAt", () => {
  it("formata a data do frontmatter em pt-BR sem deslocar o dia", () => {
    expect(formatUpdatedAt("2026-01-31")).toBe("31 de janeiro de 2026");
  });

  it("devolve o valor cru quando a data não faz sentido", () => {
    expect(formatUpdatedAt("nao-e-data")).toBe("nao-e-data");
  });
});

describe("DocFooter", () => {
  it("mostra a data e a versão", () => {
    render(<DocFooter updatedAt="2026-01-31" />);

    expect(screen.getByText(/31 de janeiro de 2026/)).toBeTruthy();
    expect(screen.getByText(/Documentação v/)).toBeTruthy();
  });

  it("omite a data quando o artigo não declara uma", () => {
    render(<DocFooter />);

    expect(screen.queryByText(/Atualizado em/)).toBeNull();
    expect(screen.getByText(/Documentação v/)).toBeTruthy();
  });
});
