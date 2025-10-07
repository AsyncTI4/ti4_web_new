import { Box, Image, Group, Text, Flex, Stack } from "@mantine/core";
import { ReactNode } from "react";
import styles from "./UnitCard.module.css";
import { cdnImage } from "../../../data/cdnImage";
import { Chip } from "@/components/shared/primitives/Chip";

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
}: BaseCardProps) {
  const cardClass = isUpgraded ? `${styles.upgraded}` : `${styles.standard}`;
  const animatedClass = enableAnimations ? styles.animated : "";
  const lockedClass = locked ? styles.locked : "";
  const compactClass = compact ? styles.compactCard : "";

  return (
    <Chip
      accent="blue"
      className={`${cardClass} ${animatedClass} ${lockedClass} ${compactClass} ${className || ""}`}
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
        {/* Faction icon badge for faction-specific units */}
        {isFaction && faction && (
          <Box className={styles.factionBadge}>
            <Image
              src={cdnImage(`/factions/${faction.toLowerCase()}.png`)}
              className={styles.factionIcon}
            />
          </Box>
        )}

        <Flex className={styles.imageContainer}>{children}</Flex>

        {!compact && locked && (
          <div className={styles.infoStack}>
            <Group className={styles.mainGroup}>
              <Text className={styles.lockedText}>{lockedLabel}</Text>
            </Group>
          </div>
        )}

        {!compact &&
          !locked &&
          reinforcements !== undefined &&
          totalCapacity !== undefined && (
            <div className={styles.infoStack}>
              <Group
                className={`${styles.mainGroup} ${styles.reinforcementGroup} ${styles.countGroup}`}
              >
                <Text
                  className={
                    reinforcements === 0
                      ? styles.countTextZero
                      : styles.countText
                  }
                >
                  {reinforcements}
                </Text>
                <Text className={styles.maxCountText}>/{totalCapacity}</Text>
              </Group>
            </div>
          )}
      </Stack>
    </Chip>
  );
}
