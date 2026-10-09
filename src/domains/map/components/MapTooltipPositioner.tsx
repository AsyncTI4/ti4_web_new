import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Box, type BoxProps } from "@mantine/core";
import { useAppStore } from "@/state/appStore";
import { getBrowserZoomScale } from "@/utils/zoom";
import {
  getMapLayoutConfig,
  mapCoordsToScreen,
  type MapLayout,
} from "./mapLayout";

type Coords = { x: number; y: number };
type TooltipPlacement = "top" | "bottom";

/** Gap kept between a tooltip and the edge of the visible screen. */
const VIEWPORT_EDGE_GAP = 4;

/**
 * Horizontal nudge that brings a box back inside the visible screen. Measured
 * against the visual viewport, which is the part of the page a pinch-zoomed
 * phone is actually showing.
 */
function shiftIntoVisualViewport(left: number, right: number): number {
  const viewport = window.visualViewport;
  const minX = (viewport?.offsetLeft ?? 0) + VIEWPORT_EDGE_GAP;
  const maxX =
    (viewport?.offsetLeft ?? 0) +
    (viewport?.width ?? window.innerWidth) -
    VIEWPORT_EDGE_GAP;

  if (left < minX) return Math.round(minX - left);
  if (right > maxX) return Math.round(Math.max(maxX - right, minX - left));
  return 0;
}

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
  children?: ReactNode;
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
  const storeZoom = useAppStore((state) => state.zoomLevel);
  const zoom = mapZoom ?? storeZoom;
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<TooltipPlacement>("top");
  const [shiftX, setShiftX] = useState(0);

  const resolvedPadding =
    mapPadding ?? getMapLayoutConfig(mapLayout).mapPadding;
  const screen = coords
    ? mapCoordsToScreen(coords, zoom, resolvedPadding)
    : null;
  const screenX = screen?.x ?? null;
  const screenY = screen?.y ?? null;

  useLayoutEffect(() => {
    if (!boxRef.current || screenY === null) return;

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

    const containerMidY = containerRect.top + containerRect.height / 2;
    setPlacement(screenY > containerMidY ? "top" : "bottom");
  }, [offsetY, screenY]);

  useLayoutEffect(() => {
    if (!boxRef.current || screenX === null) return;
    const rect = boxRef.current.getBoundingClientRect();
    setShiftX(shiftIntoVisualViewport(rect.left - shiftX, rect.right - shiftX));
  }, [screenX, screenY, placement, shiftX]);

  if (!screen) return null;

  const { x, y } = screen;

  const browserScale = applyBrowserScale ? getBrowserZoomScale() : null;
  const transformBase = `translateX(${shiftX}px) ${
    placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0%)"
  }`;
  const transform =
    browserScale != null
      ? `${transformBase} scale(${browserScale ? 1 / browserScale : 1})`
      : transformBase;
  /* Shrink toward the anchor, so a counter-scaled card stays next to the thing
     it describes instead of drifting off by the size it lost. */
  const scaleOrigin = placement === "top" ? "center bottom" : "center top";

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
        transformOrigin: applyBrowserScale ? scaleOrigin : undefined,
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
