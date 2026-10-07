import { ControlToken } from "../ControlToken";
import { getColorAlias } from "@/entities/lookup/colors";
import { getPlanetPositionsBySystemId } from "@/entities/lookup/planets";
import type { Tile } from "@/app/providers/context/types";
import { useSettingsStore } from "@/utils/appStore";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useMapReplay } from "@/hooks/useGameContext";
import { shouldShowControlToken } from "@/utils/controlTokenDisplay";

type Props = {
  systemId: string;
  mapTile: Tile;
};

export function ControlTokensLayer({ systemId, mapTile }: Props) {
  const controlTokenDisplayMode = useSettingsStore(
    (state) => state.settings.controlTokenDisplayMode,
  );
  const factionColorMap = useFactionColors();
  const replay = useMapReplay();
  if (!mapTile?.planets) return null;
  const planetPositions = getPlanetPositionsBySystemId(systemId);

  const controlTokens = Object.entries(mapTile.planets).flatMap(
    ([planetId, planetData]) => {
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

      if (
        !shouldShowControlToken(
          controlTokenDisplayMode,
          planetData.unitsByFaction,
        )
      )
        return [];

      const position =
        planetPositions[planetId] ??
        Object.values(mapTile.entityPlacements).find(
          (placement) => placement.entityId === planetId,
        );
      if (!position) return [];
      const { x, y } = position;

      const colorAlias = getColorAlias(
        factionColorMap?.[planetData.controlledBy]?.color,
      );

      return [
        <ControlToken
          key={`${systemId}-${planetId}-control`}
          colorAlias={colorAlias}
          faction={planetData.controlledBy}
          style={{
            position: "absolute",
            left: `${x - 10}px`,
            top: `${y + 15}px`,
            transform: "translate(-50%, -50%)",
            zIndex: "var(--z-control-token)",
          }}
        />,
      ];
    },
  );

  return <>{controlTokens}</>;
}
