import { isMobileDevice } from "@/utils/isTouchDevice";
import { MUSIC_VIDEO_PAGE } from "@/music-video/protocol";

/*
 * Warms the HTTP cache with everything the music video needs, in the background,
 * after the site has loaded. It only downloads bytes: nothing is decoded, mounted
 * or uploaded to the GPU until someone actually presses the button, so an unused
 * video costs bandwidth once and no memory at all.
 */

export type PrefetchState = {
  status: "idle" | "unsupported" | "loading" | "ready";
  progress: number;
  /** The game whose own art (board, faces, sprites) is cached, so the button can open instantly. */
  warmedCast: string | null;
};

let state: PrefetchState = { status: "idle", progress: 0, warmedCast: null };
const listeners = new Set<() => void>();

function set(next: Partial<PrefetchState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

export const subscribeMusicVideo = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getMusicVideoState = () => state;

/** Desktop only: a fine pointer, hover, and room for a 16:9 stage. */
export function musicVideoSupported() {
  return !isMobileDevice() && window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
}

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

async function collectUrls(): Promise<string[]> {
  const urls = new Set<string>();
  const page = await fetch(MUSIC_VIDEO_PAGE, { priority: "low" });
  const html = await page.text();
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) urls.add(match[1]);
  const { PREFETCH_URLS } = await import("@/music-video/assetUrls");
  PREFETCH_URLS.forEach((url) => urls.add(url));
  return [...urls];
}

async function warm(urls: string[], report = true) {
  const queue = [...urls];
  let done = 0;
  const worker = async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      try {
        // The image CDN sends no CORS headers: an opaque no-cors fetch still fills the HTTP cache.
        const crossOrigin = new URL(url, location.href).origin !== location.origin;
        const response = await fetch(url, { priority: "low", mode: crossOrigin ? "no-cors" : "cors" });
        await response.blob();
      } catch {
        /* the overlay will fetch anything that failed here */
      }
      done++;
      if (report && done % 8 === 0) set({ status: "loading", progress: done / urls.length });
    }
  };
  await Promise.all(Array.from({ length: 3 }, worker));
}

const whenIdle = () =>
  new Promise<void>((resolve) => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 4000 });
    else setTimeout(resolve, 1000);
  });

let warmingCast = "";
/** Warms one game's board, faces and sprites (CDN), once the bundle itself is cached. Download only;
 * the button waits for this so pressing it never waits on the network. */
export function prefetchMusicVideoCast(key: string, urls: () => string[]) {
  if (state.status !== "ready" || warmingCast === key || !musicVideoSupported()) return;
  warmingCast = key;
  if (saveData()) {
    // No background download on data saver: the button loads on demand.
    set({ warmedCast: key });
    return;
  }
  void whenIdle()
    .then(() => warm(urls(), false))
    .finally(() => {
      if (warmingCast === key) set({ warmedCast: key });
    });
}

function saveData() {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ""));
}

/** Call once at startup. Waits for the page to settle before touching the network. */
export function scheduleMusicVideoPrefetch() {
  if (state.status !== "idle") return;
  if (!musicVideoSupported()) {
    set({ status: "unsupported", progress: 0 });
    return;
  }
  const begin = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await whenIdle();
    if (saveData()) {
      // Respect data saver: no background download, the button loads on demand.
      set({ status: "ready", progress: 0 });
      return;
    }
    set({ status: "loading", progress: 0 });
    try {
      await warm(await collectUrls());
    } finally {
      set({ status: "ready", progress: 1 });
    }
  };
  if (document.readyState === "complete") void begin();
  else window.addEventListener("load", () => void begin(), { once: true });
}
