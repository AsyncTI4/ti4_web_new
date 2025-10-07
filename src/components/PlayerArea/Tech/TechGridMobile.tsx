import type { ReactNode } from "react";
import { Group, Stack, Box } from "@mantine/core";
import {
  techCategories,
  buildTechElementsForType,
  chunkInto,
} from "./TechGridShared";

type Props = {
  techs?: string[];
  exhaustedTechs?: string[];
  minSlotsPerColor?: number;
};

export function TechGridMobile({ techs = [], exhaustedTechs = [] }: Props) {
  const allTechElements: ReactNode[] = techCategories.flatMap((techType) =>
    buildTechElementsForType(techType, techs, exhaustedTechs, undefined, true)
  );

  const chunks = chunkInto(allTechElements, 4);
  return (
    <Group gap={4} align="flex-start" wrap="wrap">
      {chunks.map((chunk, idx) => (
        <Stack key={`tech-group-${idx}`} gap={4}>
          {chunk.map((child, i) => (
            <Box key={i} style={{ width: 190 }}>
              {child}
            </Box>
          ))}
        </Stack>
      ))}
    </Group>
  );
}
