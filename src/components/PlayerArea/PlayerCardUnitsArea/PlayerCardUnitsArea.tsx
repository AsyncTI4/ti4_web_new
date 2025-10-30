import { SimpleGrid } from "@mantine/core";
import { UnitCard, UnitCardUnavailable } from "../UnitCard";
import { CommandTokenCard } from "../UnitCard/CommandTokenCard";
import { StasisInfantryCard } from "../StasisInfantryCard";
import { lookupUnit } from "@/lookup/units";
import type { PlayerData } from "@/data/types";

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
};

export function PlayerCardUnitsArea({
  playerData,
  color,
  faction,
  cols = { base: 4, xl: 6 },
  spacing = "8px",
  showUnavailable = true,
}: PlayerCardUnitsAreaProps) {
  const unitCounts = playerData.unitCounts || {};
  const stasisInfantry = playerData.stasisInfantry || 0;
  const ccReinf = playerData.ccReinf;

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

        return (
          <UnitCard
            key={bestUnit.id}
            unitId={bestUnit.id}
            color={color}
            deployedCount={deployedCount}
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

