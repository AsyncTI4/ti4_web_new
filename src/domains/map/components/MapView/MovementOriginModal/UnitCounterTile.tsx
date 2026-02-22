import { Text } from "@mantine/core";
import styles from "../MovementOriginModal.module.css";
import { UnitCountAdjuster } from "./UnitCountAdjuster";
import { UnitTileHeader } from "./UnitTileHeader";

type Props = {
  unitType: string;
  unitLabel: string;
  faction: string;
  colorAlias: string;
  currentHealthy: number;
  currentSustained: number;
  maxHealthy: number;
  maxSustained: number;
  onAdjust: (field: "healthy" | "sustained", delta: number) => void;
};

export function UnitCounterTile({
  unitType,
  unitLabel,
  faction,
  colorAlias,
  currentHealthy,
  currentSustained,
  maxHealthy,
  maxSustained,
  onAdjust,
}: Props) {
  const showSustained = maxSustained > 0;

  return (
    <div className={styles.unitTile}>
      <UnitTileHeader
        unitType={unitType}
        faction={faction}
        colorAlias={colorAlias}
        label={unitLabel}
      />

      <div className={styles.unitTileCounters}>
        <Text size="xs" c="gray.4">
          H
        </Text>
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
              S
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
      </div>
    </div>
  );
}
