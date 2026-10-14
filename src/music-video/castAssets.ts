/*
 * CDN URLs for the game-specific art the music video shows. Shared by the app's
 * idle prefetcher (which only warms the HTTP cache) and the video page (which
 * decodes them before playing).
 */
import { cdnImage } from "@/entities/data/cdnImage";
import type { MusicVideoCast } from "./cast";

/* Unit sprites pre-scaled 4x (nearest neighbour) by the bot repo's
   scripts/generate_unit_sprites_x4.py, published as units/x4/<color>_<unit>.webp.
   VITE_TI4MV_SPRITE_BASE points local testing at an unpublished copy. */
const SPRITE_BASE = (import.meta.env.VITE_TI4MV_SPRITE_BASE as string | undefined) ?? "https://images.asyncti4.com/units/x4";

/** The crisp 4x sprite. */
export const unitSpriteUrl = (color: string, unit: string) => `${SPRITE_BASE}/${color}_${unit}.webp?v=4`;
/** The native-size sprite, for colours or units without a 4x copy. */
export const unitSpriteFallbackUrl = (color: string, unit: string) => cdnImage(`/units/${color}_${unit}.png`);

export const commandTokenUrl = (kind: "command" | "fleet", color: string) => cdnImage(`/command_token/${kind}_${color}.png`);

/** Ships the dance numbers draw in arbitrary colours (Drop rows, chorus choir, finale). */
export const DANCE_UNITS = ["ws", "fs", "dn", "cv", "ca", "dd"] as const;
/** Sprites drawn in the hero's colour, beyond whatever they have on the board. */
export const HERO_UNITS = ["dd_eyes", "dd", "cv", "dn", "ws", "ff"] as const;
/** Sprites drawn in the AFK player's colour. */
export const AFK_UNITS = ["ca", "fs"] as const;
/** Board units drawn as a count badge. */
export const badgeSprite = (unit: string) => (unit === "ff" ? "tkn_ff" : unit === "gf" ? "tkn_gf" : unit);

/** Image URLs worth warming before the video opens. A superset: the page decodes only what it uses. */
export function castImageUrls(cast: MusicVideoCast, decorColors: readonly string[]): string[] {
  const urls = new Set<string>();
  const sprite = (color: string, unit: string) => urls.add(unitSpriteUrl(color, unit));
  for (const tile of cast.tiles) {
    urls.add(tile.image);
    for (const u of tile.units) sprite(u.color, badgeSprite(u.unit));
  }
  for (const p of cast.players) {
    urls.add(p.icon);
    Object.values(p.leaders).forEach((url) => url && urls.add(url));
    if (p.stats) {
      urls.add(commandTokenUrl("command", p.color));
      urls.add(commandTokenUrl("fleet", p.color));
    }
  }
  // the destroyer's owner is picked per play, so warm every seat's hero set
  for (const p of cast.players) if (!p.invented) HERO_UNITS.forEach((u) => sprite(p.color, u));
  const afk = cast.players[cast.afk];
  AFK_UNITS.forEach((u) => sprite(afk.color, u));
  urls.add(commandTokenUrl("command", afk.color));
  const colors = new Set([...decorColors, ...cast.six.map((i) => cast.players[i].color)]);
  colors.forEach((c) => DANCE_UNITS.forEach((u) => sprite(c, u)));
  return [...urls];
}
