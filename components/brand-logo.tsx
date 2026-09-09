export type BrandLogoSize = "compact" | "default";

type BrandLogoProps = {
  size?: BrandLogoSize;
};

export function BrandLogo({ size = "default" }: BrandLogoProps) {
  return (
    <span aria-hidden="true" className="brand-logo" data-size={size} />
  );
}
