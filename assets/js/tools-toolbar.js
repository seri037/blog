(() => {
  const storageKey = "theme";
  const root = document.documentElement;
  const btn = document.querySelector("[data-theme-toggle]");
  const icon = document.querySelector("[data-theme-icon]");

  const prefersDark = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const effectiveTheme = () => {
    const t = root.getAttribute("data-theme");
    if (t === "dark" || t === "light") return t;
    return prefersDark() ? "dark" : "light";
  };

  const setButton = () => {
    if (!btn) return;
    const t = effectiveTheme();
    btn.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
    if (icon) {
      icon.textContent = t === "dark" ? "light_mode" : "dark_mode";
    }
  };

  const saved = localStorage.getItem(storageKey);
  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  }

  setButton();

  btn?.addEventListener("click", () => {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(storageKey, next);
    setButton();
  });
})();
