import React from "react";
import classes from "../MapTile.module.css";
import { getPlanetCoordsBySystemId, getPlanetById, getPlanetsByTileId } from "@/lookup/planets";
import { MapTileType, Planet } from "@/data/types";
import { useSettingsStore } from "@/utils/appStore";
import { rgba } from "@mantine/core";
import { getAttachmentData } from "@/lookup/attachments";

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
  const techSkipsMode = useSettingsStore(
    (state) => state.settings.techSkipsMode
  );
  const d = getPlanetsByTileId(mapTile.systemId);
  

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

  const circles = mapTile.planets.flatMap((planetTile, index) => {
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
            backdropFilter: "brightness(0.7) blur(0px)" as const,
          }
          : {};

      const techSpecialties = (() => {
        const specs: string[] = [];
        if (planet?.techSpecialties) {
          specs.push(...planet.techSpecialties);
        }
        const planetTileData = mapTile.planets?.find(p => p.name === planetId);
        if (planetTileData?.attachments) {
          planetTileData.attachments.forEach(attachmentId => {
            const attachmentData = getAttachmentData(attachmentId);
            if (attachmentData?.techSpeciality) {
              specs.push(...attachmentData.techSpeciality);
            }
          });
        }
        return specs;
      })();

      const glowClassName = (() => {
        if (techSkipsMode && techSpecialties.length > 0) {
          return techSpecialties[0]?.toLowerCase();
        }
        if (planetTypesMode && planet?.planetType) {
          return planet.planetType.toLowerCase();
        }
        return undefined;
      })();

      const glowStyle = glowClassName ? {
        background: `radial-gradient(circle, transparent 30%, var(--glow-color-dark) 50%, var(--glow-color-mid) 70%, transparent 100%)`,
        boxShadow: `0 0 8px 4px var(--rim-color-bright), 0 0 15px var(--rim-color-base), inset 0 0 8px 2px var(--rim-color-inner), 0 0 2px 1px rgba(0, 0, 0, 0.8)`,
      } : {};

      return [
        <div
          key={`${systemId}-${planetId}-circle`}
          className={`${classes.planetCircle} ${glowClassName ? classes[glowClassName] || '' : ''}`}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${diameter}px`,
            height: `${diameter}px`,
            ...glowStyle,
            ...exhaustedBackdropFilter
          }}
          onMouseEnter={() => handlePlanetMouseEnter(planetId, x, y)}
          onMouseLeave={() => handlePlanetMouseLeave(planetId)}
        />,
      ];

  });

  return <>{circles}</>;
}