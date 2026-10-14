/** postMessage protocol between the app overlay and the isolated video page. */
import type { MusicVideoCast } from "./cast";

export const MUSIC_VIDEO_PAGE = "/music-video.html";

export type FrameToApp =
  | { type: "ti4mv:hello" }
  | { type: "ti4mv:progress"; progress: number }
  | { type: "ti4mv:ready" }
  | { type: "ti4mv:needs-click" }
  | { type: "ti4mv:ended" }
  | { type: "ti4mv:close" };

export type AppToFrame = { type: "ti4mv:cast"; cast: MusicVideoCast } | { type: "ti4mv:play" };

export function isMusicVideoMessage<T extends { type: string }>(data: unknown): data is T {
  return typeof data === "object" && data !== null && typeof (data as { type?: unknown }).type === "string" && (data as { type: string }).type.startsWith("ti4mv:");
}
