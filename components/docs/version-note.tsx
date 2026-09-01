"use client";

import { useEffect, useState } from "react";

import type { VersionInfo } from "@/app/api/version/route";
import { SITE_BASE_PATH } from "@/lib/site";

export function VersionNote() {
  const [info, setInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`${SITE_BASE_PATH}/api/version`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: VersionInfo | null) => {
        if (active) setInfo(data);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  if (!info?.documented || !info.product) return null;
  if (info.documented === info.product) return null;

  return (
    <>
      <span aria-hidden="true">·</span>
      <span className="doc-footer__diverged" role="status">
        Documenta a versão {info.documented}; em uso, {info.product}
      </span>
    </>
  );
}
