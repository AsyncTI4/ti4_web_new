import { Box, Text, Group } from "@mantine/core";
import { Shimmer } from "./Shimmer";

type Props = {
  number: number;
  name: string;
  color?:
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "purple"
    | "orange"
    | "gray"
    | "teal"
    | "cyan";
  tradeGoods?: number;
};

const colorMap = {
  red: {
    shimmerColor: "red",
    gradient:
      "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 50%, rgba(239, 68, 68, 0.08) 100%)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-red-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))",
    numberColor: "red.9",
  },
  green: {
    shimmerColor: "green",
    gradient:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.05) 50%, rgba(34, 197, 94, 0.08) 100%)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-green-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(34, 197, 94, 0.3))",
    numberColor: "green.9",
  },
  blue: {
    shimmerColor: "blue",
    gradient:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.05) 50%, rgba(59, 130, 246, 0.08) 100%)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-blue-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(59, 130, 246, 0.3))",
    numberColor: "blue.9",
  },
  yellow: {
    shimmerColor: "yellow",
    gradient:
      "linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(202, 138, 4, 0.05) 50%, rgba(234, 179, 8, 0.08) 100%)",
    border: "1px solid rgba(234, 179, 8, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(234, 179, 8, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-yellow-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(234, 179, 8, 0.3))",
    numberColor: "yellow.9",
  },
  purple: {
    shimmerColor: "violet",
    gradient:
      "linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(124, 58, 237, 0.05) 50%, rgba(147, 51, 234, 0.08) 100%)",
    border: "1px solid rgba(147, 51, 234, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(147, 51, 234, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-violet-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(147, 51, 234, 0.3))",
    numberColor: "violet.9",
  },
  orange: {
    shimmerColor: "orange",
    gradient:
      "linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(234, 88, 12, 0.05) 50%, rgba(249, 115, 22, 0.08) 100%)",
    border: "1px solid rgba(249, 115, 22, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(249, 115, 22, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-orange-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(249, 115, 22, 0.3))",
    numberColor: "orange.9",
  },
  gray: {
    shimmerColor: "gray",
    gradient:
      "linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(75, 85, 99, 0.05) 50%, rgba(107, 114, 128, 0.08) 100%)",
    border: "1px solid rgba(107, 114, 128, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(107, 114, 128, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-gray-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(107, 114, 128, 0.3))",
    numberColor: "gray.9",
  },
  teal: {
    shimmerColor: "teal",
    gradient:
      "linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(13, 148, 136, 0.05) 50%, rgba(20, 184, 166, 0.08) 100%)",
    border: "1px solid rgba(20, 184, 166, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(20, 184, 166, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-teal-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(20, 184, 166, 0.3))",
    numberColor: "teal.9",
  },
  cyan: {
    shimmerColor: "cyan",
    gradient:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(8, 145, 178, 0.05) 50%, rgba(6, 182, 212, 0.08) 100%)",
    border: "1px solid rgba(6, 182, 212, 0.2)",
    radialGlow:
      "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.06) 0%, transparent 70%)",
    borderColor: "var(--mantine-color-cyan-7)",
    dropShadow: "drop-shadow(0 1px 2px rgba(6, 182, 212, 0.3))",
    numberColor: "cyan.9",
  },
};

export function StrategyCard({
  number,
  name,
  color = "red",
  tradeGoods,
}: Props) {
  const colorConfig = colorMap[color];
  return (
    <Shimmer
      color={colorConfig.shimmerColor as any}
      p={1}
      px="xs"
      pl="md"
      pos="relative"
      display="flex"
      style={{
        minWidth: "120px",
        background: colorConfig.gradient,
        border: colorConfig.border,
        borderRadius: "8px",
        overflow: "inherit",
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
          background: colorConfig.radialGlow,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box
        bg="white"
        pos="absolute"
        top={0}
        left={-8}
        w={30}
        h={30}
        display="flex"
        style={{
          border: `3px solid ${colorConfig.borderColor}`,
          borderRadius: "999px",
          alignItems: "center",
          justifyContent: "center",
          filter: colorConfig.dropShadow,
          zIndex: 2,
        }}
      >
        <Text ff="heading" c={colorConfig.numberColor} size="24px">
          {number}
        </Text>
      </Box>

      <Group
        gap="xs"
        align="center"
        pos="relative"
        px={20}
        style={{ zIndex: 1 }}
      >
        <Text
          ff="heading"
          c="white"
          size="lg"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
          }}
        >
          {name}
        </Text>

        {tradeGoods && tradeGoods > 0 && (
          <Group gap={4} align="center">
            <img
              src="/tg.png"
              alt="trade goods"
              style={{
                width: "18px",
                height: "18px",
                filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6))",
              }}
            />
            <Text
              size="xs"
              fw={700}
              c="white"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {tradeGoods}
            </Text>
          </Group>
        )}
      </Group>
    </Shimmer>
  );
}
