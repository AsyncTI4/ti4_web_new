import type { ReactNode } from "react";
import { Box, Group, Text } from "@mantine/core";
import styles from "./UnitCard.module.css";
import cx from "clsx";

type Props = {
  image: ReactNode;
  reinforcements?: number;
  totalCapacity?: number;
  label?: string;
  upgraded?: boolean;
  dimmed?: boolean;
  onClick?: () => void;
};

/**
 * Minimal cell for the condensed units grid: icon on top, count below.
 * Cells are separated by the grid's hairline gaps rather than card borders.
 */
export function DenseUnitCell({
  image,
  reinforcements,
  totalCapacity,
  label,
  upgraded = false,
  dimmed = false,
  onClick,
}: Props) {
  return (
    <Box
      className={cx(
        styles.denseCell,
        upgraded && styles.denseCellUpgraded,
        dimmed && styles.denseCellDimmed
      )}
      onClick={onClick}
    >
      <Box className={styles.denseCellImage}>{image}</Box>
      {reinforcements !== undefined && (
        <Group gap={1} justify="center" wrap="nowrap" className={styles.denseCellCount}>
          <Text
            fz={10}
            lh={1}
            fw={700}
            className={reinforcements === 0 ? styles.countTextZero : styles.countText}
          >
            {reinforcements}
          </Text>
          {totalCapacity !== undefined && (
            <Text fz={9} lh={1} className={styles.maxCountText}>
              /{totalCapacity}
            </Text>
          )}
        </Group>
      )}
      {label && (
        <Text fz={8} lh={1} c="gray.5" tt="uppercase">
          {label}
        </Text>
      )}
    </Box>
  );
}
