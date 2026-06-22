import { Stack, Box, Group, Text } from "@mantine/core";
import { useMemo } from "react";
import cx from "clsx";
import { PlanetAbilityCard } from "../PlanetAbilityCard";
import { TECH_SKIP_IMAGES } from "../TechSkipIcon";
import { cdnImage } from "@/entities/data/cdnImage";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { PlanetDetailsCard } from "../PlanetDetailsCard";
import { getAttachmentData } from "@/entities/lookup/attachments";
import styles from "./PlanetCard.module.css";
import { getPlanetData } from "@/entities/lookup/planets";
import { usePlanet } from "@/hooks/usePlanet";
import { TilePlanet } from "@/app/providers/context/types";
import { Planet } from "@/entities/data/types";
import { useAppStore } from "@/utils/appStore";
import { useDisclosure } from "@/hooks/useDisclosure";
import {
  getPlanetTraitIconSrc,
  mergePlanetTraits,
  type PlanetTrait,
} from "@/utils/planetTraits";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { getPlanetTileBackground } from "./planetTileBackground";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

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
  const { opened, setOpened, toggle } = useDisclosure(false);
  const planetData = getPlanetData(planetId);
  const planetTile = usePlanet(planetId);
  const setHoveredPlanetId = useAppStore((state) => state.setHoveredPlanetId);
  const setScrollToPlanetId = useAppStore((state) => state.setScrollToPlanetId);

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
  const finalTraits = mergePlanetTraits(
    planetData.planetTypes ||
      (planetData.planetType ? [planetData.planetType] : []),
    attachmentModifiers.planetTypes,
  );
  const baseCssTypeKey = resolveCssTypeKey(finalTraits);
  const iconSources = createIconSources(
    planetData,
    attachmentModifiers,
    resolvedAttachments,
  );
  const { finalResources, finalInfluence } = calculateFinalValues(
    planetData,
    attachmentModifiers,
    planetTile,
  );
  const isLegendary = checkIsLegendary(planetData, resolvedAttachments);
  const hasLegendaryAbility = !!(
    planetData.legendaryAbilityName && planetData.legendaryAbilityText
  );
  const isOcean = planetId.startsWith("ocean");
  const isDeepAbyss =
    (planetData.shortName ?? planetData.name) === "Deep Abyss";
  const cssTypeKey = isOcean || isDeepAbyss ? "ocean" : baseCssTypeKey;
  const planetTileBackground = !isMobileDevice()
    ? getPlanetTileBackground(planetData)
    : null;
  const planetIconSrc = getPlanetIconSrc(planetData, finalTraits);

  const planetCardContent = (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          onClick={() => {
            toggle();
            setScrollToPlanetId(planetId);
          }}
          onMouseEnter={() => setHoveredPlanetId(planetId)}
          onMouseLeave={() => setHoveredPlanetId(null)}
          className={cx(
            styles.mainStack,
            isLegendary && styles.legendaryBackground,
            (isOcean || isDeepAbyss) && styles.deepAbyssBackground,
            isLegendary && styles.legendary,
            hasLegendaryAbility && styles.noRightRadius,
            isExhausted && styles.exhausted,
          )}
          style={getCSSVariables(cssTypeKey) as React.CSSProperties}
        >
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

          {planetTileBackground && (
            <Box
              className={styles.tileArtMask}
              style={planetTileBackground.maskStyle}
              aria-hidden="true"
            >
              <img
                {...lowPriorityImageProps}
                className={styles.tileArtImage}
                src={planetTileBackground.src}
                alt=""
                style={planetTileBackground.imageStyle}
              />
            </Box>
          )}

          <Box
            className={cx(
              styles.iconContainer,
              planetIconSrc && styles.hasPlanetIcon,
            )}
            style={getPlanetIconStyle(planetIconSrc)}
          />
          <Stack className={styles.bottomStack}>
            <Group className={styles.nameGroup}>
              <Text className={styles.planetName}>
                {planetData.shortName ?? planetData.name}
              </Text>
              <PlanetCompactValues
                iconSources={iconSources}
                resources={finalResources}
                influence={finalInfluence}
              />
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
        onClick={() => setScrollToPlanetId(planetId)}
        onMouseEnter={() => setHoveredPlanetId(planetId)}
        onMouseLeave={() => setHoveredPlanetId(null)}
      >
        {planetCardContent}
        <PlanetAbilityCard
          planetId={planetId}
          abilityName={planetData.legendaryAbilityName!}
          abilityText={planetData.legendaryAbilityText!}
          actionCards={planetTile?.actionCards}
          exhausted={legendaryAbilityExhausted}
          joinedRight
        />
      </div>
    );
  }

  return planetCardContent;
}

function PlanetCompactValues({
  iconSources,
  resources,
  influence,
}: {
  iconSources: string[];
  resources: number;
  influence: number;
}) {
  return (
    <Box className={styles.planetValues}>
      {iconSources.length > 0 && (
        <Box
          className={styles.iconsStack}
          style={getStackedIconStyle(iconSources)}
        />
      )}
      <span className={cx(styles.planetValue, styles.resourceValue)}>
        {resources}
      </span>
      <span className={cx(styles.planetValue, styles.influenceValue)}>
        {influence}
      </span>
    </Box>
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
    },
  );
}

function createIconSources(
  planetData: Planet,
  attachmentModifiers: AttachmentModifiers,
  attachments: string[],
) {
  const iconSources: string[] = [];

  // Add tech skip icons
  const allTechSpecialties = [
    ...(planetData.techSpecialties || []),
    ...attachmentModifiers.techSpecialties,
  ];

  const techSkipSources = allTechSpecialties
    .map((specialty) => getTechSkipIconKey(specialty))
    .filter((key): key is keyof typeof TECH_SKIP_IMAGES => key !== null)
    .map((key) => TECH_SKIP_IMAGES[key]);

  iconSources.push(...techSkipSources);

  // Add attachment upgrade icon if applicable
  if (attachments.length > 0) {
    iconSources.push(cdnImage("/planet_cards/pc_upgrade.png"));
  }

  return iconSources;
}

function calculateFinalValues(
  planetData: Planet,
  attachmentModifiers: AttachmentModifiers,
  planetTile?: TilePlanet,
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
  const finalType = VALID_CSS_TYPES.has(typeKey) ? typeKey : "default";

  return {
    "--planet-background": `var(--${finalType}-background)`,
    "--planet-border": `var(--${finalType}-border)`,
    "--planet-shadow": `var(--${finalType}-shadow)`,
  };
}

const VALID_CSS_TYPES = new Set([
  "cultural",
  "hazardous",
  "industrial",
  "faction",
  "mr",
  "ocean",
]);

const VALID_TECH_SPECIALTIES = new Set([
  "biotic",
  "propulsion",
  "cybernetic",
  "warfare",
]);

const getTechSkipIconKey = (
  techSpecialty: string,
): keyof typeof TECH_SKIP_IMAGES | null => {
  const lowercase = techSpecialty.toLowerCase() as keyof typeof TECH_SKIP_IMAGES;
  return VALID_TECH_SPECIALTIES.has(lowercase) ? lowercase : null;
};

function getPlanetIconSrc(planetData: Planet, finalTraits: PlanetTrait[]) {
  if (planetData.planetType === "FACTION" && planetData.factionHomeworld) {
    return cdnImage(`/factions/${planetData.factionHomeworld}.png`);
  }
  if (!finalTraits || finalTraits.length === 0) return null;
  return getPlanetTraitIconSrc(finalTraits);
}

function resolveCssTypeKey(finalTraits: PlanetTrait[]) {
  if (finalTraits.length !== 1) return "default";
  return finalTraits[0];
}

type AttachmentModifiers = {
  resources: number;
  influence: number;
  techSpecialties: string[];
  planetTypes: string[];
};

function getPlanetIconStyle(src: string | null): React.CSSProperties | undefined {
  if (!src) return undefined;

  return {
    "--planet-icon-image": `url("${src}")`,
  } as React.CSSProperties;
}

function getStackedIconStyle(iconSources: string[]): React.CSSProperties {
  const iconSize = 16;
  const gap = 1;
  const padding = 1;

  return {
    width: `${iconSize + padding * 2}px`,
    height: `${
      padding * 2 +
      iconSources.length * iconSize +
      Math.max(0, iconSources.length - 1) * gap
    }px`,
    backgroundImage: [
      "linear-gradient(180deg, rgba(3, 7, 12, 0.08), rgba(3, 7, 12, 0.42))",
      ...iconSources.map((src) => `url("${src}")`),
    ].join(", "),
    backgroundPosition: [
      "0 0",
      ...iconSources.map(
        (_, index) => `center ${padding + index * (iconSize + gap)}px`,
      ),
    ].join(", "),
    backgroundSize: [
      "100% 100%",
      ...iconSources.map(() => `${iconSize}px ${iconSize}px`),
    ].join(", "),
    backgroundRepeat: ["no-repeat", ...iconSources.map(() => "no-repeat")].join(
      ", ",
    ),
  } as React.CSSProperties;
}
