import { memo, type CSSProperties, type ReactNode } from "react";
import cx from "clsx";
import type { PlayerData } from "@/entities/data/types";
import { resolvePrimaryRgb } from "@/entities/lookup/colors";
import { cdnImage } from "@/entities/data/cdnImage";
import { useGameData } from "@/state/useGameContext";
import { useSettingsStore } from "@/state/appStore";
import { PlayerColor } from "@/shared/ui/PlayerColor/PlayerColor";
import { Leaders } from "@/domains/player/components/Leaders";
import { ArmyStats } from "@/domains/player/components/ArmyStats";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerCardUnitsArea";
import { PlotCardsList } from "@/domains/player/components/PlotCardsList";
import { PlayerCardPlanetsArea } from "@/domains/player/components/PlayerCardPlanetsArea";
import { ReinforcementTokensGroup } from "@/domains/player/components/ReinforcementTokensGroup";
import { ResourceInfluenceCompact } from "@/domains/player/components/ResourceInfluenceTable";
import { Nombox } from "@/domains/player/components/composition/Nombox";
import { StrategyCard } from "@/domains/player/components/StrategyCard";
import { NeedsToFollow } from "@/domains/player/components/NeedsToFollow";
import { Neighbors } from "@/domains/player/components/Neighbors";
import { Breakthrough } from "@/domains/player/components/Breakthrough/Breakthrough";
import { PromissoryNote } from "@/domains/player/components/PromissoryNote";
import { Ability } from "@/domains/player/components/Ability";
import { Tech } from "@/domains/player/components/Tech";
import { LogisticsPlate } from "@/domains/player/components/PlayerCardShared/LogisticsPlate";
import {
  MIN_RACK_ROWS,
  ObjectivesRack,
  getObjectiveRowCount,
} from "@/domains/player/components/PlayerCardShared/ObjectivesRack";
import {
  TechGridMobile,
  getTechGridMobileRowCount,
} from "@/domains/player/components/Tech/TechGridMobile";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerCardShared/usePlayerCardComputedData";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerCardShared/getPlayerCardLayoutFields";
import { getBreakthroughSynergy } from "@/domains/player/components/Tech/TechGridShared";
import type { LaneKey } from "./deckLanes";
import styles from "./PlayerDeck.module.css";

type Props = {
  player: PlayerData;
  /** Game-wide holdings rack columns, so every seat shows the same seats. */
  objectiveColumns: number;
  /** Game-wide tech rack columns. */
  techColumns: number;
  vpsToWin: number;
};

function Lane({
  lane,
  className,
  children,
}: {
  lane: LaneKey;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx(styles.lc, className)} data-lane={lane}>
      {children}
    </div>
  );
}

/** A rail group pinned over its lane; an empty group draws a single hairline. */
function RailCell({
  className,
  children,
}: {
  className: string;
  children?: ReactNode;
}) {
  const empty = children === null || children === undefined || children === false;
  return (
    <div className={cx(styles.rc, className, empty && styles.isEmpty)}>
      {children}
    </div>
  );
}

function getVictoryReadout(vp: number, vpsToWin: number) {
  if (vp >= vpsToWin) return "Victory";
  return `${vpsToWin - vp} to win`;
}

/**
 * The faction spine doubles as a victory gauge: it fills from the foot in the
 * seat's colour to its share of the points needed, with a notch per point on
 * the track, so the race reads down the whole table at a glance.
 */
function Seat({
  player,
  factionImageUrl,
  vpsToWin,
}: {
  player: ReturnType<typeof getPlayerCardLayoutFields>;
  factionImageUrl?: string;
  vpsToWin: number;
}) {
  const vp = player.totalVps ?? 0;
  const track = Math.max(vpsToWin, 1);
  const fill = Math.min(vp / track, 1);
  const won = vp >= track;
  const style = {
    "--fill": fill,
    "--track": track,
    ...(factionImageUrl ? { "--sigil": `url("${factionImageUrl}")` } : {}),
  } as CSSProperties;

  return (
    <div className={styles.seat} style={style} data-won={won || undefined}>
      <span className={styles.gauge} aria-hidden="true">
        <span className={styles.gaugeFill} />
      </span>
      {factionImageUrl && (
        <img className={styles.sig} src={factionImageUrl} alt={player.faction} />
      )}
      <span className={styles.vp} title={`${vp} of ${track} victory points`}>
        <b>{vp}</b>
        <small>{getVictoryReadout(vp, track)}</small>
      </span>
      <span />
      <span className={styles.stamps}>
        {player.isTyrant && <span className={styles.tyrant}>Tyrant</span>}
        {player.isSpeaker && (
          <img
            className={styles.speaker}
            src={cdnImage("/tokens/token_speaker.png")}
            alt="Speaker"
            title="Speaker"
          />
        )}
      </span>
    </div>
  );
}

function StatusMark({ passed, active }: { passed: boolean; active: boolean }) {
  if (active) return <span className={styles.activeDot} title="Active" />;
  if (passed) return <span className={styles.passed}>Passed</span>;
  return null;
}

/**
 * One seat of the player deck: a subgrid row of the deck's shared lanes, so
 * every lane sits at the same x for every player. The faction spine is pinned
 * left; the header rail sits on the grid above the lanes it describes.
 */
export const PlayerDeckRow = memo(function PlayerDeckRow({
  player: playerData,
  objectiveColumns,
  techColumns,
  vpsToWin,
}: Props) {
  const gameData = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const player = getPlayerCardLayoutFields(playerData);
  const rank = gameData?.armyRankings?.[player.faction];
  const {
    factionImageUrl,
    planetEconomics,
    filteredTechs,
    allNotResearchedFactionTechs,
    promissoryNotes,
    mahactEdict,
    armyStats,
  } = usePlayerCardComputedData(playerData);

  const rgb = resolvePrimaryRgb(player.color);
  const style = {
    "--pc": rgb ? `${rgb.red}, ${rgb.green}, ${rgb.blue}` : "var(--gd-gray)",
  } as CSSProperties;

  const { synergy, breakthroughUnlocked } = getBreakthroughSynergy(
    playerData.breakthrough,
  );
  /*
   * The holdings and tech racks share one depth per seat: whichever needs more
   * rows sets it and the other pads with sockets. Column counts are game-wide,
   * so racks grow sideways and line up across seats instead of growing tall.
   */
  const rackRows = Math.max(
    MIN_RACK_ROWS,
    getObjectiveRowCount({
      secretsScored: player.secretsScored,
      knownUnscoredSecrets: player.knownUnscoredSecrets,
      soCount: player.soCount,
      promissoryNotes,
      relics: player.relics,
    }),
    getTechGridMobileRowCount(filteredTechs, techColumns),
  );
  const showLoadout = settings.showPlayerAreaFactionAbilities;
  const breakthroughId = playerData.breakthrough?.breakthroughId;
  const customNotes = showLoadout ? (player.customPromissoryNotes ?? []) : [];
  const abilities = showLoadout ? (player.abilities ?? []) : [];
  const factionTechs = showLoadout ? allNotResearchedFactionTechs : [];
  const hasCapturedUnits = player.nombox && Object.keys(player.nombox).length > 0;
  const hasPlots = Array.isArray(player.plotCards) && player.plotCards.length > 0;

  return (
    <div
      className={styles.player}
      style={style}
      data-seat={player.color}
      data-active={player.active || undefined}
    >
      <Seat player={player} factionImageUrl={factionImageUrl} vpsToWin={vpsToWin} />

      <RailCell className={styles.rcId}>
        <span className={styles.idName}>{player.userName}</span>
        <span className={styles.idMeta}>
          <span className={styles.fac}>{player.factionDisplayName}</span>
          <PlayerColor color={player.color} size="xs" />
        </span>
        <StatusMark passed={player.passed} active={player.active} />
        <span className={styles.idEnd}>
          {player.scs.map((scNumber) => (
            <StrategyCard
              key={scNumber}
              initiative={scNumber}
              isExhausted={(player.exhaustedSCs ?? []).includes(scNumber)}
              size="sm"
            />
          ))}
        </span>
      </RailCell>

      <RailCell className={styles.rcBrk}>
        {breakthroughId ? (
          <Breakthrough
            breakthroughId={breakthroughId}
            exhausted={playerData.breakthrough?.exhausted}
            tradeGoodsStored={playerData.breakthrough?.tradeGoodsStored}
            unlocked={playerData.breakthrough?.unlocked ?? false}
          />
        ) : null}
      </RailCell>

      <RailCell className={styles.rcFol}>
        {player.unfollowedSCs.length > 0 ? (
          <NeedsToFollow values={player.unfollowedSCs} />
        ) : null}
      </RailCell>

      <RailCell className={styles.rcNbr}>
        {settings.showPlayerAreaNeighborship && player.neighbors.length > 0 ? (
          <Neighbors neighbors={player.neighbors} />
        ) : null}
      </RailCell>

      <RailCell className={styles.rcPn}>
        {customNotes.length > 0
          ? customNotes.map((pnId) => (
              <PromissoryNote key={pnId} promissoryNoteId={pnId} />
            ))
          : null}
      </RailCell>

      <RailCell className={styles.rcAbl}>
        {abilities.length + factionTechs.length > 0 ? (
          <>
            {abilities.map((abilityId) => (
              <Ability key={abilityId} id={abilityId} />
            ))}
            {factionTechs.map((techId) => (
              <Tech
                key={techId}
                techId={techId}
                synergy={synergy}
                breakthroughUnlocked={breakthroughUnlocked}
                unresearched={(player.notResearchedFactionTechs ?? []).includes(techId)}
              />
            ))}
          </>
        ) : null}
      </RailCell>

      <Lane lane="stores" className={styles.lcStores}>
        <LogisticsPlate
          tg={player.tg}
          commodities={player.commodities}
          commoditiesTotal={player.commoditiesTotal}
          pnCount={player.pnCount}
          acCount={player.acCount}
          fragments={player.fragments}
          debtTokens={player.debtTokens}
          tacticalCC={player.tacticalCC}
          fleetCC={player.fleetCC}
          strategicCC={player.strategicCC}
          mahactEdict={mahactEdict}
          showCommandTokens={settings.showPlayerAreaCommandTokens}
        />
      </Lane>

      <Lane lane="leaders" className={styles.lcLeaders}>
        <Leaders leaders={player.leaders} faction={player.faction} />
      </Lane>

      <Lane lane="holdings" className={styles.lcHold}>
        <ObjectivesRack
          secretsScored={player.secretsScored}
          knownUnscoredSecrets={player.knownUnscoredSecrets}
          soCount={player.soCount}
          promissoryNotes={promissoryNotes}
          relics={player.relics}
          exhaustedRelics={player.exhaustedRelics}
          minColumns={objectiveColumns}
          minRows={rackRows}
        />
      </Lane>

      <Lane lane="tech" className={styles.lcTech}>
        <TechGridMobile
          techs={filteredTechs}
          exhaustedTechs={playerData.exhaustedTechs}
          minColumns={techColumns}
          minRows={rackRows}
          breakthrough={playerData.breakthrough}
        />
      </Lane>

      <Lane lane="units" className={styles.lcUnits}>
        <PlayerCardUnitsArea
          playerData={playerData}
          color={player.color}
          faction={player.faction}
          showUnavailable
          condensed
          showUnitUpgrades={settings.showPlayerAreaUnitUpgrades}
        />
      </Lane>

      <Lane lane="economy" className={styles.lcEcon}>
        <ResourceInfluenceCompact
          planetEconomics={planetEconomics}
          showTotalSpend={settings.showPlayerAreaTotalSpend}
        />
      </Lane>

      <Lane lane="planets" className={styles.lcPlanets}>
        <PlayerCardPlanetsArea
          planets={player.planets}
          exhaustedPlanetAbilities={player.exhaustedPlanetAbilities}
          exhaustedPlanets={player.exhaustedPlanets}
          wrap="nowrap"
        />
        {settings.showPlayerAreaReinforcements && (
          <ReinforcementTokensGroup
            breachTokensReinf={player.breachTokensReinf}
            sleeperTokensReinf={player.sleeperTokensReinf}
            ghostWormholesReinf={player.ghostWormholesReinf}
            galvanizeTokensReinf={player.galvanizeTokensReinf}
          />
        )}
        {hasPlots && (
          <div className={styles.extra}>
            <PlotCardsList
              plotCards={player.plotCards ?? []}
              faction={player.faction}
              keyPrefix="deck-plot"
              compact
            />
          </div>
        )}
        {settings.showPlayerAreaArmyStrength && (
          <div className={styles.extra}>
            <ArmyStats stats={armyStats} rank={rank} />
          </div>
        )}
        {hasCapturedUnits && (
          <div className={styles.extra}>
            <Nombox capturedUnits={player.nombox} />
          </div>
        )}
      </Lane>
    </div>
  );
});
