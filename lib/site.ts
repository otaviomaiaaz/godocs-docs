export const SITE_NAME = "GoDocs Docs";
export const SITE_HOME_TITLE = "Documentação do GoDocs";
export const SITE_DESCRIPTION =
  "Encontre orientações para acessar, organizar documentos e utilizar os recursos do sistema.";
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://app.godocs4.com.br",
);
export const SITE_LOCALE = "pt_BR";

export const SITE_BASE_PATH = "/docs";

export function absoluteUrl(path = "/"): string {
  const suffix = path === "/" ? "" : path;
  return new URL(`${SITE_BASE_PATH}${suffix}`, SITE_URL).toString();
}
