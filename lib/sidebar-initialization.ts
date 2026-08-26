export const SIDEBAR_INITIALIZATION_SCRIPT = `try {
  const storedSidebar = localStorage.getItem("godocs-docs-sidebar");
  const sidebarState =
    storedSidebar === "expanded" || storedSidebar === "collapsed"
      ? storedSidebar
      : "expanded";

  document.documentElement.dataset.docsSidebar = sidebarState;
} catch {
  document.documentElement.dataset.docsSidebar = "expanded";
}`;
