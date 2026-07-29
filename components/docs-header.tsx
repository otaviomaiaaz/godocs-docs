"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Brand } from "@/components/brand";
import { MobileNavDrawer } from "@/components/docs/mobile-nav-drawer";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DocNavigationGroup } from "@/lib/docs/navigation";

type DocsHeaderProps = {
  navigation: DocNavigationGroup[];
};

export function DocsHeader({ navigation }: DocsHeaderProps) {
  const isHome = usePathname() === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    function updateScrolledState() {
      setIsScrolled(window.scrollY > 12);
    }

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolledState);
  }, [isHome]);

  return (
    <header
      className="docs-header"
      data-home={isHome || undefined}
      data-scrolled={isHome && isScrolled ? "true" : undefined}
    >
      <div className="docs-header__inner">
        <div className="docs-header__brand">
          {!isHome ? <MobileNavDrawer groups={navigation} /> : null}
          <Brand />
        </div>
        <div className="docs-header__search">
          <SearchDialog showLauncher={!isHome} />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
