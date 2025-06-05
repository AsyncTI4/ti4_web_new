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

  const planetType = planetData.planetType as PlanetType;
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
      className={styles.legendaryIcon}
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
          className={styles.factionIcon}
        />
      );
    }
    return traitIconKey ? <PlanetTraitIcon trait={traitIconKey} /> : null;
  };

  // Legendary planet animation styles
  const isLegendary = !!planetData.legendaryAbilityText;

  // Get CSS variable names for planet type
  const getCSSVariables = (planetType: PlanetType) => {
    const typeKey = planetType?.toLowerCase() || "default";
    // Map known planet types, fallback to 'default' for unknown types
    const validTypes = ["cultural", "hazardous", "industrial", "faction", "mr"];
    const finalType = validTypes.includes(typeKey) ? typeKey : "default";

    return {
      "--planet-background": `var(--${finalType}-background)`,
      "--planet-border": `var(--${finalType}-border)`,
      "--planet-shadow": `var(--${finalType}-shadow)`,
      "--planet-highlight": `var(--${finalType}-highlight)`,
    };
  };

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          onClick={() => setOpened((o) => !o)}
          className={`${styles.mainStack} ${
            isLegendary
              ? `${styles.legendaryBackground} ${styles.legendary}`
              : ""
          } ${exhausted ? styles.exhausted : ""} ${styles.planetCard}`}
          style={getCSSVariables(planetType) as React.CSSProperties}
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
          {exhausted && <Box className={styles.exhaustedOverlay} />}

          {/* Subtle top highlight */}
          <Box
            className={`${styles.topHighlight} ${
              isLegendary ? styles.legendary : ""
            }`}
          />

          <Box className={styles.iconContainer}>{renderIcon()}</Box>
          <Stack className={styles.bottomStack}>
            <Group className={styles.nameGroup}>
              <Text className={styles.planetName} ff="monospace">
                {planetData.name}
              </Text>
              <Stack className={styles.valuesStack} align="top">
                {allIcons.length > 0 && (
                  <Stack className={styles.iconsStack}>
                    {allIcons.map((icon, index) => (
                      <Box key={index}>{icon}</Box>
                    ))}
                  </Stack>
                )}
                <Box className={styles.valueContainer}>
                  <Image
                    src="/pa_resources.png"
                    className={styles.resourceImage}
                  />
                  <Text className={styles.valueText}>
                    {planetData.resources}
                  </Text>
                </Box>

                <Box className={styles.valueContainer}>
                  <Box className={styles.influenceIconContainer}>
                    <InfluenceIcon size={18} />
                  </Box>
                  <Text className={styles.influenceValueText}>
                    {planetData.influence}
                  </Text>
                </Box>
              </Stack>
            </Group>
          </Stack>
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.popoverDropdown}>
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

type PlanetType =
  | "CULTURAL"
  | "HAZARDOUS"
  | "INDUSTRIAL"
  | "FACTION"
  | "MR"
  | "DEFAULT";
