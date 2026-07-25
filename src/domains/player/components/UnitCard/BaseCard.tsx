import { Box, Image, Text } from "@mantine/core";
import { ReactNode, type KeyboardEventHandler } from "react";
import styles from "./UnitCard.module.css";
import { cdnImage } from "@/entities/data/cdnImage";
import cx from "clsx";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

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

/**
 * A unit bay: a milled pocket holding the sprite, with the reinforcement count
 * seated in a recessed trough along the bottom edge.
 */
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
    !compact &&
    !locked &&
    reinforcements !== undefined &&
    totalCapacity !== undefined;
  const clickable = onClick !== undefined && !locked;

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!clickable) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClick?.();
  };

  return (
    <Box
      className={cx(
        styles.bay,
        isUpgraded && styles.lit,
        enableAnimations && styles.animated,
        locked && styles.locked,
        compact && styles.compactCard,
        className
      )}
      onClick={clickable ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className={styles.bayInner}>
        <div className={styles.bayField}>
          {!upgradeFactions?.length && (
            <FactionBadge faction={faction} show={isFaction && !!faction} />
          )}
          <UpgradeFactionBadges factions={upgradeFactions} />
          {children}
        </div>
        {!compact && locked && lockedLabel && (
          <div className={styles.trough}>
            <Text className={styles.lockedText}>{lockedLabel}</Text>
          </div>
        )}
        {showReinforcements && (
          <div className={styles.trough}>
            <Text
              className={
                reinforcements === 0 ? styles.countTextZero : styles.countText
              }
            >
              {reinforcements}
            </Text>
            <Text className={styles.maxCountText}>/{totalCapacity}</Text>
          </div>
        )}
      </div>
    </Box>
  );
}

function FactionBadge({ faction, show }: { faction?: string; show: boolean }) {
  if (!show || !faction) return null;

  return (
    <Box className={styles.factionBadge}>
      <Image
        {...lowPriorityImageProps}
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
          style={{ right: index * 16 }}
        >
          <Image
            {...lowPriorityImageProps}
            src={cdnImage(`/factions/${faction.toLowerCase()}.png`)}
            className={styles.upgradeFactionIcon}
          />
        </Box>
      ))}
    </Box>
  );
}
