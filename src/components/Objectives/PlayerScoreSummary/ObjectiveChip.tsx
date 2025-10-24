import type { ReactNode } from "react";
import type { EntryType, EntryState } from "@/data/types";
import cx from "clsx";
import styles from "./ObjectiveChip.module.css";
import { Tooltip } from "@mantine/core";

type ObjectiveChipProps = {
  icon?: ReactNode;
  entryType?: EntryType;
  state?: EntryState;
  span?: number;
  warningIcon?: ReactNode | null;
  hideLeftBorder?: boolean;
  hideRightBorder?: boolean;
  losable?: boolean;
  currentProgress?: number;
  totalProgress?: number;
  description?: string;
  zIndex?: number;
};

const ENTRY_TYPE_CLASS_MAP: Record<EntryType, string> = {
  PO_1: styles.po1,
  PO_2: styles.po2,
  SECRET: styles.secret,
  CUSTODIAN: styles.custodian,
  IMPERIAL: styles.imperial,
  CROWN: styles.crown,
  LATVINIA: styles.latvinia,
  SFTT: styles.sftt,
  SHARD: styles.shard,
  STYX: styles.styx,
  AGENDA: styles.agenda,
};

const STATE_CLASS_MAP: Record<EntryState, string> = {
  SCORED: styles.scored,
  QUALIFIES: styles.qualifies,
  POTENTIAL: styles.potential,
  UNSCORED: styles.unscored,
};

export function ObjectiveChip({
  icon,
  entryType = "PO_1",
  state = "SCORED",
  span = 1,
  warningIcon = null,
  hideLeftBorder = false,
  hideRightBorder = false,
  losable = false,
  currentProgress,
  totalProgress,
  description,
  zIndex,
}: ObjectiveChipProps) {
  const isTwoPoint = span === 2;
  const shouldApplyGrayscale = state === "UNSCORED";

  const chipContent = (
    <div
      className={cx(
        isTwoPoint ? styles.chipWide : styles.chip,
        ENTRY_TYPE_CLASS_MAP[entryType],
        STATE_CLASS_MAP[state],
        losable && styles.losable,
        hideLeftBorder && styles.hideLeftBorder,
        hideRightBorder && styles.hideRightBorder
      )}
      style={zIndex !== undefined ? { zIndex } : undefined}
    >
      {icon && (
        <div
          className={cx(
            styles.iconContainer,
            shouldApplyGrayscale && styles.grayscale
          )}
        >
          {icon}
        </div>
      )}
      {warningIcon && <div className={styles.warningIcon}>{warningIcon}</div>}
      {currentProgress !== undefined &&
        totalProgress !== undefined &&
        entryType !== "SECRET" &&
        (state === "QUALIFIES" || state === "POTENTIAL") && (
          <div className={styles.progress}>
            {currentProgress}/{totalProgress}
          </div>
        )}
    </div>
  );

  if (description) {
    return (
      <Tooltip label={description} withinPortal zIndex={6000}>
        {chipContent}
      </Tooltip>
    );
  }

  return chipContent;
}
