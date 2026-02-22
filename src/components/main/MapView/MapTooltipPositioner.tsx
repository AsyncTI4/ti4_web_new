import type { CSSProperties } from "react";
import { Box, type BoxProps } from "@mantine/core";
import { useAppStore } from "@/utils/appStore";
import { getBrowserZoomScale } from "@/utils/zoom";
import {
  getMapLayoutConfig,
  mapCoordsToScreen,
  type MapLayout,
} from "./mapLayout";

type Coords = { x: number; y: number };

type MapTooltipPositionerProps = {
  coords: Coords | null | undefined;
  mapPadding?: number;
  mapZoom?: number;
  mapLayout?: MapLayout;
  offsetY?: number;
  zIndexVar?: string;
  applyBrowserScale?: boolean;
  pointerEvents?: CSSProperties["pointerEvents"];
} & Omit<BoxProps, "children">;

export function MapTooltipPositioner({
  coords,
  mapPadding,
  mapZoom,
  mapLayout = "panels",
  offsetY = 25,
  zIndexVar = "var(--z-map-tooltip)",
  applyBrowserScale = false,
  pointerEvents = "none",
  children,
  style,
  ...rest
}: MapTooltipPositionerProps) {
  const zoom = mapZoom ?? useAppStore((state) => state.zoomLevel);

  if (!coords) return null;

  const resolvedPadding =
    mapPadding ?? getMapLayoutConfig(mapLayout).mapPadding;
  const { x, y } = mapCoordsToScreen(coords, zoom, resolvedPadding);

  const browserScale = applyBrowserScale ? getBrowserZoomScale() : null;
  const scale = browserScale ? 1 / browserScale : 1;
  const transformBase = "translate(-50%, -100%)";
  const transform =
    applyBrowserScale && browserScale != null
      ? `${transformBase} scale(${scale})`
      : transformBase;

  return (
    <Box
      {...rest}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y - offsetY}px`,
        zIndex: zIndexVar,
        pointerEvents,
        transform,
        ...(applyBrowserScale
          ? {
              transformOrigin: "top left",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
