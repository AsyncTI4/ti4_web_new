import type { ReactNode } from "react";
import { Image } from "@/ds";
import cx from "clsx";
import InfluenceIcon from "@/shared/ui/InfluenceIcon";
import { TechSkipIcon, type TechType } from "@/shared/ui/TechSkipIcon";
import { PlanetTraitIcon } from "@/shared/ui/PlanetTraitIcon";
import {
  mergePlanetTraits,
  type PlanetTrait,
} from "@/entities/game/planetTraits";
import { cdnImage } from "@/entities/data/cdnImage";
import { getPlanetData } from "@/entities/lookup/planets";
import { getAttachmentData } from "@/entities/lookup/attachments";
import { getAttachmentModifiers } from "@/entities/game/planets";
import type { Tile, TilePlanet } from "@/entities/game/types";
import { buildGroundBattleUrl } from "./battleCalcLink";
import { summarizeZone } from "./fleetMath";
import {
  arrangeZone,
  Balance,
  CalcLink,
  ControlPill,
  ForceRow,
} from "./ForceRow";
import type { FactionHelpers } from "./useFactionHelpers";
import styles from "./SystemDossier.module.css";

export type PlanetData = NonNullable<ReturnType<typeof getPlanetData>>;

export function EconomicFigure({
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

function planetTraits(planet: PlanetData): PlanetTrait[] {
  if (planet.planetTypes?.length) return mergePlanetTraits(planet.planetTypes);
  return mergePlanetTraits(planet.planetType ? [planet.planetType] : null);
}

/** The legendary ability is shown in its own row, so it is not flagged here. */
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
    <div className={styles.legend}>
      <span className={styles.legendTag}>
        <span className={styles.legendCore}>
          <img src={cdnImage("/planet_cards/pc_legendary_rdy.png")} alt="" />
        </span>
        {planet.legendaryAbilityName ?? "Legendary ability"}
      </span>
      <p>{planet.legendaryAbilityText}</p>
    </div>
  );
}

/**
 * One planet read as a band of the scan: name, economics and defences in the
 * header with the ground balance, then the forces on the surface.
 */
export function PlanetBand({
  planetId,
  planetTile,
  tile,
  helpers,
  attacker,
}: {
  planetId: string;
  planetTile: TilePlanet;
  tile: Tile;
  helpers: FactionHelpers;
  attacker: string | null;
}) {
  const planet = getPlanetData(planetId);
  if (!planet) return null;

  /* Everything on the planet shows in the rack, but only ground forces count
     in the combat math. */
  const summaries = summarizeZone(
    planetTile.unitsByFaction,
    helpers.playerFor,
    (unit) => unit.isGroundForce,
  );
  const { ordered, sides, roleOf } = arrangeZone(
    summaries,
    (s) => s.rows.some((row) => row.unit.isGroundForce),
    attacker,
    planetTile.controlledBy,
    true,
  );
  const defender = sides?.defender.faction ?? ordered[0]?.faction;
  const calcUrl = defender
    ? buildGroundBattleUrl(
        tile,
        planetTile,
        defender,
        helpers.playerFor,
        attacker,
      )
    : null;
  const bonus = getAttachmentModifiers(planetTile.attachments ?? []);
  const traits = planetTraits(planet);

  return (
    <section className={styles.zone} data-z="ground">
      <header className={styles.zoneHead}>
        <span className={styles.alt}>
          {traits.length > 0 && <PlanetTraitIcon traits={traits} size={16} />}
          {planet.name}
        </span>
        <span
          className={cx(
            styles.vals,
            planetTile.exhausted && styles.valsExhausted,
          )}
        >
          <EconomicFigure
            icon={<Image src="/pa_resources.png" w={13} h={13} />}
            value={planet.resources}
            bonus={bonus.resources}
          />
          <EconomicFigure
            icon={<InfluenceIcon size={13} />}
            value={planet.influence}
            bonus={bonus.influence}
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
          <span className={styles.tag}>Shield</span>
        )}
        {planetTile.exhausted && (
          <span className={cx(styles.tag, styles.tagWarn)}>Exhausted</span>
        )}
        <span className={styles.headEnd}>
          <Balance sides={sides} helpers={helpers} />
          {!sides && (
            <ControlPill
              faction={planetTile.controlledBy}
              displayName={helpers.displayName}
            />
          )}
          <CalcLink
            url={calcUrl}
            title={`Ground combat on ${planet.name} in the battle calculator`}
          />
        </span>
      </header>
      {ordered.map((summary) => (
        <ForceRow
          key={summary.faction}
          summary={summary}
          helpers={helpers}
          role={roleOf(summary.faction)}
        />
      ))}
      <AttachmentList attachments={planetTile.attachments ?? []} />
      <LegendaryAbility planet={planet} />
    </section>
  );
}
