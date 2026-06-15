import type { ReactNode } from "react";
import { Group, Stack, Box } from "@mantine/core";
import {
  techCategories,
  buildTechElementsForType,
  chunkInto,
} from "./TechGridShared";
import type { BreakthroughData } from "@/entities/data/types";

type Props = {
  techs?: string[];
  exhaustedTechs?: string[];
  minSlotsPerColor?: number;
  minColumns?: number;
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

export function TechGridMobile({
  techs = [],
  exhaustedTechs = [],
  minColumns = 1,
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
  const chunks = packTechGroupsIntoColumns(techGroups, columnCount);

  return (
    <Group gap={4} align="flex-start" wrap="nowrap">
      {Array.from({ length: columnCount }, (_, idx) => chunks[idx] ?? []).map(
        (chunk, idx) => (
          <Stack key={`tech-group-${idx}`} gap={4}>
            {chunk.map((child, i) => (
              <Box key={i} style={{ width: TECH_COLUMN_WIDTH }}>
                {child}
              </Box>
            ))}
            {chunk.length === 0 && (
              <Box style={{ width: TECH_COLUMN_WIDTH }} aria-hidden="true" />
            )}
          </Stack>
        )
      )}
    </Group>
  );
}
