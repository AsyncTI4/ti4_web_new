// Intentionally no Mantine components used directly here
import { isMobileDevice } from "@/utils/isTouchDevice";
import { TechGrid } from "./TechGrid";
import { TechGridMobile } from "./TechGridMobile";
import { TechGridSidebar } from "./TechGridSidebar";
import { Grid } from "@mantine/core";
import type { BreakthroughData } from "@/data/types";

type Props = {
  techs?: string[];
  layout?: "grid" | "simple";
  exhaustedTechs?: string[];
  /** Optional: ensure at least N slots per tech color by adding placeholders (PhantomTech). */
  minSlotsPerColor?: number;
  mobile?: boolean;
  breakthrough?: BreakthroughData;
};

export function DynamicTechGrid({
  techs = [],
  layout = "simple",
  exhaustedTechs = [],
  minSlotsPerColor,
  mobile,
  breakthrough,
}: Props) {
  if (layout === "grid") {
    if (mobile) {
      return (
        <Grid gutter={4}>
          <TechGridMobile
            techs={techs}
            exhaustedTechs={exhaustedTechs}
            minSlotsPerColor={minSlotsPerColor}
            breakthrough={breakthrough}
          />
        </Grid>
      );
    }
    return (
      <Grid gutter={4}>
        <TechGrid
          techs={techs}
          exhaustedTechs={exhaustedTechs}
          minSlotsPerColor={minSlotsPerColor}
          breakthrough={breakthrough}
        />
      </Grid>
    );
  }

  // For sidebar components - uses SimpleGrid with rows of 2
  return (
    <TechGridSidebar
      techs={techs}
      exhaustedTechs={exhaustedTechs}
      minSlotsPerColor={minSlotsPerColor}
      breakthrough={breakthrough}
    />
  );
}
