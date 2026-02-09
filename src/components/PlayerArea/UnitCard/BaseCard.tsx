import { Box, Image, Group, Text, Flex, Stack } from "@mantine/core";
import { ReactNode } from "react";
import styles from "./UnitCard.module.css";
import { cdnImage } from "../../../data/cdnImage";
import { Chip } from "@/components/shared/primitives/Chip";
import cx from "clsx";

type BaseCardProps = {
  children: ReactNode;
  onClick?: () => void;
  isUpgraded?: boolean;
  isFaction?: boolean;
  faction?: string;
  compact?: boolean;
  reinforcements?: number;
  totalCapacity?: number;
  className?: string;
  enableAnimations?: boolean;
  locked?: boolean;
  lockedLabel?: string;
  upgradeFactions?: string[];
};

export function BaseCard({
  children,
  onClick,
  isUpgraded = false,
  isFaction = false,
  faction,
  compact = false,
  reinforcements,
  totalCapacity,
  className,
  enableAnimations = true,
  locked = false,
  lockedLabel = "",
  upgradeFactions,
}: BaseCardProps) {
  const showReinforcements =
    !compact && !locked && reinforcements !== undefined && totalCapacity !== undefined;

  return (
    <Chip
      accent="blue"
      className={cx(
        styles.unitCardShape,
        isUpgraded ? styles.upgraded : styles.standard,
        enableAnimations && styles.animated,
        locked && styles.locked,
        compact && styles.compactCard,
        className
      )}
      onClick={onClick}
      px={0}
      py={0}
    >
      {isUpgraded && (
        <>
          <Box className={styles.glassySheen} />
          <Box className={styles.innerGlow} />
        </>
      )}
      <Stack gap={0} align="center" w="100%">
        {!upgradeFactions?.length && (
          <FactionBadge faction={faction} show={isFaction && !!faction} />
        )}
        <UpgradeFactionBadges factions={upgradeFactions} />
        <Flex className={styles.imageContainer}>{children}</Flex>
        {!compact && locked && <LockedLabel label={lockedLabel} />}
        {showReinforcements && (
          <ReinforcementsDisplay
            reinforcements={reinforcements!}
            totalCapacity={totalCapacity!}
          />
        )}
      </Stack>
    </Chip>
  );
}

function FactionBadge({ faction, show }: { faction?: string; show: boolean }) {
  if (!show || !faction) return null;

  return (
    <Box className={styles.factionBadge}>
      <Image
        src={cdnImage(`/factions/${faction.toLowerCase()}.png`)}
        className={styles.factionIcon}
      />
    </Box>
  );
}

function UpgradeFactionBadges({ factions }: { factions?: string[] }) {
  if (!factions || factions.length === 0) return null;

  return (
    <Box className={styles.upgradeFactionBadgesContainer}>
      {factions.map((faction, index) => (
        <Box
          key={faction}
          className={styles.upgradeFactionBadge}
          style={{ right: index * 20 }}
        >
          <Image
            src={cdnImage(`/factions/${faction.toLowerCase()}.png`)}
            className={styles.upgradeFactionIcon}
          />
        </Box>
      ))}
    </Box>
  );
}

function LockedLabel({ label }: { label: string }) {
  return (
    <div className={styles.infoStack}>
      <Group className={styles.mainGroup}>
        <Text className={styles.lockedText}>{label}</Text>
      </Group>
    </div>
  );
}

function ReinforcementsDisplay({
  reinforcements,
  totalCapacity,
}: {
  reinforcements: number;
  totalCapacity: number;
}) {
  return (
    <div className={styles.infoStack}>
      <Group className={cx(styles.mainGroup, styles.reinforcementGroup, styles.countGroup)}>
        <Text className={reinforcements === 0 ? styles.countTextZero : styles.countText}>
          {reinforcements}
        </Text>
        <Text className={styles.maxCountText}>/{totalCapacity}</Text>
      </Group>
    </div>
  );
}
