import path from "node:path";

import { validateContentDirectory } from "../lib/docs/validation";
import { anchorCompatibilityManifest } from "../lib/docs/compatibility";

const workspaceDirectory = process.cwd();
const defaultContentDirectory =
  process.env.GODOCS_FIXTURE_MODE === "filled"
    ? path.join(workspaceDirectory, "tests", "fixtures", "content-filled")
    : path.join(workspaceDirectory, "content", "docs");
const contentDirectory = path.resolve(
  process.argv[2] ?? defaultContentDirectory,
);

async function main() {
  const result = await validateContentDirectory(contentDirectory, {
    compatibilityManifest:
      contentDirectory === path.resolve(defaultContentDirectory)
        ? anchorCompatibilityManifest
        : [],
    workspaceDirectory,
  });

  if (result.issues.length > 0) {
    console.error(
      `Validação documental encontrou ${result.issues.length} ${
        result.issues.length === 1 ? "erro" : "erros"
      }:`,
    );

    result.issues.forEach((validationIssue) => {
      const relativePath = path.relative(
        workspaceDirectory,
        validationIssue.filePath,
      );
      console.error(
        `- ${relativePath || validationIssue.filePath} [${validationIssue.category}]: ${validationIssue.message}`,
      );
    });

    process.exitCode = 1;
  } else {
    console.log(
      `Conteúdo válido: ${result.documents.length} ${
        result.documents.length === 1 ? "documento" : "documentos"
      }.`,
    );
  }
}

void main();
