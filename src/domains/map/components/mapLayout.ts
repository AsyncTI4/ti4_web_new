import type { CSSProperties } from "react";
import { getCssScaleStyle, getScaleStyle } from "@/utils/zoom";

export type MapLayout = "panels" | "pannable";

export type MapLayoutConfig = {
  layout: MapLayout;
  mapPadding: number;
  contentPadding: number;
  mapWidthExtra: number;
  mapHeightExtra: number;
  useCssZoom: boolean;
  offsetByZoom: boolean;
};

// Explicit layout differences live here to avoid scattershot constants.
const MAP_LAYOUTS: Record<MapLayout, MapLayoutConfig> = {
  panels: {
    layout: "panels",
    mapPadding: 200,
    contentPadding: 200,
    mapWidthExtra: 0,
    mapHeightExtra: 50,
    useCssZoom: true,
    offsetByZoom: true,
  },
  pannable: {
    layout: "pannable",
    mapPadding: 0,
    contentPadding: 200,
    mapWidthExtra: 400,
    mapHeightExtra: 50,
    useCssZoom: false,
    offsetByZoom: false,
  },
};

export function getMapLayoutConfig(layout: MapLayout): MapLayoutConfig {
  return MAP_LAYOUTS[layout];
}

export function getMapScaleStyle(
  config: MapLayoutConfig,
  zoom: number,
  isFirefox: boolean
): CSSProperties {
  return config.useCssZoom
    ? getCssScaleStyle(zoom, isFirefox)
    : getScaleStyle(zoom, isFirefox);
}

export function getMapContainerOffset(
  config: MapLayoutConfig,
  zoom: number
): { top: number; left: number } {
  const offset = config.offsetByZoom
    ? config.mapPadding / zoom
    : config.mapPadding;
  return { top: offset, left: offset };
}

export function mapCoordsToScreen(
  coords: { x: number; y: number },
  zoom: number,
  padding: number
): { x: number; y: number } {
  return {
    x: coords.x * zoom + padding,
    y: coords.y * zoom + padding,
  };
}
