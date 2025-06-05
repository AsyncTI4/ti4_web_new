import { Text } from "@mantine/core";
import { lighten } from "@mantine/core";
import { getColorValues, findColorData } from "../../../utils/colorUtils";

interface PlayerColorProps {
  color: string;
  size?: string;
  weight?: number;
  style?: React.CSSProperties;
}

// Helper function to get the primary color for text
const getPrimaryColorForText = (color: string) => {
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

export function PlayerColor({ color, size = "sm" }: PlayerColorProps) {
  const primaryColor = getPrimaryColorForText(color);
  const lightenedColor = lighten(primaryColor, 0.4); // Lighten by 40%

  return (
    <Text span size={size} ff="heading" c={lightenedColor}>
      ({color})
    </Text>
  );
}
