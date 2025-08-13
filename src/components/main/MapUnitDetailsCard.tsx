import { Box } from "@mantine/core";
import { UnitDetailsCard } from "../PlayerArea/UnitDetailsCard";
import { lookupUnit } from "../../lookup/units";
import { PlayerData } from "../../data/types";
import { useAppStore } from "@/utils/appStore";

type TooltipUnit = {
  unitId?: string;
  faction: string;
  coords: { x: number; y: number };
};

type Props = {
  tooltipUnit: TooltipUnit | null;
  playerData: PlayerData[] | undefined;
  zoom: number;
};

export function MapUnitDetailsCard({
  tooltipUnit,
  playerData,
  zoom,
}: Props) {
  if (!tooltipUnit || !tooltipUnit.unitId || !tooltipUnit.faction) return null;
  const MAP_PADDING = useAppStore((state) => state.mapPadding);

  const activePlayer = playerData?.find(
    (player) => player.faction === tooltipUnit.faction
  );
  if (!activePlayer) return null;

  const scaledX = tooltipUnit.coords.x * zoom;
  const scaledY = tooltipUnit.coords.y * zoom;
  const unitIdToUse =
    lookupUnit(tooltipUnit.unitId, activePlayer.faction, activePlayer)?.id ||
    tooltipUnit.unitId;

  return (
    <Box
      style={{
        position: "absolute",
        left: `${scaledX + MAP_PADDING}px`,
        top: `${scaledY + MAP_PADDING - 25}px`,
        zIndex: 10000000,
        pointerEvents: "none",
        transform: "translate(-50%, -100%)", // Center horizontally, position above the unit
      }}
    >
      <UnitDetailsCard unitId={unitIdToUse} color={activePlayer.color} />
    </Box>
  );
}
