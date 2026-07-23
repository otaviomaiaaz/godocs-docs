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
  order: z
    .number()
    .int("section.order deve ser inteiro")
    .nonnegative("section.order deve ser positivo"),
});

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
    slug: z
      .string()
      .trim()
      .min(1, "slug é obrigatório")
      .regex(
        slugPattern,
        "slug deve usar segmentos minúsculos, números e hífens, sem barras nas extremidades",
      ),
    section: docSectionSchema.optional(),
    navTitle: z.string().trim().min(1, "navTitle não pode ser vazio").optional(),
    ancestors: z.array(docAncestorSchema).default([]),
    order: z
      .number()
      .int("order deve ser inteiro")
      .nonnegative("order deve ser positivo"),
    keywords: z.array(z.string().trim().min(1)).default([]),
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
  });

export type DocFrontmatter = z.infer<typeof docFrontmatterSchema>;
export type DocSection = z.infer<typeof docSectionSchema>;
export type DocAncestor = z.infer<typeof docAncestorSchema>;

export type DocHeading = {
  depth: 2 | 3;
  id: string;
  title: string;
};

export type DocRecord = {
  metadata: DocFrontmatter;
  slug: string;
  segments: string[];
  href: string;
  source: string;
  searchableText: string;
  headings: DocHeading[];
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
