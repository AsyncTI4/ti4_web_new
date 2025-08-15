import { colors } from "../data/colors";

// Helper function to get color values, prioritizing refs over direct colors
export const getColorValues = (
  colorRef: string | undefined,
  directColor: any
) => {
  if (colorRef) {
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

// Helper function to find color data by alias, name, or aliases
export const findColorData = (color: string) => {
  return colors.find(
    (c) => c.alias === color || c.name === color || c.aliases.includes(color)
  );
};

// Get color alias for unit image
export const getColorAlias = (color?: string) => {
  if (!color) return "pnk"; // default fallback

  const colorData = findColorData(color);
  return colorData?.alias || "pnk"; // fallback to pink if color not found
};

export const getTextColor = (color: string) => {
  const colorData = findColorData(color);
  return colorData?.textColor || "white";
};

export const getPrimaryColorCSS = (color: string) => {
  const colorData = findColorData(color);

  if (!colorData) {
    return "rgba(148, 163, 184, 1)"; // fallback
  }

  const primaryColorValues = getColorValues(
    (colorData as any).primaryColorRef,
    colorData.primaryColor
  );

  if (!primaryColorValues) return "rgba(148, 163, 184, 1)";

  const { red, green, blue } = primaryColorValues;
  return `rgb(${red}, ${green}, ${blue})`;
};

// Helper function to get primary color with opacity
export const getPrimaryColorWithOpacity = (
  color: string,
  opacity: number = 0.7
) => {
  const colorData = findColorData(color);

  if (!colorData) {
    return `rgba(148, 163, 184, ${opacity})`;
  }

  const primaryColorValues = getColorValues(
    (colorData as any).primaryColorRef,
    colorData.primaryColor
  );

  if (!primaryColorValues) {
    return `rgba(148, 163, 184, ${opacity})`;
  }

  const { red, green, blue } = primaryColorValues;
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

export const generateColorGradient = (color: string, opacity: number = 0.6) => {
  const colorData = findColorData(color);
  if (!colorData) {
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
