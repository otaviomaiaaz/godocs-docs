import { VersionNote } from "@/components/docs/version-note";
import { APP_VERSION } from "@/lib/site";

type DocFooterProps = {
  updatedAt?: string;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatUpdatedAt(updatedAt: string): string {
  const parsed = new Date(`${updatedAt}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return updatedAt;
  return dateFormatter.format(parsed);
}

export function DocFooter({ updatedAt }: DocFooterProps) {
  return (
    <footer className="doc-footer">
      {updatedAt ? (
        <>
          <span>Atualizado em {formatUpdatedAt(updatedAt)}</span>
          <span aria-hidden="true">·</span>
        </>
      ) : null}
      <span>Documentação v{APP_VERSION}</span>
      <VersionNote />
    </footer>
  );
}
