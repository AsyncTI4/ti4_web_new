import { Group, Box } from "@mantine/core";
import type { ReactNode } from "react";
import {
  getTechGridMobileColumnCount,
  getTechGridMobileRowCount,
  TechGridMobile,
} from "@/domains/player/components/Tech/TechGridMobile";
import { PlayerData } from "@/entities/data/types";
import { Leaders } from "@/domains/player/components/Leaders";
import { ArmyStats } from "@/domains/player/components";
import { Nombox } from "./Nombox";
import { useGameData } from "@/hooks/useGameContext";
import { PlayerCardAbilitiesFactionTechsMobile } from "@/domains/player/components/PlayerCardAbilitiesFactionTechs";
import { Module } from "@/shared/ui/primitives/Module/Module";
import { PlayerCardPlanetsArea } from "@/domains/player/components/PlayerCardPlanetsArea";
import styles from "./PlayerCardMobile.module.css";
import cx from "clsx";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerCardUnitsArea";
import { PlotCardsList } from "@/domains/player/components/PlotCardsList";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerCardShared/usePlayerCardComputedData";
import { PlayerEconomyStack } from "@/domains/player/components/PlayerCardShared/PlayerEconomyStack";
import { PlayerCardCounts } from "@/domains/player/components/PlayerCardCounts";
import { CCPool } from "@/domains/player/components/CCPool";
import { FragmentsPool } from "@/domains/player/components/FragmentsPool";
import { DebtTokens } from "@/domains/player/components/DebtTokens";
import { PlayerCardPlanetsSection } from "@/domains/player/components/PlayerCardShared/PlayerCardPlanetsSection";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerCardShared/getPlayerCardLayoutFields";
import { ReinforcementTokensGroup } from "@/domains/player/components/ReinforcementTokensGroup";
import { PlayerCardBox } from "@/domains/player/components/PlayerCardBox";
import { PlayerCardHeaderMobile } from "@/domains/player/components/PlayerCardHeader/PlayerCardHeaderCompact";
import { ScoredSecret } from "@/domains/player/components/ScoredSecret";
import { UnscoredSecret } from "@/domains/player/components/ScoredSecret/UnscoredSecret";
import { Relic } from "@/domains/player/components/Relic";
import { PromissoryNote } from "@/domains/player/components/PromissoryNote";
import { PhantomSlot } from "@/domains/player/components/PhantomSlot/PhantomSlot";
import { chunkInto } from "@/domains/player/components/Tech/TechGridShared";
import { getPlayerCardTechData } from "@/domains/player/components/PlayerCardShared/playerCardTechUtils";
import { useSettingsStore } from "@/utils/appStore";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  playerData: PlayerData;
};

/**
 * One compartment of the telemetry band. Deliberately unlabelled: the contents
 * of each group are self-evident to a player who knows the game, and the band's
 * fixed left-to-right order means position already identifies the compartment.
 * Character comes from the plate itself — cut corner, bevel, reticle brackets.
 */
function Section({
  className,
  brackets,
  density = "compact",
  children,
}: {
  className?: string;
  brackets?: boolean;
  density?: "compact" | "flush";
  children: ReactNode;
}) {
  return (
    <Module
      brackets={brackets}
      density={density}
      fill
      className={cx(styles.section, className)}
    >
      {children}
    </Module>
  );
}

type ObjectivesGridProps = {
  secretsScored: Record<string, number>;
  knownUnscoredSecrets?: Record<string, number>;
  soCount?: number;
  promissoryNotes: string[];
  relics: string[];
  exhaustedRelics?: string[];
  minColumns?: number;
  /** Rack depth imposed from outside, so sibling racks share a row count. */
  minRows?: number;
};

type ObjectiveCounts = Omit<
  ObjectivesGridProps,
  "exhaustedRelics" | "minColumns" | "minRows"
>;

const OBJECTIVE_COLUMN_WIDTH = 170;
const OBJECTIVE_GRID_GAP = 4;
const OBJECTIVES_PER_COLUMN = 6;

/*
 * The shallowest a rack is ever drawn. Cards whose holdings and tech both fit in
 * three or four rows left the band looking thin next to their neighbours, so the
 * racks always show at least five seats. This governs empty seats only — packing,
 * ordering and column counts are untouched.
 */
const MIN_RACK_ROWS = 5;

/** Secrets go in their own column; relics and notes share the ones after it. */
function countObjectiveItems({
  secretsScored,
  knownUnscoredSecrets,
  soCount,
  promissoryNotes,
  relics,
}: ObjectiveCounts): { secretCount: number; otherCount: number } {
  const knownUnscoredCount = Object.keys(knownUnscoredSecrets ?? {}).length;

  return {
    secretCount:
      Object.keys(secretsScored).length +
      knownUnscoredCount +
      Math.max((soCount ?? 0) - knownUnscoredCount, 0),
    otherCount: relics.length + promissoryNotes.length,
  };
}

function getObjectiveColumnCount(counts: ObjectiveCounts): number {
  const { secretCount, otherCount } = countObjectiveItems(counts);

  if (secretCount + otherCount <= OBJECTIVES_PER_COLUMN) return 1;

  return 1 + Math.ceil(otherCount / OBJECTIVES_PER_COLUMN);
}

/**
 * How deep this player's holdings rack is — the fullest column. Read by the card
 * so the tech rack beside it can be padded to the same depth.
 */
function getObjectiveRowCount(counts: ObjectiveCounts): number {
  const { secretCount, otherCount } = countObjectiveItems(counts);
  const totalCount = secretCount + otherCount;

  if (totalCount <= OBJECTIVES_PER_COLUMN) return totalCount;

  const lastOtherColumn = otherCount % OBJECTIVES_PER_COLUMN;
  const fullOtherColumns = otherCount >= OBJECTIVES_PER_COLUMN;

  return Math.max(
    secretCount,
    fullOtherColumns ? OBJECTIVES_PER_COLUMN : lastOtherColumn
  );
}

function ObjectivesGrid({
  secretsScored,
  knownUnscoredSecrets,
  soCount,
  promissoryNotes,
  relics,
  exhaustedRelics,
  minColumns = 1,
  minRows = 0,
}: ObjectivesGridProps) {
  const knownUnscoredIds = Object.keys(knownUnscoredSecrets ?? {});
  const hiddenSecretCount = Math.max((soCount || 0) - knownUnscoredIds.length, 0);
  const secretItems = [
    ...Object.keys(secretsScored).map((secretId) => (
      <ScoredSecret
        key={`scored-${secretId}`}
        secretId={secretId}
        variant="scored"
      />
    )),
    ...knownUnscoredIds.map((secretId) => (
      <ScoredSecret
        key={`unscored-${secretId}`}
        secretId={secretId}
        variant="unscored"
      />
    )),
    ...Array.from({ length: hiddenSecretCount }, (_, index) => (
      <UnscoredSecret key={`placeholder-${index}`} />
    )),
  ];
  const otherItems = [
    ...relics.map((relicId, index) => (
      <Relic
        key={`relic-${relicId}-${index}`}
        relicId={relicId}
        isExhausted={exhaustedRelics?.includes(relicId) ?? false}
      />
    )),
    ...promissoryNotes.map((promissoryNoteId) => (
      <PromissoryNote
        key={`pn-${promissoryNoteId}`}
        promissoryNoteId={promissoryNoteId}
      />
    )),
  ];
  const allItems = [...secretItems, ...otherItems];
  const minWidth =
    minColumns * OBJECTIVE_COLUMN_WIDTH + (minColumns - 1) * OBJECTIVE_GRID_GAP;

  /*
   * The compartment is a rack: secrets in the first column, relics and notes in
   * the ones after it, capped at six per column. Splitting is unchanged — only
   * the leftover seats are now drawn, so a player holding two cards reads as two
   * cards in a rack rather than as a panel that failed to fill.
   *
   * The rack is as deep as its fullest column, or as deep as the tech rack
   * beside it (minRows) — the two share a floor so the compartments line up.
   * Nothing pads to a fixed six: that would add a row nobody's holdings need and
   * push the whole player plate taller than its content.
   *
   * Touch devices get no empty seats: they steady a wide desktop band, and on a
   * phone they would be elements paying for nothing.
   */
  const itemColumns =
    allItems.length <= OBJECTIVES_PER_COLUMN
      ? [allItems]
      : [secretItems, ...chunkInto(otherItems, OBJECTIVES_PER_COLUMN)];

  const columnCount = Math.max(minColumns, itemColumns.length);
  const rowCount = isMobileDevice()
    ? 0
    : itemColumns.reduce((max, column) => Math.max(max, column.length), minRows);

  return (
    <Box className={styles.objectivesGridSplit} style={{ minWidth }}>
      {Array.from({ length: columnCount }, (_, columnIndex) => {
        const columnItems = itemColumns[columnIndex] ?? [];
        return (
          <Box className={styles.objectivesColumn} key={`column-${columnIndex}`}>
            {columnItems}
            {Array.from({ length: rowCount - columnItems.length }, (_, index) => (
              <PhantomSlot key={`phantom-${columnIndex}-${index}`} />
            ))}
          </Box>
        );
      })}
    </Box>
  );
}

type PlanetsAreaProps = {
  planets: string[];
  exhaustedPlanetAbilities?: string[];
  exhaustedPlanets?: string[];
  faction: string;
  breachTokensReinf?: number;
  sleeperTokensReinf?: number;
  ghostWormholesReinf?: string[];
  galvanizeTokensReinf?: number;
  showReinforcements?: boolean;
};

function PlanetsArea({
  planets,
  exhaustedPlanetAbilities = [],
  exhaustedPlanets,
  breachTokensReinf,
  sleeperTokensReinf,
  ghostWormholesReinf,
  galvanizeTokensReinf,
  showReinforcements = true,
}: PlanetsAreaProps) {
  return (
    /*
     * Planet cards are a fixed size — the art and the two economy figures don't
     * survive being stretched — so when the compartment is taller than they are
     * they sit centred in it. The slack splits above and below instead of
     * pooling under the row.
     */
    <Group gap={4} wrap="nowrap" align="center" mih="100%">
      <Group gap={4} wrap="nowrap" align="center">
        <PlayerCardPlanetsArea
          planets={planets}
          exhaustedPlanetAbilities={exhaustedPlanetAbilities}
          exhaustedPlanets={exhaustedPlanets}
          wrap="nowrap"
        />
        {showReinforcements && (
          <ReinforcementTokensGroup
            breachTokensReinf={breachTokensReinf}
            sleeperTokensReinf={sleeperTokensReinf}
            ghostWormholesReinf={ghostWormholesReinf}
            galvanizeTokensReinf={galvanizeTokensReinf}
            ml="xs"
          />
        )}
      </Group>
    </Group>
  );
}

export default function PlayerCardMobile(props: Props) {
  const gameData = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const player = getPlayerCardLayoutFields(props.playerData);
  const rank = gameData?.armyRankings?.[player.faction];

  const {
    factionImageUrl: factionUrl,
    planetEconomics,
    filteredTechs,
    allNotResearchedFactionTechs,
    promissoryNotes,
    mahactEdict,
    armyStats,
  } = usePlayerCardComputedData(props.playerData);

  const hasCapturedUnits =
    player.nombox && Object.keys(player.nombox).length > 0;
  const players = (gameData?.playerData ?? []).filter((p) => p.faction);
  const objectiveColumns = Math.max(
    1,
    ...players.map((playerData) =>
      getObjectiveColumnCount({
        secretsScored: playerData.secretsScored ?? {},
        knownUnscoredSecrets: playerData.knownUnscoredSecrets,
        soCount: playerData.soCount,
        promissoryNotes: playerData.promissoryNotesInPlayArea ?? [],
        relics: playerData.relics ?? [],
      })
    )
  );
  const techColumns = Math.max(
    1,
    ...players.map((playerData) => {
      const { filteredTechs } = getPlayerCardTechData({
        techs: playerData.techs,
        notResearchedFactionTechs: playerData.notResearchedFactionTechs,
      });

      return getTechGridMobileColumnCount(filteredTechs);
    })
  );

  /*
   * The holdings rack and the tech rack sit side by side and are the same row
   * pitch, so they share one depth: whichever needs more rows sets it and the
   * other pads out with empty seats. Column counts stay game-wide (cards line up
   * horizontally); depth stays per-card, so a card is never taller than its own
   * fullest rack.
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
    getTechGridMobileRowCount(filteredTechs, techColumns)
  );

  return (
    <PlayerCardBox
      color={player.color}
      faction={player.faction}
      showFactionBackground={false}
      subtleBorder
      isActive={player.active}
    >
      <PlayerCardHeaderMobile
        userName={player.userName}
        faction={player.faction}
        factionDisplayName={player.factionDisplayName}
        color={player.color}
        factionImageUrl={factionUrl ?? ""}
        isSpeaker={player.isSpeaker}
        isTyrant={player.isTyrant}
        scs={player.scs}
        exhaustedSCs={player.exhaustedSCs}
        passed={player.passed}
        active={player.active}
        neighbors={player.neighbors}
        showNeighbors={settings.showPlayerAreaNeighborship}
        breakthrough={props.playerData.breakthrough}
        rightSection={
          <PlayerCardAbilitiesFactionTechsMobile
            abilities={player.abilities}
            notResearchedFactionTechs={allNotResearchedFactionTechs}
            customPromissoryNotes={player.customPromissoryNotes}
            breakthrough={props.playerData.breakthrough}
            showFactionAbilities={settings.showPlayerAreaFactionAbilities}
            showBreakthrough={false}
          />
        }
      />

      {/* Single horizontal band: sections in fixed order with capped rows,
          so the same data group lands at a similar position on every card */}
      <Box className={styles.strip}>
        <Section
          brackets
          density="flush"
          className={styles.statusSection}
        >
          <Box className={styles.logistics}>
            <Box className={styles.logisticsTop}>
              {/* Debt is not part of the stores stack here — it moved down to
                  the salvage shelf, which has width to spare and vertical room
                  the stores column does not. */}
              <PlayerEconomyStack
                tg={player.tg}
                commodities={player.commodities}
                commoditiesTotal={player.commoditiesTotal}
              />
              <Box className={styles.logisticsHand}>
                <PlayerCardCounts
                  pnCount={player.pnCount}
                  acCount={player.acCount}
                />
              </Box>
            </Box>
            {/* Salvage above, command readout docked to the plate's floor. */}
            <Box className={styles.logisticsFloor}>
              <Box className={styles.fragmentRow}>
                <FragmentsPool fragments={player.fragments} reserveSpace />
                {player.debtTokens && (
                  <DebtTokens debts={player.debtTokens} compact />
                )}
              </Box>
              {settings.showPlayerAreaCommandTokens && (
                <Box className={styles.ccRow}>
                  <CCPool
                    tacticalCC={player.tacticalCC}
                    fleetCC={player.fleetCC}
                    strategicCC={player.strategicCC}
                    mahactEdict={mahactEdict}
                    layout="horizontal"
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Section>

        <Section className={styles.leadersSection}>
          <Leaders leaders={player.leaders} faction={player.faction} />
        </Section>

        <Section>
          <ObjectivesGrid
            secretsScored={player.secretsScored}
            knownUnscoredSecrets={player.knownUnscoredSecrets}
            soCount={player.soCount}
            promissoryNotes={promissoryNotes}
            relics={player.relics}
            exhaustedRelics={player.exhaustedRelics}
            minColumns={objectiveColumns}
            minRows={rackRows}
          />
        </Section>

        <Section className={styles.techSection}>
          <TechGridMobile
            techs={filteredTechs}
            exhaustedTechs={props.playerData.exhaustedTechs}
            minColumns={techColumns}
            minRows={rackRows}
            breakthrough={props.playerData.breakthrough}
          />
        </Section>

        <Section>
          <PlayerCardUnitsArea
            playerData={props.playerData}
            color={player.color}
            faction={player.faction}
            showUnavailable
            condensed
            showUnitUpgrades={settings.showPlayerAreaUnitUpgrades}
          />
        </Section>

        <Section className={styles.planetsSection}>
          <PlayerCardPlanetsSection
            planetEconomics={planetEconomics}
            gap={4}
            economyGap={6}
            wrap="nowrap"
            align="stretch"
            showTotalSpend={settings.showPlayerAreaTotalSpend}
          >
            <PlanetsArea
              planets={player.planets}
              exhaustedPlanetAbilities={player.exhaustedPlanetAbilities}
              exhaustedPlanets={player.exhaustedPlanets}
              breachTokensReinf={player.breachTokensReinf}
              sleeperTokensReinf={player.sleeperTokensReinf}
              ghostWormholesReinf={player.ghostWormholesReinf}
              galvanizeTokensReinf={player.galvanizeTokensReinf}
              showReinforcements={settings.showPlayerAreaReinforcements}
            />
          </PlayerCardPlanetsSection>
        </Section>

        {/* Plots are their own mechanic, not a property of planets. They used to
            sit inside the planets row as a horizontal sibling of the planet
            cards, which stretched that compartment and left them wedged against
            the last planet with no seat of their own. */}
        {Array.isArray(player.plotCards) && player.plotCards.length > 0 && (
          <Section className={styles.plotsSection}>
            <PlotCardsList
              plotCards={player.plotCards}
              faction={player.faction}
              keyPrefix="mobile-plot"
              compact
            />
          </Section>
        )}

        {settings.showPlayerAreaArmyStrength && (
          <Section className={styles.armySection}>
            <ArmyStats stats={armyStats} rank={rank} />
          </Section>
        )}

        {hasCapturedUnits && (
          <Section>
            <Nombox capturedUnits={player.nombox} compact />
          </Section>
        )}
      </Box>
    </PlayerCardBox>
  );
}
