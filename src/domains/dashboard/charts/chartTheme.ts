import { useEffect, useState } from "react";
import { useSettingsStore } from "@/state/appStore";

/**
 * ECharts draws to canvas and cannot read CSS variables, so the dashboard
 * resolves the design tokens from <body> (where the theme class lives) and
 * rebuilds the chart styles whenever the theme changes.
 */
export type ChartTheme = ReturnType<typeof buildChartTheme>;

function readToken(styles: CSSStyleDeclaration, name: string, fallback: string) {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

/** "59 130 246" or "59, 130, 246" → "rgba(59, 130, 246, a)". */
function tripletRgba(triplet: string, alpha: number) {
  const parts = triplet.replace(/,/g, " ").split(/\s+/).filter(Boolean);
  return `rgba(${parts.join(", ")}, ${alpha})`;
}

function buildChartTheme(styles: CSSStyleDeclaration) {
  const hair = readToken(styles, "--ds-hair-rgb", "190 190 196");
  const inkLo = readToken(styles, "--ds-ink-lo", "#868e96");
  const ink = readToken(styles, "--ds-ink", "#adb5bd");
  const inkHi = readToken(styles, "--ds-ink-hi", "#f1f3f5");
  const ground = readToken(styles, "--ds-ground", "#151517");
  const dataFont = readToken(styles, "--font-data", "monospace");
  const signal = (name: string, fallback: string) =>
    readToken(styles, name, fallback);

  const sig = {
    prop: signal("--ds-sig-prop", "59 130 246"),
    ok: signal("--ds-sig-ok", "34 197 94"),
    relic: signal("--ds-sig-relic", "212 167 44"),
    law: signal("--ds-sig-law", "168 85 247"),
    stage1: signal("--ds-sig-stage1", "249 115 22"),
  };

  return {
    font: dataFont,
    ink,
    inkHi,
    inkLo,
    hair: (alpha: number) => tripletRgba(hair, alpha),
    sig: (key: keyof typeof sig, alpha = 1) => tripletRgba(sig[key], alpha),
    axis: {
      axisLine: { lineStyle: { color: tripletRgba(hair, 0.22) } },
      axisTick: { lineStyle: { color: tripletRgba(hair, 0.14) } },
      axisLabel: { color: inkLo, fontFamily: dataFont, fontSize: 10 },
      splitLine: { lineStyle: { color: tripletRgba(hair, 0.1) } },
    },
    tooltip: {
      backgroundColor: ground,
      borderColor: tripletRgba(hair, 0.22),
      textStyle: { color: inkHi, fontFamily: dataFont, fontSize: 11 },
      extraCssText: "box-shadow: 0 8px 24px rgb(0 0 0 / 0.5); border-radius: 4px;",
    },
  };
}

const readBodyTheme = () => buildChartTheme(getComputedStyle(document.body));

/** Re-reads after paint so the body theme class (set in an effect) has landed. */
export function useChartTheme(): ChartTheme {
  const themeName = useSettingsStore((state) => state.settings.themeName);
  const [theme, setTheme] = useState(readBodyTheme);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTheme(readBodyTheme()));
    return () => cancelAnimationFrame(frame);
  }, [themeName]);

  return theme;
}
