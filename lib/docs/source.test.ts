import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadDocumentsFromDirectory } from "@/lib/docs/source";

const temporaryDirectories: string[] = [];

async function createTemporaryContentDirectory() {
  const directory = await mkdtemp(path.join(tmpdir(), "godocs-docs-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

describe("fonte documental", () => {
  it("aceita um diretório sem documentos", async () => {
    const directory = await createTemporaryContentDirectory();
    await expect(loadDocumentsFromDirectory(directory)).resolves.toEqual([]);
  });

  it("carrega e normaliza um documento válido", async () => {
    const directory = await createTemporaryContentDirectory();
    await writeFile(
      path.join(directory, "pagina.mdx"),
      `---
title: Página válida
description: Descrição válida.
slug: pagina-valida
order: 10
keywords:
  - consulta
---

## Leitura

Conteúdo pesquisável.
`,
      "utf8",
    );

    const docs = await loadDocumentsFromDirectory(directory);
    expect(docs).toHaveLength(1);
    expect(docs[0]?.href).toBe("/docs/pagina-valida");
    expect(docs[0]?.headings[0]?.id).toBe("leitura");
  });

  it("falha de forma clara quando existem slugs duplicados", async () => {
    const directory = await createTemporaryContentDirectory();
    const frontmatter = `---
title: Página
description: Descrição válida.
slug: mesmo-slug
order: 1
---

Texto.
`;

    await Promise.all([
      writeFile(path.join(directory, "a.mdx"), frontmatter, "utf8"),
      writeFile(path.join(directory, "b.md"), frontmatter, "utf8"),
    ]);

    await expect(loadDocumentsFromDirectory(directory)).rejects.toThrow(
      "Slug duplicado",
    );
  });

  it("rejeita frontmatter inválido", async () => {
    const directory = await createTemporaryContentDirectory();
    await writeFile(
      path.join(directory, "invalido.mdx"),
      `---
title: Sem descrição
slug: /slug-invalido/
order: primeiro
---
`,
      "utf8",
    );

    await expect(loadDocumentsFromDirectory(directory)).rejects.toThrow(
      "Frontmatter inválido",
    );
  });
});
