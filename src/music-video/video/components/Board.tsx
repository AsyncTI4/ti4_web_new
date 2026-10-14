import React from "react";
import { Img } from "../lib/Img";
import type { CastTile, CastUnit } from "../../cast";
import { UnitType, miscSrc, tokenSrc, unitSrc } from "../lib/assets";
import { G } from "../lib/game";
import { TILE_H, TILE_W, hexPoints } from "../lib/hex";
import { Ship } from "./Ship";

export type DanceFn = (info: { pos: string; index: number; unit: UnitType; x: number; y: number }) => string;

/** Fighter / infantry count badge: the app's tkn_* pill sprite with a stroked Slider numeral. */
export const UnitBadge: React.FC<{ color: string; unit?: "tkn_ff" | "tkn_gf"; count: number; scale?: number }> = ({ color, unit = "tkn_ff", count, scale = 1 }) => (
  <div style={{ position: "relative", width: 70 * scale, height: 35 * scale }}>
    <Img src={unitSrc(color, unit)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    <div
      style={{
        position: "absolute", right: 10 * scale, top: "50%", transform: "translateY(-52%)", width: 24 * scale,
        textAlign: "center", fontFamily: "Slider", fontSize: 24 * scale, lineHeight: 1, color: "white",
        WebkitTextStroke: `${4 * scale}px black`, paintOrder: "stroke fill",
      }}
    >
      {count}
    </div>
  </div>
);

/** Offset of the i-th unit in a stack (the app's calculateUnitArrangement: a -10/+10 splay, mechs in a 3x2 grid). */
function arrangement(unit: string, index: number, count: number): [number, number] {
  if (unit !== "mf") return [-index * 10, index * 10];
  const spacing = 20;
  const column = Math.floor(index / 6);
  const slots = [[-spacing, -spacing / 2], [0, -spacing / 2], [spacing, -spacing / 2], [-spacing, spacing / 2], [0, spacing / 2], [spacing, spacing / 2]];
  const used = slots.slice(0, Math.min(count - column * 6, 6));
  const cx = used.reduce((s, p) => s + p[0], 0) / used.length;
  const cy = used.reduce((s, p) => s + p[1], 0) / used.length;
  const [sx, sy] = slots[index % 6];
  return [column * spacing * 3 + sx - cx, sy - cy];
}

/** One placed stack, centred on its world anchor (x, y). */
export const StackView: React.FC<{ stack: Pick<CastUnit, "unit" | "count" | "color">; x: number; y: number; transform?: string; scale?: number }> = ({ stack, x, y, transform = "", scale = 1 }) => {
  if (stack.unit === "ff" || stack.unit === "gf") {
    return (
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 35 * scale}px, ${y - 17.5 * scale}px) ${transform}` }}>
        <UnitBadge color={stack.color} unit={stack.unit === "ff" ? "tkn_ff" : "tkn_gf"} count={stack.count} scale={scale} />
      </div>
    );
  }
  const items = [];
  for (let i = stack.count - 1; i >= 0; i--) {
    const [dx, dy] = arrangement(stack.unit, i, stack.count);
    items.push(<Ship key={i} color={stack.color} unit={stack.unit as UnitType} x={x + dx * scale} y={y + dy * scale} scale={scale} transform={transform} />);
  }
  return <>{items}</>;
};

/** Units in paint order: the app's z priority, then top to bottom. Cached: the board is fixed for a play. */
const sortCache = new WeakMap<CastTile, CastUnit[]>();
function sortedUnits(tile: CastTile) {
  let units = sortCache.get(tile);
  if (!units) {
    units = [...tile.units].sort((a, b) => a.z - b.z || a.y - b.y);
    sortCache.set(tile, units);
  }
  return units;
}

/* The static layers are memoised on primitive props, so a frame where only the units dance
   (most of them) skips re-rendering forty tiles, their labels and the player areas. */
const TileImg = React.memo(({ src, x, y }: { src: string; x: number; y: number }) => (
  <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: TILE_W, height: TILE_H, transform: `translate(${x - TILE_W / 2}px, ${y - TILE_H / 2}px)` }} />
));

/** Tiles sharing a filter are drawn under one filtered wrapper: one filter pass per group
 * instead of one per tile (a dimmed board is ~40 separate filter surfaces otherwise). */
const TileGroup: React.FC<{ tiles: CastTile[]; filter?: string }> = ({ tiles, filter }) => (
  <div style={{ position: "absolute", left: 0, top: 0, filter }}>
    {tiles.map((tile) => <TileImg key={tile.pos} src={tile.image} x={tile.x} y={tile.y} />)}
  </div>
);

const TileLabels = React.memo(({ tiles }: { tiles: CastTile[] }) => (
  <>
    {tiles.map((tile) =>
      /^\d+$/.test(tile.pos) ? (
        <div
          key={tile.pos}
          style={{
            position: "absolute", left: 0, top: 0, transform: `translate(${tile.x + 42}px, ${tile.y + 104}px)`,
            fontFamily: "Slider", fontSize: 26, color: "white", WebkitTextStroke: "4px black", paintOrder: "stroke fill",
          }}
        >
          {tile.pos}
        </div>
      ) : null,
    )}
  </>
));

const RimHex = React.memo(({ x, y, a, color }: { x: number; y: number; a: number; color: string }) => (
  <g transform={`translate(${x} ${y})`} opacity={Math.min(1, a)}>
    <polygon points={hexPoints(0.985)} fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={22} strokeLinejoin="round" />
    <polygon points={hexPoints(0.985)} fill="none" stroke={color} strokeOpacity={0.45} strokeWidth={10} strokeLinejoin="round" />
    <polygon points={hexPoints(0.985)} fill="none" stroke="white" strokeOpacity={0.9} strokeWidth={3} strokeLinejoin="round" />
  </g>
));

type BoardProps = {
  /** Systems whose units are left off (the leads' systems in shots that draw them by hand). */
  hideUnits?: Set<string>;
  dance?: DanceFn;
  /** Rim glow intensity 0..1 per position, plus colour. */
  rim?: (pos: string) => { a: number; color: string } | null;
  showStats?: boolean;
  showLabels?: boolean;
  /** Positions hidden entirely. */
  hidden?: Set<string>;
  tileFilter?: (pos: string) => string | undefined;
  /** Player-area status override, keyed by player index. */
  statusText?: Record<number, { text: string; color: string }>;
  children?: React.ReactNode;
};

function groupByFilter(tiles: CastTile[], tileFilter: (pos: string) => string | undefined) {
  const groups = new Map<string | undefined, CastTile[]>();
  for (const tile of tiles) {
    const filter = tileFilter(tile.pos);
    const group = groups.get(filter);
    if (group) group.push(tile);
    else groups.set(filter, [tile]);
  }
  return [...groups];
}

const visibleCache = new Map<string, CastTile[]>();
/** Tiles minus the hidden ones, stable between frames so memoised layers can skip. */
function visibleTiles(hidden?: Set<string>) {
  const key = hidden ? [...hidden].sort().join(",") : "";
  let tiles = visibleCache.get(key);
  if (!tiles || (tiles.length && !G.tiles.includes(tiles[0]))) {
    tiles = G.tiles.filter((t) => !hidden?.has(t.pos));
    visibleCache.set(key, tiles);
  }
  return tiles;
}

export const Board: React.FC<BoardProps> = ({
  hideUnits, dance, rim, showStats = true, showLabels = true, hidden, tileFilter, statusText, children,
}) => {
  const tiles = visibleTiles(hidden);
  return (
    <>
      {showStats && <StatHexes statusText={statusText} />}
      {tileFilter ? (
        // keyed by membership, not filter text, so a filter that changes every frame doesn't remount tiles
        groupByFilter(tiles, tileFilter).map(([filter, group]) => <TileGroup key={group[0].pos} tiles={group} filter={filter} />)
      ) : (
        <TileGroup tiles={tiles} />
      )}
      {rim && (
        <svg style={{ position: "absolute", left: -4000, top: -4000, width: 8000, height: 8000, overflow: "visible", pointerEvents: "none" }} viewBox="-4000 -4000 8000 8000">
          {tiles.map((tile) => {
            const r = rim(tile.pos);
            if (!r || r.a <= 0.01) return null;
            return <RimHex key={tile.pos} x={tile.x} y={tile.y} a={r.a} color={r.color} />;
          })}
        </svg>
      )}
      {showLabels && <TileLabels tiles={tiles} />}
      {tiles.map((tile) => {
        if (hideUnits?.has(tile.pos) || !tile.units.length) return null;
        return (
          <React.Fragment key={`u${tile.pos}`}>
            {sortedUnits(tile).map((s, i) => {
              const x = tile.x + s.x - TILE_W / 2;
              const y = tile.y + s.y - TILE_H / 2;
              return <StackView key={i} stack={s} x={x} y={y} transform={dance?.({ pos: tile.pos, index: i, unit: s.unit as UnitType, x, y })} />;
            })}
          </React.Fragment>
        );
      })}
      {children}
    </>
  );
};

/** The dashed player-area hexes (PlayerStatsHex / PlayerStatsArea). */
type StatusText = Record<number, { text: string; color: string }>;
const sameStatus = (a?: StatusText, b?: StatusText) => a === b || JSON.stringify(a) === JSON.stringify(b);
export const StatHexes = React.memo(({ statusText }: { statusText?: StatusText }) => (
  <>
    {G.players.map((player, index) => {
      if (!player.stats || player.stats.length < 3) return null;
      const active = index === G.afkIndex;
      const hex = player.hex;
      const [p1, p2, p3] = player.stats;
      const status = statusText?.[index] ?? (active ? { text: "ACTIVE", color: "#51cf66" } : null);
      return (
        <React.Fragment key={index}>
          {[p1, p2, p3].map((c, i) => (
            <svg key={i} style={{ position: "absolute", left: c.x - 180, top: c.y - 160, width: 360, height: 320, overflow: "visible" }} viewBox="-180 -160 360 320">
              <polygon points={hexPoints(0.98)} fill="rgba(20, 30, 48, 0.92)" />
              {active && <polygon points={hexPoints(0.98)} fill="rgba(34, 197, 94, 0.3)" />}
              <polygon points={hexPoints(0.98)} fill="none" stroke={hex} strokeOpacity={0.8} strokeWidth={4} strokeDasharray="20 8" />
            </svg>
          ))}
          <div style={{ position: "absolute", left: p1.x - 140, top: p1.y - 140, width: 280, height: 280, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Img src={player.icon} style={{ position: "absolute", inset: 30, width: 220, height: 220, opacity: 0.3, objectFit: "contain" }} />
            {status && (
              <div style={{ position: "absolute", top: -6, fontFamily: "Slider", fontSize: 24, color: status.color, textShadow: "0 2px 4px rgba(0,0,0,.8)" }}>{status.text}</div>
            )}
            <div style={{ fontFamily: "Slider", fontSize: 28, color: "rgba(255,255,255,.9)", textShadow: "0 2px 4px rgba(0,0,0,.8)", textTransform: "uppercase", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.factionName}</div>
            <div style={{ fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: 21, color: "rgba(255,255,255,.8)", textShadow: "0 2px 4px rgba(0,0,0,.8)", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</div>
            {player.sc !== null && <div style={{ fontFamily: "Slider", fontSize: 64, lineHeight: 1, color: hex, textShadow: "0 2px 6px rgba(0,0,0,.9)", margin: "4px 0" }}>{player.sc}</div>}
            <div style={{ fontFamily: "Slider", fontSize: 22, color: "rgba(255,255,255,.9)", textShadow: "0 2px 4px rgba(0,0,0,.8)" }}>{player.vp} / {G.cast.vpTarget} VP</div>
          </div>
          <div style={{ position: "absolute", left: p2.x - 80, top: p2.y - 70, display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            {([["command", player.tactical], ["fleet", player.fleet], ["command", player.strategic]] as const).map(([kind, n], r) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ fontFamily: "Slider", fontSize: 24, color: "white", width: 22 }}>{n}</div>
                <div style={{ position: "relative", width: 40 + 20 * Math.max(0, Math.min(n, 8) - 1), height: 36 }}>
                  {Array.from({ length: Math.max(1, Math.min(n, 8)) }).map((_, k) => (
                    <Img key={k} src={tokenSrc(kind, player.color)} style={{ position: "absolute", left: k * 20, top: 0, width: 40, height: 36, opacity: n ? 1 : 0.25 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: p3.x - 85, top: p3.y - 30, display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Img src={miscSrc("tg.png")} style={{ width: 34, height: 34 }} />
              <span style={{ fontFamily: "Slider", fontSize: 24, color: "white" }}>{player.tg}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Img src={miscSrc("comms.png")} style={{ width: 34, height: 32 }} />
              <span style={{ fontFamily: "Slider", fontSize: 24, color: "white" }}>{player.comms}/{player.commsMax}</span>
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </>
), (a, b) => sameStatus(a.statusText, b.statusText));
