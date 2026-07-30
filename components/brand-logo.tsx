import Image from "next/image";

export type BrandLogoSize = "compact" | "default";

const BRAND_LOGO_ASSETS = {
  dark: "/brand/godocs-logo-official-dark.png",
  light: "/brand/godocs-logo-official-light.png",
  height: 58,
  width: 150,
} as const;

type BrandLogoProps = {
  size?: BrandLogoSize;
};

export function BrandLogo({ size = "default" }: BrandLogoProps) {
  return (
    <span
      aria-label="GoDocs"
      className="brand-logo"
      data-size={size}
      role="img"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="brand-logo__image brand-logo__image--dark"
        height={BRAND_LOGO_ASSETS.height}
        priority
        src={BRAND_LOGO_ASSETS.dark}
        unoptimized
        width={BRAND_LOGO_ASSETS.width}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="brand-logo__image brand-logo__image--light"
        height={BRAND_LOGO_ASSETS.height}
        priority
        src={BRAND_LOGO_ASSETS.light}
        unoptimized
        width={BRAND_LOGO_ASSETS.width}
      />
    </span>
  );
}
