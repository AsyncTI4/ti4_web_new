import { isMobileDevice } from "@/utils/isTouchDevice";

export const MOBILE_MAP_ZOOM = 0.15;
export const MOBILE_PANELS_ZOOM = 0.31;
const PLAYER_AREAS_WIDTH = 1300;
const DECIMAL_PLACES = 4;

// Cache for mobile panels zoom (device-width based)
let cachedPanelsZoom: number | null = null;
let cachedPanelsDeviceWidth: number | null = null;

// Cache for mobile map zoom (content-width based)
type MapZoomCache = {
  zoom: number;
  contentWidth: number;
  viewportWidth: number;
};
let cachedMapZoom: MapZoomCache | null = null;

function roundToDecimalPlaces(value: number, places: number): number {
  const multiplier = Math.pow(10, places);
  return Math.round(value * multiplier) / multiplier;
}

function getViewportWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth;
}

function calculateMobilePanelsZoom(): number {
  if (typeof window === "undefined") {
    return MOBILE_PANELS_ZOOM;
  }

  const deviceWidth = getViewportWidth();

  if (cachedPanelsZoom !== null && cachedPanelsDeviceWidth === deviceWidth) {
    return cachedPanelsZoom;
  }

  const zoom = deviceWidth / PLAYER_AREAS_WIDTH;
  const roundedZoom = roundToDecimalPlaces(zoom, DECIMAL_PLACES);

  cachedPanelsZoom = roundedZoom;
  cachedPanelsDeviceWidth = deviceWidth;

  return roundedZoom;
}

function calculateMobileMapZoom(contentWidth: number): number {
  if (typeof window === "undefined" || contentWidth <= 0) {
    return MOBILE_MAP_ZOOM;
  }

  const viewportWidth = getViewportWidth();

  if (
    cachedMapZoom !== null &&
    cachedMapZoom.contentWidth === contentWidth &&
    cachedMapZoom.viewportWidth === viewportWidth
  ) {
    return cachedMapZoom.zoom;
  }

  const zoom = viewportWidth / contentWidth;
  const roundedZoom = roundToDecimalPlaces(zoom, DECIMAL_PLACES);

  cachedMapZoom = {
    zoom: roundedZoom,
    contentWidth,
    viewportWidth,
  };

  return roundedZoom;
}

export function computeMapZoom(
  storeZoom: number,
  contentWidth?: number
): number {
  if (!isMobileDevice()) {
    return storeZoom;
  }

  if (typeof contentWidth === "number") {
    return calculateMobileMapZoom(contentWidth);
  }

  return MOBILE_MAP_ZOOM;
}

export function computePanelsZoom(): number {
  if (!isMobileDevice()) {
    return 1;
  }
  return calculateMobilePanelsZoom();
}

export function shouldHideZoomControls(): boolean {
  return isMobileDevice();
}

export function getScaleStyle(scale: number): Record<string, string | number> {
  return {
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  } as const;
}

export function getCssScaleStyle(scale: number, isFirefox: boolean) {
  if (isFirefox) {
    return {
      MozTransform: `scale(${scale})`,
      MozTransformOrigin: "top left",
    };
  }
  return {
    zoom: scale,
  };
}

export function getScaledDimensions(
  width: number,
  height: number,
  scale: number
): { width: number; height: number } {
  return {
    width: width * scale,
    height: height * scale,
  };
}

export function getBrowserZoomScale(): number {
  if (typeof window === "undefined") return 1;
  const vv = (window as Window & { visualViewport?: VisualViewport })
    .visualViewport;
  if (vv && typeof vv.scale === "number" && vv.scale > 0) return vv.scale;
  if (
    typeof window.devicePixelRatio === "number" &&
    window.devicePixelRatio > 0
  )
    return window.devicePixelRatio;
  return 1;
}
