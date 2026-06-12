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
];

type PlayerCardUnitsAreaProps = {
  playerData: PlayerData;
  color: string;
  faction: string;
  cols?: number | { base?: number; xl?: number };
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
  cols = { base: 4, xl: 6 },
  spacing = "8px",
  showUnavailable = true,
  condensed = false,
  showUnitUpgrades = true,
}: PlayerCardUnitsAreaProps) {
  const unitCounts = playerData.unitCounts || {};
  const stasisInfantry = playerData.stasisInfantry || 0;
  const ccReinf = playerData.ccReinf;

  if (condensed) {
    return (
      <Box className={unitStyles.denseGrid}>
        {UNIT_PRIORITY_ORDER.map((asyncId) => {
          const bestUnit = lookupUnit(asyncId, faction, playerData);
          const deployedCount = unitCounts?.[asyncId]?.deployedCount ?? 0;

          if (!bestUnit) {
            if (!showUnavailable) return null;
            return (
              <UnitCardUnavailable
                key={`unavailable-${asyncId}`}
                asyncId={asyncId}
                color={color}
                condensed
              />
            );
          }

          return (
            <UnitCard
              key={bestUnit.id}
              unitId={bestUnit.id}
              color={color}
              deployedCount={deployedCount}
              unitCap={unitCounts?.[asyncId]?.unitCap}
              condensed
              showUpgradeState={showUnitUpgrades}
            />
          );
        })}

        {ccReinf !== undefined && (
          <CommandTokenCard
            color={color}
            faction={faction}
            reinforcements={ccReinf}
            totalCapacity={16}
            condensed
          />
        )}

        {stasisInfantry > 0 && (
          <StasisInfantryCard
            reviveCount={stasisInfantry}
            color={color}
            condensed
          />
        )}
      </Box>
    );
  }

  return (
    <SimpleGrid h="100%" cols={cols} spacing={spacing}>
      {UNIT_PRIORITY_ORDER.map((asyncId) => {
        const bestUnit = lookupUnit(asyncId, faction, playerData);
        const deployedCount = unitCounts?.[asyncId]?.deployedCount ?? 0;

        if (!bestUnit) {
          if (!showUnavailable) return null;
          return (
            <UnitCardUnavailable
              key={`unavailable-${asyncId}`}
              asyncId={asyncId}
              color={color}
            />
          );
        }

        const unitCap = unitCounts?.[asyncId]?.unitCap;

        return (
          <UnitCard
            key={bestUnit.id}
            unitId={bestUnit.id}
            color={color}
            deployedCount={deployedCount}
            unitCap={unitCap}
            showUpgradeState={showUnitUpgrades}
          />
        );
      })}

      {ccReinf !== undefined && (
        <CommandTokenCard
          color={color}
          faction={faction}
          reinforcements={ccReinf}
          totalCapacity={16}
        />
      )}

      {stasisInfantry > 0 && (
        <StasisInfantryCard reviveCount={stasisInfantry} color={color} />
      )}
    </SimpleGrid>
  );
}
