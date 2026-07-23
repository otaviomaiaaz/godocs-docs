import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

export const docFrontmatterSchema = z.object({
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
  section: z.string().trim().min(1).optional(),
  order: z.number().int("order deve ser inteiro").nonnegative("order deve ser positivo"),
  keywords: z.array(z.string().trim().min(1)).default([]),
});

export type DocFrontmatter = z.infer<typeof docFrontmatterSchema>;

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
