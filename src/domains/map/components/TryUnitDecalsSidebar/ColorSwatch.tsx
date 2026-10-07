import { Box, Text } from "@mantine/core";
import { getColorValues, toRgb } from "@/entities/lookup/colors";
import type { Color } from "@/entities/data/types";
import classes from "../TryUnitDecalsSidebar.module.css";

type Props = {
  color: Color;
  isSelected: boolean;
  onClick: () => void;
};

export function ColorSwatch({ color, isSelected, onClick }: Props) {
  const primaryColorValues = getColorValues(
    color.primaryColorRef,
    color.primaryColor
  );
  const secondaryColorValues = getColorValues(
    color.secondaryColorRef,
    color.secondaryColor
  );

  const primaryCss = primaryColorValues && toRgb(primaryColorValues);
  const secondaryCss = secondaryColorValues && toRgb(secondaryColorValues);
  const background =
    primaryCss && secondaryCss
      ? `linear-gradient(135deg, ${primaryCss} 0%, ${primaryCss} 30%, ${secondaryCss} 70%, ${secondaryCss} 100%)`
      : primaryCss;

  return (
    <Box
      className={`${classes.colorItem} ${isSelected ? classes.selected : ""}`}
      onClick={onClick}
      style={{ background }}
    >
      <Box className={classes.colorBadge}>
        <Text size="xs" fw={600} c="white">
          {color.displayName || color.name}
        </Text>
      </Box>
    </Box>
  );
}

