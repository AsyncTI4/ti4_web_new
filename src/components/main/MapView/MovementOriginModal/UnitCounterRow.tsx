import { Group, Text, ActionIcon, Box } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Unit } from "@/components/shared/Unit";
import styles from "../MovementOriginModal.module.css";

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
        <Group gap={4}>
          <ActionIcon
            size="xs"
            variant="light"
            onClick={() => onAdjust("healthy", -1)}
            disabled={currentHealthy <= 0}
          >
            <IconMinus size={12} />
          </ActionIcon>
          <Text size="sm" className={styles.countValue}>
            {currentHealthy}
          </Text>
          <ActionIcon
            size="xs"
            variant="light"
            onClick={() => onAdjust("healthy", 1)}
            disabled={currentHealthy >= maxHealthy}
          >
            <IconPlus size={12} />
          </ActionIcon>
        </Group>

        {showSustained && (
          <>
            <Text size="xs" c="gray.4">
              Sust.
            </Text>
            <Group gap={4}>
              <ActionIcon
                size="xs"
                variant="light"
                onClick={() => onAdjust("sustained", -1)}
                disabled={currentSustained <= 0}
              >
                <IconMinus size={12} />
              </ActionIcon>
              <Text size="sm" className={styles.countValue}>
                {currentSustained}
              </Text>
              <ActionIcon
                size="xs"
                variant="light"
                onClick={() => onAdjust("sustained", 1)}
                disabled={currentSustained >= maxSustained}
              >
                <IconPlus size={12} />
              </ActionIcon>
            </Group>
          </>
        )}
      </Group>
    </Group>
  );
}
