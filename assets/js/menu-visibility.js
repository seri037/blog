(() => {
  const mainMenu = document.querySelector(".main-menu");
  const headerRegion = document.querySelector(".header__region");
  const mobileNav = document.querySelector(".mobile-nav");
  const mediaQuery = window.matchMedia("(min-width: 667px)");

  const updateMenuVisibility = () => {
    const isDesktop = mediaQuery.matches;
    if (mainMenu) mainMenu.hidden = !isDesktop;
    if (headerRegion) headerRegion.hidden = !isDesktop;
    if (mobileNav) mobileNav.hidden = isDesktop;
  };

  updateMenuVisibility();

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", updateMenuVisibility);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(updateMenuVisibility);
  }
})();
