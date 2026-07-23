import { Brand } from "@/components/brand";
import { MobileNavDrawer } from "@/components/docs/mobile-nav-drawer";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DocNavigationGroup } from "@/lib/docs/navigation";
import type { SearchDocument } from "@/lib/docs/search";

type DocsHeaderProps = {
  navigation: DocNavigationGroup[];
  searchIndex: SearchDocument[];
};

export function DocsHeader({ navigation, searchIndex }: DocsHeaderProps) {
  return (
    <header className="docs-header">
      <div className="docs-header__inner">
        <div className="docs-header__brand">
          <MobileNavDrawer groups={navigation} />
          <Brand />
        </div>
        <div className="docs-header__search">
          <SearchDialog index={searchIndex} />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
