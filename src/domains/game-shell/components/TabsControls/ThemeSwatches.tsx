import { SettingsStore, useSettingsStore } from "@/state/appStore";
import classes from "./ThemeSwatches.module.css";

type ThemeName = SettingsStore["settings"]["themeName"];

/* Each swatch previews its theme's ground, so the colours here are the themes'
   own identities rather than UI chrome. */
const THEME_SWATCHES: { name: ThemeName; label: string; fill: string }[] = [
  { name: "midnightgraytheme", label: "Midnight Gray", fill: "#2a2a2e" },
  { name: "midnightbluetheme", label: "Blue", fill: "#1e3a8a" },
  { name: "midnightredtheme", label: "Red", fill: "#7f1d1d" },
  { name: "midnightviolettheme", label: "Violet", fill: "#5b21b6" },
  { name: "midnightgreentheme", label: "Green", fill: "#14532d" },
  {
    name: "vaporwavetheme",
    label: "Vaporwave",
    fill: "linear-gradient(135deg, #ff3cc8, #00dcff)",
  },
];

export function ThemeSwatches() {
  const themeName = useSettingsStore((state) => state.settings.themeName);
  const setThemeName = useSettingsStore((state) => state.handlers.setThemeName);

  return (
    <div className={classes.swatches} role="group" aria-label="Theme">
      {THEME_SWATCHES.map((t) => (
        <button
          key={t.name}
          type="button"
          className={classes.swatch}
          onClick={() => setThemeName(t.name)}
          aria-label={`Switch to ${t.label} theme`}
          aria-pressed={themeName === t.name}
          title={t.label}
          style={{ "--swatch": t.fill } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
