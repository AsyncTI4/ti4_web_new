import { getPlanetPositionsBySystemId, getPlanetData } from "@/entities/lookup/planets";
import { cdnImage } from "@/entities/data/cdnImage";
import styles from "./PlanetaryShieldOverlayLayer.module.css";
import type { Tile } from "@/app/providers/context/types";
import { isLargeLegendaryPlanet } from "./legendaryPlanetSize";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function PlanetaryShieldOverlayLayer({ systemId, mapTile }: Props) {
  const planetPositions = getPlanetPositionsBySystemId(systemId);
  const overlays = Object.entries(mapTile.planets).flatMap(
    ([planetId, planetTile]) => {
      if (!planetTile.planetaryShield) return [];

      const position = planetPositions[planetId];
      if (!position) return [];
      const { x, y } = position;

      const isMecatolRex = planetId === "mr";
      const isLargeLegendary = isLargeLegendaryPlanet(
        planetId,
        getPlanetData(planetId),
      );
      const scale = isMecatolRex ? 1.9 : isLargeLegendary ? 1.65 : 0.95;

      return [
        <img
          key={`${systemId}-${planetId}-pshield`}
          src={cdnImage("/tokens/token_planetaryShield.png")}
          alt="Planetary Shield"
          className={styles.icon}
          style={{
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        />,
      ];
    }
  );

  return <>{overlays}</>;
}
