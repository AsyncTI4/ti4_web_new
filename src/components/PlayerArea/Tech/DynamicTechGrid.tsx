// Intentionally no Mantine components used directly here
import { isMobileDevice } from "@/utils/isTouchDevice";
import { TechGrid } from "./TechGrid";
import { TechGridMobile } from "./TechGridMobile";
import { TechGridSidebar } from "./TechGridSidebar";
import { Grid } from "@mantine/core";

type Props = {
  techs?: string[];
  layout?: "grid" | "simple";
  exhaustedTechs?: string[];
  /** Optional: ensure at least N slots per tech color by adding placeholders (PhantomTech). */
  minSlotsPerColor?: number;
};

export function DynamicTechGrid({
  techs = [],
  layout = "simple",
  exhaustedTechs = [],
  minSlotsPerColor,
}: Props) {
  if (layout === "grid") {
    if (isMobileDevice()) {
      return (
        <Grid gutter={4}>
          <TechGridMobile
            techs={techs}
            exhaustedTechs={exhaustedTechs}
            minSlotsPerColor={minSlotsPerColor}
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
        />
      </Grid>
    );
  }

  // For sidebar components - uses SimpleGrid with rows of 2
  return (
    <Grid gutter={4}>
      <TechGridSidebar
        techs={techs}
        exhaustedTechs={exhaustedTechs}
        minSlotsPerColor={minSlotsPerColor}
      />
    </Grid>
  );
}
