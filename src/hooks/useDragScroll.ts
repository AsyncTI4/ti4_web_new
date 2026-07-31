import { useEffect } from "react";
import * as dragscroll from "dragscroll";

const PAN_IDLE_MS = 120;
const PANNING_CLASS = "dragscroll-panning";

/**
 * Wires the calling component's `.dragscroll` element for drag-to-pan.
 *
 * dragscroll binds by scanning the document for `.dragscroll` at window load and
 * on every `reset()`, so an element that appears after the last scan is never
 * wired and the board silently stops panning. Both of the map's scrollers appear
 * late: the map view mounts only once game data has landed, and the tab strip
 * runs with `keepMounted={false}`, so returning to the board builds a new node
 * every time. Announcing the scroller from the component that owns it is the
 * only place that knows when it exists.
 */
export function useDragScroll() {
  useEffect(() => {
    dragscroll.reset();

    const scrollers = Array.from(
      document.querySelectorAll<HTMLElement>(".dragscroll"),
    );
    const idleTimers = new Map<HTMLElement, number>();

    const handleScroll = (event: Event) => {
      const scroller = event.currentTarget as HTMLElement;
      scroller.classList.add(PANNING_CLASS);

      const idleTimer = idleTimers.get(scroller);
      if (idleTimer !== undefined) window.clearTimeout(idleTimer);
      idleTimers.set(
        scroller,
        window.setTimeout(() => {
          scroller.classList.remove(PANNING_CLASS);
          idleTimers.delete(scroller);
        }, PAN_IDLE_MS),
      );
    };

    for (const scroller of scrollers) {
      scroller.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      for (const scroller of scrollers) {
        scroller.removeEventListener("scroll", handleScroll);
        scroller.classList.remove(PANNING_CLASS);
      }
      for (const idleTimer of idleTimers.values()) {
        window.clearTimeout(idleTimer);
      }
    };
  }, []);
}
