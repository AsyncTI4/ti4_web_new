import { AFK_UNITS, HERO_UNITS, badgeSprite } from "../../castAssets";
import { CHOIR, DROP_ROWS } from "../../palette";
import { finaleSpriteKeys } from "../scenes/Finale";
import { G } from "./game";

/** Every [color, unit] sprite the video draws for the current cast. */
export function neededSprites(): [string, string][] {
  const keys = new Set<string>();
  const add = (color: string, unit: string) => keys.add(`${color}/${unit}`);
  for (const tile of G.tiles) for (const u of tile.units) add(u.color, badgeSprite(u.unit));
  HERO_UNITS.forEach((u) => add(G.hero.color, u));
  AFK_UNITS.forEach((u) => add(G.afk.color, u));
  DROP_ROWS.forEach((row) => row.colors.forEach((c) => add(c, row.unit)));
  CHOIR.forEach((c) => add(c, "dd"));
  finaleSpriteKeys().forEach((key) => keys.add(key));
  return [...keys].map((key) => key.split("/") as [string, string]);
}
