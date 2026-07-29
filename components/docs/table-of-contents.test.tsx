// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TableOfContents } from "@/components/docs/table-of-contents";

describe("TableOfContents", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 1_000,
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("mantém a última seção ativa quando a página chega ao fim", async () => {
    render(
      <>
        <h2 id="secao-inicial">Seção inicial</h2>
        <h2 id="secao-final">Seção final</h2>
        <TableOfContents
          headings={[
            { depth: 2, id: "secao-inicial", title: "Seção inicial" },
            { depth: 2, id: "secao-final", title: "Seção final" },
          ]}
        />
      </>,
    );

    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: "Seção final" }).getAttribute(
          "aria-current",
        ),
      ).toBe("location"),
    );
  });
});
