import { getTileById } from "@/domains/map/model/mapgen/systems";
import { getTokenData } from "@/entities/lookup/tokens";
import type { Tile } from "@/app/providers/context/types";

/**
 * One movement-relevant fact about a system, with the rule that governs it.
 *
 * The map draws these features as art and trusts the player to know the rules;
 * the dossier is where they get named and explained. Rule text is authored
 * from the LRR (base anomalies, wormholes, frontier), Thunder's Edge rulings
 * (ingress / entropic scar), and the async homebrew borders — the homebrew
 * summaries are best-effort and flagged for audit in the PR.
 */
export type SystemFeature = {
  id: string;
  kind: "anomaly" | "wormhole" | "token" | "border";
  name: string;
  /** Token sprite under /tokens/, when the feature has one. */
  imagePath?: string;
  /** Single glyph drawn as a medallion (wormhole letters). */
  glyph?: string;
  rule: string;
  /** Supplementary line — wormhole link positions, border edge, etc. */
  detail?: string;
};

const ANOMALY_RULES: Record<string, { name: string; rule: string }> = {
  asteroidField: {
    name: "Asteroid Field",
    rule: "A ship cannot move into or through an asteroid field. Antimass Deflectors lifts this restriction.",
  },
  nebula: {
    name: "Nebula",
    rule: "A ship can only move into a nebula if it is the active system, and never through one. A ship that begins its movement here treats its move value as 1, and if space combat occurs, the defender applies +1 to each combat roll.",
  },
  supernova: {
    name: "Supernova",
    rule: "A ship cannot move into or through a supernova. The Embers of Muaat's Magmus Reactor is the known exception.",
  },
  gravityRift: {
    name: "Gravity Rift",
    rule: "A ship moving out of or through a gravity rift applies +1 to its move value, then rolls a die as it exits: on 1–3 the ship, and everything it transports, is removed from the board.",
  },
  entropicScar: {
    name: "Entropic Scar",
    rule: "Unit abilities cannot be used by or against units here (text abilities still function), and wormholes cannot be placed in this system. At the start of the status phase, a player with ships here may spend a strategy token to gain one of their faction technologies, ignoring its prerequisites.",
  },
};

const WORMHOLE_GLYPHS: Record<string, string> = {
  ALPHA: "α",
  BETA: "β",
  GAMMA: "γ",
  DELTA: "δ",
  EPSILON: "ε",
  ETA: "η",
  IOTA: "ι",
  THETA: "θ",
  KAPPA: "κ",
  ZETA: "ζ",
};

const TOKEN_RULES: Record<
  string,
  { name: string; rule: string; imagePath?: string }
> = {
  frontier: {
    name: "Frontier Token",
    rule: "An unexplored reach of space. A player with Dark Energy Tap (or the Empyrean) explores this token when they activate the system with one or more of their ships in it.",
    imagePath: "token_frontier.png",
  },
  ingress: {
    name: "Ingress",
    rule: "A tear leading into the Fracture. This system is adjacent to every egress system inside the Fracture — but never to another ingress.",
    imagePath: "token_ingress.png",
  },
  custodian: {
    name: "Custodians",
    rule: "The Custodians still hold Mecatol Rex. A player must spend 6 influence to commit ground forces here; doing so removes the token and scores a victory point.",
    imagePath: "token_custodian.png",
  },
  sleeper: {
    name: "Sleeper Token",
    rule: "A Titans of Ul sleeper waits beneath the surface. The Titans may awaken it, replacing it with their PDS or units.",
    imagePath: "token_sleeper.png",
  },
};

const BORDER_RULES: Record<string, { name: string; rule: string }> = {
  void_tether: {
    name: "Void Tether",
    rule: "The systems on either side of this edge are treated as not adjacent — ships cannot move directly across it.",
  },
  spatial_tear: {
    name: "Spatial Tear",
    rule: "A rupture along this border. Movement directly across this edge is blocked.",
  },
};

/** Hex sides in tile-direction order, for naming a border anomaly's edge. */
const EDGE_NAMES = ["N", "NE", "SE", "S", "SW", "NW"];

function titleCaseFromId(id: string): string {
  return id
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function wormholesOnTile(tile: Tile): string[] {
  const tileData = getTileById(tile.systemId);
  const printed = tileData?.wormholes ?? [];
  const fromTokens = tile.tokens.flatMap(
    (tokenId) => getTokenData(tokenId)?.wormholes ?? []
  );

  return [...new Set([...printed, ...fromTokens].map((w) => w.toUpperCase()))];
}

/** Ring positions of every other system sharing this wormhole type. */
function linkedPositions(
  wormholeType: string,
  ownPosition: string,
  allTiles: Record<string, Tile>
): string[] {
  return Object.values(allTiles)
    .filter(
      (tile) =>
        tile.position !== ownPosition &&
        wormholesOnTile(tile).includes(wormholeType)
    )
    .map((tile) => tile.position)
    .sort();
}

export function getSystemFeatures(
  tile: Tile,
  allTiles: Record<string, Tile>
): SystemFeature[] {
  const tileData = getTileById(tile.systemId);
  const features: SystemFeature[] = [];

  if (tileData?.isAsteroidField) {
    features.push({ id: "asteroidField", kind: "anomaly", ...ANOMALY_RULES.asteroidField });
  }
  if (tileData?.isNebula) {
    features.push({ id: "nebula", kind: "anomaly", ...ANOMALY_RULES.nebula });
  }
  if (tileData?.isSupernova) {
    features.push({ id: "supernova", kind: "anomaly", ...ANOMALY_RULES.supernova });
  }
  if (tileData?.isGravityRift) {
    features.push({ id: "gravityRift", kind: "anomaly", ...ANOMALY_RULES.gravityRift });
  }

  for (const wormholeType of wormholesOnTile(tile)) {
    const glyph = WORMHOLE_GLYPHS[wormholeType] ?? wormholeType.toLowerCase();
    const links = linkedPositions(wormholeType, tile.position, allTiles);
    features.push({
      id: `wormhole-${wormholeType}`,
      kind: "wormhole",
      glyph,
      name: `${glyph.length === 1 ? wormholeType.charAt(0) + wormholeType.slice(1).toLowerCase() : glyph} Wormhole`,
      rule: "Systems that contain matching wormholes are adjacent to each other for all purposes, including movement and neighboring effects.",
      detail:
        links.length > 0
          ? `Linked to ${links.join(" · ")}`
          : "No matching wormhole is on the board.",
    });
  }

  for (const tokenId of tile.tokens) {
    const tokenData = getTokenData(tokenId);
    // Wormhole tokens already surfaced above; skip their token entry.
    if (tokenData?.wormholes?.length) continue;

    if (tokenData?.isScar) {
      features.push({
        id: tokenId,
        kind: "anomaly",
        imagePath: tokenData.imagePath,
        ...ANOMALY_RULES.entropicScar,
      });
      continue;
    }
    if (tokenData?.isRift) {
      features.push({
        id: tokenId,
        kind: "anomaly",
        imagePath: tokenData.imagePath,
        ...ANOMALY_RULES.gravityRift,
      });
      continue;
    }
    if (tokenData?.isNebula) {
      features.push({
        id: tokenId,
        kind: "anomaly",
        imagePath: tokenData.imagePath,
        ...ANOMALY_RULES.nebula,
      });
      continue;
    }

    const known = TOKEN_RULES[tokenId];
    if (known) {
      features.push({
        id: tokenId,
        kind: "token",
        name: known.name,
        rule: known.rule,
        imagePath: known.imagePath ?? tokenData?.imagePath,
      });
      continue;
    }

    // Unfamiliar tokens still get named — the dossier's job is that nothing
    // on the tile stays a mystery, even when we can't cite its rule.
    if (tokenData) {
      features.push({
        id: tokenId,
        kind: "token",
        name: titleCaseFromId(tokenId),
        rule: "",
        imagePath: tokenData.imagePath,
      });
    }
  }

  for (const border of tile.borderAnomalies ?? []) {
    const known = BORDER_RULES[border.type?.toLowerCase?.() ?? ""];
    features.push({
      id: `border-${border.type}-${border.direction}`,
      kind: "border",
      name: known?.name ?? titleCaseFromId(String(border.type)),
      rule:
        known?.rule ??
        "A border anomaly on this edge alters adjacency with the neighboring system.",
      detail: `${EDGE_NAMES[border.direction] ?? border.direction} edge`,
    });
  }

  return features;
}
