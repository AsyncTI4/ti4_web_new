import { cdnImage } from "@/entities/data/cdnImage";
import { tileAdjacencies } from "@/entities/data/tileAdjacencies";
import type { GameState, PlayerData } from "@/entities/data/types";
import { getPlayerFactionDisplayName } from "@/entities/game/playerUtils";
import type { GameData } from "@/entities/game/types";
import { calculateStatTilePositions, TILE_HEIGHT, TILE_WIDTH } from "@/entities/geometry/tilePositioning";
import { getColorAlias, resolvePrimaryRgb } from "@/entities/lookup/colors";
import { getFactionImage } from "@/entities/lookup/factions";
import { getLeaderById } from "@/entities/lookup/leaders";
import { getLeaderPortraitUrl } from "@/entities/lookup/leaderPortraits";
import { getPlanetData, getPlanetPositionsBySystemId } from "@/entities/lookup/planets";
import { getTileById } from "@/entities/lookup/systems";
import { getUnitSprite } from "@/shared/ui/Unit/unitSprites";
import { getUnitZIndex } from "@/utils/zIndexLayers";
import { COMMAND_SLOT, type CastPlayer, type CastTile, type CastUnit, type MusicVideoCast } from "@/music-video/cast";

/*
 * Turns the live game into the music video's cast:
 *  - the AFK opponent (and owner of the cruiser) is whoever's turn it is;
 *  - the googly-eyed destroyer belongs to the signed-in player, or a random other;
 *  - the board is the real map with every unit where the app placed it, except
 *    the destroyer's system and the cruiser's neighbouring system, which are
 *    cleared for the two leads unless the hero already has a lone destroyer;
 *  - six players are cast: extras are invented for small games, and big games
 *    keep the two leads and the next seats in order.
 */

const CX = TILE_WIDTH / 2;
const CY = TILE_HEIGHT / 2;

/** Fictional handles for invented seats. */
const INVENTED_NAMES = ["DestroyerDad", "WhatsUpDock", "WarSunTzu", "GreatCarrierReef", "Dreadnt", "MentakCurls", "SirLoungesALot"];
const INVENTED_FACTIONS = ["mentak", "sol", "letnev", "jolnar", "xxcha", "muaat", "saar", "sardakk", "l1z1x", "nekro", "hacan", "yssaril", "naalu", "argent", "empyrean", "winnu"];
const INVENTED_COLORS = ["red", "blu", "grn", "ylw", "ppl", "org", "pnk", "tea", "tqs", "vpw", "blk", "gry"];

type Rng = () => number;

const isSeated = (p: PlayerData) => {
  const name = (p.userName ?? "").trim().toLowerCase();
  return p.faction !== "neutral" && !name.endsWith(".deck") && !name.endsWith('.deck"');
};

const titleCase = (s: string) => s.replace(/(^|[\s_-])(\w)/g, (_, sep: string, c: string) => sep + c.toUpperCase());

function toHex(colorName: string) {
  const rgb = resolvePrimaryRgb(colorName);
  if (!rgb) return "#9aa4b8";
  return `#${[rgb.red, rgb.green, rgb.blue].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function phaseLabel(phase: GameState["phase"] | undefined) {
  const root = phase?.split(".")[0];
  return root === "strategy" || root === "agenda" || root === "status" ? `${root.toUpperCase()} PHASE` : "ACTION PHASE";
}

/** Whose turn it is: the live game state, then the per-player flag. */
export function findActivePlayer(data: GameData, gameState: GameState | undefined, playerColor?: string): PlayerData | undefined {
  const seated = data.playerData.filter(isSeated);
  const selected = playerColor ? seated.find((p) => p.color.toLowerCase() === playerColor && !p.eliminated) : undefined;
  if (selected) return selected;
  if (gameState?.phase === "finished" || gameState?.winner) return undefined;
  return (
    (gameState?.activePlayer ? seated.find((p) => p.color === gameState.activePlayer) : undefined) ??
    seated.find((p) => p.active && !p.eliminated)
  );
}

type Board = { tiles: CastTile[]; byPos: Map<string, CastTile>; planetTiles: Set<string>; homes: Map<string, string>; ox: number; oy: number };

function readBoard(data: GameData, playerIndex: Map<string, number>, colorOf: (faction: string) => string): Board {
  const all = Object.values(data.tiles);
  const mecatol = data.tiles["000"];
  let ox: number;
  let oy: number;
  if (mecatol) {
    ox = mecatol.properties.x + CX;
    oy = mecatol.properties.y + CY;
  } else {
    const xs = all.map((t) => t.properties.x);
    const ys = all.map((t) => t.properties.y);
    ox = (Math.min(...xs) + Math.max(...xs)) / 2 + CX;
    oy = (Math.min(...ys) + Math.max(...ys)) / 2 + CY;
  }
  const tiles: CastTile[] = [];
  const planetTiles = new Set<string>();
  const homes = new Map<string, string>();
  for (const tile of all) {
    const info = getTileById(tile.systemId);
    if (!info) continue;
    const planetIds = Object.keys(tile.planets);
    if (planetIds.length) planetTiles.add(tile.position);
    for (const id of planetIds) {
      const home = getPlanetData(id)?.factionHomeworld;
      if (home && !homes.has(home)) homes.set(home, tile.position);
    }
    const units: CastUnit[] = [];
    for (const stack of tile.entityPlacements) {
      if (stack.entityType !== "unit" || stack.count <= 0) continue;
      const color = colorOf(stack.faction);
      const sprite = getUnitSprite(color, stack.entityId);
      if (!sprite?.image || sprite.color === "shared") continue;
      units.push({
        unit: sprite.unit,
        count: stack.count,
        color,
        owner: playerIndex.get(stack.faction) ?? -1,
        x: stack.x,
        y: stack.y,
        z: getUnitZIndex(stack.entityId),
      });
    }
    tiles.push({
      pos: tile.position,
      x: tile.properties.x + CX - ox,
      y: tile.properties.y + CY - oy,
      image: cdnImage(`/tiles/${info.imagePath}`),
      units,
    });
  }
  return { tiles, byPos: new Map(tiles.map((t) => [t.pos, t])), planetTiles, homes, ox, oy };
}

/** Enough of the board is in play for a proper crowd of backup dancers. Starting positions come to
 * roughly 6-8 unit stacks a player; a few rounds in it's 15-25, spread over most of the map. */
export function musicVideoEligible(data: GameData | undefined, gameState: GameState | undefined, playerColor?: string): boolean {
  if (!data) return false;
  const seated = data.playerData.filter(isSeated);
  if (seated.length < 3 || !findActivePlayer(data, gameState, playerColor)) return false;
  const tiles = Object.values(data.tiles);
  let occupied = 0;
  let stacks = 0;
  for (const tile of tiles) {
    const units = tile.entityPlacements.filter((s) => s.entityType === "unit" && s.count > 0).length;
    if (units) occupied++;
    stacks += units;
  }
  return tiles.length >= 19 && stacks >= Math.max(60, 11 * seated.length) && occupied >= Math.max(12, Math.ceil(tiles.length * 0.4));
}

/** Where a lead sits in its system: clear of the planets and the command token slot, as near the
 * middle as that allows. The leads are drawn at about twice board size, so they need the room. */
function leadSpot(data: GameData, pos: string): { x: number; y: number } {
  const systemId = data.tiles[pos]?.systemId;
  const planets = systemId ? Object.values(getPlanetPositionsBySystemId(systemId)) : [];
  const blockers = [...planets.map((p) => ({ x: p.x, y: p.y, r: 70 })), { ...COMMAND_SLOT, r: 50 }];
  let best = { x: CX, y: CY };
  let bestScore = -Infinity;
  for (let dy = -70; dy <= 70; dy += 10) {
    for (let dx = -100; dx <= 100; dx += 10) {
      // keep the whole ship inside the hex's slanted sides
      if (Math.abs(dx) + Math.abs(dy) * 0.58 > 98) continue;
      const x = CX + dx;
      const y = CY + dy;
      const clear = Math.min(...blockers.map((b) => Math.hypot(b.x - x, b.y - y) - b.r));
      const score = Math.min(clear, 70) - Math.hypot(dx, dy) * 0.2;
      if (score > bestScore) {
        bestScore = score;
        best = { x, y };
      }
    }
  }
  return best;
}

const shuffle = <T,>(items: T[], rng: Rng) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export function buildMusicVideoCast(
  data: GameData,
  gameState: GameState | undefined,
  discordId: string | null,
  rng: Rng = Math.random,
  playerColor?: string,
): MusicVideoCast | null {
  const seated = data.playerData.filter(isSeated);
  const active = findActivePlayer(data, gameState, playerColor);
  if (!active) return null;

  const colorOf = (faction: string) => getColorAlias(data.factionColorMap[faction]?.color);
  const playerIndex = new Map(seated.map((p, i) => [p.faction, i]));
  const board = readBoard(data, playerIndex, colorOf);

  const players: CastPlayer[] = seated.map((p) => {
    const colorName = data.factionColorMap[p.faction]?.color ?? p.color;
    const statPositions = data.statTilePositions?.[p.faction];
    const stats = statPositions?.length
      ? calculateStatTilePositions(statPositions, data.ringCount, data.tilePositions).map((s) => ({
          x: s.x + CX - board.ox,
          y: s.y + CY - board.oy,
        }))
      : null;
    const displayName = getPlayerFactionDisplayName(p);
    const leaders: CastPlayer["leaders"] = {};
    for (const type of ["agent", "commander", "hero"] as const) {
      if (getLeaderById(`${p.faction}${type}`)) leaders[type] = getLeaderPortraitUrl(`${p.faction}${type}`);
    }
    return {
      name: p.userName?.trim() || p.flexibleDisplayName?.trim() || titleCase(p.faction),
      faction: p.faction,
      factionName: displayName.length <= 14 ? displayName : titleCase(p.faction),
      icon: getFactionImage(p.faction, p.factionImage, p.factionImageType) ?? cdnImage(`/factions/${p.faction}.png`),
      color: getColorAlias(colorName),
      hex: toHex(colorName),
      invented: false,
      vp: p.totalVps ?? 0,
      tg: p.tg ?? 0,
      comms: p.commodities ?? 0,
      commsMax: p.commoditiesTotal ?? 0,
      tactical: p.tacticalCC ?? 0,
      fleet: p.fleetCC ?? 0,
      strategic: p.strategicCC ?? 0,
      sc: p.scs?.[0] ?? null,
      stats,
      home: board.homes.get(p.faction) ?? null,
      leaders,
    };
  });

  const afk = seated.indexOf(active);
  const me = discordId ? seated.findIndex((p) => p.discordId === discordId && !p.eliminated) : -1;
  // If it's the viewer's own turn, the song is about them: someone else owns the destroyer.
  const others = seated.map((_, i) => i).filter((i) => i !== afk && !seated[i].eliminated);
  if (!others.length) return null;
  const hero = me >= 0 && me !== afk ? me : others[Math.floor(rng() * others.length)];

  // Six seats: both leads, then the rest in seat order; invent the stragglers.
  const pool = seated.map((_, i) => i).filter((i) => !seated[i].eliminated || i === afk);
  const keep = new Set([afk, hero]);
  for (const i of pool) if (keep.size < 6) keep.add(i);
  const six = [...keep].sort((a, b) => a - b);
  const usedNames = new Set(players.map((p) => p.name.toLowerCase()));
  const usedFactions = new Set(players.map((p) => p.faction));
  const usedColors = new Set(players.map((p) => p.color));
  const usedScs = new Set(players.map((p) => p.sc));
  while (six.length < 6) {
    const name = INVENTED_NAMES.find((n) => !usedNames.has(n.toLowerCase())) ?? `Player${six.length + 1}`;
    const faction = INVENTED_FACTIONS.find((f) => !usedFactions.has(f)) ?? "mentak";
    const color = INVENTED_COLORS.find((c) => !usedColors.has(c)) ?? "gry";
    const sc = [1, 2, 3, 4, 5, 6, 7, 8].find((n) => !usedScs.has(n)) ?? null;
    usedNames.add(name.toLowerCase());
    usedFactions.add(faction);
    usedColors.add(color);
    usedScs.add(sc);
    const leaders: CastPlayer["leaders"] = {};
    for (const type of ["agent", "commander", "hero"] as const) {
      if (getLeaderById(`${faction}${type}`)) leaders[type] = getLeaderPortraitUrl(`${faction}${type}`);
    }
    players.push({
      name, faction, factionName: titleCase(faction), icon: cdnImage(`/factions/${faction}.png`), color, hex: toHex(color),
      invented: true, vp: Math.floor(rng() * 4), tg: Math.floor(rng() * 6), comms: 0, commsMax: 3,
      tactical: 2, fleet: 3, strategic: 2, sc, stats: null, home: null, leaders,
    });
    six.push(players.length - 1);
  }

  // The leads' systems: ordinary space only. Never an anomaly (supernova, nebula, asteroid
  // field, gravity rift, scar), a hyperlane, Mecatol Rex or a home system.
  const homeSet = new Set(board.homes.values());
  const isAnomaly = (pos: string) => {
    const info = getTileById(data.tiles[pos].systemId);
    return data.tiles[pos].hasAnomaly || !!(info?.isSupernova || info?.isNebula || info?.isAsteroidField || info?.isGravityRift || info?.isScar);
  };
  const ordinary = (pos: string) =>
    pos !== "000" && !homeSet.has(pos) && !isAnomaly(pos) && !getTileById(data.tiles[pos].systemId)?.isHyperlane;
  const neighbours = (pos: string) => (tileAdjacencies[pos] ?? []).filter((p): p is string => !!p && board.byPos.has(p) && ordinary(p));
  const isEmpty = (pos: string) => board.byPos.get(pos)!.units.length === 0;
  const planetless = (pos: string) => (board.planetTiles.has(pos) ? 0 : 2);
  const lone = (pos: string, owner: number, unit: string) => {
    const units = board.byPos.get(pos)!.units;
    return units.length === 1 && units[0].owner === owner && units[0].unit === unit && units[0].count === 1;
  };
  const pickBest = (candidates: string[], score: (pos: string) => number) => {
    const shuffled = shuffle(candidates, rng);
    return shuffled.sort((a, b) => score(b) - score(a))[0];
  };

  const candidates = board.tiles.map((t) => t.pos).filter((pos) => ordinary(pos) && neighbours(pos).length);
  let heroPos: string | undefined = shuffle(candidates.filter((pos) => lone(pos, hero, "dd")), rng)[0];
  if (!heroPos) {
    const empty = candidates.filter(isEmpty);
    heroPos = empty.length
      ? pickBest(empty, (pos) => planetless(pos) + (neighbours(pos).some(isEmpty) ? 2 : 0))
      : pickBest(candidates, (pos) => -board.byPos.get(pos)!.units.length);
  }
  if (!heroPos) return null;

  const around = neighbours(heroPos);
  const loneCruiser = around.find((pos) => lone(pos, afk, "ca"));
  const crushPos =
    loneCruiser ?? pickBest(around, (pos) => (isEmpty(pos) ? 10 : -board.byPos.get(pos)!.units.length) + planetless(pos));
  if (!crushPos) return null;

  // Each lead is alone in its system (found that way, or the system is cleared for it) and moved to
  // the system's most open spot.
  const heroTile = board.byPos.get(heroPos)!;
  const crushTile = board.byPos.get(crushPos)!;
  heroTile.units = [{ unit: "dd", count: 1, color: players[hero].color, owner: hero, ...leadSpot(data, heroPos), z: getUnitZIndex("dd") }];
  crushTile.units = [{ unit: "ca", count: 1, color: players[afk].color, owner: afk, ...leadSpot(data, crushPos), z: getUnitZIndex("ca") }];
  const worldOf = (tile: CastTile) => ({ x: tile.x + tile.units[0].x - CX, y: tile.y + tile.units[0].y - CY });

  return {
    game: data.gameName,
    round: data.gameRound,
    phase: phaseLabel(gameState?.phase),
    vpTarget: data.vpsToWin || 10,
    players,
    six,
    afk,
    hero,
    heroPos,
    crushPos,
    heroAt: worldOf(heroTile),
    crushAt: worldOf(crushTile),
    tiles: board.tiles,
  };
}
