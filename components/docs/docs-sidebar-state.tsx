"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type DocsSidebarState = "expanded" | "collapsed";

type DocsSidebarStateValue = {
  sidebarState: DocsSidebarState;
  setSidebarState: (state: DocsSidebarState) => void;
};

const DocsSidebarStateContext = createContext<DocsSidebarStateValue | null>(
  null,
);

export function DocsSidebarStateProvider({ children }: { children: ReactNode }) {
  const [sidebarState, setSidebarState] =
    useState<DocsSidebarState>("expanded");

  useLayoutEffect(() => {
    document.documentElement.dataset.docsSidebar = sidebarState;

    return () => {
      document.documentElement.removeAttribute("data-docs-sidebar");
    };
  }, [sidebarState]);

  const value = useMemo(
    () => ({ sidebarState, setSidebarState }),
    [sidebarState],
  );

  return (
    <DocsSidebarStateContext.Provider value={value}>
      {children}
    </DocsSidebarStateContext.Provider>
  );
}

export function useDocsSidebarState() {
  const value = useContext(DocsSidebarStateContext);

  if (!value) {
    throw new Error(
      "useDocsSidebarState deve ser usado dentro de DocsSidebarStateProvider.",
    );
  }

  return value;
}
