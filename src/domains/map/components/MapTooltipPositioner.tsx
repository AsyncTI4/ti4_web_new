import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Box, type BoxProps } from "@mantine/core";
import { useAppStore } from "@/utils/appStore";
import { getBrowserZoomScale } from "@/utils/zoom";
import {
  getMapLayoutConfig,
  mapCoordsToScreen,
  type MapLayout,
} from "./mapLayout";

type Coords = { x: number; y: number };
type TooltipPlacement = "top" | "bottom";

function findClippingContainer(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement ?? null;

  while (current) {
    const computedStyle = window.getComputedStyle(current);
    const overflow = `${computedStyle.overflow} ${computedStyle.overflowX} ${computedStyle.overflowY}`;

    if (/(auto|scroll|overlay)/.test(overflow) && current !== document.body) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

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
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<TooltipPlacement>("top");

  if (!coords) return null;

  const resolvedPadding =
    mapPadding ?? getMapLayoutConfig(mapLayout).mapPadding;
  const { x, y } = mapCoordsToScreen(coords, zoom, resolvedPadding);

  const browserScale = applyBrowserScale ? getBrowserZoomScale() : null;
  const scale = browserScale ? 1 / browserScale : 1;
  const transformBase =
    placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0%)";
  const transform =
    applyBrowserScale && browserScale != null
      ? `${transformBase} scale(${scale})`
      : transformBase;

  useLayoutEffect(() => {
    if (!boxRef.current) return;

    const container = findClippingContainer(boxRef.current);
    if (!container) {
      setPlacement("top");
      return;
    }

    const rect = boxRef.current.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const overflowTop = rect.top < containerRect.top + 8;
    const overflowBottom = rect.bottom > containerRect.bottom - 8;

    if (overflowTop && !overflowBottom) {
      setPlacement("bottom");
      return;
    }

    if (overflowBottom && !overflowTop) {
      setPlacement("top");
      return;
    }

    const cardMidY = y;
    const containerMidY = containerRect.top + containerRect.height / 2;
    setPlacement(cardMidY > containerMidY ? "top" : "bottom");
  }, [coords.x, coords.y, offsetY, y]);

  const top = placement === "top" ? `${y - offsetY}px` : `${y + offsetY}px`;

  return (
    <Box
      ref={boxRef}
      {...rest}
      style={{
        position: "absolute",
        left: `${x}px`,
        top,
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
