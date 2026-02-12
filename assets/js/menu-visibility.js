(() => {
  const mainMenu = document.querySelector(".main-menu");
  const headerRegion = document.querySelector(".header__region");
  const mobileNav = document.querySelector(".mobile-nav");
  const mediaQuery = window.matchMedia("(min-width: 667px)");
  const body = document.body;
  const mobileNavOpenAttr = "data-mobile-nav-open";
  const mobileNavToggleAttr = "data-navopen";
  const fallbackExitDelayMs = 170;
  const prefersMotion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  let closeStateTimer = null;

  const parseDurationMs = (value, fallbackMs) => {
    const raw = String(value || "").trim();
    if (!raw) return fallbackMs;

    if (raw.endsWith("ms")) {
      const ms = Number.parseFloat(raw);
      return Number.isFinite(ms) ? ms : fallbackMs;
    }
    if (raw.endsWith("s")) {
      const sec = Number.parseFloat(raw);
      return Number.isFinite(sec) ? sec * 1000 : fallbackMs;
    }

    const numeric = Number.parseFloat(raw);
    return Number.isFinite(numeric) ? numeric : fallbackMs;
  };

  const mobileNavExitDelayMs = parseDurationMs(
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--mobile-nav-state-transition"),
    fallbackExitDelayMs
  );

  const clearCloseStateTimer = () => {
    if (!closeStateTimer) return;
    window.clearTimeout(closeStateTimer);
    closeStateTimer = null;
  };

  const isMobileNavOpen = () =>
    Boolean(
      mobileNav && !mobileNav.hidden && mobileNav.hasAttribute(mobileNavToggleAttr)
    );

  const syncMobileNavState = () => {
    if (!body) return;
    const shouldAnimateClose = prefersMotion.matches && mobileNavExitDelayMs > 0;

    if (isMobileNavOpen()) {
      clearCloseStateTimer();
      body.setAttribute(mobileNavOpenAttr, "");
      return;
    }

    if (!body.hasAttribute(mobileNavOpenAttr)) return;

    if (!shouldAnimateClose) {
      clearCloseStateTimer();
      body.removeAttribute(mobileNavOpenAttr);
      return;
    }

    clearCloseStateTimer();
    closeStateTimer = window.setTimeout(() => {
      if (!isMobileNavOpen()) {
        body.removeAttribute(mobileNavOpenAttr);
      }
      closeStateTimer = null;
    }, mobileNavExitDelayMs);
  };

  const updateMenuVisibility = () => {
    const isDesktop = mediaQuery.matches;
    if (mainMenu) mainMenu.hidden = !isDesktop;
    if (headerRegion) headerRegion.hidden = !isDesktop;
    if (mobileNav) {
      mobileNav.hidden = isDesktop;
      if (isDesktop && mobileNav.hasAttribute(mobileNavToggleAttr)) {
        mobileNav.removeAttribute(mobileNavToggleAttr);
      }
    }
    syncMobileNavState();
  };

  updateMenuVisibility();

  if (mobileNav && "MutationObserver" in window) {
    const observer = new MutationObserver(syncMobileNavState);
    observer.observe(mobileNav, {
      attributes: true,
      attributeFilter: [mobileNavToggleAttr, "hidden"],
    });
  }

  if (prefersMotion.addEventListener) {
    prefersMotion.addEventListener("change", syncMobileNavState);
  } else if (prefersMotion.addListener) {
    prefersMotion.addListener(syncMobileNavState);
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", updateMenuVisibility);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(updateMenuVisibility);
  }
})();
