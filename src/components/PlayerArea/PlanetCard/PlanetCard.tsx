import { Stack, Box, Group, Text, Image } from "@mantine/core";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";
import { PlanetTraitIcon } from "../PlanetTraitIcon";
import { planets } from "../../../data/planets";

type Props = {
  planetId: string;
  techSkipIcons: Record<string, React.ReactNode>;
  exhausted?: boolean;
};

export function PlanetCard({
  planetId,
  techSkipIcons,
  exhausted = false,
}: Props) {
  const planetData = getPlanetData(planetId);

  if (!planetData) {
    console.warn(`Planet data not found for ID: ${planetId}`);
    return null;
  }

  const colors =
    PLANET_COLORS[planetData.planetType as PlanetType] || PLANET_COLORS.default;

  const traitIconKey = getTraitIconKey(planetData.planetType);

  // Get all tech skip icons for this planet
  const techSkipIconElements =
    planetData.techSpecialties
      ?.map((specialty) => getTechSkipIconKey(specialty))
      .filter((key) => key !== null)
      .map((key) => techSkipIcons[key!]) || [];

  // For faction planets, render faction icon instead of trait icon
  const renderIcon = () => {
    if (planetData.planetType === "FACTION" && planetData.factionHomeworld) {
      return (
        <Image
          src={`/factions/${planetData.factionHomeworld}.png`}
          w={24}
          h={24}
        />
      );
    }
    return traitIconKey ? <PlanetTraitIcon trait={traitIconKey} /> : null;
  };

  return (
    <Stack
      py={6}
      px={3}
      justify="space-between"
      h={140}
      pos="relative"
      style={{
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${colors.background} 0%, rgba(15, 23, 42, 0.6) 100%)`,
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
        boxShadow: `0 2px 8px ${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        filter: exhausted ? "grayscale(0.4) opacity(0.5)" : "none",
      }}
    >
      {/* Dark overlay for exhausted planets */}
      {exhausted && (
        <Box
          pos="absolute"
          top={-1}
          left={-1}
          right={-1}
          bottom={-1}
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            borderRadius: "12px",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Subtle top highlight */}
      <Box
        pos="absolute"
        top={0}
        left="20%"
        right="20%"
        h={1}
        style={{
          background: colors.highlight,
        }}
      />

      <Box display="flex" style={{ justifyContent: "center" }} w="100%">
        {renderIcon()}
      </Box>
      <Stack gap={4} pos="relative" style={{ zIndex: 1 }}>
        <Group gap={0} align="flex-end">
          <Text
            size="xs"
            c="white"
            fw={700}
            ff="monospace"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "sideways",
              whiteSpace: "nowrap",
              transform: "rotate(180deg)",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            {planetData.name}
          </Text>
          <Stack gap={2} align="top">
            {techSkipIconElements.length > 0 && (
              <Stack gap={1}>
                {techSkipIconElements.map((icon, index) => (
                  <Box key={index}>{icon}</Box>
                ))}
              </Stack>
            )}
            <Box pos="relative" w={16} h={16}>
              <Image
                src="/pa_resources.png"
                w={16}
                pos="absolute"
                top={0}
                left={0}
              />
              <Text
                size="xs"
                c="white"
                fw={700}
                pos="absolute"
                top={1}
                left={5}
              >
                {planetData.resources}
              </Text>
            </Box>

            <Box pos="relative" w={16} h={16}>
              <Box pos="absolute" top={0} left={0}>
                <InfluenceIcon size={18} />
              </Box>
              <Text
                size="xs"
                c="white"
                fw={700}
                pos="absolute"
                top={2}
                left={5}
              >
                {planetData.influence}
              </Text>
            </Box>
          </Stack>
        </Group>
      </Stack>
    </Stack>
  );
}

const getPlanetData = (planetId: string) => {
  return planets[planetId as keyof typeof planets];
};

const VALID_PLANET_TYPES = new Set(["cultural", "hazardous", "industrial"]);

const getTraitIconKey = (
  planetType: string
): "cultural" | "hazardous" | "industrial" | null => {
  const lowercase = planetType.toLowerCase();
  return VALID_PLANET_TYPES.has(lowercase)
    ? (lowercase as "cultural" | "hazardous" | "industrial")
    : null;
};

const VALID_TECH_SPECIALTIES = new Set([
  "biotic",
  "propulsion",
  "cybernetic",
  "warfare",
]);

const getTechSkipIconKey = (techSpecialty: string): string | null => {
  const lowercase = techSpecialty.toLowerCase();
  return VALID_TECH_SPECIALTIES.has(lowercase) ? lowercase : null;
};

// Planet color configurations by trait
const PLANET_COLORS = {
  CULTURAL: {
    background: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.3)",
    shadow: "rgba(59, 130, 246, 0.08)",
    highlight: "rgba(59, 130, 246, 0.4)",
  },
  HAZARDOUS: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.3)",
    shadow: "rgba(239, 68, 68, 0.08)",
    highlight: "rgba(239, 68, 68, 0.4)",
  },
  INDUSTRIAL: {
    background: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.3)",
    shadow: "rgba(34, 197, 94, 0.08)",
    highlight: "rgba(34, 197, 94, 0.4)",
  },
  FACTION: {
    background: "rgba(107, 114, 128, 0.12)",
    border: "rgba(107, 114, 128, 0.3)",
    shadow: "rgba(107, 114, 128, 0.08)",
    highlight: "rgba(107, 114, 128, 0.4)",
  },
  MR: {
    background: "rgba(107, 114, 128, 0.12)",
    border: "rgba(107, 114, 128, 0.3)",
    shadow: "rgba(107, 114, 128, 0.08)",
    highlight: "rgba(107, 114, 128, 0.4)",
  },
  // Default for planets without traits
  default: {
    background: "rgba(107, 114, 128, 0.12)",
    border: "rgba(107, 114, 128, 0.3)",
    shadow: "rgba(107, 114, 128, 0.08)",
    highlight: "rgba(107, 114, 128, 0.4)",
  },
};

type PlanetType = keyof typeof PLANET_COLORS;
