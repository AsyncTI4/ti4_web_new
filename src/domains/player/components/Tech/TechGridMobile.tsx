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

const TECHS_PER_COLUMN = 4;
const TECH_COLUMN_WIDTH = 190;

export function getTechGridMobileColumnCount(techs: string[] = []): number {
  const renderedTechCount = techCategories.reduce(
    (count, techType) =>
      count + buildTechElementsForType(techType, techs).length,
    0
  );

  return Math.max(1, Math.ceil(renderedTechCount / TECHS_PER_COLUMN));
}

export function TechGridMobile({
  techs = [],
  exhaustedTechs = [],
  minColumns = 1,
  breakthrough,
}: Props) {
  const allTechElements: ReactNode[] = techCategories.flatMap((techType) =>
    buildTechElementsForType(techType, techs, exhaustedTechs, undefined, true, breakthrough)
  );

  const chunks = chunkInto(allTechElements, TECHS_PER_COLUMN);
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
