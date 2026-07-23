import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link
      aria-label="GoDocs — página inicial"
      className="brand"
      href="/"
    >
      <Image
        alt=""
        className="brand__logo"
        height={78}
        priority
        sizes="(max-width: 767px) 108px, 124px"
        src="/brand/godocs-logo.png"
        width={178}
      />
    </Link>
  );
}
