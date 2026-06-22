import type { ReactNode } from "react";
import { Box, Group, Image, Text } from "@mantine/core";
import styles from "./UnitCard.module.css";
import cx from "clsx";
import { cdnImage } from "@/entities/data/cdnImage";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props = {
  image: ReactNode;
  reinforcements?: number;
  totalCapacity?: number;
  label?: string;
  upgraded?: boolean;
  faction?: string;
  upgradeFactions?: string[];
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
  faction,
  upgradeFactions,
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
      {!upgradeFactions?.length && faction && (
        <FactionBadge faction={faction} className={styles.denseFactionBadge} />
      )}
      <UpgradeFactionBadges factions={upgradeFactions} />
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

function FactionBadge({
  faction,
  className,
}: {
  faction: string;
  className: string;
}) {
  return (
    <Box className={className}>
      <Image
        {...lowPriorityImageProps}
        src={cdnImage(`/factions/${faction.toLowerCase()}.png`)}
        className={styles.denseFactionIcon}
      />
    </Box>
  );
}

function UpgradeFactionBadges({ factions }: { factions?: string[] }) {
  if (!factions || factions.length === 0) return null;

  return (
    <Box className={styles.denseUpgradeFactionBadgesContainer}>
      {factions.map((faction, index) => (
        <Box
          key={faction}
          className={styles.denseUpgradeFactionBadge}
          style={{ right: index * 13 }}
        >
          <Image
            {...lowPriorityImageProps}
            src={cdnImage(`/factions/${faction.toLowerCase()}.png`)}
            className={styles.denseUpgradeFactionIcon}
          />
        </Box>
      ))}
    </Box>
  );
}
