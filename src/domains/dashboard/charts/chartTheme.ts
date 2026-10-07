/**
 * Shared ECharts theme configuration for the dashboard.
 */

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

export const TOOLTIP_STYLE = {
  backgroundColor: "rgba(10,15,28,0.92)",
  borderColor: "rgba(148,163,184,0.15)",
  textStyle: { color: "#c0cbd8", fontFamily: "monospace", fontSize: 11 },
};
