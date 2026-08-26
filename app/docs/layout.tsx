import type { ReactNode } from "react";

import { DocsSidebarStateProvider } from "@/components/docs/docs-sidebar-state";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsSidebarStateProvider>{children}</DocsSidebarStateProvider>;
}
