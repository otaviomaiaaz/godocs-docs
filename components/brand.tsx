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
          height={54}
          priority
          sizes="(max-width: 767px) 118px, 142px"
          src="/brand/godocs-wordmark-on-dark.svg"
          width={218}
        />
        <Image
          alt=""
          className="brand__logo brand__logo--light"
          height={54}
          priority
          sizes="(max-width: 767px) 118px, 142px"
          src="/brand/godocs-wordmark-on-light.svg"
          width={218}
        />
      </span>
    </Link>
  );
}
