import { Fragment } from "react";
import { Box, SimpleGrid, Text } from "@mantine/core";
import { colors } from "@/entities/data/colors";
import { ColorSwatch } from "./ColorSwatch";

type Props = {
  activeColorAlias: string | null;
  onColorClick: (colorAlias: string) => void;
};

const hasSecondary = (color: (typeof colors)[number]) =>
  !!(color.secondaryColor || color.secondaryColorRef);

const COLOR_SECTIONS = [
  {
    title: "Basic Colors",
    colors: colors.filter((c) => c.primaryColor && !hasSecondary(c)),
  },
  {
    title: "Gradient Colors",
    colors: colors.filter((c) => c.primaryColor && hasSecondary(c)),
  },
];

export function ColorGrid({ activeColorAlias, onColorClick }: Props) {
  return (
    <Box>
      {COLOR_SECTIONS.map((section, index) => (
        <Fragment key={section.title}>
          <Text size="sm" fw={600} mb="xs" mt="xs" c="gray.3">
            {section.title}
          </Text>
          <SimpleGrid
            cols={6}
            spacing="xs"
            mb={index < COLOR_SECTIONS.length - 1 ? "md" : undefined}
          >
            {section.colors.map((color) => (
              <ColorSwatch
                key={color.alias}
                color={color}
                isSelected={activeColorAlias === color.alias}
                onClick={() => onColorClick(color.alias)}
              />
            ))}
          </SimpleGrid>
        </Fragment>
      ))}
    </Box>
  );
}
