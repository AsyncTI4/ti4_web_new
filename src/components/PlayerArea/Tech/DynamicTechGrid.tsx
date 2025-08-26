import { Grid, Stack, SimpleGrid } from "@mantine/core";
import { Tech } from "./Tech";
import { getTechData, getTechTier } from "@/lookup/tech";
import { PhantomTech } from "./PhantomTech";

type TechCategory = "PROPULSION" | "CYBERNETIC" | "BIOTIC" | "WARFARE";

type Props = {
  techs?: string[];
  layout?: "grid" | "simple";
  exhaustedTechs?: string[];
};
const techCategories: TechCategory[] = [
  "PROPULSION",
  "CYBERNETIC",
  "BIOTIC",
  "WARFARE",
];

export function DynamicTechGrid({
  techs = [],
  layout = "simple",
  exhaustedTechs = [],
}: Props) {
  const renderTechColumn = (
    techType: string,
    exhaustedTechs: string[] = []
  ) => {
    const filteredTechs = techs.filter((techId) => {
      const techData = getTechData(techId);
      return techData?.types[0] === techType;
    });

    // Sort techs by tier (lower tier first)
    const sortedTechs = filteredTechs.sort((a, b) => {
      const techDataA = getTechData(a);
      const techDataB = getTechData(b);
      const tierA = techDataA ? getTechTier(techDataA.requirements) : 999;
      const tierB = techDataB ? getTechTier(techDataB.requirements) : 999;
      return tierA - tierB;
    });

    const techElements = sortedTechs.map((techId, index) => (
      <Tech
        key={index}
        techId={techId}
        isExhausted={exhaustedTechs.includes(techId)}
      />
    ));

    return [...techElements];
  };

  const categoriesWithTechs = techCategories.map((techType) => ({
    type: techType,
    techs: renderTechColumn(techType, exhaustedTechs),
  }));

  if (categoriesWithTechs.length === 0) return null;

  if (layout === "grid") {
    return (
      <>
        {techCategories.map((techType) => {
          const techs = renderTechColumn(techType, exhaustedTechs);
          return (
            <Grid.Col
              key={techType}
              span={{
                base: 6,
                md: 3,
              }}
            >
              <Stack key={techType} gap={4}>
                {techs.length > 0 ? techs : <PhantomTech techType={techType} />}
              </Stack>
            </Grid.Col>
          );
        })}
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
