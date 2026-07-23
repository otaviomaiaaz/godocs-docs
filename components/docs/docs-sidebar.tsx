import { NavigationTree } from "@/components/navigation-tree";
import type { DocNavigationGroup } from "@/lib/docs/navigation";

type DocsSidebarProps = {
  groups: DocNavigationGroup[];
};

export function DocsSidebar({ groups }: DocsSidebarProps) {
  if (groups.length === 0) return null;

  return (
    <aside className="docs-sidebar">
      <nav aria-label="Navegação da documentação">
        <NavigationTree groups={groups} />
      </nav>
    </aside>
  );
}
