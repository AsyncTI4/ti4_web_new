export function isMobileDevice() {
  // First check if device has touch capability
  const hasTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0;

  if (!hasTouch) {
    return false;
  }

  // Check user agent for known mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );

  // If it's a known mobile user agent, it's definitely mobile
  if (isMobileUserAgent) {
    return true;
  }

  // Check for desktop/laptop patterns in user agent (to exclude touchscreen laptops)
  const isLaptopUserAgent =
    /windows nt|mac os x|linux/i.test(userAgent) &&
    !/mobile|tablet/i.test(userAgent);

  // If it looks like a laptop/desktop, it's probably not mobile even with touch
  if (isLaptopUserAgent) {
    return false;
  }

  // For remaining devices, use more restrictive screen size checks
  // Mobile devices typically have smaller screens in BOTH dimensions
  const hasSmallScreen =
    window.screen.width <= 1024 &&
    window.screen.height <= 1024 &&
    (window.screen.width <= 768 || window.screen.height <= 768);

  // Check if device supports orientation (mobile-specific)
  const supportsOrientation =
    "orientation" in window || "onorientationchange" in window;

  // Only consider it mobile if it has small screen AND orientation support
  // AND we couldn't identify it as a laptop
  return hasSmallScreen && supportsOrientation;
}
