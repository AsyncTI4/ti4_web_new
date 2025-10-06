import { Grid, Stack } from "@mantine/core";
import type { ReactNode } from "react";
import { techCategories, buildTechElementsForType } from "./TechGridShared";
import { PhantomTech } from "./PhantomTech";

type Props = {
  techs?: string[];
  exhaustedTechs?: string[];
  minSlotsPerColor?: number;
};

export function TechGrid({
  techs = [],
  exhaustedTechs = [],
  minSlotsPerColor,
}: Props) {
  const colSpan: number | { base: number; md: number } = { base: 6, md: 3 };

  return (
    <>
      {techCategories.map((techType) => {
        const techsForType: ReactNode[] = buildTechElementsForType(
          techType,
          techs,
          exhaustedTechs,
          minSlotsPerColor
        );
        return (
          <Grid.Col key={techType} span={colSpan}>
            <Stack key={techType} gap={4}>
              {techsForType.length > 0 ? (
                techsForType
              ) : (
                <PhantomTech techType={techType} />
              )}
            </Stack>
          </Grid.Col>
        );
      })}
    </>
  );
}


