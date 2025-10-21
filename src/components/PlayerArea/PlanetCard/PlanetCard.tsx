import { Stack, Box, Group, Text, Image } from "@mantine/core";
import { useMemo, useState } from "react";
import cx from "clsx";
import { PlanetAbilityCard } from "../PlanetAbilityCard";
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
  legendaryAbilityExhausted?: boolean;
};

export function PlanetCard({
  planetId,
  legendaryAbilityExhausted = false,
}: Props) {
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

  const attachmentModifiers = calculateAttachmentModifiers(resolvedAttachments);
  const finalTraits = resolveFinalTraits(
    planetData.planetType ?? "NONE",
    attachmentModifiers.planetTypes
  );
  const cssTypeKey = resolveCssTypeKey(finalTraits);
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
  const hasLegendaryAbility = !!(
    planetData.legendaryAbilityName && planetData.legendaryAbilityText
  );

  const planetCardContent = (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          onClick={() => setOpened((o) => !o)}
          className={cx(
            styles.mainStack,
            isLegendary && styles.legendaryBackground,
            isLegendary && styles.legendary,
            hasLegendaryAbility && styles.noRightRadius,
            isExhausted && styles.exhausted
          )}
          style={getCSSVariables(cssTypeKey) as React.CSSProperties}
        >
          <Box className={styles.planetCardHighlight} />

          {isLegendary && !isExhausted && (
            <>
              <Box className={styles.legendaryConstellation} />
              <Box className={cx(styles.floatingParticle, styles.particle1)} />
              <Box className={cx(styles.floatingParticle, styles.particle2)} />
              <Box className={cx(styles.floatingParticle, styles.particle3)} />
              <Box className={cx(styles.floatingParticle, styles.particle4)} />
              <Box className={cx(styles.floatingParticle, styles.particle5)} />
            </>
          )}

          <Box className={styles.topHighlight} />

          <Box className={styles.iconContainer}>
            <PlanetIcon planetData={planetData} finalTraits={finalTraits} />
          </Box>
          <Stack className={styles.bottomStack}>
            <Group className={styles.nameGroup}>
              <Text className={styles.planetName} ff="monospace">
                {planetData.shortName ?? planetData.name}
              </Text>
              <Stack className={styles.valuesStack} align="top">
                {allIcons.length > 0 && (
                  <Stack className={styles.iconsStack}>{allIcons}</Stack>
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
        <PlanetDetailsCard planetId={planetId} planetTile={planetTile} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );

  if (hasLegendaryAbility) {
    return (
      <div
        className={styles.legendaryWrapper}
        style={getCSSVariables(cssTypeKey) as React.CSSProperties}
      >
        {planetCardContent}
        <PlanetAbilityCard
          planetId={planetId}
          abilityName={planetData.legendaryAbilityName!}
          abilityText={planetData.legendaryAbilityText!}
          exhausted={legendaryAbilityExhausted}
          joinedRight
        />
      </div>
    );
  }

  return planetCardContent;
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
          planetTypes: [
            ...totals.planetTypes,
            ...((attachmentData as any).planetTypes || []),
          ],
        };
      }
      return totals;
    },
    {
      resources: 0,
      influence: 0,
      techSpecialties: [] as string[],
      planetTypes: [] as string[],
    }
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

type SingleTrait = "cultural" | "hazardous" | "industrial";

const getTraitIconKey = (planetType: string): SingleTrait | null => {
  const lowercase = planetType.toLowerCase();
  return VALID_PLANET_TYPES.has(lowercase) ? (lowercase as SingleTrait) : null;
};

const getTechSkipIconKey = (techSpecialty: string): string | null => {
  const lowercase = techSpecialty.toLowerCase();
  return VALID_TECH_SPECIALTIES.has(lowercase) ? lowercase : null;
};

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
  finalTraits: SingleTrait[];
};

function PlanetIcon({ planetData, finalTraits }: PlanetIconProps) {
  if (planetData.planetType === "FACTION" && planetData.factionHomeworld) {
    return (
      <Image
        src={cdnImage(`/factions/${planetData.factionHomeworld}.png`)}
        className={styles.factionIcon}
      />
    );
  }
  if (!finalTraits || finalTraits.length === 0) return null;
  if (finalTraits.length === 1) {
    return <PlanetTraitIcon trait={finalTraits[0]} />;
  }
  return <PlanetTraitIcon traits={finalTraits} />;
}

function resolveFinalTraits(
  planetType: string,
  attachmentPlanetTypes: string[]
): SingleTrait[] {
  const base = getTraitIconKey(planetType);
  const traits = new Set<SingleTrait>();
  if (base) traits.add(base);
  for (const t of attachmentPlanetTypes) {
    const key = t.toLowerCase();
    if (VALID_PLANET_TYPES.has(key)) traits.add(key as SingleTrait);
  }
  return Array.from(traits);
}

function resolveCssTypeKey(finalTraits: SingleTrait[]) {
  if (finalTraits.length !== 1) return "default";
  return finalTraits[0];
}
