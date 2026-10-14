import { assetUrl } from "../../assetUrls";
import { cdnImage } from "@/entities/data/cdnImage";
import { commandTokenUrl, unitSpriteUrl } from "../../castAssets";
import { G } from "./game";

const staticFile = assetUrl;

export type UnitType =
  | "fs" | "dn" | "cv" | "ca" | "ws" | "dd" | "dd_eyes" | "mf" | "gf" | "sd" | "pd" | "ff"
  | "tkn_ff" | "tkn_gf" | "tkn_inf" | "monument";

/** Native sprite sizes (px) from the web app's renderedSpriteDimensions.ts. */
export const UNIT_SIZE: Record<UnitType, [number, number]> = {
  fs: [80, 82], dn: [77, 77], cv: [71, 70], ca: [67, 67], ws: [56, 65], monument: [64, 64],
  dd: [51, 50], dd_eyes: [51, 50], mf: [45, 45], gf: [39, 44], sd: [42, 43], pd: [33, 38],
  tkn_ff: [70, 35], tkn_gf: [70, 35], tkn_inf: [70, 35], ff: [32, 32],
};
export const SHIPS: UnitType[] = ["fs", "dn", "cv", "ca", "ws", "dd"];
/** Ship art points north-west natively (the app's NATIVE_NORTHWEST_ANGLE). Fighters point north. */
export const NATIVE_ANGLE = (u: UnitType) => (u === "ff" ? -90 : -135);

export type Sprite = { src: string; /** a native-size fallback rather than the 4x copy */ native: boolean };
const sprites = new Map<string, Sprite>();
const spriteKey = (color: string, unit: string) => `${color}/${unit}`;

/** Records which file the preloader managed to decode for a sprite. */
export function registerSprite(color: string, unit: string, sprite: Sprite) {
  sprites.set(spriteKey(color, unit), sprite);
}
export function spriteOf(color: string, unit: UnitType): Sprite {
  return (
    sprites.get(spriteKey(color, unit)) ??
    (unit === "dd_eyes" ? sprites.get(spriteKey(color, "dd")) : undefined) ?? { src: unitSpriteUrl(color, unit), native: false }
  );
}
export const unitSrc = (color: string, unit: UnitType) => spriteOf(color, unit).src;

/* Images that failed to load (a homebrew faction without leader art, say), so scenes can fall back. */
const broken = new Set<string>();
export const markBroken = (url: string) => broken.add(url);
export const usable = (url: string | undefined): url is string => !!url && !broken.has(url);

export const leaderSrc = (name: string) => `/leaders/${name}.webp`;
export const tileSrc = (image: string) => cdnImage(`/tiles/${image}`);
export const tokenSrc = (kind: "command" | "fleet", color: string) => commandTokenUrl(kind, color);
export const cardSrc = (name: string) => staticFile(`cards/${name}.webp`);
export const botSrc = (name: string) => staticFile(`bot/${name}`);
export const miscSrc = (name: string) => staticFile(`misc/${name}`);

/** Primary colours from the app's colors.ts (plus neon accents for glows). */
export const COLOR_HEX: Record<string, string> = {
  red: "#F00606", org: "#F0B406", ylw: "#F5F506", grn: "#06AF32", blu: "#064BCB", ppl: "#9206BA",
  pnk: "#F08AF0", blk: "#323232", tea: "#00EBFF", tqs: "#3FFF91", vpw: "#FF71CE", ryl: "#4169E1",
  hqn: "#4BD18C", mgm: "#FF5A1F", tan: "#ACA074", rbw: "#FF4FD8", gld: "#FF6401", eme: "#25FF2F",
  nvy: "#323CFF", gcr: "#05F0F0", sns: "#7881FF", rby: "#D42B4B", azr: "#8BBEF1", lvn: "#A9A7E7",
  jad: "#23C831", cpr: "#E58600", lme: "#B1E5A5", rse: "#D9A5E5", bld: "#E60028", eth: "#2368C8",
  gry: "#6E7A96", ptr: "#428C8C", spr: "#DBE7A7", pch: "#E8B8A7", frs: "#5A9664", plm: "#965A8C",
};
export const hexOf = (c: string) => G?.players.find((p) => p.color === c)?.hex ?? COLOR_HEX[c] ?? "#9aa4b8";

/** Neon palette used for the video's own graphics. */
export const NEON = {
  magenta: "#ff2bd6",
  cyan: "#22e6ff",
  yellow: "#ffe74a",
  red: "#ff3b4e",
  green: "#3dff8f",
  violet: "#8b5cff",
  white: "#f4f7ff",
  ink: "#05070f",
  activation: "rgba(165, 243, 252, 0.98)",
};

/** Discord palette. */
export const DISCORD = {
  bg: "#313338", sidebar: "#2b2d31", rail: "#1e1f22", input: "#383a40", text: "#dbdee1", muted: "#949ba4",
  header: "#f2f3f5", blurple: "#5865f2", green: "#248046", red: "#da373c", grey: "#4e5058",
  mentionBg: "rgba(88, 101, 242, 0.3)", mentionText: "#c9cdfb", highlight: "rgba(240, 178, 50, 0.08)",
  highlightBar: "#f0b232",
};
