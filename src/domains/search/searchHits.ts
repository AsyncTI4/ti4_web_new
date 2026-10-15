import { useEffect } from "react";
import type { SearchKey } from "./searchKeys";

const MATCH_ATTR = "data-search-match";
const CURRENT_ATTR = "data-search-current";

function isMapHit(element: HTMLElement) {
  return element.dataset.searchScope?.startsWith("map") ?? false;
}

/**
 * Every rendered element tagged with this key, board first and then the player
 * areas in page order. Elements with no box (a collapsed sidebar, a hidden
 * breakpoint variant) are skipped, since there is nothing to show.
 */
export function findSearchHits(key: SearchKey): HTMLElement[] {
  const selector = `[data-search-key="${CSS.escape(key)}"]`;
  const hits = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => element.getClientRects().length > 0,
  );
  return [...hits.filter(isMapHit), ...hits.filter((hit) => !isMapHit(hit))];
}

function markHits(key: SearchKey) {
  findSearchHits(key).forEach((hit) => hit.setAttribute(MATCH_ATTR, ""));
}

function clearMarks(attribute: string) {
  document
    .querySelectorAll(`[${attribute}]`)
    .forEach((element) => element.removeAttribute(attribute));
}

/** Past this share of the viewport a target is aligned by its start edge, not centred. */
const OVERSIZED_SHARE = 0.6;

/**
 * Moves the "you are here" mark to one hit and brings it into view. A target
 * wider or taller than most of the viewport (a whole player card) is aligned by
 * its leading edge, since centring it would push its header off screen.
 */
export function focusSearchHit(hit: HTMLElement) {
  clearMarks(CURRENT_ATTR);
  hit.setAttribute(CURRENT_ATTR, "");

  const rect = hit.getBoundingClientRect();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  hit.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: rect.height > window.innerHeight * OVERSIZED_SHARE ? "start" : "center",
    inline: rect.width > window.innerWidth * OVERSIZED_SHARE ? "start" : "center",
  });
}

/**
 * Marks every element matching the active key. The marks are attributes set
 * outside React so the hundreds of tagged cards never subscribe to search state;
 * a mutation observer re-applies them when the board re-renders new nodes, for
 * instance after a live game update or a tab switch.
 */
export function useSearchHighlight(activeKey: SearchKey | null) {
  useEffect(() => {
    if (!activeKey) return;

    markHits(activeKey);

    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => markHits(activeKey));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearMarks(MATCH_ATTR);
      clearMarks(CURRENT_ATTR);
    };
  }, [activeKey]);
}
