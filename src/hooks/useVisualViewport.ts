import { useEffect, useState } from "react";

export type VisualViewportRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  scale: number;
};

function readVisualViewport(): VisualViewportRect {
  const viewport = window.visualViewport;
  if (!viewport) {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      scale: 1,
    };
  }
  return {
    left: viewport.offsetLeft,
    top: viewport.offsetTop,
    width: viewport.width,
    height: viewport.height,
    scale: viewport.scale || 1,
  };
}

/**
 * The part of the page actually on screen. On a pinch-zoomed phone this is
 * smaller than, and offset inside, the layout viewport that `position: fixed`
 * and `100vw` measure against. Tracks pinch and pan only while `enabled`.
 */
export function useVisualViewport(enabled: boolean): VisualViewportRect {
  const [rect, setRect] = useState(readVisualViewport);

  useEffect(() => {
    if (!enabled) return;
    const update = () => setRect(readVisualViewport());
    update();

    const viewport = window.visualViewport;
    const target = viewport ?? window;
    target.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    return () => {
      target.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
    };
  }, [enabled]);

  return rect;
}
