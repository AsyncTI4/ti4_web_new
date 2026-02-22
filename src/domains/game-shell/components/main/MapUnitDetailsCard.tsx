import { UnitDetailsCard } from "@/domains/player/components/PlayerArea/UnitDetailsCard";
import { lookupUnit } from "@/entities/lookup/units";
import { useGameData } from "@/hooks/useGameContext";
import {
  type MapLayout,
} from "@/domains/map/components/MapView/mapLayout";
import { MapTooltipPositioner } from "@/domains/map/components/MapView/MapTooltipPositioner";

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
  const playerData = gameData?.playerData;

  const activePlayer = playerData?.find(
    (player) => player.faction === tooltipUnit.faction
  );
  if (!activePlayer) return null;

  const unitIdToUse =
    lookupUnit(tooltipUnit.unitId, activePlayer.faction, activePlayer)?.id ||
    tooltipUnit.unitId;

  return (
    <MapTooltipPositioner
      coords={tooltipUnit.coords}
      mapPadding={mapPadding}
      mapZoom={mapZoom}
      mapLayout={mapLayout}
      zIndexVar="var(--z-map-unit-details)"
    >
      <UnitDetailsCard unitId={unitIdToUse} color={activePlayer.color} />
    </MapTooltipPositioner>
  );
}
