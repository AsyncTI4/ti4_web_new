import { isMobileDevice } from "@/utils/isTouchDevice";

export const MOBILE_MAP_ZOOM = 0.15;
export const MOBILE_PANELS_ZOOM = 0.31;
const PLAYER_AREAS_WIDTH = 1300;
const DECIMAL_PLACES = 4;

  return isMobileDevice() ? MOBILE_MAP_ZOOM : storeZoom;
}

export function computePanelsZoom(): number {
  return isMobileDevice() ? MOBILE_PANELS_ZOOM : 1;
  if (!isMobileDevice()) {
    return 1;
  }
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
    } as const;
  }
  return { zoom: scale } as const;
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
