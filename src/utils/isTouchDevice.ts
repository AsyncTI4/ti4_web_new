export function isMobileDevice() {
  // First check if device has touch capability
  const hasTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0;

  if (!hasTouch) {
    return false;
  }

  // Additional mobile-specific checks
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );

  // Check screen size (mobile devices typically have smaller screens)
  const hasSmallScreen =
    window.screen.width <= 768 || window.screen.height <= 768;

  // Check if device supports orientation (mobile-specific)
  const supportsOrientation =
    "orientation" in window || "onorientationchange" in window;

  // Combine checks: must have touch AND (mobile user agent OR small screen with orientation support)
  return isMobileUserAgent || (hasSmallScreen && supportsOrientation);
}
