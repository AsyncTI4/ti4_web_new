import { Box } from "@mantine/core";
import { UnitDetailsCard } from "../PlayerArea/UnitDetailsCard";
import { lookupUnit } from "../../lookup/units";
import { useGameData } from "@/hooks/useGameContext";
import { useAppStore } from "@/utils/appStore";
import {
  getMapLayoutConfig,
  mapCoordsToScreen,
  type MapLayout,
} from "./MapView/mapLayout";

type TooltipUnit = {
  unitId?: string;
  faction: string;
  coords: { x: number; y: number };
};

type Props = {
  tooltipUnit: TooltipUnit | null;
  mapPadding?: number;
  mapZoom?: number;
  mapLayout?: MapLayout;
};

export function MapUnitDetailsCard({
  tooltipUnit,
  mapPadding,
  mapZoom,
  mapLayout = "panels",
}: Props) {
  if (!tooltipUnit || !tooltipUnit.unitId || !tooltipUnit.faction) return null;
  const gameData = useGameData();
  const zoom = mapZoom ?? useAppStore((state) => state.zoomLevel);
  const playerData = gameData?.playerData;
  const resolvedPadding =
    mapPadding ?? getMapLayoutConfig(mapLayout).mapPadding;

  const activePlayer = playerData?.find(
    (player) => player.faction === tooltipUnit.faction
  );
  if (!activePlayer) return null;

  const { x, y } = mapCoordsToScreen(tooltipUnit.coords, zoom, resolvedPadding);
  const unitIdToUse =
    lookupUnit(tooltipUnit.unitId, activePlayer.faction, activePlayer)?.id ||
    tooltipUnit.unitId;

  return (
    <Box
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y - 25}px`,
        zIndex: "var(--z-map-unit-details)",
        pointerEvents: "none",
        transform: "translate(-50%, -100%)", // Center horizontally, position above the unit
      }}
    >
      <UnitDetailsCard unitId={unitIdToUse} color={activePlayer.color} />
    </Box>
  );
}
