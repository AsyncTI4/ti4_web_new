import { Group, Text, Box } from "@mantine/core";
import { Unit } from "@/shared/ui/Unit";
import styles from "../MovementOriginModal.module.css";
import { UnitCountAdjuster } from "./UnitCountAdjuster";

type Props = {
  unitType: string;
  unitLabel: string;
  faction: string;
  colorAlias: string;
  currentHealthy: number;
  currentSustained: number;
  maxHealthy: number;
  maxSustained: number;
  totalAvailable?: number;
  onAdjust: (field: "healthy" | "sustained", delta: number) => void;
};

export function UnitCounterRow({
  unitType,
  unitLabel,
  faction,
  colorAlias,
  currentHealthy,
  currentSustained,
  maxHealthy,
  maxSustained,
  totalAvailable,
  onAdjust,
}: Props) {
  const showSustained = maxSustained > 0;

  return (
    <Group justify="space-between" align="center" className={styles.unitRow}>
      <Group gap={8} className={styles.unitInfo}>
        <Box className={styles.unitIconWrap}>
          <Unit
            unitType={unitType}
            colorAlias={colorAlias}
            faction={faction}
            style={{ width: 22, height: 22, objectFit: "contain" }}
          />
        </Box>
        <Text size="sm" c="gray.2" fw={600}>
          {unitLabel}
          {typeof totalAvailable === "number" && (
            <Text span c="gray.5">
              {" "}
              ({totalAvailable})
            </Text>
          )}
        </Text>
      </Group>

      <Group gap={10} className={styles.counterGroup}>
        <UnitCountAdjuster
          field="healthy"
          value={currentHealthy}
          max={maxHealthy}
          onAdjust={onAdjust}
          valueClassName={styles.countValue}
        />

        {showSustained && (
          <>
            <Text size="xs" c="gray.4">
              Sust.
            </Text>
            <UnitCountAdjuster
              field="sustained"
              value={currentSustained}
              max={maxSustained}
              onAdjust={onAdjust}
              valueClassName={styles.countValue}
            />
          </>
        )}
      </Group>
    </Group>
  );
}
