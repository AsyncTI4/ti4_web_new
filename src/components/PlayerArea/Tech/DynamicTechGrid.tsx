import { Grid, Stack, SimpleGrid } from "@mantine/core";

type TechCategory = "PROPULSION" | "CYBERNETIC" | "BIOTIC" | "WARFARE";

type Props = {
  renderTechColumn: (
    techType: string,
    exhaustedTechs?: string[]
  ) => React.ReactNode[];
  layout?: "grid" | "simple";
  exhaustedTechs?: string[];
};

export function DynamicTechGrid({
  renderTechColumn,
  layout = "simple",
  exhaustedTechs = [],
}: Props) {
  const techCategories: TechCategory[] = [
    "PROPULSION",
    "CYBERNETIC",
    "BIOTIC",
    "WARFARE",
  ];

  const categoriesWithTechs = techCategories
    .map((techType) => ({
      type: techType,
      techs: renderTechColumn(techType, exhaustedTechs),
    }))
    .filter((category) => category.techs.length > 0);

  if (categoriesWithTechs.length === 0) return null;

  if (layout === "grid") {
    return (
      <>
        {categoriesWithTechs.map((category) => (
          <Grid.Col
            key={category.type}
            span={{
              base: 6,
              md: 6,
            }}
          >
            <Stack gap={4}>{category.techs}</Stack>
          </Grid.Col>
        ))}
      </>
    );
  }

  // For sidebar components - uses SimpleGrid with rows of 2
  const rows = [];
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
          {/* Add empty column if row has only 1 category */}
          {row.length === 1 && <Stack gap={4} />}
        </SimpleGrid>
      ))}
    </>
  );
}
