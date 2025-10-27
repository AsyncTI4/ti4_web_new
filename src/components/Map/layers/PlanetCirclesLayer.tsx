import React from "react";
import classes from "../MapTile.module.css";
import { getPlanetCoordsBySystemId, getPlanetById, getPlanetsByTileId } from "@/lookup/planets";
import { MapTileType, Planet } from "@/data/types";
import { useSettingsStore } from "@/utils/appStore";
import { rgba } from "@mantine/core";

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

  const planetTypesMode = useSettingsStore(
    (state) => state.settings.planetTypesMode
  );
  const planetsById = getPlanetsByTileId(mapTile.systemId);

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


  if (!mapTile?.planets) return [] as React.ReactElement[];
  const planetCoords = getPlanetCoordsBySystemId(systemId);

  function cleanPlanetName(name: string) {
    return name.toLowerCase().replace(/[^a-zA-Z]/g, '');
  }

  const circles = mapTile.planets.flatMap((planetTile) => {
    const planetId = planetTile.name;
    if (!planetCoords[planetId]) return [];

    const [x, y] = planetCoords[planetId].split(",").map(Number);
    const planet = getPlanetById(planetId);
    const planetTypeStyles = getPlanetBackdropStyles(planetsById.find((planet) => cleanPlanetName(planet.name) === cleanPlanetName(planetTile.name)));

    const isLegendary = planet?.legendaryAbilityName || planet?.legendaryAbilityText;
    const isMecatolRex = planetId === "mr";


    let radius = 60;
    if (isMecatolRex) {
      radius = 120;
    } else if (isLegendary && !planetId.includes("mallice")) {
      radius = 100;
    }

    const diameter = radius * 2;
    const exhaustedBackdropFilter =
      planetTile.exhausted && showExhaustedPlanets
        ? {
          backdropFilter: "brightness(0.7) blur(0px)" as const,
        }
        : {};

    return [
      <div
        key={`${systemId}-${planetId}-circle`}
        className={classes.planetCircle}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${diameter}px`,
          height: `${diameter}px`,
          backgroundColor: `${planetTypesMode ? planetTypeStyles : ""}`,
          ...exhaustedBackdropFilter
        }}
        onMouseEnter={() => handlePlanetMouseEnter(planetId, x, y)}
        onMouseLeave={() => handlePlanetMouseLeave(planetId)}
      />,
    ];

  });

  return <>{circles}</>;
}

function getPlanetBackdropStyles(planet: Planet | undefined) {
  if (!planet) return "";

  switch (planet.planetType) {
    case "CULTURAL":
      return "rgba(0, 123, 255, 0.8)";
    case "HAZARDOUS":
      return "rgba(220, 38, 38, 0.8)";
    case "INDUSTRIAL":
      return "rgba(34, 197, 94, 0.8)";
    default:
      return "";
  }
}