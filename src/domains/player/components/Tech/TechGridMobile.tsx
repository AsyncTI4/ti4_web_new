import type { ReactNode } from "react";
import { Group, Stack, Box } from "@mantine/core";
import {
  techCategories,
  buildTechElementsForType,
  chunkInto,
} from "./TechGridShared";
import { PhantomTech } from "./PhantomTech";
import type { BreakthroughData } from "@/entities/data/types";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  techs?: string[];
  exhaustedTechs?: string[];
  minSlotsPerColor?: number;
  minColumns?: number;
  /** Rack depth imposed from outside, so sibling racks share a row count. */
  minRows?: number;
  breakthrough?: BreakthroughData;
};

const TECHS_PER_COLUMN = 6;
const TECH_COLUMN_WIDTH = 190;

function getPackableGroups(groups: ReactNode[][]): ReactNode[][] {
  return groups
    .flatMap((group) =>
      group.length > TECHS_PER_COLUMN
        ? chunkInto(group, TECHS_PER_COLUMN)
        : [group]
    )
    .filter((group) => group.length > 0);
}

function getMinimumTechColumnCount(groups: ReactNode[][]): number {
  const packableGroups = getPackableGroups(groups);
  if (packableGroups.length === 0) return 1;

  let columnCount = 1;
  let currentCount = 0;

  packableGroups.forEach((group) => {
    if (currentCount > 0 && currentCount + group.length > TECHS_PER_COLUMN) {
      columnCount += 1;
      currentCount = 0;
    }

    currentCount += group.length;
  });

  return columnCount;
}

function packTechGroupsIntoColumns(
  groups: ReactNode[][],
  columnCount: number
): ReactNode[][] {
  const packableGroups = getPackableGroups(groups);
  const totalCount = packableGroups.reduce(
    (count, group) => count + group.length,
    0
  );
  const targetRows = Math.ceil(totalCount / columnCount);
  const columns: ReactNode[][] = Array.from({ length: columnCount }, () => []);
  const columnCounts = Array.from({ length: columnCount }, () => 0);
  let columnIndex = 0;

  packableGroups.forEach((group, index) => {
    const remainingGroupsAfterThis = packableGroups.length - index - 1;
    const remainingColumnsAfterThis = columnCount - columnIndex - 1;
    const wouldOverflow =
      columnCounts[columnIndex] > 0 &&
      columnCounts[columnIndex] + group.length > TECHS_PER_COLUMN;
    const wouldImproveBalance =
      Math.abs(columnCounts[columnIndex] + group.length - targetRows) >
      Math.abs(columnCounts[columnIndex] - targetRows);
    const shouldMoveToNextColumn =
      columnIndex < columnCount - 1 &&
      columnCounts[columnIndex] > 0 &&
      (wouldOverflow ||
        (columnCount > 1 &&
          wouldImproveBalance &&
          remainingGroupsAfterThis >= remainingColumnsAfterThis));

    if (shouldMoveToNextColumn) {
      columnIndex += 1;
    }

    columns[columnIndex].push(...group);
    columnCounts[columnIndex] += group.length;
  });

  return columns;
}

export function getTechGridMobileColumnCount(techs: string[] = []): number {
  const techGroups = techCategories.map((techType) =>
    buildTechElementsForType(techType, techs)
  );

  return getMinimumTechColumnCount(techGroups);
}

function packIntoColumns(
  groups: ReactNode[][],
  columnCount: number
): ReactNode[][] {
  const chunks = packTechGroupsIntoColumns(groups, columnCount);
  return Array.from({ length: columnCount }, (_, idx) => chunks[idx] ?? []);
}

/**
 * How deep this player's tech rack is once packed — the fullest column. Read by
 * the card so the objectives rack beside it can be padded to the same depth.
 * Uses the same packing as the render, so the answer can't drift from it.
 */
export function getTechGridMobileRowCount(
  techs: string[] = [],
  minColumns = 1
): number {
  const techGroups = techCategories.map((techType) =>
    buildTechElementsForType(techType, techs)
  );
  const columnCount = Math.max(
    minColumns,
    getMinimumTechColumnCount(techGroups)
  );

  return packIntoColumns(techGroups, columnCount).reduce(
    (max, column) => Math.max(max, column.length),
    0
  );
}

export function TechGridMobile({
  techs = [],
  exhaustedTechs = [],
  minColumns = 1,
  minRows = 0,
  breakthrough,
}: Props) {
  const techGroups = techCategories.map((techType) =>
    buildTechElementsForType(
      techType,
      techs,
      exhaustedTechs,
      undefined,
      true,
      breakthrough
    )
  );

  const columnCount = Math.max(
    minColumns,
    getMinimumTechColumnCount(techGroups)
  );
  const columns = packIntoColumns(techGroups, columnCount);

  /*
   * The packed grid is a rectangle: as many rows as the longest column, or as
   * many as a sibling rack needs (minRows), whichever is deeper. Short columns
   * used to just stop, leaving ragged holes that read as a layout bug. Filling
   * the remainder with empty sockets makes the rack read like an RTS build queue
   * — fixed capacity, some of it filled — without moving a single researched
   * tech: padding is appended, packing is untouched.
   *
   * Skipped on touch devices: the empty seats are there to steady a wide desktop
   * band, and on a phone they'd be hundreds of elements paying for nothing.
   */
  const rowCount = isMobileDevice()
    ? 0
    : columns.reduce((max, column) => Math.max(max, column.length), minRows);

  return (
    <Group gap={4} align="flex-start" wrap="nowrap">
      {columns.map((chunk, idx) => (
        <Stack key={`tech-group-${idx}`} gap={4}>
          {chunk.map((child, i) => (
            <Box key={i} style={{ width: TECH_COLUMN_WIDTH }}>
              {child}
            </Box>
          ))}
          {Array.from({ length: rowCount - chunk.length }, (_, i) => (
            <Box key={`empty-${i}`} style={{ width: TECH_COLUMN_WIDTH }}>
              <PhantomTech />
            </Box>
          ))}
          {/* A column with nothing in it still holds its width open. */}
          {chunk.length === 0 && rowCount === 0 && (
            <Box style={{ width: TECH_COLUMN_WIDTH }} aria-hidden="true" />
          )}
        </Stack>
      ))}
    </Group>
  );
}
