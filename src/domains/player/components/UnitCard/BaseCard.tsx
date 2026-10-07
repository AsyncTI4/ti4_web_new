import { Box, Text } from "@mantine/core";
import { ReactNode, type KeyboardEventHandler } from "react";
import styles from "./UnitCard.module.css";
import cx from "clsx";
import { FactionBadge, UpgradeFactionBadges } from "./FactionBadges";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  isUpgraded?: boolean;
  isFaction?: boolean;
  faction?: string;
  reinforcements?: number;
  totalCapacity?: number;
  enableAnimations?: boolean;
  locked?: boolean;
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
  reinforcements,
  totalCapacity,
  enableAnimations = true,
  locked = false,
  upgradeFactions,
}: Props) {
  const showReinforcements =
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
        locked && styles.locked
      )}
      onClick={clickable ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className={styles.bayInner}>
        <div className={styles.bayField}>
          {!upgradeFactions?.length && isFaction && faction && (
            <FactionBadge
              faction={faction}
              className={styles.factionBadge}
              iconClassName={styles.factionIcon}
            />
          )}
          <UpgradeFactionBadges
            factions={upgradeFactions}
            step={16}
            classNames={{
              container: styles.upgradeFactionBadgesContainer,
              badge: styles.upgradeFactionBadge,
              icon: styles.upgradeFactionIcon,
            }}
          />
          {children}
        </div>
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
