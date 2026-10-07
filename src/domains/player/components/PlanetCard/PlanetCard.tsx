import { Stack, Box, Text } from "@mantine/core";
import cx from "clsx";
import { PlanetAbilityCard } from "../PlanetAbilityCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { PlanetDetailsCard } from "@/domains/cards/components/PlanetDetailsCard";
import styles from "./PlanetCard.module.css";
import { getPlanetData } from "@/entities/lookup/planets";
import { usePlanet } from "@/hooks/usePlanet";
import type { Planet } from "@/entities/data/types";
import { useAppStore } from "@/state/appStore";
import { useDisclosure } from "@/hooks/useDisclosure";
import { mergePlanetTraits } from "@/entities/game/planetTraits";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { getPlanetTileBackground } from "./planetTileBackground";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";
import { getAttachmentModifiers } from "@/entities/game/planets";
import {
  calculateFinalValues,
  createIconSources,
  getCSSVariables,
  getPlanetIconSrc,
  getPlanetIconStyle,
  getStackedIconStyle,
  isOceanicPlanet,
  planetCssType,
} from "./planetCardStyle";

type Props = {
  planetId: string;
  legendaryAbilityExhausted?: boolean;
  /** Overrides the exhausted state read from the map tile. */
  isExhausted?: boolean;
};

const LEGENDARY_PARTICLES = [
  styles.particle1,
  styles.particle2,
  styles.particle3,
  styles.particle4,
  styles.particle5,
];
const OCEAN_BUBBLES = [
  styles.bubble1,
  styles.bubble2,
  styles.bubble3,
  styles.bubble4,
];

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

function PlanetDecorations({
  planetData,
  isLegendary,
  isOceanic,
  isExhausted,
}: {
  planetData: Planet;
  isLegendary: boolean;
  isOceanic: boolean;
  isExhausted: boolean;
}) {
  const tileBackground = isMobileDevice()
    ? null
    : getPlanetTileBackground(planetData);

  return (
    <>
      {isLegendary && !isExhausted && (
        <>
          <Box className={styles.legendaryConstellation} />
          {LEGENDARY_PARTICLES.map((particle) => (
            <Box
              key={particle}
              className={cx(styles.floatingParticle, particle)}
            />
          ))}
        </>
      )}

      {isOceanic &&
        !isExhausted &&
        OCEAN_BUBBLES.map((bubble) => (
          <Box key={bubble} className={cx(styles.bubbleParticle, bubble)} />
        ))}

      {tileBackground && (
        <Box
          className={styles.tileArtMask}
          style={tileBackground.maskStyle}
          aria-hidden="true"
        >
          <img
            {...lowPriorityImageProps}
            className={styles.tileArtImage}
            src={tileBackground.src}
            alt=""
            style={tileBackground.imageStyle}
          />
        </Box>
      )}
    </>
  );
}

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

  if (!planetData) return null;

  const isExhausted = isExhaustedProp ?? planetTile?.exhausted ?? false;
  const attachments = planetTile?.attachments ?? [];
  const attachmentModifiers = getAttachmentModifiers(attachments);
  const finalTraits = mergePlanetTraits(
    planetData.planetTypes ||
      (planetData.planetType ? [planetData.planetType] : []),
    attachmentModifiers.planetTypes,
  );
  const { finalResources, finalInfluence } = calculateFinalValues(
    planetData,
    attachmentModifiers,
    planetTile,
  );
  const isLegendary =
    !!planetData.legendaryAbilityText || attachments.includes("nanoforge");
  const { legendaryAbilityName, legendaryAbilityText } = planetData;
  const hasLegendaryAbility = !!(legendaryAbilityName && legendaryAbilityText);
  const isOceanic = isOceanicPlanet(planetId, planetData);
  const cssVariables = getCSSVariables(planetCssType(isOceanic, finalTraits));
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
            isOceanic && styles.deepAbyssBackground,
            isLegendary && styles.legendary,
            hasLegendaryAbility && styles.noRightRadius,
            isExhausted && styles.exhausted,
            planetIconSrc && styles.hasPlanetIcon,
          )}
          style={{ ...cssVariables, ...getPlanetIconStyle(planetIconSrc) }}
        >
          <PlanetDecorations
            planetData={planetData}
            isLegendary={isLegendary}
            isOceanic={isOceanic}
            isExhausted={isExhausted}
          />
          <Text className={styles.planetName}>
            {planetData.shortName ?? planetData.name}
          </Text>
          <PlanetCompactValues
            iconSources={createIconSources(
              planetData,
              attachmentModifiers,
              attachments,
            )}
            resources={finalResources}
            influence={finalInfluence}
          />
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.popoverDropdown}>
        <PlanetDetailsCard planetId={planetId} planetTile={planetTile} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );

  if (!legendaryAbilityName || !legendaryAbilityText) return planetCardContent;

  return (
    <div
      className={styles.legendaryWrapper}
      style={cssVariables}
      onClick={() => setScrollToPlanetId(planetId)}
      onMouseEnter={() => setHoveredPlanetId(planetId)}
      onMouseLeave={() => setHoveredPlanetId(null)}
    >
      {planetCardContent}
      <PlanetAbilityCard
        planetId={planetId}
        abilityName={legendaryAbilityName}
        abilityText={legendaryAbilityText}
        actionCards={planetTile?.actionCards}
        exhausted={legendaryAbilityExhausted}
        joinedRight
      />
    </div>
  );
}
