import { Group, Text, ActionIcon, Stack } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import styles from "../MovementOriginModal.module.css";
import { UnitTileHeader } from "./UnitTileHeader";

type Context = {
  key: string;
  label: string;
  currentHealthy: number;
  currentSustained: number;
  maxHealthy: number;
  maxSustained: number;
  onAdjust: (field: "healthy" | "sustained", delta: number) => void;
};

type Props = {
  unitType: string;
  unitLabel: string;
  faction: string;
  colorAlias: string;
  totalAvailable: number;
  contexts: Context[];
  canAdjust?: boolean;
};

export function UnitMultiContextTile({
  unitType,
  unitLabel,
  faction,
  colorAlias,
  totalAvailable,
  contexts,
  canAdjust = true,
}: Props) {
  return (
    <div className={styles.unitTile}>
      <UnitTileHeader
        unitType={unitType}
        faction={faction}
        colorAlias={colorAlias}
        label={
          <>
            {unitLabel}
            <Text span c="gray.5">
              {" "}
              ({totalAvailable})
            </Text>
          </>
        }
      />

      <Stack gap={6}>
        {contexts.map((ctx) => {
          const showSustained = ctx.maxSustained > 0;
          return (
            <div key={ctx.key} className={styles.contextRow}>
              <Text
                size="sm"
                c="gray.3"
                fw={600}
                className={styles.contextLabel}
              >
                {ctx.label}
              </Text>
              <div className={styles.unitTileCounters}>
                <Group gap={4} style={{ gridColumn: "1 / span 2" }}>
                  <ActionIcon
                    size="xs"
                    variant="light"
                    onClick={() => ctx.onAdjust("healthy", -1)}
                    disabled={!canAdjust || ctx.currentHealthy <= 0}
                  >
                    <IconMinus size={12} />
                  </ActionIcon>
                  <Text size="sm" className={styles.countValue}>
                    {ctx.currentHealthy}
                  </Text>
                  <ActionIcon
                    size="xs"
                    variant="light"
                    onClick={() => ctx.onAdjust("healthy", 1)}
                    disabled={
                      !canAdjust || ctx.currentHealthy >= ctx.maxHealthy
                    }
                  >
                    <IconPlus size={12} />
                  </ActionIcon>
                </Group>

                {showSustained && (
                  <>
                    <Text size="xs" c="gray.4">
                      S
                    </Text>
                    <Group gap={4}>
                      <ActionIcon
                        size="xs"
                        variant="light"
                        onClick={() => ctx.onAdjust("sustained", -1)}
                        disabled={!canAdjust || ctx.currentSustained <= 0}
                      >
                        <IconMinus size={12} />
                      </ActionIcon>
                      <Text size="sm" className={styles.countValue}>
                        {ctx.currentSustained}
                      </Text>
                      <ActionIcon
                        size="xs"
                        variant="light"
                        onClick={() => ctx.onAdjust("sustained", 1)}
                        disabled={
                          !canAdjust || ctx.currentSustained >= ctx.maxSustained
                        }
                      >
                        <IconPlus size={12} />
                      </ActionIcon>
                    </Group>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </Stack>
    </div>
  );
}
