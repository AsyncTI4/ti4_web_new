import { Box, Group, Text } from "@mantine/core";
import { SpeakerToken } from "./SpeakerToken";
import { Shimmer } from "./Shimmer/Shimmer";

type Props = {
  number: number;
  text: string;
  color: string;
  hasSpeaker: boolean;
};

// Color theme mappings for strategy cards
const COLOR_THEMES = {
  red: {
    gradient:
      "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 50%, rgba(239, 68, 68, 0.08) 100%)",
    border: "rgba(239, 68, 68, 0.2)",
    innerGlow: "rgba(239, 68, 68, 0.06)",
    borderColor: "var(--mantine-color-red-7)",
    dropShadow: "rgba(239, 68, 68, 0.3)",
    numberColor: "red.9",
  },
  orange: {
    gradient:
      "linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(234, 88, 12, 0.05) 50%, rgba(249, 115, 22, 0.08) 100%)",
    border: "rgba(249, 115, 22, 0.2)",
    innerGlow: "rgba(249, 115, 22, 0.06)",
    borderColor: "var(--mantine-color-orange-7)",
    dropShadow: "rgba(249, 115, 22, 0.3)",
    numberColor: "orange.9",
  },
  yellow: {
    gradient:
      "linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(202, 138, 4, 0.05) 50%, rgba(234, 179, 8, 0.08) 100%)",
    border: "rgba(234, 179, 8, 0.2)",
    innerGlow: "rgba(234, 179, 8, 0.06)",
    borderColor: "var(--mantine-color-yellow-7)",
    dropShadow: "rgba(234, 179, 8, 0.3)",
    numberColor: "yellow.9",
  },
  green: {
    gradient:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.05) 50%, rgba(34, 197, 94, 0.08) 100%)",
    border: "rgba(34, 197, 94, 0.2)",
    innerGlow: "rgba(34, 197, 94, 0.06)",
    borderColor: "var(--mantine-color-green-7)",
    dropShadow: "rgba(34, 197, 94, 0.3)",
    numberColor: "green.9",
  },
  teal: {
    gradient:
      "linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(13, 148, 136, 0.05) 50%, rgba(20, 184, 166, 0.08) 100%)",
    border: "rgba(20, 184, 166, 0.2)",
    innerGlow: "rgba(20, 184, 166, 0.06)",
    borderColor: "var(--mantine-color-teal-7)",
    dropShadow: "rgba(20, 184, 166, 0.3)",
    numberColor: "teal.9",
  },
  cyan: {
    gradient:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(8, 145, 178, 0.05) 50%, rgba(6, 182, 212, 0.08) 100%)",
    border: "rgba(6, 182, 212, 0.2)",
    innerGlow: "rgba(6, 182, 212, 0.06)",
    borderColor: "var(--mantine-color-cyan-7)",
    dropShadow: "rgba(6, 182, 212, 0.3)",
    numberColor: "cyan.9",
  },
  blue: {
    gradient:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.05) 50%, rgba(59, 130, 246, 0.08) 100%)",
    border: "rgba(59, 130, 246, 0.2)",
    innerGlow: "rgba(59, 130, 246, 0.06)",
    borderColor: "var(--mantine-color-blue-7)",
    dropShadow: "rgba(59, 130, 246, 0.3)",
    numberColor: "blue.9",
  },
  purple: {
    gradient:
      "linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(126, 34, 206, 0.05) 50%, rgba(147, 51, 234, 0.08) 100%)",
    border: "rgba(147, 51, 234, 0.2)",
    innerGlow: "rgba(147, 51, 234, 0.06)",
    borderColor: "var(--mantine-color-violet-7)",
    dropShadow: "rgba(147, 51, 234, 0.3)",
    numberColor: "violet.9",
  },
};

export function StrategyCardBanner({ number, text, color, hasSpeaker }: Props) {
  const theme =
    COLOR_THEMES[color as keyof typeof COLOR_THEMES] || COLOR_THEMES.red;

  return (
    <Group gap="xs" align="center">
      <Shimmer
        color={
          color as
            | "red"
            | "orange"
            | "yellow"
            | "green"
            | "teal"
            | "cyan"
            | "blue"
            | "purple"
            | "gray"
        }
        p={2}
        px="sm"
        pl="lg"
        pos="relative"
        display="flex"
        style={{
          minWidth: "140px",
          background: theme.gradient,
          border: `1px solid ${theme.border}`,
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
          style={{
            background: `radial-gradient(ellipse at center, ${theme.innerGlow} 0%, transparent 70%)`,
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
          style={{
            border: `3px solid ${theme.borderColor}`,
            borderRadius: "999px",
            alignItems: "center",
            justifyContent: "center",
            filter: `drop-shadow(0 1px 2px ${theme.dropShadow})`,
            zIndex: 2,
          }}
        >
          <Text ff="heading" c={theme.numberColor} size="30px">
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
