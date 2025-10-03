import { isMobileDevice } from "@/utils/isTouchDevice";

export const MOBILE_MAP_ZOOM = 0.2;
export const MOBILE_PANELS_ZOOM = 0.25;

export function computeMapZoom(storeZoom: number): number {
  return isMobileDevice() ? MOBILE_MAP_ZOOM : storeZoom;
}

export function computePanelsZoom(): number {
  return isMobileDevice() ? MOBILE_PANELS_ZOOM : 1;
}

export function shouldHideZoomControls(): boolean {
  return isMobileDevice();
}

// Returns cross-browser style for applying scale/zoom
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

// Detect effective browser zoom using VisualViewport if available
export function getBrowserZoomScale(): number {
  if (typeof window === "undefined") return 1;
  const vv = (window as any).visualViewport as VisualViewport | undefined;
  if (vv && typeof vv.scale === "number" && vv.scale > 0) return vv.scale;
  if (
    typeof window.devicePixelRatio === "number" &&
    window.devicePixelRatio > 0
  )
    return window.devicePixelRatio;
  return 1;
}

// Hook to subscribe to visual viewport scale changes
export function subscribeToViewportScale(
  onChange: (scale: number) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange(getBrowserZoomScale());
  const vv = (window as any).visualViewport as VisualViewport | undefined;
  if (vv) {
    vv.addEventListener("resize", handler);
    vv.addEventListener("scroll", handler);
  } else {
    window.addEventListener("resize", handler);
  }
  // Initial fire
  handler();
  return () => {
    if (vv) {
      vv.removeEventListener("resize", handler);
      vv.removeEventListener("scroll", handler);
    } else {
      window.removeEventListener("resize", handler);
    }
  };
}
