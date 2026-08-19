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
const WORKFLOW_CARDS_SLUG = "funcionalidades/workflows/cards-kanban-e-lista";
const WORKFLOW_AUTOMATIONS_SLUG = "funcionalidades/workflows/automacoes";
const WORKFLOW_SETUP_SLUG = "funcionalidades/workflows/criar-e-configurar";
const WORKFLOW_PHASES_SLUG = "funcionalidades/workflows/fases-e-transicoes";
const WORKFLOW_FORMS_SLUG = "funcionalidades/workflows/formularios-e-campos";
const WORKFLOW_MEMBERS_SLUG = "funcionalidades/workflows/membros-e-papeis";
const WORKFLOW_PUBLIC_FORM_SLUG = "funcionalidades/workflows/formulario-publico";
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

function relocateWorkflowsAnchor(
  fragment: (typeof workflowsAnchors)[number],
): AnchorCompatibilityEntry {
  const destinations: Record<
    (typeof workflowsAnchors)[number],
    AnchorLocation
  > = {
    "como-um-workflow-funciona": { slug: WORKFLOWS_SLUG, fragment: "como-um-workflow-funciona" },
    "visão-geral-da-seção": { slug: WORKFLOWS_SLUG, fragment: "visão-geral-da-seção" },
    "utilizando-um-workflow": { slug: WORKFLOW_CARDS_SLUG, fragment: "utilizando-um-workflow" },
    fluxo: { slug: WORKFLOW_CARDS_SLUG, fragment: "fluxo" },
    kanban: { slug: WORKFLOW_CARDS_SLUG, fragment: "kanban" },
    "criando-um-card": { slug: WORKFLOW_CARDS_SLUG, fragment: "criando-um-card" },
    "acompanhando-um-card": { slug: WORKFLOW_CARDS_SLUG, fragment: "acompanhando-um-card" },
    "movendo-um-card-entre-as-fases": { slug: WORKFLOW_CARDS_SLUG, fragment: "movendo-um-card-entre-as-fases" },
    lista: { slug: WORKFLOW_CARDS_SLUG, fragment: "lista" },
    "automações": { slug: WORKFLOW_AUTOMATIONS_SLUG, fragment: "automações" },
    "criando-uma-automação": { slug: WORKFLOW_AUTOMATIONS_SLUG, fragment: "criando-uma-automação" },
    "criando-um-workflow": { slug: WORKFLOW_SETUP_SLUG, fragment: "criando-um-workflow" },
    "configurações-do-workflow": { slug: WORKFLOW_SETUP_SLUG, fragment: "configurações-do-workflow" },
    geral: { slug: WORKFLOW_SETUP_SLUG, fragment: "geral" },
    "informações-gerais": { slug: WORKFLOW_SETUP_SLUG, fragment: "informações-gerais" },
    "identificação-dos-cards": { slug: WORKFLOW_SETUP_SLUG, fragment: "identificação-dos-cards" },
    "arquivando-o-workflow": { slug: WORKFLOW_SETUP_SLUG, fragment: "arquivando-o-workflow" },
    "restaurando-um-workflow": { slug: WORKFLOW_SETUP_SLUG, fragment: "restaurando-um-workflow" },
    "excluindo-o-workflow": { slug: WORKFLOW_SETUP_SLUG, fragment: "excluindo-o-workflow" },
    fases: { slug: WORKFLOW_PHASES_SLUG, fragment: "fases" },
    "criando-uma-fase": { slug: WORKFLOW_PHASES_SLUG, fragment: "criando-uma-fase" },
    "organizando-as-fases": { slug: WORKFLOW_PHASES_SLUG, fragment: "organizando-as-fases" },
    "configurando-a-movimentação-dos-cards": { slug: WORKFLOW_PHASES_SLUG, fragment: "configurando-a-movimentação-dos-cards" },
    "editando-e-configurando-uma-fase": { slug: WORKFLOW_PHASES_SLUG, fragment: "editando-e-configurando-uma-fase" },
    "excluindo-uma-fase": { slug: WORKFLOW_PHASES_SLUG, fragment: "excluindo-uma-fase" },
    "formulário-inicial": { slug: WORKFLOW_FORMS_SLUG, fragment: "formulário-inicial" },
    "configurando-o-formulário": { slug: WORKFLOW_FORMS_SLUG, fragment: "configurando-o-formulário" },
    "configurando-cada-campo": { slug: WORKFLOW_FORMS_SLUG, fragment: "configurando-cada-campo" },
    "campos-das-fases": { slug: WORKFLOW_FORMS_SLUG, fragment: "campos-das-fases" },
    membros: { slug: WORKFLOW_MEMBERS_SLUG, fragment: "membros" },
    "adicionando-um-membro": { slug: WORKFLOW_MEMBERS_SLUG, fragment: "adicionando-um-membro" },
    "papéis-disponíveis": { slug: WORKFLOW_MEMBERS_SLUG, fragment: "papéis-disponíveis" },
    "alterando-o-papel-de-um-membro": { slug: WORKFLOW_MEMBERS_SLUG, fragment: "alterando-o-papel-de-um-membro" },
    "removendo-um-membro": { slug: WORKFLOW_MEMBERS_SLUG, fragment: "removendo-um-membro" },
    "formulário-público": { slug: WORKFLOW_PUBLIC_FORM_SLUG, fragment: "formulário-público" },
    "habilitando-e-configurando-o-formulário": { slug: WORKFLOW_PUBLIC_FORM_SLUG, fragment: "habilitando-e-configurando-o-formulário" },
    "revisando-e-compartilhando-o-formulário": { slug: WORKFLOW_PUBLIC_FORM_SLUG, fragment: "revisando-e-compartilhando-o-formulário" },
    "enviando-uma-solicitação": { slug: WORKFLOW_PUBLIC_FORM_SLUG, fragment: "enviando-uma-solicitação" },
    "confirmação-e-protocolo": { slug: WORKFLOW_PUBLIC_FORM_SLUG, fragment: "confirmação-e-protocolo" },
    "acompanhando-a-solicitação": { slug: WORKFLOW_PUBLIC_FORM_SLUG, fragment: "acompanhando-a-solicitação" },
    "desativando-o-formulário": { slug: WORKFLOW_PUBLIC_FORM_SLUG, fragment: "desativando-o-formulário" },
    "integração-via-api": { slug: WORKFLOWS_SLUG, fragment: "integração-via-api" },
    "dúvidas-e-situações-comuns": { slug: WORKFLOWS_SLUG, fragment: "como-um-workflow-funciona" },
    "por-que-não-consigo-mover-um-card-para-determinada-fase": { slug: WORKFLOW_PHASES_SLUG, fragment: "por-que-não-consigo-mover-um-card-para-determinada-fase" },
    "por-que-não-consigo-avançar-o-card-mesmo-com-a-próxima-fase-habilitada": { slug: WORKFLOW_PHASES_SLUG, fragment: "por-que-não-consigo-avançar-o-card-mesmo-com-a-próxima-fase-habilitada" },
    "um-card-precisa-ser-criado-sempre-na-primeira-fase": { slug: WORKFLOW_CARDS_SLUG, fragment: "um-card-precisa-ser-criado-sempre-na-primeira-fase" },
    "um-card-pode-sair-de-uma-fase-final": { slug: WORKFLOW_PHASES_SLUG, fragment: "um-card-pode-sair-de-uma-fase-final" },
    "o-que-acontece-se-uma-fase-com-cards-for-excluída": { slug: WORKFLOW_PHASES_SLUG, fragment: "o-que-acontece-se-uma-fase-com-cards-for-excluída" },
    "por-quanto-tempo-o-link-de-acompanhamento-de-uma-solicitação-pública-permanece-válido": { slug: WORKFLOW_PUBLIC_FORM_SLUG, fragment: "por-quanto-tempo-o-link-de-acompanhamento-de-uma-solicitação-pública-permanece-válido" },
  };

  return {
    from: { slug: WORKFLOWS_SLUG, fragment },
    to: destinations[fragment],
  };
}

export const anchorCompatibilityManifest: readonly AnchorCompatibilityEntry[] = [
  ...documentsAnchors.map(relocateDocumentsAnchor),
  ...workflowsAnchors.map(relocateWorkflowsAnchor),
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
