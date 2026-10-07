import { cdnImage } from "@/entities/data/cdnImage";
import type { TilePlanet } from "@/app/providers/context/types";
import type { Planet } from "@/entities/data/types";
import { getPlanetTraitIconSrc, type PlanetTrait } from "@/utils/planetTraits";
import type { AttachmentModifiers } from "@/utils/planets";
import { TECH_SKIP_IMAGES, type TechType } from "../TechSkipIcon";

const VALID_CSS_TYPES = new Set([
  "cultural",
  "hazardous",
  "industrial",
  "faction",
  "mr",
  "ocean",
]);

const STACKED_ICON_SIZE = 16;
const STACKED_ICON_GAP = 1;
const STACKED_ICON_PADDING = 1;

export function isOceanicPlanet(planetId: string, planetData: Planet): boolean {
  return (
    planetId.startsWith("ocean") ||
    (planetData.shortName ?? planetData.name) === "Deep Abyss"
  );
}

export function planetCssType(
  isOceanic: boolean,
  traits: PlanetTrait[],
): string {
  if (isOceanic) return "ocean";
  return traits.length === 1 ? traits[0] : "default";
}

export function createIconSources(
  planetData: Planet,
  attachmentModifiers: AttachmentModifiers,
  attachments: string[],
): string[] {
  const techSkipSources = [
    ...(planetData.techSpecialties || []),
    ...attachmentModifiers.techSpecialties,
  ].flatMap((specialty) => {
    const src = TECH_SKIP_IMAGES[specialty.toLowerCase() as TechType];
    return src ? [src] : [];
  });

  return attachments.length > 0
    ? [...techSkipSources, cdnImage("/planet_cards/pc_upgrade.png")]
    : techSkipSources;
}

/** Server-computed values (e.g. Triad) win over the client-side sum. */
export function calculateFinalValues(
  planetData: Planet,
  attachmentModifiers: AttachmentModifiers,
  planetTile?: TilePlanet,
) {
  if (planetTile?.resources != null && planetTile?.influence != null) {
    return {
      finalResources: planetTile.resources,
      finalInfluence: planetTile.influence,
    };
  }

  return {
    finalResources: planetData.resources + attachmentModifiers.resources,
    finalInfluence: planetData.influence + attachmentModifiers.influence,
  };
}

export function getCSSVariables(planetType: string): React.CSSProperties {
  const typeKey = planetType.toLowerCase() || "default";
  const finalType = VALID_CSS_TYPES.has(typeKey) ? typeKey : "default";

  return {
    "--planet-background": `var(--${finalType}-background)`,
    "--planet-border": `var(--${finalType}-border)`,
    "--planet-shadow": `var(--${finalType}-shadow)`,
  } as React.CSSProperties;
}

export function getPlanetIconSrc(
  planetData: Planet,
  finalTraits: PlanetTrait[],
): string | null {
  if (planetData.planetType === "FACTION" && planetData.factionHomeworld) {
    return cdnImage(`/factions/${planetData.factionHomeworld}.png`);
  }
  if (finalTraits.length === 0) return null;
  return getPlanetTraitIconSrc(finalTraits);
}

export function getPlanetIconStyle(
  src: string | null,
): React.CSSProperties | undefined {
  if (!src) return undefined;
  return { "--planet-icon-image": `url("${src}")` } as React.CSSProperties;
}

/** Stacks every icon vertically as layered backgrounds of a single element. */
export function getStackedIconStyle(
  iconSources: string[],
): React.CSSProperties {
  const count = iconSources.length;
  return {
    width: `${STACKED_ICON_SIZE + STACKED_ICON_PADDING * 2}px`,
    height: `${
      STACKED_ICON_PADDING * 2 +
      count * STACKED_ICON_SIZE +
      Math.max(0, count - 1) * STACKED_ICON_GAP
    }px`,
    backgroundImage: [
      "linear-gradient(180deg, rgba(3, 7, 12, 0.08), rgba(3, 7, 12, 0.42))",
      ...iconSources.map((src) => `url("${src}")`),
    ].join(", "),
    backgroundPosition: [
      "0 0",
      ...iconSources.map(
        (_, index) =>
          `center ${STACKED_ICON_PADDING + index * (STACKED_ICON_SIZE + STACKED_ICON_GAP)}px`,
      ),
    ].join(", "),
    backgroundSize: [
      "100% 100%",
      ...iconSources.map(() => `${STACKED_ICON_SIZE}px ${STACKED_ICON_SIZE}px`),
    ].join(", "),
    backgroundRepeat: ["no-repeat", ...iconSources.map(() => "no-repeat")].join(
      ", ",
    ),
  };
}
