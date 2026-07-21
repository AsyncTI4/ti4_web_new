import { UnitDetailsCard } from "@/domains/player/components/UnitDetailsCard";
import { lookupUnit, getGenericUnitDataByAsyncId } from "@/entities/lookup/units";
import { useGameData } from "@/hooks/useGameContext";
import {
  type MapLayout,
} from "@/domains/map/components/mapLayout";
import { MapTooltipPositioner } from "@/domains/map/components/MapTooltipPositioner";
import { resolveFactionIdentity } from "@/utils/fowIdentity";

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

  // tooltipUnit.faction may be a "fow:<color>" sentinel (see
  // WebTileUnitData#redactUnitIdentities) when the viewer can't identify this player -
  // resolveFactionIdentity keeps us from ever passing the real faction into the
  // faction-specific unit/tech lookup below in that case.
  const { faction: identifiedFaction, rawColor } = resolveFactionIdentity(
    tooltipUnit.faction
  );

  const activePlayer = playerData?.find(
    (player) => player.faction === identifiedFaction
  );

  // For an identified player, resolve their real (possibly upgraded/faction-specific) unit.
  // For an unidentified one, lookupUnit's faction="" fallback path would still prefer an
  // upgraded variant if one shares this asyncId (a guess we have no evidence for) - so use
  // getGenericUnitDataByAsyncId instead, which explicitly prefers the base, non-upgraded unit.
  const unitIdToUse = activePlayer
    ? lookupUnit(tooltipUnit.unitId, activePlayer.faction, activePlayer)?.id ||
      tooltipUnit.unitId
    : getGenericUnitDataByAsyncId(tooltipUnit.unitId)?.id || tooltipUnit.unitId;

  return (
    <MapTooltipPositioner
      coords={tooltipUnit.coords}
      mapPadding={mapPadding}
      mapZoom={mapZoom}
      mapLayout={mapLayout}
      zIndexVar="var(--z-map-unit-details)"
    >
      <UnitDetailsCard
        unitId={unitIdToUse}
        color={activePlayer?.color ?? rawColor}
        isEstimated={!activePlayer}
      />
    </MapTooltipPositioner>
  );
}
