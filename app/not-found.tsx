import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="not-found" id="main-content">
      <section>
        <p className="eyebrow">ERRO 404</p>
        <h1>Página não encontrada</h1>
        <p>
          O endereço informado não corresponde a uma página publicada nesta
          documentação.
        </p>
        <Link href="/">
          <ArrowLeft aria-hidden="true" size={17} />
          Voltar para a página inicial
        </Link>
      </section>
    </main>
  );
}
