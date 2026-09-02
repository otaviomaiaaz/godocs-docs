"use client";

import { useEffect, useState } from "react";

import type { VersionInfo } from "@/app/api/version/route";
import { SITE_BASE_PATH } from "@/lib/site";

type DeployedVersionsProps = {
  fallback: string;
};

export function DeployedVersions({ fallback }: DeployedVersionsProps) {
  const [info, setInfo] = useState<VersionInfo>({
    docs: fallback,
    api: null,
    web: null,
  });

  useEffect(() => {
    let active = true;

    fetch(`${SITE_BASE_PATH}/api/version`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: VersionInfo | null) => {
        if (active && data?.docs) setInfo(data);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const parts = [
    info.api ? `API v${info.api}` : null,
    info.web ? `Web v${info.web}` : null,
    `Documentação v${info.docs}`,
  ].filter(Boolean) as string[];

  return (
    <>
      {parts.map((part, index) => (
        <span key={part}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {part}
        </span>
      ))}
    </>
  );
}
