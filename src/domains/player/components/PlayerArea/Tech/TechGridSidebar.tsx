import type { ReactNode } from "react";
import { SimpleGrid, Stack } from "@mantine/core";
import { buildCategoriesWithTechs, TechCategory } from "./TechGridShared";
import { getTechData } from "@/entities/lookup/tech";
import type { BreakthroughData } from "@/entities/data/types";

type Props = {
  techs?: string[];
  exhaustedTechs?: string[];
  minSlotsPerColor?: number;
  breakthrough?: BreakthroughData;
};

function filterCategoriesWithTechs(
  categories: { type: TechCategory; techs: ReactNode[] }[],
  techs: string[]
): { type: TechCategory; techs: ReactNode[] }[] {
  return categories.filter((category) => {
    // Check if there are any techs of this category type in the techs array
    return techs.some((techId) => {
      const techData = getTechData(techId);
      return techData?.types[0] === category.type;
    });
  });
}

export function TechGridSidebar({
  techs = [],
  exhaustedTechs = [],
  minSlotsPerColor,
  breakthrough,
}: Props) {
  const categoriesWithTechs = buildCategoriesWithTechs(
    techs,
    exhaustedTechs,
    minSlotsPerColor,
    breakthrough
  );

  // Filter out categories that have no actual techs (only show colors that have techs)
  const categoriesWithActualTechs = filterCategoriesWithTechs(
    categoriesWithTechs,
    techs
  );

  const rows: typeof categoriesWithActualTechs[] = [];
  for (let i = 0; i < categoriesWithActualTechs.length; i += 2) {
    rows.push(categoriesWithActualTechs.slice(i, i + 2));
  }

  return (
    <>
      {rows.map((row, rowIndex) => (
        <SimpleGrid key={rowIndex} cols={2} spacing="xs">
          {row.map((category) => (
            <Stack key={category.type} gap={4}>
              {category.techs}
            </Stack>
          ))}
          {row.length === 1 && <Stack gap={4} />}
        </SimpleGrid>
      ))}
    </>
  );
}


