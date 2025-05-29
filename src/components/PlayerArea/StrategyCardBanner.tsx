import { Box, Group, Text } from "@mantine/core";
import { SpeakerToken } from "./SpeakerToken";
import { Shimmer } from "./Shimmer/Shimmer";
import { getGradientClasses, ColorKey } from "./gradientClasses";

type Props = {
  number: number;
  text: string;
  color: string;
  hasSpeaker: boolean;
};

// Strategy card color mapping to Mantine colors for number display
const SC_NUMBER_COLORS = {
  red: "red.9",
  orange: "orange.9",
  yellow: "yellow.9",
  green: "green.9",
  teal: "teal.9",
  cyan: "cyan.9",
  blue: "blue.9",
  purple: "violet.9",
} as const;

// Strategy card color mapping to Mantine border colors
const SC_BORDER_COLORS = {
  red: "var(--mantine-color-red-7)",
  orange: "var(--mantine-color-orange-7)",
  yellow: "var(--mantine-color-yellow-7)",
  green: "var(--mantine-color-green-7)",
  teal: "var(--mantine-color-teal-7)",
  cyan: "var(--mantine-color-cyan-7)",
  blue: "var(--mantine-color-blue-7)",
  purple: "var(--mantine-color-violet-7)",
} as const;

export function StrategyCardBanner({ number, text, color, hasSpeaker }: Props) {
  const gradientClasses = getGradientClasses(color as ColorKey);
  const numberColor =
    SC_NUMBER_COLORS[color as keyof typeof SC_NUMBER_COLORS] || "red.9";
  const borderColor =
    SC_BORDER_COLORS[color as keyof typeof SC_BORDER_COLORS] ||
    "var(--mantine-color-red-7)";

  return (
    <Group gap="xs" align="center">
      <Shimmer
        color={color as ColorKey}
        p={2}
        px="sm"
        pl="lg"
        pos="relative"
        display="flex"
        className={gradientClasses.strategyCardBanner}
        style={{
          minWidth: "140px",
          borderRadius: "8px",
        }}
      >
        {/* Additional subtle inner glow overlay */}
        <Box
          pos="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          className={gradientClasses.innerGlow}
          style={{
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Box
          bg="white"
          pos="absolute"
          top={0}
          left={-10}
          w={35}
          h={35}
          display="flex"
          className={gradientClasses.iconFilter}
          style={{
            border: `3px solid ${borderColor}`,
            borderRadius: "999px",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Text ff="heading" c={numberColor} size="30px">
            {number}
          </Text>
        </Box>
        <Text
          ff="heading"
          c="white"
          size="xl"
          pos="relative"
          px={24}
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        >
          {text}
        </Text>
      </Shimmer>

      {/* Speaker Token */}
      <SpeakerToken isVisible={hasSpeaker} />
    </Group>
  );
}
