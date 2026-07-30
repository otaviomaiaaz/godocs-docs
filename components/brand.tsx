import Link from "next/link";

import {
  BrandLogo,
  type BrandLogoSize,
} from "@/components/brand-logo";

type BrandProps = {
  logoSize?: BrandLogoSize;
};

export function Brand({ logoSize = "default" }: BrandProps) {
  return (
    <Link
      aria-label="GoDocs — página inicial"
      className="brand"
      href="/"
    >
      <BrandLogo size={logoSize} />
    </Link>
  );
}
