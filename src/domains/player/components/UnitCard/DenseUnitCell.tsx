import { forwardRef, type KeyboardEvent, type ReactNode } from "react";
import { Box } from "@/ds";
import styles from "./UnitCard.module.css";
import cx from "clsx";
import { FactionBadge, UpgradeFactionBadges } from "./FactionBadges";

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
export const DenseUnitCell = forwardRef<HTMLDivElement, Props>(function DenseUnitCell(
  {
    image,
    reinforcements,
    totalCapacity,
    label,
    upgraded = false,
    faction,
    upgradeFactions,
    dimmed = false,
    onClick,
  },
  ref,
) {
  return (
    <Box
      ref={ref}
      className={cx(
        styles.denseCell,
        upgraded && styles.denseCellUpgraded,
        dimmed && styles.denseCellDimmed
      )}
      onClick={onClick}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (!onClick) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onClick();
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {!upgradeFactions?.length && faction && (
        <FactionBadge
          faction={faction}
          className={styles.factionBadge}
          iconClassName={styles.denseFactionIcon}
        />
      )}
      <UpgradeFactionBadges
        factions={upgradeFactions}
        step={13}
        classNames={{
          container: styles.upgradeFactionBadgesContainer,
          badge: styles.denseUpgradeFactionBadge,
          icon: styles.denseUpgradeFactionIcon,
        }}
      />
      <span className={styles.denseCellField}>{image}</span>
      {upgraded && !upgradeFactions?.length && !faction && (
        <img
          className={styles.upgradeBadge}
          src="/UnitUpgradeTech.png"
          alt="Upgraded"
        />
      )}
      {reinforcements !== undefined && (
        <span className={styles.denseTrough}>
          <span
            className={cx(
              styles.denseCellCount,
              reinforcements === 0 ? styles.countTextZero : styles.countText,
            )}
            data-total={totalCapacity}
          >
            {reinforcements}
          </span>
        </span>
      )}
      {label && (
        <span className={styles.denseTrough}>
          <span className={styles.denseLabel}>{label}</span>
        </span>
      )}
      {reinforcements === undefined && !label && (
        <span className={styles.denseTrough} />
      )}
    </Box>
  );
});
