/*
 * Every file the music video uses, resolved through Vite so production URLs are
 * content-hashed (long-cacheable). Shared by the video page and the app's idle
 * prefetcher, which warms the HTTP cache from this list without decoding anything.
 */
const FILES = import.meta.glob<string>("./assets/**/*", {
  query: "?url",
  import: "default",
  eager: true,
});

export function assetUrl(path: string): string {
  const url = FILES[`./assets/${path}`];
  if (!url) throw new Error(`music video asset missing: ${path}`);
  return url;
}

/** Remote (non-inlined) asset URLs, for prefetching. */
export const PREFETCH_URLS: string[] = Object.values(FILES).filter((url) => !url.startsWith("data:"));
