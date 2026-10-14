import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";

const cache = new Map<string, HTMLImageElement>();
const pending = new Map<string, Promise<HTMLImageElement>>();

function load(src: string): Promise<HTMLImageElement> {
  const hit = cache.get(src);
  if (hit) return Promise.resolve(hit);
  const p = pending.get(src);
  if (p) return p;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      cache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
  pending.set(src, promise);
  return promise;
}

/** Registers an already-decoded image so canvas scenes can draw it immediately. */
export function seedImage(src: string, img: HTMLImageElement) {
  cache.set(src, img);
}

/** Loads images for canvas drawing, holding the Remotion render until they're ready. */
export function useImages(srcs: string[]): Map<string, HTMLImageElement> | null {
  const ready = srcs.every((s) => cache.has(s));
  const [, setTick] = useState(0);
  const [handle] = useState(() => (ready ? null : delayRender("canvas sprites")));
  useEffect(() => {
    if (!handle) return;
    void Promise.all(srcs.map(load)).then(() => {
      setTick((n) => n + 1);
      continueRender(handle);
    });
  }, []);
  return srcs.every((s) => cache.has(s)) ? cache : null;
}
