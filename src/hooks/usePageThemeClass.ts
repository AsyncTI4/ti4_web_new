import { useEffect } from "react";
import { useSettingsStore } from "@/utils/appStore";

const THEME_CLASSES = [
  "theme-midnightbluetheme",
  "theme-midnighttheme",
  "theme-midnightgraytheme",
  "theme-midnightredtheme",
  "theme-sunsettheme",
  "theme-magmatheme",
  "theme-vaporwavetheme",
  "theme-midnightviolettheme",
  "theme-midnightgreentheme",
  "theme-mobile",
];

export function usePageThemeClass() {
  const themeName = useSettingsStore((state) => state.settings.themeName);

  useEffect(() => {
    const body = document.body;
    THEME_CLASSES.forEach((cls) => body.classList.remove(cls));
    body.classList.add(`theme-${themeName}`);
    return () => {
      THEME_CLASSES.forEach((cls) => body.classList.remove(cls));
    };
  }, [themeName]);

  return `theme-${themeName}`;
}
