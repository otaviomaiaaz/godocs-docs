import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link
      aria-label="GoDocs — página inicial"
      className="brand"
      href="/"
    >
      <span aria-hidden="true" className="brand__mark">
        <Image
          alt=""
          className="brand__logo brand__logo--dark"
          height={58}
          priority
          sizes="(max-width: 767px) 83px, 93px"
          src="/brand/godocs-logo-official-dark.png"
          width={150}
        />
        <Image
          alt=""
          className="brand__logo brand__logo--light"
          height={58}
          priority
          sizes="(max-width: 767px) 83px, 93px"
          src="/brand/godocs-logo-official-light.png"
          width={150}
        />
      </span>
    </Link>
  );
}
