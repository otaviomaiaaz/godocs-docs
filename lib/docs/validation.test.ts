import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { validateContentDirectory } from "@/lib/docs/validation";

const temporaryDirectories: string[] = [];

async function createWorkspace() {
  const workspaceDirectory = await mkdtemp(
    path.join(tmpdir(), "godocs-validation-"),
  );
  const contentDirectory = path.join(workspaceDirectory, "content", "docs");
  const publicDirectory = path.join(workspaceDirectory, "public");
  await Promise.all([
    mkdir(contentDirectory, { recursive: true }),
    mkdir(publicDirectory, { recursive: true }),
  ]);
  temporaryDirectories.push(workspaceDirectory);
  return { workspaceDirectory, contentDirectory, publicDirectory };
}

async function writeDocument(
  contentDirectory: string,
  name: string,
  source: string,
) {
  const filePath = path.join(contentDirectory, name);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, source, "utf8");
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

describe("validação documental", () => {
  it("aceita o diretório vazio intencional", async () => {
    const workspace = await createWorkspace();
    const result = await validateContentDirectory(workspace.contentDirectory, {
      publicDirectory: workspace.publicDirectory,
      workspaceDirectory: workspace.workspaceDirectory,
    });

    expect(result.documents).toEqual([]);
    expect(result.issues).toEqual([]);
  });

  it("valida fixtures preenchidas com taxonomia, MDX, links e assets", async () => {
    const workspace = await createWorkspace();
    const section = `section:
  id: guias
  label: Guias
  description: Orientações publicadas.
  order: 10`;

    await writeFile(
      path.join(workspace.publicDirectory, "diagram.svg"),
      "<svg xmlns=\"http://www.w3.org/2000/svg\" />",
      "utf8",
    );
    await writeDocument(
      workspace.contentDirectory,
      "guias.mdx",
      `---
title: Guias
description: Página de entrada dos guias.
slug: guias
${section}
order: 1
---

## Visão geral

[Configuração](/docs/guias/configuracao#op%C3%A7%C3%B5es)

![Diagrama](/diagram.svg)
`,
    );
    await writeDocument(
      workspace.contentDirectory,
      "configuracao.mdx",
      `---
title: Configuração detalhada
navTitle: Configuração
description: Orientações de configuração.
slug: guias/configuracao
${section}
ancestors:
  - segment: guias
    label: Guias
    order: 1
order: 2
keywords:
  - ajustes
---

## Opções

<Callout variant="info">Revise as opções disponíveis.</Callout>

<Steps>
  <Step title="Abrir">Consulte a página.</Step>
</Steps>
`,
    );

    const result = await validateContentDirectory(workspace.contentDirectory, {
      publicDirectory: workspace.publicDirectory,
      workspaceDirectory: workspace.workspaceDirectory,
    });

    expect(result.documents).toHaveLength(2);
    expect(result.issues).toEqual([]);
  });

  it("informa arquivo e causa para erros de conteúdo", async () => {
    const workspace = await createWorkspace();

    await writeDocument(
      workspace.contentDirectory,
      "destino.mdx",
      `---
title: Destino
description: Documento de destino.
slug: destino
order: 1
---

## Seção existente

Texto.
`,
    );
    await writeDocument(
      workspace.contentDirectory,
      "links.mdx",
      `---
title: Links
description: Documento com referências inválidas.
slug: links
order: 2
---

## Referências

[Ausente](/docs/ausente)
[Fragmento](/docs/destino#nao-existe)
![Imagem ausente](/nao-existe.png)

<ComponenteInexistente />
`,
    );
    await writeDocument(
      workspace.contentDirectory,
      "frontmatter.mdx",
      `---
title: Sem descrição
slug: frontmatter
order: 3
---
`,
    );
    await writeDocument(
      workspace.contentDirectory,
      "h1.mdx",
      `---
title: H1 duplicado
description: Documento inválido.
slug: h1
order: 4
---

# H1 inválido
`,
    );
    await writeDocument(
      workspace.contentDirectory,
      "duplicado-a.mdx",
      `---
title: Duplicado A
description: Primeiro.
slug: duplicado
order: 5
---
`,
    );
    await writeDocument(
      workspace.contentDirectory,
      "duplicado-b.mdx",
      `---
title: Duplicado B
description: Segundo.
slug: duplicado
order: 6
---
`,
    );

    const result = await validateContentDirectory(workspace.contentDirectory, {
      publicDirectory: workspace.publicDirectory,
      workspaceDirectory: workspace.workspaceDirectory,
    });
    const categories = new Set(result.issues.map((entry) => entry.category));

    expect(categories).toEqual(
      new Set([
        "asset",
        "component",
        "fragment",
        "frontmatter",
        "link",
        "mdx",
        "slug",
      ]),
    );
    expect(
      result.issues.every(
        (entry) => entry.filePath.length > 0 && entry.message.length > 0,
      ),
    ).toBe(true);
  });
});
