"use client";

import { useEffect } from "react";

import {
  anchorCompatibilityManifest,
  resolveCompatibleAnchor,
  type AnchorCompatibilityEntry,
} from "@/lib/docs/compatibility";

type AnchorCompatibilityProps = {
  slug: string;
};

export function getCompatibleAnchorUrl(
  slug: string,
  hash: string,
  manifest: readonly AnchorCompatibilityEntry[] = anchorCompatibilityManifest,
): string | undefined {
  if (!hash.startsWith("#") || hash.length === 1) return undefined;

  let fragment: string;
  try {
    fragment = decodeURIComponent(hash.slice(1));
  } catch {
    fragment = hash.slice(1);
  }

  const destination = resolveCompatibleAnchor(slug, fragment, manifest);
  if (!destination) return undefined;

  if (
    destination.slug === slug &&
    destination.fragment === fragment
  ) {
    return undefined;
  }

  return `/docs/${destination.slug}#${encodeURIComponent(destination.fragment)}`;
}

export function AnchorCompatibility({ slug }: AnchorCompatibilityProps) {
  useEffect(() => {
    function replaceLegacyAnchor() {
      const destination = getCompatibleAnchorUrl(slug, window.location.hash);
      if (destination) window.location.replace(destination);
    }

    replaceLegacyAnchor();
    window.addEventListener("hashchange", replaceLegacyAnchor);

    return () => window.removeEventListener("hashchange", replaceLegacyAnchor);
  }, [slug]);

  return null;
}
