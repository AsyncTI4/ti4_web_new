import { Box, Group, Text } from "@mantine/core";
import { SpeakerToken } from "./SpeakerToken";

interface Props {
  number: number;
  text: string;
  color: string;
  isSpeaker: boolean;
}

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

// Strategy card color mapping to CSS RGB values for backgrounds
const SC_BG_COLORS = {
  red: "239, 68, 68",
  orange: "249, 115, 22",
  yellow: "234, 179, 8",
  green: "34, 197, 94",
  teal: "20, 184, 166",
  cyan: "6, 182, 212",
  blue: "59, 130, 246",
  purple: "147, 51, 234",
} as const;

export function StrategyCardBannerCompact({
  number,
  text,
  color,
  isSpeaker,
}: Props) {
  const numberColor =
    SC_NUMBER_COLORS[color as keyof typeof SC_NUMBER_COLORS] || "red.9";
  const bgRgb =
    SC_BG_COLORS[color as keyof typeof SC_BG_COLORS] || "239, 68, 68";

  return (
    <Group gap={4} align="center">
      {/* Speaker Token */}
      <SpeakerToken isVisible={isSpeaker} />

      <Box
        pos="relative"
        display="flex"
        style={{
          background: `linear-gradient(135deg, rgba(${bgRgb}, 0.15) 0%, rgba(${bgRgb}, 0.08) 100%)`,
          border: `1px solid rgba(${bgRgb}, 0.3)`,
          borderRadius: "4px",
          minWidth: "60px",
          // height: "20px",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "12px",
          paddingRight: "4px",
          paddingTop: "6px",
          paddingBottom: "6px",
        }}
      >
        {/* Strategy card number circle */}
        <Box
          bg="white"
          pos="absolute"
          left={-16}
          w={24}
          h={24}
          display="flex"
          style={{
            border: `2px solid rgba(${bgRgb}, 1)`,
            borderRadius: "50%",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Text ff="heading" c={numberColor} size="16px" fw={700}>
            {number}
          </Text>
        </Box>

        {/* Strategy card text - abbreviated */}
        <Text
          ff="heading"
          c="white"
          size="14px"
          fw={600}
          style={{
            textShadow: "0 1px 1px rgba(0, 0, 0, 0.8)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {text}
        </Text>
      </Box>
    </Group>
  );
}
