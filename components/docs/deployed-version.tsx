"use client";

import { useEffect, useState } from "react";

import type { VersionInfo } from "@/app/api/version/route";
import { SITE_BASE_PATH } from "@/lib/site";

type DeployedVersionProps = {
  fallback: string;
};

export function DeployedVersion({ fallback }: DeployedVersionProps) {
  const [version, setVersion] = useState(fallback);

  useEffect(() => {
    let active = true;

    fetch(`${SITE_BASE_PATH}/api/version`)
      .then((response) => (response.ok ? response.json() : null))
      .then((info: VersionInfo | null) => {
        if (active && info?.version) setVersion(info.version);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return <>v{version}</>;
}
