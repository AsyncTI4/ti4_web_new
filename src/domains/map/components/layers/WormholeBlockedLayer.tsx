import { useGameData } from "@/hooks/useGameContext";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTileById } from "@/domains/map/model/mapgen/systems";

type Props = {
  systemId: string;
};

export function WormholeBlockedLayer({ systemId }: Props) {
  const gameData = useGameData();
  const lawsInPlay = gameData?.lawsInPlay || [];

  const travelBanActive = lawsInPlay.some(
    (law) => law.id === "travel_ban" || law.id === "absol_travelban"
  );
  if (!travelBanActive) return null;
  const systemData = getTileById(systemId);
  if (!systemData) return null;

  const hasAlpha = systemData.wormholes?.includes("ALPHA") || false;
  const hasBeta = systemData.wormholes?.includes("BETA") || false;
  if (!hasAlpha && !hasBeta) return null;

  const reconstructionActive = lawsInPlay.some(
    (law) => law.id === "wormhole_recon" || law.id === "absol_recon"
  );
  const imageName = reconstructionActive
    ? "agenda_wormhole_blocked_half.png"
    : "agenda_wormhole_blocked.png";

  const coordinates = getWormholeCoordinates(
    systemId,
    systemData.shipPositionsType,
    hasAlpha,
    hasBeta,
    40
  );

  return (
    <>
      {coordinates.map((coord, index) => (
        <img
          key={`${systemId}-wh-blocked-${index}`}
          src={cdnImage(`/tokens/${imageName}`)}
          alt="Wormhole Blocked"
          style={{
            position: "absolute",
            left: `${coord.x}px`,
            top: `${coord.y}px`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      ))}
    </>
  );
}

type Point = { x: number; y: number };

/** Per-tile wormhole art positions, ported from TileGenerator.java drawOnWormhole. */
const TILE_WORMHOLE_POSITIONS: Record<string, { alpha?: Point; beta?: Point }> = {
  "82b": { alpha: { x: 95, y: 249 }, beta: { x: 169, y: 273 } }, // wormhole nexus
  c02: { alpha: { x: 37, y: 158 }, beta: { x: 223, y: 62 } }, // Locke/Bentham
  c10: { alpha: { x: 182, y: 22 }, beta: { x: 259, y: 241 } }, // Kwon
  c11: { alpha: { x: 54, y: 138 }, beta: { x: 159, y: 275 } }, // Ethan
  d119: { beta: { x: 94, y: 170 } }, // beta/nebula
  d123: { alpha: { x: 22, y: 110 }, beta: { x: 190, y: 206 } }, // alpha/beta/supernova
  er19: { alpha: { x: 60, y: 44 }, beta: { x: 192, y: 184 } }, // alpha/beta/rift
  er119: { alpha: { x: 60, y: 44 }, beta: { x: 192, y: 184 } }, // alpha/beta/nebula
  er94: { beta: { x: 157, y: 165 } }, // Iynntani
  er95: { alpha: { x: 60, y: 155 }, beta: { x: 215, y: 61 } }, // Kytos/Prymis
  m05: { alpha: { x: 185, y: 180 } }, // Shanh
  m32: { beta: { x: 49, y: 147 } }, // Vespa/Apis
};

/** Fallback positions by ship-position layout, from ShipPositionModel.java getWormholeLocation. */
const SHIP_POSITION_WORMHOLE: Record<string, Point> = {
  TYPE05: { x: 162, y: 166 }, // planet and wormhole
  TYPE07: { x: 172, y: 32 }, // 1 planet bottom left
  TYPE08: { x: 132, y: 110 }, // empty and wormhole
  TYPE13: { x: 139, y: 186 }, // Eko
  TYPE14: { x: 152, y: 124 }, // Horace
};

function getWormholeCoordinates(
  tileId: string,
  shipPositionsType: string | null | undefined,
  hasAlpha: boolean,
  hasBeta: boolean,
  offset: number,
): Point[] {
  const shift = (point: Point) => ({ x: offset + point.x, y: offset + point.y });
  const tilePositions = TILE_WORMHOLE_POSITIONS[tileId];

  if (tilePositions) {
    return [
      hasAlpha && tilePositions.alpha,
      hasBeta && tilePositions.beta,
    ]
      .filter((point): point is Point => !!point)
      .map(shift);
  }

  const layoutPosition = shipPositionsType
    ? SHIP_POSITION_WORMHOLE[shipPositionsType]
    : undefined;
  const point = layoutPosition
    ? shift(layoutPosition)
    : { x: offset + 86, y: 260 };
  return [hasAlpha && point, hasBeta && point].filter(
    (p): p is Point => !!p,
  );
}
