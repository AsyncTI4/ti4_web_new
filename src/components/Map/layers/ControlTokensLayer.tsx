import React from "react";
import { ControlToken } from "../ControlToken";
import { getColorAlias } from "@/lookup/colors";
import { getPlanetCoordsBySystemId } from "@/lookup/planets";
import { MapTileType } from "@/data/types";
import { useSettingsStore } from "@/utils/appStore";
import { useFactionColors } from "@/hooks/useFactionColors";

type Props = {
  systemId: string;
  mapTile: MapTileType;
};

export function ControlTokensLayer({ systemId, mapTile }: Props) {
  const alwaysShowControlTokens = useSettingsStore(
    (state) => state.settings.showControlTokens
  );
  const factionColorMap = useFactionColors();
  const controlTokens = React.useMemo(() => {
    if (!mapTile?.planets) return [] as React.ReactElement[];
    const planetCoords = getPlanetCoordsBySystemId(systemId);

    return mapTile.planets.flatMap((planetData) => {
      const planetId = planetData.name;
      if (!planetData.controller) return [];

      if (!alwaysShowControlTokens) {
        const planetHasUnits = Object.values(mapTile.entityPlacements).some(
          (placement) =>
            placement.planetName === planetId && placement.entityType === "unit"
        );
        if (planetHasUnits) return [];
      }

      let x: number, y: number;
      if (planetCoords[planetId]) {
        [x, y] = planetCoords[planetId].split(",").map(Number);
      } else {
        const tokenPlacement = Object.values(mapTile.entityPlacements).find(
          (placement) => placement.entityId === planetId
        );
        if (!tokenPlacement) return [];
        x = tokenPlacement.x;
        y = tokenPlacement.y;
      }

      const colorAlias = getColorAlias(
        factionColorMap?.[planetData.controller]?.color
      );

      return [
        <ControlToken
          key={`${systemId}-${planetId}-control`}
          colorAlias={colorAlias}
          faction={planetData.controller}
          style={{
            position: "absolute",
            left: `${x - 10}px`,
            top: `${y + 15}px`,
            transform: "translate(-50%, -50%)",
            zIndex: "var(--z-control-token)",
          }}
        />,
      ];
    });
  }, [systemId, mapTile, alwaysShowControlTokens, factionColorMap]);

  return <>{controlTokens}</>;
}
