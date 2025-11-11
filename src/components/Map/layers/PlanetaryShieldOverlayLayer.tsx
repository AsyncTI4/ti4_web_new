import React from "react";
import { getPlanetCoordsBySystemId, getPlanetById } from "@/lookup/planets";
import { cdnImage } from "@/data/cdnImage";
import styles from "./PlanetaryShieldOverlayLayer.module.css";
import { Tile } from "@/context/types";

type Props = {
  systemId: string;
  mapTile: Tile;
};

function isSmallLegendaryPlanet(planetId: string): boolean {
  return (
    planetId === "mirage" ||
    planetId === "mallice" ||
    planetId === "lockedmallice" ||
    planetId === "hexmallice" ||
    planetId === "hexlockedmallice" ||
    planetId === "industrex" ||
    planetId === "ordinian"
  );
}

export function PlanetaryShieldOverlayLayer({ systemId, mapTile }: Props) {
  const planetCoords = getPlanetCoordsBySystemId(systemId);
  const overlays = Object.entries(mapTile.planets).flatMap(
    ([planetId, planetTile]) => {
      if (!planetTile.planetaryShield) return [];

      const coord = planetCoords[planetId];
      if (!coord) return [] as React.ReactElement[];
      const [x, y] = coord.split(",").map(Number);

      const planet = getPlanetById(planetId);
      const isMecatolRex = planetId === "mr";
      const isLegendary = !!(
        planet?.legendaryAbilityName || planet?.legendaryAbilityText
      );
      const isSmallLegendary = isSmallLegendaryPlanet(planetId);

      let scale = 0.95;
      if (isMecatolRex) {
        scale = 1.9;
      } else if (isLegendary && !isSmallLegendary) {
        scale = 1.65;
      } else {
        scale = 0.95;
      }

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
