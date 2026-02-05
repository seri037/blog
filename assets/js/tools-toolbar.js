(() => {
  const storageKey = "theme";
  const effectStorageKey = "site-effect";
  const root = document.documentElement;
  const btn = document.querySelector("[data-theme-toggle]");
  const icon = document.querySelector("[data-theme-icon]");
  const effectBtn = document.querySelector("[data-effect-toggle]");
  const effectIcon = document.querySelector("[data-effect-icon]");

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

  const isEffectEnabled = () => root.getAttribute("data-effect") !== "off";

  const setEffectButton = () => {
    if (!effectBtn) return;
    const enabled = isEffectEnabled();
    effectBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
    if (effectIcon) {
      effectIcon.textContent = enabled ? "blur_on" : "blur_off";
    }
  };

  const saved = localStorage.getItem(storageKey);
  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  }

  const savedEffect = localStorage.getItem(effectStorageKey);
  if (savedEffect === "off" || savedEffect === "on") {
    root.setAttribute("data-effect", savedEffect);
  }

  setButton();
  setEffectButton();

  btn?.addEventListener("click", () => {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(storageKey, next);
    setButton();
  });

  effectBtn?.addEventListener("click", () => {
    const nextEnabled = !isEffectEnabled();
    root.setAttribute("data-effect", nextEnabled ? "on" : "off");
    localStorage.setItem(effectStorageKey, nextEnabled ? "on" : "off");
    setEffectButton();
    document.dispatchEvent(new CustomEvent("site-effect-toggle"));
  });
})();
