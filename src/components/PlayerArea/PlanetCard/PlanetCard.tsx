import { Stack, Box, Group, Text, Image } from "@mantine/core";
import { useMemo, useState } from "react";
import InfluenceIcon from "../../InfluenceIcon";
import { PlanetTraitIcon } from "../PlanetTraitIcon";
import { TechSkipIcon, TechType } from "../TechSkipIcon";
import { cdnImage } from "../../../data/cdnImage";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { PlanetDetailsCard } from "../PlanetDetailsCard";
import { getAttachmentData } from "@/lookup/attachments";
import styles from "./PlanetCard.module.css";
import { getPlanetData } from "@/lookup/planets";
import { usePlanet } from "@/hooks/usePlanet";

type Props = {
  planetId: string;
};

export function PlanetCard({ planetId }: Props) {
  const [opened, setOpened] = useState(false);
  const planetData = getPlanetData(planetId);
  const planetTile = usePlanet(planetId);
  const isExhausted = planetTile?.exhausted ?? false;
  const resolvedAttachments = useMemo(() => {
    return planetTile?.attachments || [];
  }, [planetTile]);

  if (!planetData) {
    console.warn(`Planet data not found for ID: ${planetId}`);
    return null;
  }

  const planetType = planetData.planetType;
  const traitIconKey = getTraitIconKey(planetData.planetType!);

  const attachmentModifiers = calculateAttachmentModifiers(resolvedAttachments);
  const allIcons = createAllIcons(
    planetData,
    attachmentModifiers,
    resolvedAttachments
  );
  const { finalResources, finalInfluence } = calculateFinalValues(
    planetData,
    attachmentModifiers
  );
  const isLegendary = checkIsLegendary(planetData, resolvedAttachments);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          onClick={() => setOpened((o) => !o)}
          className={`${styles.mainStack} ${
            isLegendary
              ? `${styles.legendaryBackground} ${styles.legendary}`
              : ""
          } ${isExhausted ? styles.exhausted : ""} ${styles.planetCard}`}
          style={getCSSVariables(planetType!) as React.CSSProperties}
        >
          {/* Hover highlight overlay */}
          <Box className={styles.planetCardHighlight} />

          {/* Legendary constellation background */}
          {isLegendary && !isExhausted && (
            <>
              <Box className={styles.legendaryConstellation} />
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
          {isExhausted && <Box className={styles.exhaustedOverlay} />}

          {/* Subtle top highlight */}
          <Box
            className={`${styles.topHighlight} ${
              isLegendary ? styles.legendary : ""
            }`}
          />

          <Box className={styles.iconContainer}>
            <PlanetIcon planetData={planetData} traitIconKey={traitIconKey} />
          </Box>
          <Stack className={styles.bottomStack}>
            <Group className={styles.nameGroup}>
              <Text className={styles.planetName} ff="monospace">
                {planetData.shortName ?? planetData.name}
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
                  <Text className={styles.valueText}>{finalResources}</Text>
                </Box>

                <Box className={styles.valueContainer}>
                  <Box className={styles.influenceIconContainer}>
                    <InfluenceIcon size={18} />
                  </Box>
                  <Text className={styles.influenceValueText}>
                    {finalInfluence}
                  </Text>
                </Box>
              </Stack>
            </Group>
          </Stack>
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.popoverDropdown}>
        <PlanetDetailsCard
          planetId={planetId}
          attachments={resolvedAttachments}
        />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

function calculateAttachmentModifiers(attachments: string[]) {
  return attachments.reduce(
    (totals, attachmentId) => {
      const attachmentData = getAttachmentData(attachmentId);
      if (attachmentData) {
        return {
          resources: totals.resources + (attachmentData.resourcesModifier || 0),
          influence: totals.influence + (attachmentData.influenceModifier || 0),
          techSpecialties: [
            ...totals.techSpecialties,
            ...(attachmentData.techSpeciality || []),
          ],
        };
      }
      return totals;
    },
    { resources: 0, influence: 0, techSpecialties: [] as string[] }
  );
}

function createAllIcons(
  planetData: any,
  attachmentModifiers: any,
  attachments: string[]
) {
  const allIcons = [];

  // Add tech skip icons
  const allTechSpecialties = [
    ...(planetData.techSpecialties || []),
    ...attachmentModifiers.techSpecialties,
  ];

  const techSkipIconElements = allTechSpecialties
    .map((specialty) => getTechSkipIconKey(specialty))
    .filter((key) => key !== null)
    .map((key, index) => (
      <TechSkipIcon key={`${key}-${index}`} techType={key as TechType} />
    ));

  allIcons.push(...techSkipIconElements);

  // Add legendary icon if applicable
  if (checkIsLegendary(planetData, attachments)) {
    allIcons.push(<LegendaryIcon key="legendary" />);
  }

  // Add attachment upgrade icon if applicable
  if (attachments.length > 0) {
    allIcons.push(<AttachmentUpgradeIcon key="upgrade" />);
  }

  return allIcons;
}

function calculateFinalValues(planetData: any, attachmentModifiers: any) {
  return {
    finalResources: planetData.resources + attachmentModifiers.resources,
    finalInfluence: planetData.influence + attachmentModifiers.influence,
  };
}

function checkIsLegendary(planetData: any, attachments: string[]) {
  return !!planetData.legendaryAbilityText || attachments.includes("nanoforge");
}

function getCSSVariables(planetType: string) {
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
}

const VALID_PLANET_TYPES = new Set(["cultural", "hazardous", "industrial"]);

const VALID_TECH_SPECIALTIES = new Set([
  "biotic",
  "propulsion",
  "cybernetic",
  "warfare",
]);

const getTraitIconKey = (
  planetType: string
): "cultural" | "hazardous" | "industrial" | null => {
  const lowercase = planetType.toLowerCase();
  return VALID_PLANET_TYPES.has(lowercase)
    ? (lowercase as "cultural" | "hazardous" | "industrial")
    : null;
};

const getTechSkipIconKey = (techSpecialty: string): string | null => {
  const lowercase = techSpecialty.toLowerCase();
  return VALID_TECH_SPECIALTIES.has(lowercase) ? lowercase : null;
};

type LegendaryIconProps = {};

function LegendaryIcon({}: LegendaryIconProps) {
  return (
    <Image
      src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
      className={styles.legendaryIcon}
    />
  );
}

type AttachmentUpgradeIconProps = {};

function AttachmentUpgradeIcon({}: AttachmentUpgradeIconProps) {
  return (
    <Image
      src={cdnImage("/planet_cards/pc_upgrade.png")}
      className={styles.attachmentIcon}
    />
  );
}

type PlanetIconProps = {
  planetData: any;
  traitIconKey: any;
};

function PlanetIcon({ planetData, traitIconKey }: PlanetIconProps) {
  if (planetData.planetType === "FACTION" && planetData.factionHomeworld) {
    return (
      <Image
        src={cdnImage(`/factions/${planetData.factionHomeworld}.png`)}
        className={styles.factionIcon}
      />
    );
  }
  return traitIconKey ? <PlanetTraitIcon trait={traitIconKey} /> : null;
}
