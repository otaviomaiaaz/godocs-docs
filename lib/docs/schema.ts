import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const slugSegmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const docSectionSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "section.id é obrigatório")
    .regex(slugSegmentPattern, "section.id deve usar minúsculas, números e hífens"),
  label: z.string().trim().min(1, "section.label é obrigatório"),
  description: z.string().trim().min(1, "section.description é obrigatória"),
  entrySlug: z
    .string()
    .trim()
    .min(1, "section.entrySlug é obrigatório")
    .regex(
      slugPattern,
      "section.entrySlug deve ser um slug válido, sem barras nas extremidades",
    ),
  order: z
    .number()
    .int("section.order deve ser inteiro")
    .nonnegative("section.order deve ser positivo"),
});

export const docPageTypeSchema = z.enum(["hub", "task", "reference"]);

export const docAncestorSchema = z.object({
  segment: z
    .string()
    .trim()
    .min(1, "ancestors.segment é obrigatório")
    .regex(
      slugSegmentPattern,
      "ancestors.segment deve usar minúsculas, números e hífens",
    ),
  label: z.string().trim().min(1, "ancestors.label é obrigatório"),
  order: z
    .number()
    .int("ancestors.order deve ser inteiro")
    .nonnegative("ancestors.order deve ser positivo"),
});

export const docFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1, "title é obrigatório"),
    description: z.string().trim().min(1, "description é obrigatório"),
    cardDescription: z
      .string()
      .trim()
      .min(1, "cardDescription não pode ser vazio")
      .optional(),
    slug: z
      .string()
      .trim()
      .min(1, "slug é obrigatório")
      .regex(
        slugPattern,
        "slug deve usar segmentos minúsculos, números e hífens, sem barras nas extremidades",
      ),
    pageType: docPageTypeSchema,
    section: docSectionSchema.optional(),
    navTitle: z.string().trim().min(1, "navTitle não pode ser vazio").optional(),
    ancestors: z
      .array(docAncestorSchema)
      .max(
        2,
        "ancestors aceita no máximo dois níveis anteriores neste ciclo",
      )
      .default([]),
    order: z
      .number()
      .int("order deve ser inteiro")
      .nonnegative("order deve ser positivo"),
    keywords: z.array(z.string().trim().min(1)).default([]),
    status: z.enum(["published", "draft"]).default("published"),
    availability: z
      .enum(["available", "coming-soon"])
      .default("available"),
    updatedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt deve usar o formato YYYY-MM-DD")
      .optional(),
    version: z.string().trim().min(1, "version não pode ser vazio").optional(),
    permission: z
      .string()
      .trim()
      .min(1, "permission não pode ser vazio")
      .optional(),
    related: z
      .array(
        z
          .string()
          .trim()
          .regex(
            slugPattern,
            "related deve conter slugs válidos, sem barras nas extremidades",
          ),
      )
      .max(4, "related aceita no máximo quatro destinos")
      .default([]),
  })
  .superRefine((value, context) => {
    const segments = value.slug.split("/");
    const expectedAncestors = segments.slice(0, -1);

    if (value.ancestors.length !== expectedAncestors.length) {
      context.addIssue({
        code: "custom",
        path: ["ancestors"],
        message: `deve descrever os ${expectedAncestors.length} níveis anteriores do slug`,
      });
      return;
    }

    value.ancestors.forEach((ancestor, index) => {
      if (ancestor.segment !== expectedAncestors[index]) {
        context.addIssue({
          code: "custom",
          path: ["ancestors", index, "segment"],
          message: `deve corresponder ao segmento "${expectedAncestors[index]}" do slug`,
        });
      }
    });

    const relatedSlugs = new Set<string>();
    value.related.forEach((relatedSlug, index) => {
      if (relatedSlug === value.slug) {
        context.addIssue({
          code: "custom",
          path: ["related", index],
          message: "related não pode apontar para a própria página",
        });
      }

      if (relatedSlugs.has(relatedSlug)) {
        context.addIssue({
          code: "custom",
          path: ["related", index],
          message: `related não pode repetir o destino "${relatedSlug}"`,
        });
      }

      relatedSlugs.add(relatedSlug);
    });
  });

export type DocFrontmatter = z.infer<typeof docFrontmatterSchema>;
export type DocSection = z.infer<typeof docSectionSchema>;
export type DocAncestor = z.infer<typeof docAncestorSchema>;
export type DocPageType = z.infer<typeof docPageTypeSchema>;

export type DocHeading = {
  depth: 2 | 3;
  id: string;
  title: string;
};

export type DocSearchSection = {
  depth: 2 | 3 | 4;
  id: string;
  title: string;
  text: string;
};

export type DocRecord = {
  metadata: DocFrontmatter;
  slug: string;
  segments: string[];
  href: string;
  source: string;
  searchableText: string;
  headings: DocHeading[];
  sections: DocSearchSection[];
  readingMinutes: number;
  filePath: string;
};

export function parseDocFrontmatter(
  data: unknown,
  filePath: string,
): DocFrontmatter {
  const result = docFrontmatterSchema.safeParse(data);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
      .join("; ");

    throw new Error(`Frontmatter inválido em ${filePath}: ${details}`);
  }

  return result.data;
}
