export const SITE_NAME = "GoDocs Docs";
export const SITE_HOME_TITLE = "Documentação do GoDocs";
export const SITE_DESCRIPTION =
  "Encontre orientações para acessar, organizar documentos e utilizar os recursos do sistema.";
export const SITE_URL = new URL("https://godocs-docs.vercel.app");
export const SITE_LOCALE = "pt_BR";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
