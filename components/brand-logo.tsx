import type { CSSProperties } from "react";

import { SITE_BASE_PATH } from "@/lib/site";

export type BrandLogoSize = "compact" | "default";

type BrandLogoProps = {
  size?: BrandLogoSize;
};

type BrandLogoStyle = CSSProperties & {
  "--brand-logo-dark": string;
  "--brand-logo-light": string;
};

export function BrandLogo({ size = "default" }: BrandLogoProps) {
  const style: BrandLogoStyle = {
    "--brand-logo-dark": `url("${SITE_BASE_PATH}/brand/godocs-logo-official-dark.svg")`,
    "--brand-logo-light": `url("${SITE_BASE_PATH}/brand/godocs-logo-official-light.png")`,
  };

  return (
    <span
      aria-hidden="true"
      className="brand-logo"
      data-size={size}
      style={style}
    />
  );
}