import { Box } from "@mantine/core";
import { getColorValues, findColorData } from "@/lookup/colors";

interface HeaderAccentProps {
  color: string;
}

// Utility function to generate gradient styles based on color data
export const generateColorGradient = (color: string, opacity: number = 0.6) => {
  // Find the color data from colors
  const colorData = findColorData(color);

  if (!colorData) {
    // Fallback gradient
    return `linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, ${opacity}) 50%, transparent 100%)`;
  }

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
    return `linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, ${opacity}) 50%, transparent 100%)`;
  }

  const {
    red: primaryRed,
    green: primaryGreen,
    blue: primaryBlue,
  } = primaryColorValues;
  const primaryColor = `rgba(${primaryRed}, ${primaryGreen}, ${primaryBlue}, ${opacity})`;

  // Check if this is a split color (has secondaryColor or secondaryColorRef)
  if (secondaryColorValues) {
    const {
      red: secondaryRed,
      green: secondaryGreen,
      blue: secondaryBlue,
    } = secondaryColorValues;
    const secondaryColor = `rgba(${secondaryRed}, ${secondaryGreen}, ${secondaryBlue}, ${opacity})`;

    // Create a split gradient with softer transition
    return `linear-gradient(90deg, transparent 0%, ${primaryColor} 25%, ${primaryColor} 45%, ${secondaryColor} 55%, ${secondaryColor} 75%, transparent 100%)`;
  }

  // Single color gradient
  return `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`;
};

export function HeaderAccent({ color }: HeaderAccentProps) {
  return (
    <Box
      pos="absolute"
      bottom={0}
      left={0}
      right={0}
      h={8}
      style={{
        background: generateColorGradient(color, 0.6),
      }}
    />
  );
}
