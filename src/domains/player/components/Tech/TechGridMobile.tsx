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

function packTechGroupsIntoColumns(groups: ReactNode[][]): ReactNode[][] {
  const columns: ReactNode[][] = [];
  let currentColumn: ReactNode[] = [];

  groups.forEach((group) => {
    if (group.length === 0) return;

    if (
      currentColumn.length > 0 &&
      currentColumn.length + group.length > TECHS_PER_COLUMN
    ) {
      columns.push(currentColumn);
      currentColumn = [];
    }

    if (group.length <= TECHS_PER_COLUMN) {
      currentColumn.push(...group);
      return;
    }

    const groupChunks = chunkInto(group, TECHS_PER_COLUMN);
    columns.push(...groupChunks.slice(0, -1));
    currentColumn = groupChunks.at(-1) ?? [];
  });

  if (currentColumn.length > 0) {
    columns.push(currentColumn);
  }

  return columns;
}

export function getTechGridMobileColumnCount(techs: string[] = []): number {
  const techGroups = techCategories.map((techType) =>
    buildTechElementsForType(techType, techs)
  );
  const columns = packTechGroupsIntoColumns(techGroups);

  return Math.max(1, columns.length);
}

export function TechGridMobile({
  techs = [],
  exhaustedTechs = [],
  minColumns = 1,
  breakthrough,
}: Props) {
  const techGroups = techCategories.map((techType) =>
    buildTechElementsForType(techType, techs, exhaustedTechs, undefined, true, breakthrough)
  );

  const chunks = packTechGroupsIntoColumns(techGroups);
  const columnCount = Math.max(minColumns, chunks.length || 1);

  return (
    <Group gap={4} align="flex-start" wrap="nowrap">
      {Array.from({ length: columnCount }, (_, idx) => chunks[idx] ?? []).map((chunk, idx) => (
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
      ))}
    </Group>
  );
}
