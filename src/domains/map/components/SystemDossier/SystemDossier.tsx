import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGameState } from "@/api/useGameState";
import { CloseButton, Image } from "@/ds";
import { IconSwords } from "@tabler/icons-react";
import cx from "clsx";
import { UnitDetailsCard } from "@/domains/cards/components/UnitDetailsCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import InfluenceIcon from "@/shared/ui/InfluenceIcon";
import { lookupUnit } from "@/entities/lookup/units";
import { MapTile } from "../MapTile";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTileById } from "@/entities/lookup/systems";
import { TILE_HEIGHT, TILE_WIDTH } from "@/entities/geometry/tilePositioning";
import { getPlanetData, getPlanetsByTileId } from "@/entities/lookup/planets";
import { getAttachmentModifiers } from "@/entities/game/planets";
import { useAppStore } from "@/state/appStore";
import { useGameData } from "@/state/useGameContext";
import type { GameData, Tile } from "@/entities/game/types";
import {
  buildSpaceBattleUrl,
  buildPickedSystemBattleUrl,
  buildSystemBattleUrl,
  factionsInSystem,
  findAttacker,
} from "./battleCalcLink";
import { getSystemFeatures, systemAnomalies } from "./featureRules";
import { capacityOf, summarizeZone } from "./fleetMath";
import {
  arrangeZone,
  Balance,
  CalcLink,
  ControlPill,
  FireRow,
  ForceRow,
} from "./ForceRow";
import { EconomicFigure, PlanetBand } from "./PlanetBand";
import { PickedAttackerNote, PickedBattleActions } from "./PickedBattle";
import { useFactionHelpers, type FactionHelpers } from "./useFactionHelpers";
import { UnitSheetContext, useUnitSheet, type SheetUnit } from "./unitSheet";
import styles from "./SystemDossier.module.css";

/** Fits the 345px tile into the art column's 222px well. */
const TILE_SCALE = 0.64;
const BRACKET_CORNERS = ["tl", "br"];

type SystemFeature = ReturnType<typeof getSystemFeatures>[number];
type PdsCoverage = GameData["pdsByTile"][string];
type SelectedUnit = { faction: string; unitId: string; x: number; y: number };

/**
 * Static planet order (as printed on the tile), then any live-only planets the
 * server knows about that the static data doesn't.
 */
function orderedPlanetIds(tile: Tile): string[] {
  const staticIds = (getPlanetsByTileId(tile.systemId) ?? []).map((p) => p.id);
  return [
    ...staticIds.filter((id) => tile.planets[id] !== undefined),
    ...Object.keys(tile.planets).filter((id) => !staticIds.includes(id)),
  ];
}

/** Strips the markdown-italic asterisks the planet data wraps lore in. */
function cleanFlavour(text: string): string {
  return text.replace(/^\*+/, "").replace(/\*+$/, "").trim();
}

function shipsFight(summary: { rows: { unit: { isShip?: boolean } }[] }) {
  return summary.rows.some((row) => row.unit.isShip);
}

/** Which zones hold two or more factions that can fight there. */
function contestedZones(tile: Tile, helpers: FactionHelpers): string[] {
  const space = summarizeZone(
    tile.unitsByFaction,
    helpers.playerFor,
    () => false,
  ).filter(shipsFight).length;
  const ground = Object.values(tile.planets).some(
    (planet) =>
      summarizeZone(
        planet.unitsByFaction,
        helpers.playerFor,
        () => false,
      ).filter((s) => s.rows.some((row) => row.unit.isGroundForce)).length > 1,
  );
  return [space > 1 ? "space" : null, ground ? "ground" : null].filter(
    (zone): zone is string => zone !== null,
  );
}

function FeatureIcon({ feature }: { feature: SystemFeature }) {
  if (feature.glyph) {
    return (
      <span className={styles.wormholeGlyph} aria-hidden>
        {feature.glyph}
      </span>
    );
  }
  if (!feature.imagePath) return null;
  return (
    <img
      src={cdnImage(`/tokens/${feature.imagePath}`)}
      alt=""
      className={styles.featureIcon}
    />
  );
}

/**
 * A system with no anomaly, wormhole or token has nothing to say, so the
 * navigation band is absent rather than stating that ordinary rules apply.
 */
function NavigationBand({ features }: { features: SystemFeature[] }) {
  if (features.length === 0) return null;
  return (
    <section className={styles.zone} data-z="nav">
      <header className={styles.zoneHead}>
        <span className={styles.alt}>Navigation</span>
        <span className={styles.lbl}>Rules in force</span>
      </header>
      {features.map((feature) => (
        <div key={feature.id} className={styles.feature}>
          <div className={styles.featureHead}>
            <FeatureIcon feature={feature} />
            <span className={styles.featureName}>{feature.name}</span>
            {feature.detail && (
              <span className={styles.featureDetail}>{feature.detail}</span>
            )}
          </div>
          {feature.rule && <p className={styles.featureRule}>{feature.rule}</p>}
        </div>
      ))}
    </section>
  );
}

function ActivatedBy({ factions }: { factions: string[] }) {
  if (factions.length === 0) return null;
  return (
    <span className={styles.activated}>
      Activated
      {factions.map((faction) => (
        <FactionIcon key={faction} faction={faction} w={13} h={13} />
      ))}
    </span>
  );
}

/**
 * The space area: only ships roll in space combat, so only ships count, but
 * the rack shows everything there, transported ground forces included.
 */
function SpaceBand({
  tile,
  pdsInRange,
  helpers,
  attacker,
}: {
  tile: Tile;
  pdsInRange: PdsCoverage | undefined;
  helpers: FactionHelpers;
  attacker: string | null;
}) {
  const summaries = summarizeZone(
    tile.unitsByFaction,
    helpers.playerFor,
    (unit) => unit.isShip,
  );
  const { ordered, sides, roleOf } = arrangeZone(
    summaries,
    shipsFight,
    attacker,
    tile.controlledBy,
    false,
  );
  const defender = sides?.defender.faction ?? ordered.find(shipsFight)?.faction;
  const calcUrl = defender
    ? buildSpaceBattleUrl(tile, defender, helpers.playerFor, attacker)
    : null;
  const empty = ordered.length === 0 && !pdsInRange?.length;

  return (
    <section className={styles.zone} data-z="space">
      <header className={styles.zoneHead}>
        <span className={styles.alt}>Orbit</span>
        <span className={styles.lbl}>
          {sides ? "Space combat" : "Space area"}
        </span>
        <ActivatedBy factions={tile.commandCounters} />
        <span className={styles.headEnd}>
          <Balance sides={sides} helpers={helpers} />
          <CalcLink
            url={calcUrl}
            title="Space combat here in the battle calculator"
          />
        </span>
      </header>
      {empty && <div className={styles.empty}>No ships in the system</div>}
      {ordered.map((summary) => (
        <ForceRow
          key={summary.faction}
          summary={summary}
          helpers={helpers}
          role={roleOf(summary.faction)}
          capacity={capacityOf(summary.rows)}
          actions={
            <PickedBattleActions
              tile={tile}
              planetId={null}
              faction={summary.faction}
              helpers={helpers}
            />
          }
        />
      ))}
      {pdsInRange?.map((entry) => (
        <FireRow key={entry.faction} entry={entry} helpers={helpers} />
      ))}
    </section>
  );
}

/**
 * Units on the embedded tile open the same stat card the board shows. One
 * popover serves the whole tile, anchored to a marker at the clicked stack;
 * where the dossier runs a unit sheet, the card goes there instead.
 */
function TileWell({ tile, helpers }: { tile: Tile; helpers: FactionHelpers }) {
  const [selectedUnit, setSelectedUnit] = useState<SelectedUnit | null>(null);
  const openUnitSheet = useUnitSheet();
  const player = selectedUnit
    ? helpers.playerFor(selectedUnit.faction)
    : undefined;
  const unitId = selectedUnit
    ? (lookupUnit(selectedUnit.unitId, selectedUnit.faction, player)?.id ??
      selectedUnit.unitId)
    : undefined;

  const handleUnitClick = (
    faction: string,
    unitId: string,
    x: number,
    y: number,
  ) => {
    if (!openUnitSheet) return setSelectedUnit({ faction, unitId, x, y });
    const owner = helpers.playerFor(faction);
    openUnitSheet({
      unitId: lookupUnit(unitId, faction, owner)?.id ?? unitId,
      color: owner?.color,
    });
  };

  return (
    <div className={styles.tileWell}>
      {BRACKET_CORNERS.map((corner) => (
        <span
          key={corner}
          className={styles.bracket}
          data-corner={corner}
          aria-hidden
        />
      ))}
      <div
        className={styles.tileScale}
        style={{
          width: TILE_WIDTH * TILE_SCALE,
          height: TILE_HEIGHT * TILE_SCALE,
        }}
      >
        <div style={{ transform: `scale(${TILE_SCALE})` }}>
          <MapTile mapTile={tile} embedded onUnitClick={handleUnitClick} />
          <SmoothPopover
            opened={!!selectedUnit}
            onChange={(opened) => !opened && setSelectedUnit(null)}
            offset={22}
          >
            <SmoothPopover.Target>
              <span
                className={styles.unitAnchor}
                style={{
                  left: selectedUnit?.x ?? 0,
                  top: selectedUnit?.y ?? 0,
                }}
                aria-hidden
              />
            </SmoothPopover.Target>
            <SmoothPopover.Dropdown className={styles.unitPopover}>
              {unitId && (
                <UnitDetailsCard unitId={unitId} color={player?.color} />
              )}
            </SmoothPopover.Dropdown>
          </SmoothPopover>
        </div>
      </div>
    </div>
  );
}

/** The static read of the system: economics summed, anomaly and wormholes named. */
function SystemFacts({
  tile,
  features,
}: {
  tile: Tile;
  features: SystemFeature[];
}) {
  const totals = Object.entries(tile.planets).reduce(
    (sum, [planetId, planetTile]) => {
      const planet = getPlanetData(planetId);
      const bonus = getAttachmentModifiers(planetTile.attachments ?? []);
      return {
        resources: sum.resources + (planet?.resources ?? 0),
        influence: sum.influence + (planet?.influence ?? 0),
        resourceBonus: sum.resourceBonus + bonus.resources,
        influenceBonus: sum.influenceBonus + bonus.influence,
      };
    },
    { resources: 0, influence: 0, resourceBonus: 0, influenceBonus: 0 },
  );
  const anomalyIds = new Set<string>(systemAnomalies(tile));
  const anomalies = features
    .filter((feature) => anomalyIds.has(feature.id))
    .map((feature) => feature.name);
  const wormholes = features
    .filter((feature) => feature.id.startsWith("wormhole-"))
    .map((feature) => feature.glyph ?? feature.name);

  return (
    <dl className={styles.facts}>
      <div>
        <dt>Resources</dt>
        <dd>
          <EconomicFigure
            icon={<Image src="/pa_resources.png" w={14} h={14} />}
            value={totals.resources}
            bonus={totals.resourceBonus}
          />
        </dd>
      </div>
      <div>
        <dt>Influence</dt>
        <dd>
          <EconomicFigure
            icon={<InfluenceIcon size={14} />}
            value={totals.influence}
            bonus={totals.influenceBonus}
          />
        </dd>
      </div>
      <div>
        <dt>Anomaly</dt>
        <dd
          className={cx(anomalies.length === 0 && styles.nil, styles.textFact)}
        >
          {anomalies.length > 0 ? anomalies.join(", ") : "none"}
        </dd>
      </div>
      <div>
        <dt>Wormhole</dt>
        <dd className={cx(wormholes.length === 0 && styles.nil)}>
          {wormholes.length > 0 ? wormholes.join(" ") : "none"}
        </dd>
      </div>
    </dl>
  );
}

function Flavour({ planetIds }: { planetIds: string[] }) {
  const entries = planetIds
    .map((id) => getPlanetData(id))
    .filter((planet) => !!planet?.flavourText)
    .map((planet) => ({
      name: planet!.name,
      text: cleanFlavour(planet!.flavourText!),
    }));
  if (entries.length === 0) return null;
  const named = entries.length > 1;
  return (
    <div className={styles.flavour}>
      {entries.map((entry) => (
        <p key={entry.name}>
          {named && <b>{entry.name}</b>}
          {entry.text}
        </p>
      ))}
    </div>
  );
}

/**
 * One link per defending faction, carrying its ships and ground forces
 * together so both battles can be run from a single calculator tab. In a
 * contested system the attacker rides along on each, so it gets no link of
 * its own unless it is the only one there. A picked attacker, gathered from
 * any zones and systems, takes the place of the system's own attacker.
 */
function SystemBattleLinks({
  tile,
  helpers,
  attacker: systemAttacker,
}: {
  tile: Tile;
  helpers: FactionHelpers;
  attacker: string | null;
}) {
  const gameData = useGameData();
  const picks = useAppStore((state) => state.battleAttackers);
  const picked = picks[0]?.faction;
  const attacker = picked ?? systemAttacker;
  const present = factionsInSystem(tile);
  const defenders = present.filter((faction) => faction !== attacker);

  return (defenders.length > 0 ? defenders : present).map((faction, index) => {
    const url =
      picked && picked !== faction
        ? buildPickedSystemBattleUrl(
            (position) => gameData?.tiles?.[position],
            picks,
            tile,
            faction,
            helpers.playerFor,
          )
        : buildSystemBattleUrl(tile, faction, helpers.playerFor, attacker);
    if (!url) return null;
    const versus = attacker && attacker !== faction;
    return (
      <a
        key={faction}
        className={cx(styles.btn, index === 0 && styles.btnPrimary)}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={
          versus
            ? `Open ti4battle.com with ${helpers.displayName(attacker)} attacking ${helpers.displayName(faction)}, ships and ground forces`
            : `Open ti4battle.com with all of ${helpers.displayName(faction)}'s ships and ground forces here set as the defender`
        }
      >
        <IconSwords size={13} aria-hidden />
        Battle calc
        {versus && <FactionIcon faction={attacker} w={14} h={14} />}
        {versus && <span className={styles.versus}>vs</span>}
        <FactionIcon faction={faction} w={14} h={14} />
      </a>
    );
  });
}

/** The stat card's own width; the sheet scales it down to fit under this. */
const UNIT_CARD_WIDTH = 380;

/**
 * A unit's stat card laid over the dossier, centred on the visible screen.
 * A tap anywhere dismisses it.
 */
function UnitSheet({
  unit,
  maxWidth,
  onClose,
}: {
  unit: SheetUnit;
  maxWidth: number;
  onClose: () => void;
}) {
  return (
    <div className={styles.unitSheet} onClick={onClose}>
      <div style={{ zoom: Math.min(1, maxWidth / UNIT_CARD_WIDTH) }}>
        <UnitDetailsCard unitId={unit.unitId} color={unit.color} />
      </div>
    </div>
  );
}

/**
 * The system dossier as a sector scan: the tile and its static facts on the
 * left, and on the right the zones read top-down the way combat resolves —
 * space cannon and orbit, then each planet — on shared numeric columns.
 */
export function SystemDossier({
  tile,
  onClose,
  unitSheetWidth,
}: {
  tile: Tile;
  onClose?: () => void;
  /**
   * Shows unit stat cards as a sheet over the dossier, at most this wide,
   * instead of as popovers. The host must be a transformed box filling the
   * visible screen, since the sheet is fixed to it.
   */
  unitSheetWidth?: number;
}) {
  const gameData = useGameData();
  const helpers = useFactionHelpers();
  const { mapid } = useParams<{ mapid: string }>();
  const { data: gameState } = useGameState(mapid ?? "");
  const attacker = findAttacker(tile, gameState, gameData?.playerData ?? []);
  const [sheetUnit, setSheetUnit] = useState<SheetUnit | null>(null);
  const systemName =
    getTileById(tile.systemId)?.name || `System ${tile.systemId}`;
  const planetIds = orderedPlanetIds(tile);
  const pdsInRange = gameData?.pdsByTile?.[tile.position];
  const pdsCount = (pdsInRange ?? []).reduce((n, pds) => n + pds.count, 0);
  const features = getSystemFeatures(tile, gameData?.tiles ?? {});
  const contested = contestedZones(tile, helpers);
  const subline = [
    `System ${tile.systemId}`,
    `position ${tile.position}`,
    planetIds.length > 0
      ? `${planetIds.length} planet${planetIds.length === 1 ? "" : "s"}`
      : null,
    pdsCount > 0 ? `${pdsCount} PDS in range` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <UnitSheetContext value={unitSheetWidth ? setSheetUnit : null}>
      {/* Outside the dossier box: its container query makes it the containing
          block for fixed descendants, which would pin the sheet to the
          scrolled content rather than the screen. */}
      {sheetUnit && unitSheetWidth && (
        <UnitSheet
          unit={sheetUnit}
          maxWidth={unitSheetWidth}
          onClose={() => setSheetUnit(null)}
        />
      )}
      <div className={styles.dossier}>
        <header className={styles.head}>
          <span className={styles.hexno}>{tile.position}</span>
          <span className={styles.titleBlock}>
            <h2 className={styles.title}>{systemName}</h2>
            <small className={styles.subtitle}>{subline}</small>
          </span>
          <span className={styles.status}>
            {contested.length > 0 && (
              <span className={cx(styles.pill, styles.contest)}>
                <IconSwords size={13} aria-hidden />
                Contested · {contested.join(" + ")}
              </span>
            )}
            <ControlPill
              faction={tile.controlledBy}
              displayName={helpers.displayName}
            />
          </span>
          {onClose && (
            <CloseButton
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close system view"
            />
          )}
        </header>

        <div className={styles.body}>
          <aside className={styles.art}>
            <TileWell tile={tile} helpers={helpers} />
            <SystemFacts tile={tile} features={features} />
            <Flavour planetIds={planetIds} />
          </aside>

          <div className={styles.zones}>
            <div className={styles.cols} aria-hidden>
              <span />
              <span className={styles.lbl}>Forces</span>
              <span className={styles.lbl}>Hits</span>
              <span className={styles.lbl}>HP</span>
              <span className={styles.lbl}>Cap</span>
            </div>
            <SpaceBand
              tile={tile}
              pdsInRange={pdsInRange}
              helpers={helpers}
              attacker={attacker}
            />
            {planetIds.map((planetId) => (
              <PlanetBand
                key={planetId}
                planetId={planetId}
                planetTile={tile.planets[planetId]}
                tile={tile}
                helpers={helpers}
                attacker={attacker}
              />
            ))}
            <NavigationBand features={features} />
          </div>
        </div>

        <footer className={styles.foot}>
          <span className={styles.note}>
            Expected hits per combat round. Space cannon resolves before the
            first round.
          </span>
          <PickedAttackerNote helpers={helpers} />
          <SystemBattleLinks
            tile={tile}
            helpers={helpers}
            attacker={attacker}
          />
        </footer>
      </div>
    </UnitSheetContext>
  );
}
