import type { ReactNode } from "react";
import { Image } from "@mantine/core";
import { IconPlanet } from "@tabler/icons-react";
import cx from "clsx";
import { Module } from "@/shared/ui/primitives/Module/Module";
import InfluenceIcon from "@/shared/ui/InfluenceIcon";
import {
  TechSkipIcon,
  type TechType,
} from "@/domains/player/components/TechSkipIcon";
import { PlanetTraitIcon } from "@/domains/player/components/PlanetTraitIcon";
import { mergePlanetTraits, type PlanetTrait } from "@/utils/planetTraits";
import { cdnImage } from "@/entities/data/cdnImage";
import { getPlanetData } from "@/entities/lookup/planets";
import { getAttachmentData } from "@/entities/lookup/attachments";
import { getAttachmentModifiers } from "@/utils/planets";
import type { TilePlanet } from "@/app/providers/context/types";
import { summarizeZone } from "./fleetMath";
import { ControllerChip, ForceStrip } from "./ForceStrip";
import type { FactionHelpers } from "./useFactionHelpers";
import styles from "./SystemDossier.module.css";

type PlanetData = NonNullable<ReturnType<typeof getPlanetData>>;

function EconomicFigure({
  icon,
  value,
  bonus,
}: {
  icon: ReactNode;
  value: number;
  bonus: number;
}) {
  return (
    <span className={styles.figure}>
      {icon}
      <span>
        {value}
        {bonus !== 0 && (
          <em className={styles.bonus}>
            {bonus > 0 ? "+" : ""}
            {bonus}
          </em>
        )}
      </span>
    </span>
  );
}

/** Strips the markdown-italic asterisks the planet data wraps lore in. */
function cleanFlavour(text: string): string {
  return text.replace(/^\*+/, "").replace(/\*+$/, "").trim();
}

function planetTraits(planet: PlanetData): PlanetTrait[] {
  if (planet.planetTypes?.length) return mergePlanetTraits(planet.planetTypes);
  return mergePlanetTraits(planet.planetType ? [planet.planetType] : null);
}

/** The legendary ability is shown in its own block, so it is not flagged here. */
function attachmentEffects(
  data: NonNullable<ReturnType<typeof getAttachmentData>>,
): string {
  return [
    data.resourcesModifier ? `+${data.resourcesModifier}R` : null,
    data.influenceModifier ? `+${data.influenceModifier}I` : null,
    data.techSpeciality?.length
      ? data.techSpeciality.join("/").toLowerCase()
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function AttachmentList({ attachments }: { attachments: string[] }) {
  if (attachments.length === 0) return null;
  return (
    <div className={styles.attachments}>
      {attachments.map((attachmentId, index) => {
        const data = getAttachmentData(attachmentId);
        if (!data) return null;
        const effects = attachmentEffects(data);
        return (
          <span key={`${attachmentId}-${index}`} className={styles.attachment}>
            <img src={cdnImage(`/attachment_token/${data.imagePath}`)} alt="" />
            {data.name ?? attachmentId}
            {effects && <em>{effects}</em>}
          </span>
        );
      })}
    </div>
  );
}

function LegendaryAbility({ planet }: { planet: PlanetData }) {
  if (!planet.legendaryAbilityText) return null;
  return (
    <div className={styles.legendary}>
      <div className={styles.legendaryHead}>
        <Image
          src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
          w={14}
          h={14}
        />
        <span className={styles.legendaryName}>
          {planet.legendaryAbilityName ?? "Legendary Ability"}
        </span>
      </div>
      <p className={styles.legendaryText}>{planet.legendaryAbilityText}</p>
    </div>
  );
}

/**
 * The masthead carries everything static about the planet on one line —
 * kind, name, traits, economics, defenses — with control on the right.
 */
function PlanetHeader({
  planet,
  planetTile,
  helpers,
}: {
  planet: PlanetData;
  planetTile: TilePlanet;
  helpers: FactionHelpers;
}) {
  const attachmentBonus = getAttachmentModifiers(planetTile.attachments ?? []);
  const traits = planetTraits(planet);

  return (
    <div className={styles.planetHeader}>
      <span className={styles.identity}>
        <IconPlanet size={15} className={styles.zoneKindIcon} aria-hidden />
        <span className={styles.planetName}>{planet.name}</span>
        {traits.length > 0 && <PlanetTraitIcon traits={traits} size={15} />}
      </span>

      <span
        className={cx(
          styles.economics,
          planetTile.exhausted && styles.figureExhausted,
        )}
      >
        <EconomicFigure
          icon={<Image src="/pa_resources.png" w={13} h={13} />}
          value={planet.resources}
          bonus={attachmentBonus.resources}
        />
        <EconomicFigure
          icon={<InfluenceIcon size={13} />}
          value={planet.influence}
          bonus={attachmentBonus.influence}
        />
        {planetTile.techSpecialties?.map((specialty, index) => (
          <TechSkipIcon
            key={`${specialty}-${index}`}
            techType={specialty.toLowerCase() as TechType}
            size={14}
          />
        ))}
      </span>

      {planetTile.planetaryShield && (
        <span className={styles.shieldTag}>Planetary Shield</span>
      )}

      <span className={styles.planetHeaderRight}>
        {planetTile.exhausted && (
          <span className={styles.exhaustedTag}>Exhausted</span>
        )}
        <ControllerChip
          faction={planetTile.controlledBy}
          displayName={helpers.displayName}
        />
      </span>
    </div>
  );
}

export function PlanetPlate({
  planetId,
  planetTile,
  helpers,
}: {
  planetId: string;
  planetTile: TilePlanet;
  helpers: FactionHelpers;
}) {
  const planet = getPlanetData(planetId);
  if (!planet) return null;

  /* Everything on the planet shows in the rack, but only ground forces count
     in the combat math. */
  const groundSummaries = summarizeZone(
    planetTile.unitsByFaction,
    helpers.playerFor,
    (unit) => unit.isGroundForce,
  );
  const flavour = planet.flavourText ? cleanFlavour(planet.flavourText) : "";

  return (
    <Module className={styles.plate}>
      <div className={styles.planetBody}>
        <PlanetHeader
          planet={planet}
          planetTile={planetTile}
          helpers={helpers}
        />
        <LegendaryAbility planet={planet} />
        <AttachmentList attachments={planetTile.attachments ?? []} />
        {groundSummaries.length > 0 && (
          <div className={cx(styles.zoneForces, styles.groundForces)}>
            {groundSummaries.map((summary) => (
              <ForceStrip
                key={summary.faction}
                summary={summary}
                helpers={helpers}
              />
            ))}
          </div>
        )}
        {flavour && <p className={styles.flavour}>{flavour}</p>}
      </div>
    </Module>
  );
}
