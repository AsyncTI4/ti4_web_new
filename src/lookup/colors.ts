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
