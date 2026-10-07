let cachedIsMobile: boolean | undefined;

/** Cached for the session: nothing it reads changes after load. */
export function isMobileDevice() {
  cachedIsMobile ??= detectMobileDevice();
  return cachedIsMobile;
}

function detectMobileDevice() {
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (!hasTouch) return false;

  const userAgent = navigator.userAgent.toLowerCase();
  if (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    )
  ) {
    return true;
  }

  // Touchscreen laptops report desktop user agents
  const isLaptopUserAgent =
    /windows nt|mac os x|linux/i.test(userAgent) &&
    !/mobile|tablet/i.test(userAgent);
  if (isLaptopUserAgent) return false;

  const hasSmallScreen =
    window.screen.width <= 1024 &&
    window.screen.height <= 1024 &&
    (window.screen.width <= 768 || window.screen.height <= 768);
  const supportsOrientation =
    "orientation" in window || "onorientationchange" in window;

  return hasSmallScreen && supportsOrientation;
}
