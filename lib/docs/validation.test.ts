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
  entrySlug: guias
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
pageType: hub
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
pageType: task
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
  <Step headingLevel="3" id="abrir" title="Abrir">Consulte a página.</Step>
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
pageType: reference
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
pageType: reference
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
pageType: reference
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
pageType: reference
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
pageType: reference
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
pageType: reference
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

  it("aceita fragments H2, H3, H4 e aliases sem mascarar fragment inexistente", async () => {
    const workspace = await createWorkspace();

    await writeDocument(
      workspace.contentDirectory,
      "destino.mdx",
      `---
title: Destino
description: Documento de destino.
slug: destino
pageType: reference
order: 1
---

## Nível dois

### Nível três

#### Nível quatro
`,
    );
    await writeDocument(
      workspace.contentDirectory,
      "origem.mdx",
      `---
title: Origem
description: Documento com fragments.
slug: origem
pageType: reference
order: 2
---

[H2](/docs/destino#nível-dois)
[H3](/docs/destino#nível-três)
[H4](/docs/destino#nível-quatro)
[Alias](/docs/destino#nome-antigo)
[Inválido](/docs/destino#nao-existe)
`,
    );

    const result = await validateContentDirectory(workspace.contentDirectory, {
      compatibilityManifest: [
        {
          from: { slug: "destino", fragment: "nome-antigo" },
          to: { slug: "destino", fragment: "nível-quatro" },
        },
      ],
      publicDirectory: workspace.publicDirectory,
      workspaceDirectory: workspace.workspaceDirectory,
    });
    const fragmentIssues = result.issues.filter(
      (entry) => entry.category === "fragment",
    );

    expect(fragmentIssues).toHaveLength(1);
    expect(fragmentIssues[0]?.message).toContain("#nao-existe");
  });

  it("rejeita ancestor sem página real para manter breadcrumbs navegáveis", async () => {
    const workspace = await createWorkspace();

    await writeDocument(
      workspace.contentDirectory,
      "filha.mdx",
      `---
title: Filha
description: Página filha.
slug: guias/filha
pageType: task
section:
  id: guias
  label: Guias
  description: Guias publicados.
  entrySlug: guias/filha
  order: 1
ancestors:
  - segment: guias
    label: Guias
    order: 1
order: 1
---

## Conteúdo
`,
    );

    const result = await validateContentDirectory(workspace.contentDirectory, {
      publicDirectory: workspace.publicDirectory,
      workspaceDirectory: workspace.workspaceDirectory,
    });

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "taxonomy",
          message: expect.stringContaining(
            'ancestor "guias" não corresponde a uma página real',
          ),
        }),
      ]),
    );
  });

  it("rejeita entrySlug conflitante entre documentos da mesma seção", async () => {
    const workspace = await createWorkspace();

    await writeDocument(
      workspace.contentDirectory,
      "guias.mdx",
      `---
title: Guias
description: Página de entrada.
slug: guias
pageType: hub
section:
  id: guias
  label: Guias
  description: Orientações publicadas.
  entrySlug: guias
  order: 10
order: 1
---

## Início
`,
    );
    await writeDocument(
      workspace.contentDirectory,
      "outra.mdx",
      `---
title: Outra página
description: Documento da mesma seção.
slug: guias/outra
pageType: task
section:
  id: guias
  label: Guias
  description: Orientações publicadas.
  entrySlug: guias/outra
  order: 10
ancestors:
  - segment: guias
    label: Guias
    order: 1
order: 99
---

## Conteúdo
`,
    );

    const result = await validateContentDirectory(workspace.contentDirectory, {
      publicDirectory: workspace.publicDirectory,
      workspaceDirectory: workspace.workspaceDirectory,
    });

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "taxonomy",
          message: expect.stringContaining(
            'section "guias" diverge',
          ),
        }),
      ]),
    );
  });

  it("rejeita entrySlug que não aponta para documento existente", async () => {
    const workspace = await createWorkspace();

    await writeDocument(
      workspace.contentDirectory,
      "guias.mdx",
      `---
title: Guias
description: Página de entrada.
slug: guias
pageType: hub
section:
  id: guias
  label: Guias
  description: Orientações publicadas.
  entrySlug: destino-ausente
  order: 10
order: 1
---

## Início
`,
    );

    const result = await validateContentDirectory(workspace.contentDirectory, {
      publicDirectory: workspace.publicDirectory,
      workspaceDirectory: workspace.workspaceDirectory,
    });

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "taxonomy",
          message: expect.stringContaining(
            'section "guias" aponta para destino inexistente "destino-ausente"',
          ),
        }),
      ]),
    );
  });

  it("rejeita entrySlug que aponta para documento não publicado", async () => {
    const workspace = await createWorkspace();

    await writeDocument(
      workspace.contentDirectory,
      "guias.mdx",
      `---
title: Guias
description: Página de entrada.
slug: guias
pageType: hub
section:
  id: guias
  label: Guias
  description: Orientações publicadas.
  entrySlug: guias
  order: 10
order: 1
status: draft
---

## Início
`,
    );

    const result = await validateContentDirectory(workspace.contentDirectory, {
      publicDirectory: workspace.publicDirectory,
      workspaceDirectory: workspace.workspaceDirectory,
    });

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "taxonomy",
          message: expect.stringContaining(
            'section "guias" aponta para documento não publicado: "guias"',
          ),
        }),
      ]),
    );
  });
});
