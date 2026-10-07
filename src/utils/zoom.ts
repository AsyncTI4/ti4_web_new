import { isMobileDevice } from "@/utils/isTouchDevice";

const MOBILE_MAP_ZOOM = 0.15;
const MOBILE_PANELS_ZOOM = 0.31;
const PLAYER_AREAS_WIDTH = 1300;
const DECIMAL_PLACES = 4;

function roundToDecimalPlaces(value: number, places: number): number {
  const multiplier = Math.pow(10, places);
  return Math.round(value * multiplier) / multiplier;
}

function calculateMobilePanelsZoom(): number {
  if (typeof window === "undefined") return MOBILE_PANELS_ZOOM;
  return roundToDecimalPlaces(
    window.innerWidth / (PLAYER_AREAS_WIDTH + 20),
    DECIMAL_PLACES,
  );
}

function calculateMobileMapZoom(contentWidth: number): number {
  if (typeof window === "undefined" || contentWidth <= 0) {
    return MOBILE_MAP_ZOOM;
  }
  return roundToDecimalPlaces(window.innerWidth / contentWidth, DECIMAL_PLACES);
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
  if (!isMobileDevice()) return 1;
  return calculateMobilePanelsZoom();
}

export function shouldHideZoomControls(): boolean {
  return isMobileDevice();
}

export function getScaleStyle(
  scale: number,
  isFirefox: boolean
): Record<string, string | number> {
  if (isFirefox) {
    return {
      MozTransform: `scale(${scale})`,
      MozTransformOrigin: "top left",
    };
  }
  return {
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };
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

export function getBrowserZoomScale(): number {
  if (typeof window === "undefined") return 1;
  const visualScale = window.visualViewport?.scale;
  if (typeof visualScale === "number" && visualScale > 0) return visualScale;
  if (window.devicePixelRatio > 0) return window.devicePixelRatio;
  return 1;
}
