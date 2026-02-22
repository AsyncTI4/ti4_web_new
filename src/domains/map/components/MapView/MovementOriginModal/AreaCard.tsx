import { Box, Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import styles from "../MovementOriginModal.module.css";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { UnitCounterRow } from "./UnitCounterRow";

type UnitCounts = {
  healthy: number;
  sustained: number;
  maxHealthy: number;
  maxSustained: number;
};

type Props = {
  label: string;
  factions: string[];
  byFaction: Record<string, Record<string, UnitCounts>>;
  colorAliasForFaction: (faction: string) => string;
  getCurrentCounts: (
    faction: string,
    unitType: string
  ) => { healthy: number; sustained: number };
  onAdjust: (
    faction: string,
    unitType: string,
    field: "healthy" | "sustained",
    delta: number
  ) => void;
  getUnitLabel: (unitType: string, faction: string) => string;
};

export function AreaCard({
  label,
  factions,
  byFaction,
  colorAliasForFaction,
  getCurrentCounts,
  onAdjust,
  getUnitLabel,
}: Props) {
  return (
    <Card withBorder className={styles.areaCard}>
      <Group justify="space-between" className={styles.areaHeader}>
        <Text
          size="xs"
          tt="uppercase"
          fw={700}
          c="gray.5"
          className={styles.areaCaption}
        >
          {label}
        </Text>
      </Group>
      <Stack>
        {factions.map((faction) => {
          const units = Object.keys(byFaction[faction] || {}).sort((a, b) =>
            a.localeCompare(b)
          );
          const colorAlias = colorAliasForFaction(faction);
          return (
            <div key={faction} className={styles.factionBlock}>
              <Group gap={6} className={styles.factionHeader}>
                <CircularFactionIcon faction={faction} size={20} />
                <Text fw={700} size="xs" c="gray.2">
                  {faction}
                </Text>
              </Group>
              <SimpleGrid cols={3} verticalSpacing="md">
                {units.map((unitType) => {
                  const caps = byFaction[faction][unitType];
                  const current = getCurrentCounts(faction, unitType);
                  const unitLabel = getUnitLabel(unitType, faction);
                  const totalAvailable = caps.maxHealthy + caps.maxSustained;
                  return (
                    <UnitCounterRow
                      key={`${faction}-${unitType}`}
                      unitType={unitType}
                      unitLabel={unitLabel}
                      faction={faction}
                      colorAlias={colorAlias}
                      currentHealthy={current.healthy}
                      currentSustained={current.sustained}
                      maxHealthy={caps.maxHealthy}
                      maxSustained={caps.maxSustained}
                      totalAvailable={totalAvailable}
                      onAdjust={(field, delta) =>
                        onAdjust(faction, unitType, field, delta)
                      }
                    />
                  );
                })}
              </SimpleGrid>
            </div>
          );
        })}
      </Stack>
    </Card>
  );
}
