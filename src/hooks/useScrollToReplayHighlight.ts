import { useEffect, type RefObject } from "react";
import { useMapReplay } from "@/hooks/useGameContext";

const VIEWPORT_MARGIN = 80;

/** Centers an off-screen replay focus without disturbing an in-view map. */
export function useScrollToReplayHighlight(
  mapContainerRef: RefObject<HTMLDivElement | null>,
) {
  const replay = useMapReplay();

  useEffect(() => {
    const container = mapContainerRef.current;
    const position = replay.active ? replay.focusPosition : undefined;
    if (!container || !position) return;

    const frame = window.requestAnimationFrame(() => {
      const tile = document.getElementById(`tile-${position}`);
      const tileVisual = tile?.querySelector<HTMLElement>(
        '[data-map-tile-visual="true"]',
      );
      if (!tileVisual || !container.contains(tileVisual)) return;

      const viewport = container.getBoundingClientRect();
      const target = tileVisual.getBoundingClientRect();
      const isVisible =
        target.left >= viewport.left + VIEWPORT_MARGIN &&
        target.right <= viewport.right - VIEWPORT_MARGIN &&
        target.top >= viewport.top + VIEWPORT_MARGIN &&
        target.bottom <= viewport.bottom - VIEWPORT_MARGIN;
      if (isVisible) return;

      const targetCenterX = target.left + target.width / 2;
      const targetCenterY = target.top + target.height / 2;
      const viewportCenterX = viewport.left + viewport.width / 2;
      const viewportCenterY = viewport.top + viewport.height / 2;
      container.scrollTo({
        left: container.scrollLeft + targetCenterX - viewportCenterX,
        top: container.scrollTop + targetCenterY - viewportCenterY,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mapContainerRef, replay.active, replay.focusPosition, replay.key]);
}
