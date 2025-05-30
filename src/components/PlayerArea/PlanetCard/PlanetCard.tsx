import { Stack, Box, Group, Text, Image } from "@mantine/core";
import { useState } from "react";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";
import { PlanetTraitIcon } from "../PlanetTraitIcon";
import { planets } from "../../../data/planets";
import { TechSkipIcon, TechType } from "../TechSkipIcon";
import { cdnImage } from "../../../data/cdnImage";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { PlanetDetailsCard } from "../PlanetDetailsCard";
import styles from "./PlanetCard.module.css";

type Props = {
  planetId: string;
  exhausted?: boolean;
};

export function PlanetCard({ planetId, exhausted = false }: Props) {
  const [opened, setOpened] = useState(false);
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
      .map((key) => <TechSkipIcon key={key} techType={key as TechType} />) ||
    [];

  // Add legendary ability icon if planet has legendary ability text
  const legendaryAbilityIcon = planetData.legendaryAbilityText ? (
    <Image
      key="legendary"
      src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
      w={16}
      h={16}
    />
  ) : null;

  // Combine tech skip icons and legendary ability icon
  const allIcons = [...techSkipIconElements];
  if (legendaryAbilityIcon) {
    allIcons.push(legendaryAbilityIcon);
  }

  // For faction planets, render faction icon instead of trait icon
  const renderIcon = () => {
    if (planetData.planetType === "FACTION" && planetData.factionHomeworld) {
      return (
        <Image
          src={cdnImage(`/factions/${planetData.factionHomeworld}.png`)}
          w={24}
          h={24}
        />
      );
    }
    return traitIconKey ? <PlanetTraitIcon trait={traitIconKey} /> : null;
  };

  // Legendary planet animation styles
  const isLegendary = !!planetData.legendaryAbilityText;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          py={6}
          px={3}
          justify="space-between"
          h={140}
          pos="relative"
          onClick={() => setOpened((o) => !o)}
          style={
            {
              borderRadius: "12px",
              background: isLegendary
                ? undefined
                : `linear-gradient(135deg, ${colors.background} 0%, rgba(15, 23, 42, 0.6) 100%)`,
              border: `1px solid ${colors.border}`,
              overflow: "hidden",
              boxShadow: `0 2px 8px ${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
              filter: exhausted ? "grayscale(0.4) opacity(0.5)" : "none",
              "--planet-bg": colors.background,
            } as React.CSSProperties
          }
          className={`${isLegendary ? styles.legendaryBackground : ""} ${styles.planetCard}`}
        >
          {/* Hover highlight overlay */}
          <Box className={styles.planetCardHighlight} />

          {/* Legendary constellation background */}
          {isLegendary && !exhausted && (
            <>
              <Box className={styles.legendaryConstellation} />

              {/* Floating energy particles */}
              <Box
                className={`${styles.floatingParticle} ${styles.particle1}`}
              />
              <Box
                className={`${styles.floatingParticle} ${styles.particle2}`}
              />
              <Box
                className={`${styles.floatingParticle} ${styles.particle3}`}
              />
              <Box
                className={`${styles.floatingParticle} ${styles.particle4}`}
              />
              <Box
                className={`${styles.floatingParticle} ${styles.particle5}`}
              />
            </>
          )}

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
              background: isLegendary
                ? "rgba(255, 215, 0, 0.6)"
                : colors.highlight,
              zIndex: 3,
            }}
          />

          <Box display="flex" style={{ justifyContent: "center" }} w="100%">
            {renderIcon()}
          </Box>
          <Stack gap={4} pos="relative" style={{ zIndex: 1 }}>
            <Group gap={0} align="flex-end" style={{ minWidth: 34 }}>
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
                {allIcons.length > 0 && (
                  <Stack gap={1}>
                    {allIcons.map((icon, index) => (
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
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <PlanetDetailsCard planetId={planetId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
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
