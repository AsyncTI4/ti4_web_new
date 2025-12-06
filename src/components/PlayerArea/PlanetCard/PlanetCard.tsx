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
import { TilePlanet } from "@/context/types";
import { Planet } from "@/data/types";
import { IconValue } from "@/components/shared/primitives/IconValue";

type Props = {
  planetId: string;
  legendaryAbilityExhausted?: boolean;
  isExhausted?: boolean; // Optional prop to override exhausted status from playerData
};

export function PlanetCard({
  planetId,
  legendaryAbilityExhausted = false,
  isExhausted: isExhaustedProp,
}: Props) {
  const [opened, setOpened] = useState(false);
  const planetData = getPlanetData(planetId);
  const planetTile = usePlanet(planetId);

  // Use prop if provided (from playerData.exhaustedPlanets), otherwise fall back to planetTile
  const isExhausted = isExhaustedProp ?? planetTile?.exhausted ?? false;
  const resolvedAttachments = useMemo(() => {
    return planetTile?.attachments || [];
  }, [planetTile]);

  if (!planetData) {
    console.warn(`Planet data not found for ID: ${planetId}`);
    return null;
  }

  const attachmentModifiers = calculateAttachmentModifiers(resolvedAttachments);
  const finalTraits = resolveFinalTraits(
    planetData.planetTypes ||
      (planetData.planetType ? [planetData.planetType] : []),
    attachmentModifiers.planetTypes
  );
  const baseCssTypeKey = resolveCssTypeKey(finalTraits);
  const allIcons = createAllIcons(
    planetData,
    attachmentModifiers,
    resolvedAttachments
  );
  const { finalResources, finalInfluence } = calculateFinalValues(
    planetData,
    attachmentModifiers,
    planetTile
  );
  const isLegendary = checkIsLegendary(planetData, resolvedAttachments);
  const hasLegendaryAbility = !!(
    planetData.legendaryAbilityName && planetData.legendaryAbilityText
  );
  const isOcean = planetId.startsWith("ocean");
  const isDeepAbyss =
    (planetData.shortName ?? planetData.name) === "Deep Abyss";
  const cssTypeKey = isOcean || isDeepAbyss ? "ocean" : baseCssTypeKey;

  const planetCardContent = (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          onClick={() => setOpened((o) => !o)}
          className={cx(
            styles.mainStack,
            isLegendary && styles.legendaryBackground,
            (isOcean || isDeepAbyss) && styles.deepAbyssBackground,
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

          {(isOcean || isDeepAbyss) && !isExhausted && (
            <>
              <Box className={cx(styles.bubbleParticle, styles.bubble1)} />
              <Box className={cx(styles.bubbleParticle, styles.bubble2)} />
              <Box className={cx(styles.bubbleParticle, styles.bubble3)} />
              <Box className={cx(styles.bubbleParticle, styles.bubble4)} />
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
                <IconValue
                  icon={
                    <Image
                      src="/pa_resources.png"
                      className={styles.resourceImage}
                    />
                  }
                  value={finalResources}
                />
                <IconValue
                  icon={<InfluenceIcon size={18} />}
                  value={finalInfluence}
                />
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
            ...(attachmentData.planetTypes || []),
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
  planetData: Planet,
  attachmentModifiers: AttachmentModifiers,
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

function calculateFinalValues(
  planetData: Planet,
  attachmentModifiers: AttachmentModifiers,
  planetTile?: TilePlanet
) {
  // If the server provides calculated values (e.g. for Triad), use them
  if (
    planetTile?.resources !== undefined &&
    planetTile?.influence !== undefined
  ) {
    return {
      finalResources: planetTile.resources,
      finalInfluence: planetTile.influence,
    };
  }

  // Fallback to client-side calculation
  return {
    finalResources: planetData.resources + attachmentModifiers.resources,
    finalInfluence: planetData.influence + attachmentModifiers.influence,
  };
}

function checkIsLegendary(planetData: Planet, attachments: string[]) {
  return !!planetData.legendaryAbilityText || attachments.includes("nanoforge");
}

function getCSSVariables(planetType: string) {
  const typeKey = planetType?.toLowerCase() || "default";
  // Map known planet types, fallback to 'default' for unknown types
  const validTypes = [
    "cultural",
    "hazardous",
    "industrial",
    "faction",
    "mr",
    "ocean",
  ];
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

const getTechSkipIconKey = (techSpecialty: string): string | null => {
  const lowercase = techSpecialty.toLowerCase();
  return VALID_TECH_SPECIALTIES.has(lowercase) ? lowercase : null;
};

type AttachmentUpgradeIconProps = object;

function AttachmentUpgradeIcon({}: AttachmentUpgradeIconProps) {
  return (
    <Image
      src={cdnImage("/planet_cards/pc_upgrade.png")}
      className={styles.attachmentIcon}
    />
  );
}

type PlanetIconProps = {
  planetData: Planet;
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
  planetTypes: string[],
  attachmentPlanetTypes: string[]
): SingleTrait[] {
  const traits = new Set<SingleTrait>();
  // Add planet types from planet data
  for (const t of planetTypes) {
    const key = t.toLowerCase();
    if (VALID_PLANET_TYPES.has(key)) traits.add(key as SingleTrait);
  }
  // Add planet types from attachments
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

type AttachmentModifiers = {
  resources: number;
  influence: number;
  techSpecialties: string[];
  planetTypes: string[];
};
