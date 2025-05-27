import { Stack, Box, Group, Text, Image } from "@mantine/core";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";

// Planet color configurations by trait
const PLANET_COLORS = {
  cultural: {
    background: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.3)",
    shadow: "rgba(59, 130, 246, 0.08)",
    highlight: "rgba(59, 130, 246, 0.4)",
  },
  hazardous: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.3)",
    shadow: "rgba(239, 68, 68, 0.08)",
    highlight: "rgba(239, 68, 68, 0.4)",
  },
  industrial: {
    background: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.3)",
    shadow: "rgba(34, 197, 94, 0.08)",
    highlight: "rgba(34, 197, 94, 0.4)",
  },
  // Default for planets without traits (like Mecatol Rex)
  default: {
    background: "rgba(107, 114, 128, 0.12)",
    border: "rgba(107, 114, 128, 0.3)",
    shadow: "rgba(107, 114, 128, 0.08)",
    highlight: "rgba(107, 114, 128, 0.4)",
  },
};

type PlanetTrait = keyof typeof PLANET_COLORS;
type TechSkip = "biotic" | "propulsion" | "cybernetic" | "warfare";

type Props = {
  planet: {
    name: string;
    resources: number;
    influence: number;
    trait?: PlanetTrait;
    techSkip?: TechSkip;
  };
  planetTraitIcons: Record<string, React.ReactNode>;
  techSkipIcons: Record<string, React.ReactNode>;
};

export function PlanetCard({ planet, planetTraitIcons, techSkipIcons }: Props) {
  const colors =
    PLANET_COLORS[planet.trait || "default"] || PLANET_COLORS.default;

  return (
    <Stack
      py={6}
      px={3}
      justify="space-between"
      h={140}
      style={{
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${colors.background} 0%, rgba(15, 23, 42, 0.6) 100%)`,
        border: `1px solid ${colors.border}`,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 2px 8px ${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
      }}
    >
      {/* Subtle top highlight */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: "1px",
          background: colors.highlight,
        }}
      />

      <Box align="center">{planet.trait && planetTraitIcons[planet.trait]}</Box>
      <Stack gap={4} style={{ position: "relative", zIndex: 1 }}>
        <Group gap={0} align="flex-end">
          <Text
            size="xs"
            c="white"
            fw={700}
            style={{
              writingMode: "vertical-rl",
              textOrientation: "sideways",
              whiteSpace: "nowrap",
              transform: "rotate(180deg)",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            {planet.name}
          </Text>
          <Stack gap={2} align="top">
            {planet.techSkip && techSkipIcons[planet.techSkip]}
            <Box
              pos="relative"
              style={{
                width: "16px",
                height: "16px",
              }}
            >
              <Image
                src="/pa_resources.png"
                style={{
                  width: "16px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
              <Text
                size="xs"
                c="white"
                fw={700}
                style={{
                  position: "absolute",
                  top: 1,
                  left: 5,
                }}
              >
                {planet.resources}
              </Text>
            </Box>

            <Box
              pos="relative"
              style={{
                width: "16px",
                height: "16px",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <InfluenceIcon size={18} />
              </Box>
              <Text
                size="xs"
                c="white"
                fw={700}
                style={{ position: "absolute", top: 2, left: 5 }}
              >
                {planet.influence}
              </Text>
            </Box>
          </Stack>
        </Group>
      </Stack>
    </Stack>
  );
}
