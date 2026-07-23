"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

type CodeBlockProps = {
  code: string;
  language?: string;
};

type CopyState = "idle" | "copied" | "error";

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timeout = window.setTimeout(() => setCopyState("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  const copied = copyState === "copied";
  const label =
    copyState === "error"
      ? "Não foi possível copiar"
      : copied
        ? "Código copiado"
        : "Copiar código";

  return (
    <figure className="code-block">
      <figcaption>
        <span>{language ?? "Código"}</span>
        <button
          aria-label={label}
          onClick={copyCode}
          type="button"
        >
          {copied ? (
            <Check aria-hidden="true" size={15} />
          ) : (
            <Copy aria-hidden="true" size={15} />
          )}
          <span aria-live="polite">
            {copyState === "error" ? "Falha ao copiar" : copied ? "Copiado" : "Copiar"}
          </span>
        </button>
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
