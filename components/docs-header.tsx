import { Brand } from "@/components/brand";
import { MobileNavDrawer } from "@/components/docs/mobile-nav-drawer";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DocNavigationGroup } from "@/lib/docs/navigation";

type DocsHeaderProps = {
  navigation: DocNavigationGroup[];
};

export function DocsHeader({ navigation }: DocsHeaderProps) {
  return (
    <header className="docs-header">
      <div className="docs-header__inner">
        <div className="docs-header__brand">
          <MobileNavDrawer groups={navigation} />
          <Brand />
        </div>
        <div className="docs-header__search">
          <SearchDialog />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
