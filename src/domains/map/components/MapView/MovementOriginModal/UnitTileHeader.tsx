import { ReactNode } from "react";
import { Box, Group, Text } from "@mantine/core";
import { Unit } from "@/shared/ui/Unit";
import styles from "../MovementOriginModal.module.css";

type UnitTileHeaderProps = {
  unitType: string;
  faction: string;
  colorAlias: string;
  label: ReactNode;
};

export function UnitTileHeader({
  unitType,
  faction,
  colorAlias,
  label,
}: UnitTileHeaderProps) {
  return (
    <Group gap={8} align="center" className={styles.unitTileHeader}>
      <Box className={styles.unitIconWrap}>
        <Unit
          unitType={unitType}
          colorAlias={colorAlias}
          faction={faction}
          style={{ width: 22, height: 22, objectFit: "contain" }}
        />
      </Box>
      <Text size="xs" c="gray.2" fw={600} lineClamp={1}>
        {label}
      </Text>
    </Group>
  );
}
