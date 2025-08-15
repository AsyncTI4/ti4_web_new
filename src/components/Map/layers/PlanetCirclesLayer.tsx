import React from "react";
import classes from "../MapTile.module.css";
import { getPlanetCoordsBySystemId, getPlanetById } from "@/lookup/planets";
import { MapTileType } from "@/data/types";
import { useSettingsStore } from "@/utils/appStore";

type Props = {
  systemId: string;
  mapTile: MapTileType;
  position: { x: number; y: number };
  onPlanetMouseEnter?: (planetId: string, x: number, y: number) => void;
  onPlanetMouseLeave?: () => void;
};

export function PlanetCirclesLayer({
  systemId,
  mapTile,
  position,
  onPlanetMouseEnter,
  onPlanetMouseLeave,
}: Props) {
  const showExhaustedPlanets = useSettingsStore(
    (state) => state.settings.showExhaustedPlanets
  );
  const hoverTimeoutRef = React.useRef<Record<string, number>>({});

  const handlePlanetMouseEnter = React.useCallback(
    (planetId: string, x: number, y: number) => {
      if (!onPlanetMouseEnter) return;
      hoverTimeoutRef.current[planetId] = setTimeout(() => {
        const worldX = position.x + x;
        const worldY = position.y + y;
        onPlanetMouseEnter(planetId, worldX, worldY);
      }, 1000);
    },
    [onPlanetMouseEnter, position.x, position.y]
  );

  const handlePlanetMouseLeave = React.useCallback(
    (planetId: string) => {
      if (hoverTimeoutRef.current[planetId]) {
        clearTimeout(hoverTimeoutRef.current[planetId]);
        delete hoverTimeoutRef.current[planetId];
      }
      if (onPlanetMouseLeave) onPlanetMouseLeave();
    },
    [onPlanetMouseLeave]
  );

  React.useEffect(() => {
    return () => {
      Object.values(hoverTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  const circles = React.useMemo(() => {
    if (!mapTile?.planets) return [] as React.ReactElement[];
    const planetCoords = getPlanetCoordsBySystemId(systemId);

    return mapTile.planets.flatMap((planetTile) => {
      const planetId = planetTile.name;
      if (!planetCoords[planetId]) return [];
      const [x, y] = planetCoords[planetId].split(",").map(Number);

      const planet = getPlanetById(planetId);
      const isLegendary =
        planet?.legendaryAbilityName || planet?.legendaryAbilityText;
      const isMecatolRex = planetId === "mr";

      let radius = 60;
      if (isMecatolRex) radius = 120;
      else if (
        planetId === "mallice" ||
        planetId === "lockedmallice" ||
        planetId === "hexmallice" ||
        planetId === "hexlockedmallice"
      ) {
        radius = 60;
      } else if (isLegendary) {
        radius = 100;
      }

      const diameter = radius * 2;
      const exhaustedBackdropFilter =
        planetTile.exhausted && showExhaustedPlanets
          ? {
              backdropFilter: "grayscale(1) brightness(0.7) blur(0px)" as const,
            }
          : {};

      return [
        <div
          key={`${systemId}-${planetId}-circle`}
          className={classes.planetCircle}
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: `${diameter}px`,
            height: `${diameter}px`,
            ...exhaustedBackdropFilter,
          }}
          onMouseEnter={() => handlePlanetMouseEnter(planetId, x, y)}
          onMouseLeave={() => handlePlanetMouseLeave(planetId)}
        />,
      ];
    });
  }, [
    systemId,
    mapTile,
    showExhaustedPlanets,
    handlePlanetMouseEnter,
    handlePlanetMouseLeave,
  ]);

  return <>{circles}</>;
}
