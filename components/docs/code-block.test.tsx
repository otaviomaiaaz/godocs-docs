// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CodeBlock } from "@/components/docs/code-block";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("bloco de código", () => {
  it("copia por teclado, preserva o foco e comunica o resultado", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");

    render(<CodeBlock code="const docs = true;" language="typescript" />);
    const copyButton = screen.getByRole("button", { name: "Copiar código" });

    copyButton.focus();
    expect(document.activeElement).toBe(copyButton);
    await user.keyboard("{Enter}");

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("const docs = true;"),
    );
    expect(document.activeElement).toBe(copyButton);
    expect(
      screen.getByRole("button", { name: "Código copiado" }),
    ).toBeTruthy();
    expect(screen.getByText("Copiado")).toBeTruthy();
  });
});
