"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
  }

  return (
    <figure className="code-block">
      <figcaption>
        <span>{language ?? "Código"}</span>
        <button
          aria-label={copied ? "Código copiado" : "Copiar código"}
          onClick={copyCode}
          type="button"
        >
          {copied ? (
            <Check aria-hidden="true" size={15} />
          ) : (
            <Copy aria-hidden="true" size={15} />
          )}
          <span>{copied ? "Copiado" : "Copiar"}</span>
        </button>
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
