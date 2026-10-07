import { useEffect } from "react";
import { THEME_NAMES, useSettingsStore } from "@/state/appStore";

const THEME_CLASSES = [
  ...THEME_NAMES.map((name) => `theme-${name}`),
  "theme-mobile",
];

type Options = {
  mobile?: boolean;
};

/** Applies the active theme class to <body> and returns it for the page root. */
export function usePageThemeClass({ mobile = false }: Options = {}) {
  const themeName = useSettingsStore((state) => state.settings.themeName);
  const themeClass = mobile ? "theme-mobile" : `theme-${themeName}`;

  useEffect(() => {
    const body = document.body;
    THEME_CLASSES.forEach((cls) => body.classList.remove(cls));
    body.classList.add(themeClass);
    return () => {
      THEME_CLASSES.forEach((cls) => body.classList.remove(cls));
    };
  }, [themeClass]);

  return themeClass;
}
