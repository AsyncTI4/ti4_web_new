import { Box } from "@mantine/core";
import cx from "clsx";
import { ScoredSecret } from "@/domains/player/components/ScoredSecret";
import { UnscoredSecret } from "@/domains/player/components/ScoredSecret/UnscoredSecret";
import { Relic } from "@/domains/player/components/Relic";
import { PromissoryNote } from "@/domains/player/components/PromissoryNote";
import { PhantomSlot } from "@/domains/player/components/PhantomSlot/PhantomSlot";
import { chunkInto } from "@/domains/player/components/Tech/TechGridShared";
import { isMobileDevice } from "@/utils/isTouchDevice";
import styles from "./ObjectivesRack.module.css";

type ObjectivesRackProps = {
  secretsScored: Record<string, number>;
  knownUnscoredSecrets?: Record<string, number>;
  soCount?: number;
  promissoryNotes: string[];
  relics: string[];
  exhaustedRelics?: string[];
  minColumns?: number;
  /** Rack depth imposed from outside, so sibling racks share a row count. */
  minRows?: number;
  /**
   * Fixed-width columns anchor the pannable band, where the card grows
   * horizontally. In a card that must fill whatever width its row deals it,
   * fluid columns split the plate equally instead, so slack widens the seats
   * rather than pooling as dead field beside the rack.
   */
  fluid?: boolean;
};

type ObjectiveCounts = Omit<
  ObjectivesRackProps,
  "exhaustedRelics" | "minColumns" | "minRows" | "fluid"
>;

const OBJECTIVE_COLUMN_WIDTH = 170;
const OBJECTIVE_GRID_GAP = 4;
const OBJECTIVES_PER_COLUMN = 6;

/** Secrets go in their own column; relics and notes share the ones after it. */
function countObjectiveItems({
  secretsScored,
  knownUnscoredSecrets,
  soCount,
  promissoryNotes,
  relics,
}: ObjectiveCounts): { secretCount: number; otherCount: number } {
  const knownUnscoredCount = Object.keys(knownUnscoredSecrets ?? {}).length;

  return {
    secretCount:
      Object.keys(secretsScored).length +
      knownUnscoredCount +
      Math.max((soCount ?? 0) - knownUnscoredCount, 0),
    otherCount: relics.length + promissoryNotes.length,
  };
}

export function getObjectiveColumnCount(counts: ObjectiveCounts): number {
  const { secretCount, otherCount } = countObjectiveItems(counts);

  if (secretCount + otherCount <= OBJECTIVES_PER_COLUMN) return 1;

  return 1 + Math.ceil(otherCount / OBJECTIVES_PER_COLUMN);
}

/**
 * How deep this player's holdings rack is — the fullest column. Read by the
 * card so a sibling rack can be padded to the same depth.
 */
export function getObjectiveRowCount(counts: ObjectiveCounts): number {
  const { secretCount, otherCount } = countObjectiveItems(counts);
  const totalCount = secretCount + otherCount;

  if (totalCount <= OBJECTIVES_PER_COLUMN) return totalCount;

  const lastOtherColumn = otherCount % OBJECTIVES_PER_COLUMN;
  const fullOtherColumns = otherCount >= OBJECTIVES_PER_COLUMN;

  return Math.max(
    secretCount,
    fullOtherColumns ? OBJECTIVES_PER_COLUMN : lastOtherColumn
  );
}

export function ObjectivesRack({
  secretsScored,
  knownUnscoredSecrets,
  soCount,
  promissoryNotes,
  relics,
  exhaustedRelics,
  minColumns = 1,
  minRows = 0,
  fluid = false,
}: ObjectivesRackProps) {
  const knownUnscoredIds = Object.keys(knownUnscoredSecrets ?? {});
  const hiddenSecretCount = Math.max((soCount || 0) - knownUnscoredIds.length, 0);
  const secretItems = [
    ...Object.keys(secretsScored).map((secretId) => (
      <ScoredSecret
        key={`scored-${secretId}`}
        secretId={secretId}
        variant="scored"
      />
    )),
    ...knownUnscoredIds.map((secretId) => (
      <ScoredSecret
        key={`unscored-${secretId}`}
        secretId={secretId}
        variant="unscored"
      />
    )),
    ...Array.from({ length: hiddenSecretCount }, (_, index) => (
      <UnscoredSecret key={`placeholder-${index}`} />
    )),
  ];
  const otherItems = [
    ...relics.map((relicId, index) => (
      <Relic
        key={`relic-${relicId}-${index}`}
        relicId={relicId}
        isExhausted={exhaustedRelics?.includes(relicId) ?? false}
      />
    )),
    ...promissoryNotes.map((promissoryNoteId) => (
      <PromissoryNote
        key={`pn-${promissoryNoteId}`}
        promissoryNoteId={promissoryNoteId}
      />
    )),
  ];
  const allItems = [...secretItems, ...otherItems];
  const minWidth = fluid
    ? undefined
    : minColumns * OBJECTIVE_COLUMN_WIDTH +
      (minColumns - 1) * OBJECTIVE_GRID_GAP;

  /*
   * The compartment is a rack: secrets in the first column, relics and notes in
   * the ones after it, capped at six per column. Splitting is unchanged — only
   * the leftover seats are now drawn, so a player holding two cards reads as two
   * cards in a rack rather than as a panel that failed to fill.
   *
   * The rack is as deep as its fullest column, or as deep as the rack beside it
   * (minRows) — the two share a floor so the compartments line up. Nothing pads
   * to a fixed six: that would add a row nobody's holdings need and push the
   * whole player plate taller than its content.
   *
   * Touch devices get no empty seats: they steady a wide desktop band, and on a
   * phone they would be elements paying for nothing.
   */
  /*
   * Fluid racks always split and never run below two columns: a lone column
   * would stretch its seats across the whole plate, and a chip the width of a
   * card stops reading as a seat in a rack. The second column starts as
   * sockets, which is the same statement the band makes — capacity, unfilled.
   */
  const splitColumns =
    (fluid && otherItems.length > 0) ||
    allItems.length > OBJECTIVES_PER_COLUMN;
  const itemColumns = splitColumns
    ? [secretItems, ...chunkInto(otherItems, OBJECTIVES_PER_COLUMN)]
    : [allItems];

  const columnCount = Math.max(
    fluid ? 2 : minColumns,
    minColumns,
    itemColumns.length
  );
  const rowCount = isMobileDevice()
    ? 0
    : itemColumns.reduce((max, column) => Math.max(max, column.length), minRows);

  return (
    <Box
      className={cx(styles.rack, fluid && styles.rackFluid)}
      style={minWidth !== undefined ? { minWidth } : undefined}
    >
      {Array.from({ length: columnCount }, (_, columnIndex) => {
        const columnItems = itemColumns[columnIndex] ?? [];
        return (
          <Box className={styles.column} key={`column-${columnIndex}`}>
            {columnItems}
            {Array.from({ length: rowCount - columnItems.length }, (_, index) => (
              <PhantomSlot key={`phantom-${columnIndex}-${index}`} />
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
