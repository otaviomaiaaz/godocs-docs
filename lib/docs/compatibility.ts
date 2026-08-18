import type { DocRecord } from "@/lib/docs/schema";

export type AnchorLocation = {
  slug: string;
  fragment: string;
};

export type AnchorCompatibilityEntry = {
  from: AnchorLocation;
  to: AnchorLocation;
};

export type AnchorCompatibilityIssue = {
  entry: AnchorCompatibilityEntry;
  message: string;
};

const DOCUMENTS_SLUG = "funcionalidades/documentos";
const WORKFLOWS_SLUG = "funcionalidades/workflows";
const DOCUMENT_FOLDERS_SLUG = "funcionalidades/documentos/pastas";
const DOCUMENT_ADD_SLUG = "funcionalidades/documentos/adicionar-documentos";
const DOCUMENT_FILTERS_SLUG = "funcionalidades/documentos/filtros-e-metadados";
const DOCUMENT_MANAGEMENT_SLUG = "funcionalidades/documentos/gerenciar-documentos";
const DOCUMENT_LOGS_SLUG = "funcionalidades/documentos/logs-e-acoes";
const SLUG_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

const documentsAnchors = [
  "o-que-é-a-seção-documentos",
  "conceitos-importantes",
  "organizando-pastas-e-subpastas",
  "criando-uma-nova-pasta",
  "pasta-indexada",
  "criando-uma-subpasta",
  "formas-de-visualização",
  "gerenciando-uma-pasta",
  "adicionar-documento",
  "editar-pasta",
  "mover-pasta",
  "ver-detalhes",
  "vincular-a-um-grupo",
  "visualizar-logs-da-pasta",
  "excluir-pasta",
  "adicionando-documentos",
  "localizando-e-exibindo-documentos",
  "filtros-avançados",
  "exibição-de-metadados",
  "visualizando-e-gerenciando-um-documento",
  "visualizar",
  "detalhes-do-documento",
  "tags",
  "peças-do-documento",
  "páginas",
  "logs-do-documento",
  "anexar-arquivo",
  "outras-ações-do-documento",
  "favoritar",
  "excluir",
] as const;

const workflowsAnchors = [
  "como-um-workflow-funciona",
  "visão-geral-da-seção",
  "utilizando-um-workflow",
  "fluxo",
  "kanban",
  "criando-um-card",
  "acompanhando-um-card",
  "movendo-um-card-entre-as-fases",
  "lista",
  "automações",
  "criando-uma-automação",
  "criando-um-workflow",
  "configurações-do-workflow",
  "geral",
  "informações-gerais",
  "identificação-dos-cards",
  "arquivando-o-workflow",
  "restaurando-um-workflow",
  "excluindo-o-workflow",
  "fases",
  "criando-uma-fase",
  "organizando-as-fases",
  "configurando-a-movimentação-dos-cards",
  "editando-e-configurando-uma-fase",
  "excluindo-uma-fase",
  "formulário-inicial",
  "configurando-o-formulário",
  "configurando-cada-campo",
  "campos-das-fases",
  "membros",
  "adicionando-um-membro",
  "papéis-disponíveis",
  "alterando-o-papel-de-um-membro",
  "removendo-um-membro",
  "formulário-público",
  "habilitando-e-configurando-o-formulário",
  "revisando-e-compartilhando-o-formulário",
  "enviando-uma-solicitação",
  "confirmação-e-protocolo",
  "acompanhando-a-solicitação",
  "desativando-o-formulário",
  "integração-via-api",
  "dúvidas-e-situações-comuns",
  "por-que-não-consigo-mover-um-card-para-determinada-fase",
  "por-que-não-consigo-avançar-o-card-mesmo-com-a-próxima-fase-habilitada",
  "um-card-precisa-ser-criado-sempre-na-primeira-fase",
  "um-card-pode-sair-de-uma-fase-final",
  "o-que-acontece-se-uma-fase-com-cards-for-excluída",
  "por-quanto-tempo-o-link-de-acompanhamento-de-uma-solicitação-pública-permanece-válido",
] as const;

function preserveCurrentAnchor(
  slug: string,
  fragment: string,
): AnchorCompatibilityEntry {
  return {
    from: { slug, fragment },
    to: { slug, fragment },
  };
}

function relocateDocumentsAnchor(
  fragment: (typeof documentsAnchors)[number],
): AnchorCompatibilityEntry {
  const destinations: Record<
    (typeof documentsAnchors)[number],
    AnchorLocation
  > = {
    "o-que-é-a-seção-documentos": { slug: DOCUMENTS_SLUG, fragment: "o-que-é-a-seção-documentos" },
    "conceitos-importantes": { slug: DOCUMENTS_SLUG, fragment: "conceitos-importantes" },
    "organizando-pastas-e-subpastas": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "organizando-pastas-e-subpastas" },
    "criando-uma-nova-pasta": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "criando-uma-nova-pasta" },
    "pasta-indexada": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "pasta-indexada" },
    "criando-uma-subpasta": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "criando-uma-subpasta" },
    "formas-de-visualização": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "formas-de-visualização" },
    "gerenciando-uma-pasta": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "gerenciando-uma-pasta" },
    "adicionar-documento": { slug: DOCUMENT_ADD_SLUG, fragment: "adicionar-documento" },
    "editar-pasta": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "editar-pasta" },
    "mover-pasta": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "mover-pasta" },
    "ver-detalhes": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "ver-detalhes" },
    "vincular-a-um-grupo": { slug: DOCUMENT_FOLDERS_SLUG, fragment: "vincular-a-um-grupo" },
    "visualizar-logs-da-pasta": { slug: DOCUMENT_LOGS_SLUG, fragment: "visualizar-logs-da-pasta" },
    "excluir-pasta": { slug: DOCUMENT_LOGS_SLUG, fragment: "excluir-pasta" },
    "adicionando-documentos": { slug: DOCUMENT_ADD_SLUG, fragment: "adicionando-documentos" },
    "localizando-e-exibindo-documentos": { slug: DOCUMENT_FILTERS_SLUG, fragment: "localizando-e-exibindo-documentos" },
    "filtros-avançados": { slug: DOCUMENT_FILTERS_SLUG, fragment: "filtros-avançados" },
    "exibição-de-metadados": { slug: DOCUMENT_FILTERS_SLUG, fragment: "exibição-de-metadados" },
    "visualizando-e-gerenciando-um-documento": { slug: DOCUMENT_MANAGEMENT_SLUG, fragment: "visualizando-e-gerenciando-um-documento" },
    "visualizar": { slug: DOCUMENT_MANAGEMENT_SLUG, fragment: "visualizar" },
    "detalhes-do-documento": { slug: DOCUMENT_MANAGEMENT_SLUG, fragment: "detalhes-do-documento" },
    "tags": { slug: DOCUMENT_MANAGEMENT_SLUG, fragment: "tags" },
    "peças-do-documento": { slug: DOCUMENT_MANAGEMENT_SLUG, fragment: "peças-do-documento" },
    "páginas": { slug: DOCUMENT_MANAGEMENT_SLUG, fragment: "páginas" },
    "logs-do-documento": { slug: DOCUMENT_LOGS_SLUG, fragment: "logs-do-documento" },
    "anexar-arquivo": { slug: DOCUMENT_MANAGEMENT_SLUG, fragment: "anexar-arquivo" },
    "outras-ações-do-documento": { slug: DOCUMENT_LOGS_SLUG, fragment: "outras-ações-do-documento" },
    "favoritar": { slug: DOCUMENT_LOGS_SLUG, fragment: "favoritar" },
    "excluir": { slug: DOCUMENT_LOGS_SLUG, fragment: "excluir" },
  };

  return {
    from: { slug: DOCUMENTS_SLUG, fragment },
    to: destinations[fragment],
  };
}

export const anchorCompatibilityManifest: readonly AnchorCompatibilityEntry[] = [
  ...documentsAnchors.map(relocateDocumentsAnchor),
  ...workflowsAnchors.map((fragment) =>
    preserveCurrentAnchor(WORKFLOWS_SLUG, fragment),
  ),
];

function anchorKey(location: AnchorLocation): string {
  return `${location.slug}#${location.fragment}`;
}

export function resolveCompatibleAnchor(
  slug: string,
  fragment: string,
  manifest: readonly AnchorCompatibilityEntry[] = anchorCompatibilityManifest,
): AnchorLocation | undefined {
  return manifest.find(
    (entry) => entry.from.slug === slug && entry.from.fragment === fragment,
  )?.to;
}

export function validateAnchorCompatibilityManifest(
  docs: DocRecord[],
  manifest: readonly AnchorCompatibilityEntry[] = anchorCompatibilityManifest,
): AnchorCompatibilityIssue[] {
  const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));
  const sources = new Set<string>();
  const issues: AnchorCompatibilityIssue[] = [];

  for (const entry of manifest) {
    for (const [role, location] of [
      ["origem", entry.from],
      ["destino", entry.to],
    ] as const) {
      if (!SLUG_PATTERN.test(location.slug) || location.fragment.trim().length === 0) {
        issues.push({
          entry,
          message: `${role} inválida no manifesto: ${anchorKey(location)}`,
        });
      }
    }

    const sourceKey = anchorKey(entry.from);
    if (sources.has(sourceKey)) {
      issues.push({
        entry,
        message: `origem duplicada no manifesto: ${sourceKey}`,
      });
    }
    sources.add(sourceKey);

    const sourceDocument = docsBySlug.get(entry.from.slug);
    if (!sourceDocument || sourceDocument.metadata.status !== "published") {
      issues.push({
        entry,
        message: `URL de origem não está publicada: /docs/${entry.from.slug}`,
      });
    }

    const targetDocument = docsBySlug.get(entry.to.slug);
    if (!targetDocument || targetDocument.metadata.status !== "published") {
      issues.push({
        entry,
        message: `URL de destino não está publicada: /docs/${entry.to.slug}`,
      });
      continue;
    }

    if (!targetDocument.sections.some((section) => section.id === entry.to.fragment)) {
      issues.push({
        entry,
        message: `fragmento de destino não existe: /docs/${entry.to.slug}#${entry.to.fragment}`,
      });
    }
  }

  return issues;
}
