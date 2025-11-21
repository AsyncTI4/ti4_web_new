import { useGameData } from "@/hooks/useGameContext";
import { cdnImage } from "@/data/cdnImage";
import { systems } from "@/data/systems";

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
  const systemData = systems.find((s) => s.id === systemId);
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
            zIndex: 2, // Above base tile, below units
          }}
        />
      ))}
    </>
  );
}

function getWormholeCoordinates(
  tileId: string,
  shipPositionsType: string | null | undefined,
  hasAlpha: boolean,
  hasBeta: boolean,
  offset: number = 0
): Array<{ x: number; y: number; type: "alpha" | "beta" }> {
  const coords: Array<{ x: number; y: number; type: "alpha" | "beta" }> = [];

  // Coordinates ported from TileGenerator.java drawOnWormhole
  switch (tileId) {
    case "82b": // wormhole nexus
      if (hasAlpha)
        coords.push({ x: offset + 95, y: offset + 249, type: "alpha" });
      if (hasBeta)
        coords.push({ x: offset + 169, y: offset + 273, type: "beta" });
      break;
    case "c02": // Locke/Bentham
      if (hasAlpha)
        coords.push({ x: offset + 37, y: offset + 158, type: "alpha" });
      if (hasBeta)
        coords.push({ x: offset + 223, y: offset + 62, type: "beta" });
      break;
    case "c10": // Kwon
      if (hasAlpha)
        coords.push({ x: offset + 182, y: offset + 22, type: "alpha" });
      if (hasBeta)
        coords.push({ x: offset + 259, y: offset + 241, type: "beta" });
      break;
    case "c11": // Ethan
      if (hasAlpha)
        coords.push({ x: offset + 54, y: offset + 138, type: "alpha" });
      if (hasBeta)
        coords.push({ x: offset + 159, y: offset + 275, type: "beta" });
      break;
    case "d119": // beta/nebula
      if (hasBeta)
        coords.push({ x: offset + 94, y: offset + 170, type: "beta" });
      break;
    case "d123": // alpha/beta/supernova
      if (hasAlpha)
        coords.push({ x: offset + 22, y: offset + 110, type: "alpha" });
      if (hasBeta)
        coords.push({ x: offset + 190, y: offset + 206, type: "beta" });
      break;
    case "er19": // alpha/beta/rift
    case "er119": // alpha/beta/nebula
      if (hasAlpha)
        coords.push({ x: offset + 60, y: offset + 44, type: "alpha" });
      if (hasBeta)
        coords.push({ x: offset + 192, y: offset + 184, type: "beta" });
      break;
    case "er94": // Iynntani
      if (hasBeta)
        coords.push({ x: offset + 157, y: offset + 165, type: "beta" });
      break;
    case "er95": // Kytos/Prymis
      if (hasAlpha)
        coords.push({ x: offset + 60, y: offset + 155, type: "alpha" });
      if (hasBeta)
        coords.push({ x: offset + 215, y: offset + 61, type: "beta" });
      break;
    case "m05": // Shanh
      if (hasAlpha)
        coords.push({ x: offset + 185, y: offset + 180, type: "alpha" });
      break;
    case "m32": // Vespa/Apis
      if (hasBeta)
        coords.push({ x: offset + 49, y: offset + 147, type: "beta" });
      break;
    default: {
      // Logic based on ShipPositionModel.java getWormholeLocation
      let x = offset + 86;
      let y = 260;

      if (shipPositionsType) {
        const locations: Record<string, { x: number; y: number }> = {
          TYPE05: { x: 162, y: 166 }, // planet and wormhole
          TYPE07: { x: 172, y: 32 }, // 1 planet bottom left
          TYPE08: { x: 132, y: 110 }, // empty and wormhole
          TYPE13: { x: 139, y: 186 }, // Eko
          TYPE14: { x: 152, y: 124 }, // Horace
        };

        if (locations[shipPositionsType]) {
          x = offset + locations[shipPositionsType].x;
          y = offset + locations[shipPositionsType].y;
        }
      }

      if (hasAlpha) coords.push({ x, y, type: "alpha" });
      if (hasBeta) coords.push({ x, y, type: "beta" });
      break;
    }
  }
  return coords;
}
