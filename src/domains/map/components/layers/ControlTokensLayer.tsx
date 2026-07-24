import React from "react";
import { ControlToken } from "../ControlToken";
import { getColorAlias } from "@/entities/lookup/colors";
import { getPlanetCoordsBySystemId } from "@/entities/lookup/planets";
import { Tile } from "@/app/providers/context/types";
import { useSettingsStore } from "@/utils/appStore";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useMapReplay } from "@/hooks/useGameContext";
import { resolveFactionIdentity } from "@/utils/fowIdentity";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function ControlTokensLayer({ systemId, mapTile }: Props) {
  const alwaysShowControlTokens = useSettingsStore(
    (state) => state.settings.showControlTokens
  );
  const factionColorMap = useFactionColors();
  const replay = useMapReplay();
  const controlTokens = React.useMemo(() => {
    if (!mapTile?.planets) return [] as React.ReactElement[];
    const planetCoords = getPlanetCoordsBySystemId(systemId);

    return Object.entries(mapTile.planets).flatMap(([planetId, planetData]) => {
      if (!planetData.controlledBy) return [];
      if (
        replay.active &&
        replay.controlTokens.some(
          (token) =>
            token.kind === "added" &&
            token.position === mapTile.position &&
            token.planet === planetId,
        )
      )
        return [];

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

      const { faction, rawColor } = resolveFactionIdentity(
        planetData.controlledBy
      );
      const colorAlias = getColorAlias(
        rawColor ?? factionColorMap?.[faction ?? ""]?.color
      );

      return [
        <ControlToken
          key={`${systemId}-${planetId}-control`}
          colorAlias={colorAlias}
          faction={faction}
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
  }, [systemId, mapTile, alwaysShowControlTokens, factionColorMap, replay]);

  return <>{controlTokens}</>;
}
