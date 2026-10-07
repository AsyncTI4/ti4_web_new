import { IconRocket } from "@tabler/icons-react";
import { Module } from "@/shared/ui/primitives/Module/Module";
import { MapTile } from "../MapTile";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTileById } from "@/domains/map/model/mapgen/systems";
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/domains/map/model/mapgen/tilePositioning";
import { getPlanetsByTileId } from "@/entities/lookup/planets";
import { getColorAlias } from "@/entities/lookup/colors";
import { useGameData } from "@/hooks/useGameContext";
import type { GameData, Tile } from "@/app/providers/context/types";
import { getSystemFeatures } from "./featureRules";
import { summarizeZone, formatStat } from "./fleetMath";
import { ControllerChip, ForceStrip } from "./ForceStrip";
import { PlanetPlate } from "./PlanetPlate";
import { useFactionHelpers, type FactionHelpers } from "./useFactionHelpers";
import styles from "./SystemDossier.module.css";

const TILE_SCALE = 0.78;
const BRACKET_CORNERS = ["tl", "tr", "bl", "br"];

type SystemFeature = ReturnType<typeof getSystemFeatures>[number];
type PdsCoverage = GameData["pdsByTile"][string];

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
 * navigation plate is absent rather than stating that ordinary rules apply.
 */
function NavigationPlate({ features }: { features: SystemFeature[] }) {
  if (features.length === 0) return null;
  return (
    <Module label="Navigation" className={styles.plate}>
      <div className={styles.features}>
        {features.map((feature) => (
          <div key={feature.id} className={styles.feature}>
            <div className={styles.featureHead}>
              <FeatureIcon feature={feature} />
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
}

function SpaceCannonCoverage({
  pdsInRange,
  helpers,
}: {
  pdsInRange: PdsCoverage | undefined;
  helpers: FactionHelpers;
}) {
  if (!pdsInRange?.length) return null;
  return (
    <div className={styles.structures}>
      <span className={styles.structuresLabel}>Space cannon coverage</span>
      {pdsInRange.map((pds) => (
        <span
          key={pds.faction}
          className={styles.structure}
          aria-label={`${helpers.displayName(pds.faction)}: ${pds.count} PDS, ${formatStat(pds.expected)} expected hits`}
        >
          <img
            src={cdnImage(`/units/${getColorAlias(pds.color)}_pd.png`)}
            alt=""
            className={styles.structureUnit}
          />
          <span className={styles.structureCount}>{pds.count}×</span>
          <span className={styles.structureName}>PDS</span>
          <span
            className={styles.structureExpected}
            title="Expected space cannon hits"
          >
            <img src={cdnImage("/player_area/pa_hit.png")} alt="" />
            {formatStat(pds.expected)}
          </span>
        </span>
      ))}
    </div>
  );
}

function ActivatedBy({ factions }: { factions: string[] }) {
  return (
    <span className={styles.ccMeta}>
      Activated by
      {factions.map((faction) => (
        <FactionIcon key={faction} faction={faction} w={13} h={13} />
      ))}
    </span>
  );
}

/**
 * The space rack shows everything in the area, transported ground forces
 * included, but only ships roll in space combat, so only ships count.
 */
function SpaceZone({
  tile,
  pdsInRange,
  helpers,
}: {
  tile: Tile;
  pdsInRange: PdsCoverage | undefined;
  helpers: FactionHelpers;
}) {
  const spaceSummaries = summarizeZone(
    tile.unitsByFaction,
    helpers.playerFor,
    (unit) => unit.isShip,
  );

  return (
    <Module
      label={
        <span className={styles.zoneLabel}>
          <IconRocket size={11} aria-hidden />
          Space Zone
        </span>
      }
      meta={
        tile.commandCounters.length > 0 ? (
          <ActivatedBy factions={tile.commandCounters} />
        ) : undefined
      }
      className={styles.plate}
    >
      <div className={styles.zoneForces}>
        {spaceSummaries.length === 0 && (
          <div className={styles.emptySocket}>No ships in the system</div>
        )}
        {spaceSummaries.map((summary) => (
          <ForceStrip
            key={summary.faction}
            summary={summary}
            helpers={helpers}
          />
        ))}
        <SpaceCannonCoverage pdsInRange={pdsInRange} helpers={helpers} />
      </div>
    </Module>
  );
}

function TileWell({ tile }: { tile: Tile }) {
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
          <MapTile mapTile={tile} embedded />
        </div>
      </div>
    </div>
  );
}

export function SystemDossier({ tile }: { tile: Tile }) {
  const gameData = useGameData();
  const helpers = useFactionHelpers();
  const systemName =
    getTileById(tile.systemId)?.name || `System ${tile.systemId}`;

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
          <TileWell tile={tile} />
        </div>

        <div className={styles.forces}>
          <SpaceZone
            tile={tile}
            pdsInRange={gameData?.pdsByTile?.[tile.position]}
            helpers={helpers}
          />
          {orderedPlanetIds(tile).map((planetId) => (
            <PlanetPlate
              key={planetId}
              planetId={planetId}
              planetTile={tile.planets[planetId]}
              helpers={helpers}
            />
          ))}
          <NavigationPlate
            features={getSystemFeatures(tile, gameData?.tiles ?? {})}
          />
        </div>
      </div>
    </div>
  );
}
