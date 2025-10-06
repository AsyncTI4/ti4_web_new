import { SimpleGrid, Stack } from "@mantine/core";
import { buildCategoriesWithTechs } from "./TechGridShared";

type Props = {
  techs?: string[];
  exhaustedTechs?: string[];
  minSlotsPerColor?: number;
};

export function TechGridSidebar({
  techs = [],
  exhaustedTechs = [],
  minSlotsPerColor,
}: Props) {
  const categoriesWithTechs = buildCategoriesWithTechs(
    techs,
    exhaustedTechs,
    minSlotsPerColor
  );

  const rows: typeof categoriesWithTechs[] = [];
  for (let i = 0; i < categoriesWithTechs.length; i += 2) {
    rows.push(categoriesWithTechs.slice(i, i + 2));
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


