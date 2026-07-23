export const SITE_NAME = "GoDocs Docs";
export const SITE_DESCRIPTION = "Documentação oficial do GoDocs.";
export const SITE_URL = new URL("https://godocs-docs.vercel.app");
export const SITE_LOCALE = "pt_BR";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
