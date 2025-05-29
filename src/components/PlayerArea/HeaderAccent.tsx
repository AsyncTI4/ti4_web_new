import { Box } from "@mantine/core";
import { colors } from "../../data/colors";

interface HeaderAccentProps {
  color: string;
}

export function HeaderAccent({ color }: HeaderAccentProps) {
  // Find the color data from colors
  const colorData = colors.find(
    (c) => c.alias === color || c.name === color || c.aliases.includes(color)
  );

  if (!colorData) {
    // Fallback to a default gradient if color not found
    return (
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        h={8}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.5) 50%, transparent 100%)",
        }}
      />
    );
  }

  // Helper function to get color values, prioritizing refs over direct colors
  const getColorValues = (colorRef: string | undefined, directColor: any) => {
    if (colorRef) {
      // Look up the referenced color
      const referencedColor = colors.find(
        (c) =>
          c.alias === colorRef ||
          c.name === colorRef ||
          c.aliases.includes(colorRef)
      );
      return referencedColor?.primaryColor;
    }
    return directColor;
  };

  // Get primary color values (prioritize ref over direct)
  const primaryColorValues = getColorValues(
    (colorData as any).primaryColorRef,
    colorData.primaryColor
  );

  // Get secondary color values (prioritize ref over direct)
  const secondaryColorValues = getColorValues(
    (colorData as any).secondaryColorRef,
    colorData.secondaryColor
  );

  if (!primaryColorValues) {
    // Fallback if no primary color found
    return (
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        h={8}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.5) 50%, transparent 100%)",
        }}
      />
    );
  }

  const {
    red: primaryRed,
    green: primaryGreen,
    blue: primaryBlue,
  } = primaryColorValues;
  const primaryColor = `rgba(${primaryRed}, ${primaryGreen}, ${primaryBlue}, 0.6)`;

  // Check if this is a split color (has secondaryColor or secondaryColorRef)
  if (secondaryColorValues) {
    const {
      red: secondaryRed,
      green: secondaryGreen,
      blue: secondaryBlue,
    } = secondaryColorValues;
    const secondaryColor = `rgba(${secondaryRed}, ${secondaryGreen}, ${secondaryBlue}, 0.6)`;

    // Create a split gradient with softer transition: transparent -> primary -> blend -> secondary -> transparent
    return (
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        h={8}
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 25%, ${primaryColor} 45%, ${secondaryColor} 55%, ${secondaryColor} 75%, transparent 100%)`,
        }}
      />
    );
  }

  // Single color gradient
  return (
    <Box
      pos="absolute"
      bottom={0}
      left={0}
      right={0}
      h={8}
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
      }}
    />
  );
}
