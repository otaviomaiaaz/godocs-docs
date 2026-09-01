import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const standalone = resolve(root, ".next/standalone");

if (!existsSync(standalone)) {
  console.error(
    "[prepare-standalone] .next/standalone não encontrado — rode `pnpm build` primeiro.",
  );
  process.exit(1);
}

cpSync(resolve(root, ".next/static"), resolve(standalone, ".next/static"), {
  recursive: true,
});

if (existsSync(resolve(root, "public"))) {
  cpSync(resolve(root, "public"), resolve(standalone, "public"), {
    recursive: true,
  });
}

console.log("[prepare-standalone] assets estáticos e /public copiados ✓");
