/**
 * Shared ECharts theme configuration for the dashboard.
 * Uses the app's industrial sci-fi palette.
 */

export const CHART_COLORS = {
  red: "rgb(239, 68, 68)",
  green: "rgb(34, 197, 94)",
  blue: "rgb(59, 130, 246)",
  cyan: "rgb(6, 182, 212)",
  orange: "rgb(249, 115, 22)",
  yellow: "rgb(234, 179, 8)",
  teal: "rgb(20, 184, 166)",
  purple: "rgb(147, 51, 234)",
  gray: "rgb(148, 163, 184)",
} as const;

export const CHART_PALETTE = [
  CHART_COLORS.cyan,
  CHART_COLORS.teal,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.yellow,
  CHART_COLORS.orange,
  CHART_COLORS.red,
  CHART_COLORS.green,
];

export const SC_NAMES: Record<string, string> = {
  "1": "Leadership",
  "2": "Diplomacy",
  "3": "Politics",
  "4": "Construction",
  "5": "Trade",
  "6": "Warfare",
  "7": "Technology",
  "8": "Imperial",
};

export const SC_COLORS: Record<string, string> = {
  "1": CHART_COLORS.red,
  "2": CHART_COLORS.orange,
  "3": CHART_COLORS.yellow,
  "4": CHART_COLORS.green,
  "5": CHART_COLORS.teal,
  "6": CHART_COLORS.blue,
  "7": CHART_COLORS.cyan,
  "8": CHART_COLORS.purple,
};

/** Base axis/text styles that unify all charts */
export const AXIS_STYLE = {
  axisLine: { lineStyle: { color: "rgba(148,163,184,0.2)" } },
  axisTick: { lineStyle: { color: "rgba(148,163,184,0.15)" } },
  axisLabel: {
    color: "rgba(148,163,184,0.7)",
    fontFamily: "var(--mantine-font-family-monospace), monospace",
    fontSize: 10,
  },
  splitLine: { lineStyle: { color: "rgba(148,163,184,0.06)" } },
};
