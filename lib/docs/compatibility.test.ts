import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  anchorCompatibilityManifest,
  resolveCompatibleAnchor,
  validateAnchorCompatibilityManifest,
  type AnchorCompatibilityEntry,
} from "@/lib/docs/compatibility";
import { createSearchIndex } from "@/lib/docs/search";
import { loadPublishedDocumentsFromDirectory } from "@/lib/docs/source";

const contentDirectory = path.join(process.cwd(), "content", "docs");

const workflowExpectedDestinations = {
  "como-um-workflow-funciona": ["funcionalidades/workflows", "como-um-workflow-funciona"],
  "visão-geral-da-seção": ["funcionalidades/workflows", "visão-geral-da-seção"],
  "utilizando-um-workflow": ["funcionalidades/workflows/cards-kanban-e-lista", "utilizando-um-workflow"],
  fluxo: ["funcionalidades/workflows/cards-kanban-e-lista", "fluxo"],
  kanban: ["funcionalidades/workflows/cards-kanban-e-lista", "kanban"],
  "criando-um-card": ["funcionalidades/workflows/cards-kanban-e-lista", "criando-um-card"],
  "acompanhando-um-card": ["funcionalidades/workflows/cards-kanban-e-lista", "acompanhando-um-card"],
  "movendo-um-card-entre-as-fases": ["funcionalidades/workflows/cards-kanban-e-lista", "movendo-um-card-entre-as-fases"],
  lista: ["funcionalidades/workflows/cards-kanban-e-lista", "lista"],
  "automações": ["funcionalidades/workflows/automacoes", "automações"],
  "criando-uma-automação": ["funcionalidades/workflows/automacoes", "criando-uma-automação"],
  "criando-um-workflow": ["funcionalidades/workflows/criar-e-configurar", "criando-um-workflow"],
  "configurações-do-workflow": ["funcionalidades/workflows/criar-e-configurar", "configurações-do-workflow"],
  geral: ["funcionalidades/workflows/criar-e-configurar", "geral"],
  "informações-gerais": ["funcionalidades/workflows/criar-e-configurar", "informações-gerais"],
  "identificação-dos-cards": ["funcionalidades/workflows/criar-e-configurar", "identificação-dos-cards"],
  "arquivando-o-workflow": ["funcionalidades/workflows/criar-e-configurar", "arquivando-o-workflow"],
  "restaurando-um-workflow": ["funcionalidades/workflows/criar-e-configurar", "restaurando-um-workflow"],
  "excluindo-o-workflow": ["funcionalidades/workflows/criar-e-configurar", "excluindo-o-workflow"],
  fases: ["funcionalidades/workflows/fases-e-transicoes", "fases"],
  "criando-uma-fase": ["funcionalidades/workflows/fases-e-transicoes", "criando-uma-fase"],
  "organizando-as-fases": ["funcionalidades/workflows/fases-e-transicoes", "organizando-as-fases"],
  "configurando-a-movimentação-dos-cards": ["funcionalidades/workflows/fases-e-transicoes", "configurando-a-movimentação-dos-cards"],
  "editando-e-configurando-uma-fase": ["funcionalidades/workflows/fases-e-transicoes", "editando-e-configurando-uma-fase"],
  "excluindo-uma-fase": ["funcionalidades/workflows/fases-e-transicoes", "excluindo-uma-fase"],
  "formulário-inicial": ["funcionalidades/workflows/formularios-e-campos", "formulário-inicial"],
  "configurando-o-formulário": ["funcionalidades/workflows/formularios-e-campos", "configurando-o-formulário"],
  "configurando-cada-campo": ["funcionalidades/workflows/formularios-e-campos", "configurando-cada-campo"],
  "campos-das-fases": ["funcionalidades/workflows/formularios-e-campos", "campos-das-fases"],
  membros: ["funcionalidades/workflows/membros-e-papeis", "membros"],
  "adicionando-um-membro": ["funcionalidades/workflows/membros-e-papeis", "adicionando-um-membro"],
  "papéis-disponíveis": ["funcionalidades/workflows/membros-e-papeis", "papéis-disponíveis"],
  "alterando-o-papel-de-um-membro": ["funcionalidades/workflows/membros-e-papeis", "alterando-o-papel-de-um-membro"],
  "removendo-um-membro": ["funcionalidades/workflows/membros-e-papeis", "removendo-um-membro"],
  "formulário-público": ["funcionalidades/workflows/formulario-publico", "formulário-público"],
  "habilitando-e-configurando-o-formulário": ["funcionalidades/workflows/formulario-publico", "habilitando-e-configurando-o-formulário"],
  "revisando-e-compartilhando-o-formulário": ["funcionalidades/workflows/formulario-publico", "revisando-e-compartilhando-o-formulário"],
  "enviando-uma-solicitação": ["funcionalidades/workflows/formulario-publico", "enviando-uma-solicitação"],
  "confirmação-e-protocolo": ["funcionalidades/workflows/formulario-publico", "confirmação-e-protocolo"],
  "acompanhando-a-solicitação": ["funcionalidades/workflows/formulario-publico", "acompanhando-a-solicitação"],
  "desativando-o-formulário": ["funcionalidades/workflows/formulario-publico", "desativando-o-formulário"],
  "integração-via-api": ["funcionalidades/workflows", "integração-via-api"],
  "dúvidas-e-situações-comuns": ["funcionalidades/workflows", "como-um-workflow-funciona"],
  "por-que-não-consigo-mover-um-card-para-determinada-fase": ["funcionalidades/workflows/fases-e-transicoes", "por-que-não-consigo-mover-um-card-para-determinada-fase"],
  "por-que-não-consigo-avançar-o-card-mesmo-com-a-próxima-fase-habilitada": ["funcionalidades/workflows/fases-e-transicoes", "por-que-não-consigo-avançar-o-card-mesmo-com-a-próxima-fase-habilitada"],
  "um-card-precisa-ser-criado-sempre-na-primeira-fase": ["funcionalidades/workflows/cards-kanban-e-lista", "um-card-precisa-ser-criado-sempre-na-primeira-fase"],
  "um-card-pode-sair-de-uma-fase-final": ["funcionalidades/workflows/fases-e-transicoes", "um-card-pode-sair-de-uma-fase-final"],
  "o-que-acontece-se-uma-fase-com-cards-for-excluída": ["funcionalidades/workflows/fases-e-transicoes", "o-que-acontece-se-uma-fase-com-cards-for-excluída"],
  "por-quanto-tempo-o-link-de-acompanhamento-de-uma-solicitação-pública-permanece-válido": ["funcionalidades/workflows/formulario-publico", "por-quanto-tempo-o-link-de-acompanhamento-de-uma-solicitação-pública-permanece-válido"],
} as const;

describe("compatibilidade de anchors", () => {
  it("mantém as 79 origens aprovadas com destinos publicados e válidos", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);

    expect(anchorCompatibilityManifest).toHaveLength(79);
    expect(
      anchorCompatibilityManifest.filter(
        (entry) => entry.from.slug === "funcionalidades/documentos",
      ),
    ).toHaveLength(30);
    expect(
      anchorCompatibilityManifest.filter(
        (entry) => entry.from.slug === "funcionalidades/workflows",
      ),
    ).toHaveLength(49);
    expect(validateAnchorCompatibilityManifest(docs)).toEqual([]);
  });

  it.each(
    anchorCompatibilityManifest.filter(
      (entry) => entry.from.slug === "funcionalidades/documentos",
    ),
  )("resolve o alias histórico de Documentos %#", (entry) => {
    expect(
      resolveCompatibleAnchor(entry.from.slug, entry.from.fragment),
    ).toEqual(entry.to);
  });

  it("redireciona os 49 aliases de Workflows para os destinos canônicos", () => {
    const workflowAliases = anchorCompatibilityManifest.filter(
      (entry) => entry.from.slug === "funcionalidades/workflows",
    );

    expect(workflowAliases).toHaveLength(49);
    expect(workflowAliases.some((entry) => entry.from.slug !== entry.to.slug)).toBe(
      true,
    );
    expect(new Set(workflowAliases.map((entry) => entry.to.slug))).toEqual(
      new Set([
        "funcionalidades/workflows",
        "funcionalidades/workflows/cards-kanban-e-lista",
        "funcionalidades/workflows/automacoes",
        "funcionalidades/workflows/criar-e-configurar",
        "funcionalidades/workflows/fases-e-transicoes",
        "funcionalidades/workflows/formularios-e-campos",
        "funcionalidades/workflows/membros-e-papeis",
        "funcionalidades/workflows/formulario-publico",
      ]),
    );
  });

  it.each(Object.entries(workflowExpectedDestinations))(
    "resolve o alias histórico de Workflows %s para o destino esperado",
    (fragment, [slug, canonicalFragment]) => {
      expect(
        resolveCompatibleAnchor("funcionalidades/workflows", fragment),
      ).toEqual({ slug, fragment: canonicalFragment });
    },
  );

  it("resolve alias entre páginas sem alterar o manifesto público", () => {
    const fixture: readonly AnchorCompatibilityEntry[] = [
      {
        from: { slug: "antiga", fragment: "passo" },
        to: { slug: "nova", fragment: "procedimento" },
      },
    ];

    expect(resolveCompatibleAnchor("antiga", "passo", fixture)).toEqual({
      slug: "nova",
      fragment: "procedimento",
    });
    expect(resolveCompatibleAnchor("antiga", "typo", fixture)).toBeUndefined();
  });

  it("preserva alias histórico sem exigir o heading antigo na página de origem", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const source = docs.find(
      (doc) => doc.slug === "funcionalidades/documentos",
    );
    const target = docs.find(
      (doc) => doc.slug === "funcionalidades/workflows",
    );
    const historicalFragment = "criando-uma-nova-pasta";
    const canonicalFragment = "como-um-workflow-funciona";

    expect(source).toBeDefined();
    expect(target).toBeDefined();

    const migratedSource = {
      ...source!,
      sections: source!.sections.filter(
        (section) => section.id !== historicalFragment,
      ),
    };
    const fixture: readonly AnchorCompatibilityEntry[] = [
      {
        from: { slug: migratedSource.slug, fragment: historicalFragment },
        to: { slug: target!.slug, fragment: canonicalFragment },
      },
    ];

    expect(
      migratedSource.sections.some(
        (section) => section.id === historicalFragment,
      ),
    ).toBe(false);
    expect(
      resolveCompatibleAnchor(migratedSource.slug, historicalFragment, fixture),
    ).toEqual({ slug: target!.slug, fragment: canonicalFragment });
    expect(
      validateAnchorCompatibilityManifest([migratedSource, target!], fixture),
    ).toEqual([]);
  });

  it("não transforma aliases em entradas independentes da busca", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const index = createSearchIndex(docs);
    const canonicalHrefs = new Set(index.entries.map((entry) => entry.href));

    expect(canonicalHrefs.size).toBe(index.entries.length);
    expect(
      index.entries.some((entry) =>
        anchorCompatibilityManifest.some(
          (alias) =>
            alias.from.fragment !== alias.to.fragment &&
            entry.href.endsWith(`#${alias.from.fragment}`),
        ),
      ),
    ).toBe(false);
  });

  it("rejeita manifesto malformado e destino inexistente", async () => {
    const docs = await loadPublishedDocumentsFromDirectory(contentDirectory);
    const issues = validateAnchorCompatibilityManifest(docs, [
      {
        from: { slug: "/url-invalida/", fragment: "" },
        to: { slug: "destino-inexistente", fragment: "fragmento" },
      },
    ]);

    expect(issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("origem inválida"),
        expect.stringContaining("URL de destino não está publicada"),
      ]),
    );
  });
});
