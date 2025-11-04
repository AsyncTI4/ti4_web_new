import React from "react";
import { Box, SimpleGrid, Text } from "@mantine/core";
import { colors } from "@/data/colors";
import { getColorAlias } from "@/lookup/colors";
import { ColorSwatch } from "./ColorSwatch";
import classes from "../TryUnitDecalsSidebar.module.css";

type Props = {
  selectedFaction: string;
  colorOverrides: Record<string, string>;
  playerColorAlias: string | null;
  onColorClick: (colorAlias: string) => void;
};

export function ColorGrid({
  selectedFaction,
  colorOverrides,
  playerColorAlias,
  onColorClick,
}: Props) {
  const overrideColorAlias = colorOverrides[selectedFaction];

  const basicColors = colors.filter(
    (color) =>
      !color.secondaryColor &&
      !color.secondaryColorRef &&
      color.primaryColor
  );

  const gradientColors = colors.filter(
    (color) =>
      (color.secondaryColor || color.secondaryColorRef) &&
      color.primaryColor
  );

  const getIsSelected = (colorAlias: string) => {
    return (
      (overrideColorAlias !== undefined &&
        overrideColorAlias === colorAlias) ||
      (overrideColorAlias === undefined && playerColorAlias === colorAlias)
    );
  };

  return (
    <Box>
      {/* Basic Colors Section */}
      <Text size="sm" fw={600} mb="xs" mt="xs" c="gray.3">
        Basic Colors
      </Text>
      <SimpleGrid cols={6} spacing="xs" mb="md">
        {basicColors.map((color) => (
          <ColorSwatch
            key={color.alias}
            color={color}
            isSelected={getIsSelected(color.alias)}
            onClick={() => onColorClick(color.alias)}
          />
        ))}
      </SimpleGrid>

      {/* Gradient Colors Section */}
      <Text size="sm" fw={600} mb="xs" mt="xs" c="gray.3">
        Gradient Colors
      </Text>
      <SimpleGrid cols={6} spacing="xs">
        {gradientColors.map((color) => (
          <ColorSwatch
            key={color.alias}
            color={color}
            isSelected={getIsSelected(color.alias)}
            onClick={() => onColorClick(color.alias)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

