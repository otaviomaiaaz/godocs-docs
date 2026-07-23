import Link from "next/link";

export function Brand() {
  return (
    <Link
      aria-label="GoDocs Documentação — página inicial"
      className="brand"
      href="/"
    >
      <span aria-hidden="true" className="brand__wordmark">
        <span className="brand__accent">go</span>
        <span>docs</span>
      </span>
      <span aria-hidden="true" className="brand__separator" />
      <span aria-hidden="true" className="brand__label brand__label--desktop">
        Documentação
      </span>
      <span aria-hidden="true" className="brand__label brand__label--mobile">
        Docs
      </span>
    </Link>
  );
}
