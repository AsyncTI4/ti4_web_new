import { Box, SimpleGrid } from "@mantine/core";
import { UnitCard, UnitCardUnavailable } from "./UnitCard";
import { CommandTokenCard } from "./UnitCard/CommandTokenCard";
import { StasisInfantryCard } from "./StasisInfantryCard";
import { lookupUnit } from "@/entities/lookup/units";
import type { PlayerData } from "@/entities/data/types";
import unitStyles from "./UnitCard/UnitCard.module.css";

const UNIT_PRIORITY_ORDER = [
  "ws",
  "fs",
  "dn",
  "cv",
  "ca",
  "dd",
  "ff",
  "mf",
  "gf",
  "sd",
  "pd",
  "monument",
];

const OPTIONAL_UNITS = ["monument"];

/** A rack position: the player's best unit for it, or no unitId when unavailable. */
type UnitSlot = { asyncId: string; unitId?: string };

type Props = {
  playerData: PlayerData;
  color: string;
  faction: string;
  spacing?: string;
  showUnavailable?: boolean;
  /** Tight "tic-tac-toe" grid of 2 rows with hairline dividers */
  condensed?: boolean;
  showUnitUpgrades?: boolean;
};

export function PlayerCardUnitsArea({
  playerData,
  color,
  faction,
  spacing = "8px",
  showUnavailable = true,
  condensed = false,
  showUnitUpgrades = true,
}: Props) {
  const unitCounts = playerData.unitCounts || {};
  const stasisInfantry = playerData.stasisInfantry || 0;
  const ccReinf = playerData.ccReinf;

  const slots = UNIT_PRIORITY_ORDER.flatMap((asyncId): UnitSlot[] => {
    const bestUnit = lookupUnit(asyncId, faction, playerData);
    if (bestUnit && bestUnit.id.toLowerCase() !== "nowarsun") {
      return [{ asyncId, unitId: bestUnit.id }];
    }
    if (OPTIONAL_UNITS.includes(asyncId) || !showUnavailable) return [];
    return [{ asyncId }];
  });

  const cards = (
    <>
      {slots.map(({ asyncId, unitId }) =>
        unitId ? (
          <UnitCard
            key={unitId}
            unitId={unitId}
            color={color}
            deployedCount={unitCounts[asyncId]?.deployedCount ?? 0}
            unitCap={unitCounts[asyncId]?.unitCap}
            condensed={condensed}
            showUpgradeState={showUnitUpgrades}
          />
        ) : (
          <UnitCardUnavailable
            key={`unavailable-${asyncId}`}
            asyncId={asyncId}
            color={color}
            condensed={condensed}
          />
        )
      )}

      {ccReinf !== undefined && (
        <CommandTokenCard
          color={color}
          faction={faction}
          reinforcements={ccReinf}
          totalCapacity={16}
          condensed={condensed}
        />
      )}

      {stasisInfantry > 0 && (
        <StasisInfantryCard
          reviveCount={stasisInfantry}
          color={color}
          condensed={condensed}
        />
      )}
    </>
  );

  if (condensed) {
    return <Box className={unitStyles.denseGrid}>{cards}</Box>;
  }

  const totalCardCount =
    slots.length + (ccReinf !== undefined ? 1 : 0) + (stasisInfantry > 0 ? 1 : 0);
  const rows = totalCardCount > 7 ? 2 : 1;

  return (
    <SimpleGrid h="100%" cols={Math.ceil(totalCardCount / rows)} spacing={spacing}>
      {cards}
    </SimpleGrid>
  );
}
