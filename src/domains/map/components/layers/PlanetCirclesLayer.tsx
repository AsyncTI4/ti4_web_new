import React from "react";
import cx from "clsx";
import classes from "../MapTile.module.css";
import { getPlanetCoordsBySystemId, getPlanetById } from "@/entities/lookup/planets";
import { Tile } from "@/app/providers/context/types";
import { useSettingsStore, useAppStore } from "@/utils/appStore";
import { getTokenData } from "@/entities/lookup/tokens";

type Props = {
  systemId: string;
  mapTile: Tile;
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
  const hoveredPlanetId = useAppStore((state) => state.hoveredPlanetId);
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

  if (!mapTile?.planets) return [] as React.ReactElement[];
  const planetCoords = getPlanetCoordsBySystemId(systemId);

  // Helper function to create a planet circle element
  const createPlanetCircle = (
    planetId: string,
    x: number,
    y: number,
    isExhausted: boolean,
    keySuffix: string = ""
  ) => {
    const planet = getPlanetById(planetId);
    if (!planet) return null;

    const isLegendary =
      planet?.legendaryAbilityName || planet?.legendaryAbilityText;
    const isMecatolRex = planetId === "mr" || planetId === "mrte";
    let radius = 60;
    let circleOffsetX = 0;
    let circleOffsetY = 0;
    if (isMecatolRex) radius = 120;
    else if (
      planetId === "mallice" ||
      planetId === "lockedmallice" ||
      planetId === "hexmallice" ||
      planetId === "hexlockedmallice" ||
      planetId === "ordinian"
    ) {
      radius = 60;
    } else if (planetId === "avernus") {
      radius = 62;
      // needs to be offset to account for the image having the 'avernus' text in the bottom
      circleOffsetX = 10;
      circleOffsetY = -10;
    } else if (planetId === "industrex") {
      radius = 55;
    } else if (planetId === "emelpar") {
      radius = 100;
      circleOffsetX = 0;
      circleOffsetY = -5;
    } else if (isLegendary) {
      radius = 100;
    }

    const diameter = radius * 2;
    const isSpaceStation =
      planet.planetTypes?.some((type) => (type as string) === "SPACESTATION") ??
      false;
    const exhaustedBackdropFilter =
      isExhausted && showExhaustedPlanets && !isSpaceStation
        ? {
            backdropFilter: "brightness(0.7) grayscale(1) blur(0px)" as const,
          }
        : {};

    const isHighlighted = hoveredPlanetId === planetId;

    return (
      <div
        key={`${systemId}-${planetId}${keySuffix}-circle`}
        className={cx(classes.planetCircle, isHighlighted && classes.highlighted)}
        style={{
          position: "absolute",
          left: `${x + circleOffsetX}px`,
          top: `${y + circleOffsetY}px`,
          width: `${diameter}px`,
          height: `${diameter}px`,
          zIndex: 52,
          ...exhaustedBackdropFilter,
        }}
        onMouseEnter={() => handlePlanetMouseEnter(planetId, x, y)}
        onMouseLeave={() => handlePlanetMouseLeave(planetId)}
      />
    );
  };

  // Build a map of token planets from entityPlacements
  const tokenPlanets = React.useMemo(() => {
    const tokenPlanetMap: Record<
      string,
      { x: number; y: number; planetName: string }
    > = {};
    if (mapTile.entityPlacements) {
      Object.values(mapTile.entityPlacements).forEach((placement) => {
        if (placement.entityType === "token") {
          const tokenData = getTokenData(placement.entityId);
          if (tokenData?.isPlanet && tokenData.tokenPlanetName) {
            tokenPlanetMap[tokenData.tokenPlanetName] = {
              x: placement.x,
              y: placement.y,
              planetName: tokenData.tokenPlanetName,
            };
          }
        }
      });
    }
    return tokenPlanetMap;
  }, [mapTile.entityPlacements]);

  // Regular planets from mapTile.planets
  const regularPlanetCircles = Object.entries(mapTile.planets).flatMap(
    ([planetId, planetTile]) => {
      if (!planetCoords[planetId]) return [];
      const [x, y] = planetCoords[planetId].split(",").map(Number);
      const circle = createPlanetCircle(planetId, x, y, planetTile.exhausted);
      return circle ? [circle] : [];
    }
  );

  // Token planets (like Thunder's Edge)
  const tokenPlanetCircles = Object.entries(tokenPlanets).flatMap(
    ([planetName, tokenPlanet]) => {
      // Skip if already rendered as a regular planet
      if (planetCoords[planetName]) return [];
      const planetTileData = mapTile.planets[planetName];
      const circle = createPlanetCircle(
        planetName,
        tokenPlanet.x,
        tokenPlanet.y,
        planetTileData?.exhausted || false,
        "-token"
      );
      return circle ? [circle] : [];
    }
  );

  return <>{[...regularPlanetCircles, ...tokenPlanetCircles]}</>;
}
