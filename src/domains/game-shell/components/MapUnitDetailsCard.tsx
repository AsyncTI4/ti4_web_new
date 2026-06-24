import { UnitDetailsCard } from "@/domains/player/components/UnitDetailsCard";
import { lookupUnit } from "@/entities/lookup/units";
import { useGameData } from "@/hooks/useGameContext";
import {
  type MapLayout,
} from "@/domains/map/components/mapLayout";
import { MapTooltipPositioner } from "@/domains/map/components/MapTooltipPositioner";

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

  // Try to find a player matching the faction; neutral units may not have an associated player
  const activePlayer = playerData?.find(
    (player) => player.faction === tooltipUnit.faction
  );

  // If we don't have a player for this faction (e.g. neutral), still attempt to resolve
  // a sensible unit id for display. Pass `activePlayer?.faction` when available so
  // faction-specific lookups prefer that, otherwise fall back to the tooltip faction
  // which allows `lookupUnit` to return generic unit data.
  const lookupFaction = activePlayer?.faction || tooltipUnit.faction;
  const unitIdToUse =
    lookupUnit(tooltipUnit.unitId, lookupFaction, activePlayer)?.id ||
    tooltipUnit.unitId;

  return (
    <MapTooltipPositioner
      coords={tooltipUnit.coords}
      mapPadding={mapPadding}
      mapZoom={mapZoom}
      mapLayout={mapLayout}
      zIndexVar="var(--z-map-unit-details)"
    >
      <UnitDetailsCard unitId={unitIdToUse} color={activePlayer?.color} />
    </MapTooltipPositioner>
  );
}
