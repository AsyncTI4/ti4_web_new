import { Box, Image, Text, Tooltip } from "@mantine/core";
import { IconPlanet, IconRocket } from "@tabler/icons-react";
import cx from "clsx";
import { Module } from "@/shared/ui/primitives/Module/Module";
import { MapTile } from "../MapTile";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import InfluenceIcon from "@/shared/ui/InfluenceIcon";
import { TechSkipIcon, type TechType } from "@/domains/player/components/TechSkipIcon";
import { PlanetTraitIcon } from "@/domains/player/components/PlanetTraitIcon";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTileById } from "@/domains/map/model/mapgen/systems";
import { getPlanetData, getPlanetsByTileId } from "@/entities/lookup/planets";
import { getAttachmentData } from "@/entities/lookup/attachments";
import { getColorAlias } from "@/entities/lookup/colors";
import { getPlayerFactionDisplayName } from "@/utils/playerUtils";
import { useGameData } from "@/hooks/useGameContext";
import type { Tile, TilePlanet } from "@/app/providers/context/types";
import type { PlayerData, Unit } from "@/entities/data/types";
import { getSystemFeatures } from "./featureRules";
import {
  summarizeForce,
  summarizeRows,
  formatStat,
  type ForceSummary,
} from "./fleetMath";
import styles from "./SystemDossier.module.css";

type Props = {
  tile: Tile;
};

const TILE_SCALE = 0.78;
const TILE_WIDTH = 345;
const TILE_HEIGHT = 299;

/** Strips the markdown-italic asterisks the planet data wraps lore in. */
function cleanFlavour(text: string): string {
  return text.replace(/^\*+/, "").replace(/\*+$/, "").trim();
}

function useFactionHelpers() {
  const gameData = useGameData();
  const players = gameData?.playerData ?? [];

  const playerFor = (faction: string): PlayerData | undefined =>
    players.find((p) => p.faction === faction);

  const displayName = (faction: string): string => {
    const player = playerFor(faction);
    if (player) return getPlayerFactionDisplayName(player);
    return faction.charAt(0).toUpperCase() + faction.slice(1);
  };

  const colorAlias = (faction: string): string =>
    getColorAlias(playerFor(faction)?.color);

  return { playerFor, displayName, colorAlias };
}

/** Structures ride in the same rack as combat units; their working stat —
    production for docks, space cannon for PDS — rides on the badge, spelled
    out so it needs no decoder ring. */
function unitBadgeSuffix(unit: Unit): string | null {
  if (unit.productionValue) return `production ${unit.productionValue}`;
  if (unit.spaceCannonHitsOn) {
    const dice = unit.spaceCannonDieCount ?? 1;
    return `space cannon ${unit.spaceCannonHitsOn}${dice > 1 ? `×${dice}` : ""}`;
  }
  return null;
}

function UnitChip({
  unit,
  colorAlias,
  count,
  sustained,
}: {
  unit: Unit;
  colorAlias: string;
  count: number;
  sustained: number;
}) {
  const suffix = unitBadgeSuffix(unit);
  const statLine = [
    unit.cost != null ? `Cost ${formatStat(unit.cost)}` : null,
    unit.combatHitsOn
      ? `Combat ${unit.combatHitsOn}${(unit.combatDieCount ?? 1) > 1 ? ` ×${unit.combatDieCount}` : ""}`
      : null,
    unit.moveValue ? `Move ${unit.moveValue}` : null,
    unit.capacityValue ? `Capacity ${unit.capacityValue}` : null,
    unit.sustainDamage ? "Sustain Damage" : null,
    sustained > 0 ? `${sustained} damage sustained` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Tooltip
      multiline
      maw={300}
      label={
        <Box>
          <Text size="xs" fw={600}>
            {unit.name}
          </Text>
          <Text size="xs" ff="monospace">
            {statLine}
          </Text>
          {unit.ability && (
            <Text size="xs" mt={4} c="gray.4">
              {unit.ability}
            </Text>
          )}
        </Box>
      }
    >
      <span className={styles.unitChip}>
        <img
          src={cdnImage(`/units/${colorAlias}_${unit.asyncId}.png`)}
          alt=""
          className={styles.unitChipImage}
        />
        {count > 1 && <span className={styles.unitChipCount}>{count}×</span>}
        <span className={styles.unitChipName}>{unit.name}</span>
        {suffix && <span className={styles.unitChipSuffix}>{suffix}</span>}
      </span>
    </Tooltip>
  );
}

/**
 * One faction's presence in a zone: a single large faction icon owns the
 * strip, its units flow beside it as named badges (structures included,
 * wearing their production or space-cannon stat), and the three numbers a
 * player weighs a force by sit in a readout trough under the army tab's own
 * icons. The math counts only units that roll dice in this zone's combat.
 */
function ForceStrip({
  faction,
  rows,
  math,
  displayName,
  colorAlias,
}: {
  faction: string;
  rows: ForceSummary["rows"];
  math: ForceSummary;
  displayName: string;
  colorAlias: string;
}) {
  if (rows.length === 0) return null;

  return (
    <div className={styles.forceStrip}>
      <span className={styles.forceOwner} title={displayName}>
        <FactionIcon faction={faction} w={26} h={26} />
      </span>
      <div className={styles.forceUnits}>
        {rows.map((row) => (
          <UnitChip
            key={row.asyncId}
            unit={row.unit}
            colorAlias={colorAlias}
            count={row.count}
            sustained={row.sustained}
          />
        ))}
      </div>
      {/* Fixed width, trailing edge: the numerals land in the same column on
          every strip in the dossier without a full-width band per force. */}
      <div className={styles.forceMath}>
        <span title="Total build cost">
          <img src={cdnImage("/player_area/pa_resources.png")} alt="Cost" />
          {formatStat(math.cost)}
        </span>
        <span title="Hits the force can absorb">
          <img src={cdnImage("/player_area/pa_health.png")} alt="Hits absorbed" />
          {formatStat(math.hitPoints)}
        </span>
        <span title="Expected hits per combat round">
          <img src={cdnImage("/player_area/pa_hit.png")} alt="Expected hits" />
          {formatStat(math.expectedHits)}
        </span>
      </div>
    </div>
  );
}

/** Ownership reads as one badge: role, faction mark and faction name. */
function ControllerChip({
  faction,
  displayName,
  label = "Control",
}: {
  faction: string | null | undefined;
  displayName: (faction: string) => string;
  label?: string;
}) {
  return (
    <span className={styles.control}>
      {faction ? (
        <span
          className={styles.controller}
          aria-label={`${label}: ${displayName(faction)}`}
        >
          <span className={styles.controlLabel}>{label}</span>
          <FactionIcon faction={faction} w={14} h={14} />
          {displayName(faction)}
        </span>
      ) : (
        <span className={styles.uncontrolled}>
          <span className={styles.controlLabel}>{label}</span>
          Uncontrolled
        </span>
      )}
    </span>
  );
}

function PlanetPlate({
  planetId,
  planetTile,
  helpers,
}: {
  planetId: string;
  planetTile: TilePlanet;
  helpers: ReturnType<typeof useFactionHelpers>;
}) {
  const planetData = getPlanetData(planetId);
  if (!planetData) return null;

  const attachments = planetTile.attachments ?? [];
  const attachmentBonus = attachments.reduce(
    (totals, attachmentId) => {
      const data = getAttachmentData(attachmentId);
      return {
        resources: totals.resources + (data?.resourcesModifier ?? 0),
        influence: totals.influence + (data?.influenceModifier ?? 0),
      };
    },
    { resources: 0, influence: 0 }
  );

  const traits =
    planetData.planetTypes && planetData.planetTypes.length > 0
      ? planetData.planetTypes
      : planetData.planetType &&
          ["CULTURAL", "INDUSTRIAL", "HAZARDOUS"].includes(planetData.planetType)
        ? [planetData.planetType]
        : [];

  /* Everything on the planet shows in the rack — structures wear their stat
     on the badge — but only ground forces count in the combat math. */
  const groundSummaries = Object.entries(planetTile.unitsByFaction ?? {})
    .map(([faction, entities]) => {
      const all = summarizeForce(entities, faction, helpers.playerFor(faction));
      const math = summarizeRows(
        all.rows.filter((row) => row.unit.isGroundForce)
      );
      return { faction, rows: all.rows, math };
    })
    .filter((f) => f.rows.length > 0);

  const flavour = planetData.flavourText
    ? cleanFlavour(planetData.flavourText)
    : null;

  return (
    <Module className={styles.plate}>
      <div className={styles.planetBody}>
        {/* The planet's masthead carries everything static about it on one
            line: kind, name, traits, economics, defenses — control on the
            right. Entities outrank the chrome around them, so the name sits
            at title scale, not on a 9px rail. */}
        <div className={styles.planetHeader}>
          <span className={styles.identity}>
            <IconPlanet size={15} className={styles.zoneKindIcon} aria-hidden />
            <span className={styles.planetName}>{planetData.name}</span>
            {traits.length > 0 && (
              <PlanetTraitIcon
                traits={traits.map((t) => t.toLowerCase()) as never}
                size={15}
              />
            )}
          </span>

          <span
            className={cx(
              styles.economics,
              planetTile.exhausted && styles.figureExhausted
            )}
          >
            <span className={styles.figure}>
              <Image src="/pa_resources.png" w={13} h={13} />
              <span>
                {planetData.resources}
                {attachmentBonus.resources !== 0 && (
                  <em className={styles.bonus}>
                    {attachmentBonus.resources > 0 ? "+" : ""}
                    {attachmentBonus.resources}
                  </em>
                )}
              </span>
            </span>
            <span className={styles.figure}>
              <InfluenceIcon size={13} />
              <span>
                {planetData.influence}
                {attachmentBonus.influence !== 0 && (
                  <em className={styles.bonus}>
                    {attachmentBonus.influence > 0 ? "+" : ""}
                    {attachmentBonus.influence}
                  </em>
                )}
              </span>
            </span>
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

        {planetData.legendaryAbilityText && (
          <div className={styles.legendary}>
            <div className={styles.legendaryHead}>
              <Image
                src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
                w={14}
                h={14}
              />
              <span className={styles.legendaryName}>
                {planetData.legendaryAbilityName ?? "Legendary Ability"}
              </span>
            </div>
            <p className={styles.legendaryText}>
              {planetData.legendaryAbilityText}
            </p>
          </div>
        )}

        {attachments.length > 0 && (
          <div className={styles.attachments}>
            {attachments.map((attachmentId, index) => {
              const data = getAttachmentData(attachmentId);
              if (!data) return null;
              /* No "legendary" flag here — the ability it grants is already
                 spelled out in its own block above. */
              const effects = [
                data.resourcesModifier ? `+${data.resourcesModifier}R` : null,
                data.influenceModifier ? `+${data.influenceModifier}I` : null,
                data.techSpeciality?.length
                  ? data.techSpeciality.join("/").toLowerCase()
                  : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <span key={`${attachmentId}-${index}`} className={styles.attachment}>
                  <img
                    src={cdnImage(`/attachment_token/${data.imagePath}`)}
                    alt=""
                  />
                  {data.name ?? attachmentId}
                  {effects && <em>{effects}</em>}
                </span>
              );
            })}
          </div>
        )}

        {/* Space, not another hairline, separates what the planet *is* from
            who is standing on it. */}
        {groundSummaries.length > 0 && (
          <div className={cx(styles.zoneForces, styles.groundForces)}>
            {groundSummaries.map(({ faction, rows, math }) => (
              <ForceStrip
                key={faction}
                faction={faction}
                rows={rows}
                math={math}
                displayName={helpers.displayName(faction)}
                colorAlias={helpers.colorAlias(faction)}
              />
            ))}
          </div>
        )}

        {flavour && <p className={styles.flavour}>{flavour}</p>}
      </div>
    </Module>
  );
}

export function SystemDossier({ tile }: Props) {
  const gameData = useGameData();
  const helpers = useFactionHelpers();
  const tileData = getTileById(tile.systemId);
  const features = getSystemFeatures(tile, gameData?.tiles ?? {});

  /* The space rack shows everything in the area — transported ground forces
     included — but only ships roll in space combat, so only ships count. */
  const spaceFactions = Object.entries(tile.unitsByFaction ?? {})
    .map(([faction, entities]) => {
      const all = summarizeForce(entities, faction, helpers.playerFor(faction));
      const math = summarizeRows(all.rows.filter((row) => row.unit.isShip));
      return { faction, rows: all.rows, math };
    })
    .filter(({ rows }) => rows.length > 0);

  const pdsInRange = gameData?.pdsByTile?.[tile.position];

  /* Static planet order (as printed on the tile), then any live-only planets
     the server knows about that the static data doesn't. */
  const staticPlanets = getPlanetsByTileId(tile.systemId) ?? [];
  const orderedPlanetIds = [
    ...staticPlanets
      .map((p) => p.id)
      .filter((id) => tile.planets[id] !== undefined),
    ...Object.keys(tile.planets).filter(
      (id) => !staticPlanets.some((p) => p.id === id)
    ),
  ];

  const systemName = tileData?.name || `System ${tile.systemId}`;

  /*
   * A system with no anomaly, wormhole or token has nothing to say, so the
   * navigation plate is absent rather than stating that ordinary rules apply.
   */
  const navigationPlate = features.length > 0 && (
    <Module label="Navigation" className={styles.plate}>
      <div className={styles.features}>
        {features.map((feature) => (
          <div key={feature.id} className={styles.feature}>
            <div className={styles.featureHead}>
              {feature.glyph ? (
                <span className={styles.wormholeGlyph} aria-hidden>
                  {feature.glyph}
                </span>
              ) : feature.imagePath ? (
                <img
                  src={cdnImage(`/tokens/${feature.imagePath}`)}
                  alt=""
                  className={styles.featureIcon}
                />
              ) : null}
              <span className={styles.featureName}>{feature.name}</span>
              {feature.detail && (
                <span className={styles.featureDetail}>{feature.detail}</span>
              )}
            </div>
            {feature.rule && (
              <p className={styles.featureRule}>{feature.rule}</p>
            )}
          </div>
        ))}
      </div>
    </Module>
  );

  return (
    <div className={styles.dossier}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{systemName}</h2>
          <div className={styles.subtitle}>
            System {tile.systemId} · Position {tile.position}
          </div>
        </div>
        <div className={styles.headerControl}>
          <ControllerChip
            label="Space control"
            faction={tile.controlledBy}
            displayName={helpers.displayName}
          />
        </div>
      </header>

      <div className={styles.columns}>
        <div className={styles.terrain}>
          <div className={styles.tileWell}>
            <span className={styles.bracket} data-corner="tl" aria-hidden />
            <span className={styles.bracket} data-corner="tr" aria-hidden />
            <span className={styles.bracket} data-corner="bl" aria-hidden />
            <span className={styles.bracket} data-corner="br" aria-hidden />
            <div
              className={styles.tileScale}
              style={{
                width: TILE_WIDTH * TILE_SCALE,
                height: TILE_HEIGHT * TILE_SCALE,
              }}
            >
              <div style={{ transform: `scale(${TILE_SCALE})` }}>
                <MapTile mapTile={tile} embedded />
              </div>
            </div>
          </div>

        </div>

        <div className={styles.forces}>
          <Module
            label={
              <span className={styles.zoneLabel}>
                <IconRocket size={11} aria-hidden />
                Space Zone
              </span>
            }
            meta={
              tile.commandCounters.length > 0 ? (
                <span className={styles.ccMeta}>
                  Activated by
                  {tile.commandCounters.map((faction) => (
                    <FactionIcon key={faction} faction={faction} w={13} h={13} />
                  ))}
                </span>
              ) : undefined
            }
            className={styles.plate}
          >
            <div className={styles.zoneForces}>
              {spaceFactions.length === 0 ? (
                <div className={styles.emptySocket}>No ships in the system</div>
              ) : (
                spaceFactions.map(({ faction, rows, math }) => (
                  <ForceStrip
                    key={faction}
                    faction={faction}
                    rows={rows}
                    math={math}
                    displayName={helpers.displayName(faction)}
                    colorAlias={helpers.colorAlias(faction)}
                  />
                ))
              )}
              {pdsInRange && Object.keys(pdsInRange).length > 0 && (
                <div className={styles.structures}>
                  <span className={styles.structuresLabel}>
                    Space cannon coverage
                  </span>
                  {pdsInRange.map((pds) => (
                    <span
                      key={pds.faction}
                      className={styles.structure}
                      aria-label={`${helpers.displayName(pds.faction)}: ${pds.count} PDS, ${formatStat(pds.expected)} expected hits`}
                    >
                      <img
                        src={cdnImage(
                          `/units/${getColorAlias(pds.color)}_pd.png`
                        )}
                        alt=""
                        className={styles.structureUnit}
                      />
                      <span className={styles.structureCount}>
                        {pds.count}×
                      </span>
                      <span className={styles.structureName}>PDS</span>
                      <span
                        className={styles.structureExpected}
                        title="Expected space cannon hits"
                      >
                        <img
                          src={cdnImage("/player_area/pa_hit.png")}
                          alt=""
                        />
                        {formatStat(pds.expected)}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Module>

          {orderedPlanetIds.map((planetId) => (
            <PlanetPlate
              key={planetId}
              planetId={planetId}
              planetTile={tile.planets[planetId]}
              helpers={helpers}
            />
          ))}

          {navigationPlate}
        </div>
      </div>
    </div>
  );
}
