/*
 * A stand-in cast for opening the video page on its own (development and the
 * capture harness): the reference game's board with fictional players.
 */
import { cdnImage } from "@/entities/data/cdnImage";
import { getLeaderPortraitUrl } from "@/entities/lookup/leaderPortraits";
import mapData from "../video/data/map.json";
import { TILE_H, TILE_W, hexCenter } from "../video/lib/hex";
import type { CastPlayer, CastTile, CastUnit, MusicVideoCast } from "../cast";

const COLORS: Record<string, [string, string]> = {
  hacan: ["ylw", "#f5f506"], yssaril: ["red", "#f00606"], naalu: ["tqs", "#3fff91"],
  firmament: ["ryl", "#4169e1"], argent: ["pnk", "#f08af0"], empyrean: ["vpw", "#ff71ce"],
};
const HANDLES: Record<string, string> = {
  hacan: "SirLoungesALot", yssaril: "DestroyerDad", naalu: "WhatsUpDock",
  firmament: "WarSunTzu", argent: "GreatCarrierReef", empyrean: "Dreadnt",
};
const Z: Record<string, number> = { ff: 110, mf: 120, gf: 125, sd: 130, pd: 140, dd: 150, cv: 160, ca: 170, dn: 180, fs: 190, ws: 200 };

type MapTile = (typeof mapData.tiles)[number];

/** Space slots clear of planets (tile-local, top-left origin). */
function spaceSlots(tile: MapTile, n: number) {
  const planets = tile.planets.map((p) => ({ x: p.x, y: p.y }));
  const cands = [{ x: TILE_W / 2, y: TILE_H / 2 }];
  for (const r of [62, 100]) for (let a = 0; a < 360; a += 30) {
    const rad = ((a + (r === 100 ? 15 : 0)) * Math.PI) / 180;
    cands.push({ x: TILE_W / 2 + Math.cos(rad) * r * 1.12, y: TILE_H / 2 + Math.sin(rad) * r * 0.92 });
  }
  const chosen: { x: number; y: number }[] = [];
  for (let k = 0; k < n; k++) {
    let best = cands[0];
    let bestScore = -Infinity;
    for (const c of cands) {
      if (chosen.includes(c)) continue;
      const dp = planets.length ? Math.min(...planets.map((p) => Math.hypot(p.x - c.x, p.y - c.y))) : 200;
      const dc = chosen.length ? Math.min(...chosen.map((p) => Math.hypot(p.x - c.x, p.y - c.y))) : 200;
      const score = Math.min(dp - 62, (dc - 58) * 1.4) - Math.hypot(c.x - TILE_W / 2, c.y - TILE_H / 2) * 0.05;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    chosen.push(best);
  }
  return chosen;
}

export function defaultCast(): MusicVideoCast {
  const order = mapData.players.map((p) => p.faction);
  const index = new Map(order.map((f, i) => [f, i]));
  const colorOf = (f: string) => COLORS[f]?.[0] ?? "gry";
  const tiles: CastTile[] = mapData.tiles.filter((t) => t.pos !== "tl").map((t) => {
    const units: CastUnit[] = [];
    const space = t.space.flatMap((s) => s.units.filter((u) => u.count > 0).map((u) => ({ faction: s.faction, ...u })));
    spaceSlots(t, space.length).forEach((slot, i) => {
      const u = space[i];
      units.push({ unit: u.unit, count: u.count, color: colorOf(u.faction), owner: index.get(u.faction) ?? -1, ...slot, z: Z[u.unit] ?? 53 });
    });
    for (const planet of t.planets) {
      planet.ground.flatMap((g) => g.units.map((u) => ({ faction: g.faction, ...u }))).forEach((u, i) => {
        units.push({ unit: u.unit, count: u.count, color: colorOf(u.faction), owner: index.get(u.faction) ?? -1, x: planet.x + (i % 2 ? 26 : -26), y: planet.y + 30 + i * 6, z: Z[u.unit] ?? 53 });
      });
    }
    const c = hexCenter(t.pos);
    return { pos: t.pos, x: c.x, y: c.y, image: cdnImage(`/tiles/${t.image}`), units };
  });
  // the leads stand alone in their systems
  const byPos = new Map(tiles.map((t) => [t.pos, t]));
  byPos.get("102")!.units = [{ unit: "dd", count: 1, color: "red", owner: index.get("yssaril")!, x: TILE_W / 2, y: TILE_H / 2, z: 150 }];
  byPos.get("203")!.units = [{ unit: "ca", count: 1, color: "ylw", owner: index.get("hacan")!, x: TILE_W / 2, y: TILE_H / 2, z: 170 }];

  const stats = mapData.statTilePositions as Record<string, string[]>;
  const players: CastPlayer[] = mapData.players.map((p, i) => ({
    name: HANDLES[p.faction] ?? p.faction,
    faction: p.faction,
    factionName: p.faction.charAt(0).toUpperCase() + p.faction.slice(1),
    icon: cdnImage(`/factions/${p.faction}.png`),
    color: colorOf(p.faction),
    hex: COLORS[p.faction]?.[1] ?? "#9aa4b8",
    invented: false,
    vp: p.vps, tg: p.tg, comms: p.comms, commsMax: p.commsTotal,
    tactical: p.tactical, fleet: p.fleet, strategic: p.strategic,
    sc: [2, 3, 4, 5, 8, 1][i],
    stats: stats[p.faction]?.map(hexCenter) ?? null,
    home: p.faction === "hacan" ? "304" : null,
    leaders: { agent: getLeaderPortraitUrl(`${p.faction}agent`), commander: getLeaderPortraitUrl(`${p.faction}commander`), hero: getLeaderPortraitUrl(`${p.faction}hero`) },
  }));
  return {
    game: "pbd1337",
    round: 3,
    phase: "ACTION PHASE",
    vpTarget: 10,
    players,
    six: players.map((_, i) => i),
    afk: index.get("hacan")!,
    hero: index.get("yssaril")!,
    heroPos: "102",
    crushPos: "203",
    heroAt: hexCenter("102"),
    crushAt: hexCenter("203"),
    tiles,
  };
}
