// MS-DOS TUI runtime bridge for Vencord CustomJS/userscript.
// Do not paste this into a CSS theme; load it as JavaScript.
(() => {
  "use strict";

  if (window.__msdosTuiRuntime) return;
  window.__msdosTuiRuntime = true;

  const APP = "#app-mount";
  const HOME_PATH = /^\/channels\/@me(?:\/|$)/;
  const SERVER_PATH = /^\/channels\/\d+\/\d+/;
  let lastPath = "";
  let refreshTimer = 0;

  const getRoot = () => document.querySelector(APP);

  function viewFor(path = location.pathname) {
    if (SERVER_PATH.test(path)) return "server";
    if (HOME_PATH.test(path)) return "home";
    return "neutral";
  }

  function restoreGuildIcons(root) {
    const rail = root?.querySelector('[class*="guilds"]');
    if (!rail) return;

    rail.style.setProperty("display", "flex", "important");
    rail.style.setProperty("visibility", "visible", "important");
    rail.style.setProperty("opacity", "1", "important");

    // Discord may render guild icons as img, SVG, CSS masks, or blob containers.
    rail.querySelectorAll("img, svg, [class*='blobContainer'], [class*='avatar'], [class*='icon']").forEach((node) => {
      node.style.setProperty("visibility", "visible", "important");
      node.style.setProperty("opacity", "1", "important");
      node.style.setProperty("display", "block", "important");
      node.style.removeProperty("filter");
      node.style.removeProperty("clip-path");
      node.style.removeProperty("mask");
      node.style.removeProperty("mask-image");
    });
  }

  function applyView() {
    const root = getRoot();
    if (!root) return;

    const path = location.pathname;
    const view = viewFor(path);
    if (path !== lastPath || root.dataset.tuiView !== view) {
      root.dataset.tuiView = view;
      root.dataset.tuiPath = path;
      lastPath = path;
    }

    if (view === "server") restoreGuildIcons(root);
  }

  function scheduleApply() {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(applyView, 75);
  }

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    scheduleApply();
    return result;
  };
  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    scheduleApply();
    return result;
  };

  window.addEventListener("popstate", scheduleApply);
  window.addEventListener("hashchange", scheduleApply);

  new MutationObserver(scheduleApply).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  applyView();
})();
