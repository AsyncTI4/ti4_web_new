/*
 * The live game, as the music video needs it. The app builds this from its game
 * data when the button is pressed and posts it to the isolated video page, so it
 * must stay plain JSON. Shared by both bundles: keep it free of app imports.
 */

export type CastUnit = {
  /** Sprite id from the colored unit sheet: fs dn cv ca ws dd mf gf sd pd ff monument. */
  unit: string;
  count: number;
  /** Sprite colour alias (red, ylw, mgm...). */
  color: string;
  /** Index into MusicVideoCast.players, or -1 when the owner isn't a seated player. */
  owner: number;
  /** Stack anchor in tile-local px (345x299 box, top-left origin), as the app placed it. */
  x: number;
  y: number;
  /** The app's stacking priority (getUnitZIndex). */
  z: number;
};

export type CastTile = {
  pos: string;
  /** Tile centre in world px; the board centre (Mecatol) is 0,0. */
  x: number;
  y: number;
  image: string;
  units: CastUnit[];
};

export type CastPlayer = {
  name: string;
  faction: string;
  factionName: string;
  icon: string;
  color: string;
  /** Primary colour as #rrggbb. */
  hex: string;
  /** Made up to fill a six-seat table. Invented players have no tiles or stat area. */
  invented: boolean;
  vp: number;
  tg: number;
  comms: number;
  commsMax: number;
  tactical: number;
  fleet: number;
  strategic: number;
  sc: number | null;
  /** World centres of the three player-area hexes, when the map has them. */
  stats: { x: number; y: number }[] | null;
  /** Ring position of the home system. */
  home: string | null;
  leaders: { agent?: string; commander?: string; hero?: string };
};

export type MusicVideoCast = {
  game: string;
  round: number;
  /** "ACTION PHASE", "STRATEGY PHASE"... */
  phase: string;
  vpTarget: number;
  /** Every seated player (board order), then invented players. */
  players: CastPlayer[];
  /** The six players the video casts, in seat order. */
  six: number[];
  /** Whose turn it is: the AFK opponent who owns the cruiser. */
  afk: number;
  /** Owns the googly-eyed destroyer. */
  hero: number;
  heroPos: string;
  crushPos: string;
  /** World positions of the destroyer and the cruiser. */
  heroAt: { x: number; y: number };
  crushAt: { x: number; y: number };
  tiles: CastTile[];
};
