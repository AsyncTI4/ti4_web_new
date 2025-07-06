import { Stack, Box, Image, Group, Text, Flex } from "@mantine/core";
import { ReactNode } from "react";
import styles from "./UnitCard.module.css";
import { cdnImage } from "../../../data/cdnImage";

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
}: BaseCardProps) {
  const cardClass = isUpgraded
    ? `${styles.unitCard} ${styles.upgraded}`
    : `${styles.unitCard} ${styles.standard}`;

  const animatedClass = enableAnimations ? styles.animated : "";

  return (
    <Stack
      className={`${cardClass} ${animatedClass} ${styles.cardStack} ${className || ""}`}
      onClick={onClick}
    >
      {isUpgraded && (
        <>
          <Box className={styles.glassySheen} />
          <Box className={styles.innerGlow} />
        </>
      )}

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

      {!compact &&
        reinforcements !== undefined &&
        totalCapacity !== undefined && (
          <Stack className={styles.infoStack}>
            <Group className={styles.mainGroup}>
              {/* Reinforcements */}
              <Group className={styles.reinforcementGroup}>
                <Group className={styles.countGroup}>
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
              </Group>
            </Group>
          </Stack>
        )}
    </Stack>
  );
}
