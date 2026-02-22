import { Text } from "@mantine/core";
import { lighten } from "@mantine/core";
import { getPrimaryColorCSS } from "@/entities/lookup/colors";

type PlayerColorProps = {
  color: string;
  size?: string;
  weight?: number;
  style?: React.CSSProperties;
};

export function PlayerColor({ color, size = "sm" }: PlayerColorProps) {
  const primaryColor = getPrimaryColorCSS(color);
  const lightenedColor = lighten(primaryColor, 0.4); // Lighten by 40%

  return (
    <Text span fs="italic" size={size} ff="heading" c={lightenedColor}>
      ({color})
    </Text>
  );
}
