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
