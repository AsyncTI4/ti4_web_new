import { Group, Box, Stack } from "@mantine/core";
import type { ReactNode } from "react";
import {
  getTechGridMobileColumnCount,
  TechGridMobile,
} from "@/domains/player/components/Tech/TechGridMobile";
import { PlayerData, type PlotCard } from "@/entities/data/types";
import { Leaders } from "@/domains/player/components/Leaders";
import { ArmyStats } from "@/domains/player/components";
import { Nombox } from "./Nombox";
import { useGameData } from "@/hooks/useGameContext";
import { PlayerCardAbilitiesFactionTechsMobile } from "@/domains/player/components/PlayerCardAbilitiesFactionTechs";
import { Panel } from "@/shared/ui/primitives/Panel";
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
import { PlayerCardPlanetsSection } from "@/domains/player/components/PlayerCardShared/PlayerCardPlanetsSection";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerCardShared/getPlayerCardLayoutFields";
import { ReinforcementTokensGroup } from "@/domains/player/components/ReinforcementTokensGroup";
import { PlayerCardBox } from "@/domains/player/components/PlayerCardBox";
import { PlayerCardHeaderMobile } from "@/domains/player/components/PlayerCardHeader/PlayerCardHeaderCompact";
import { ScoredSecret } from "@/domains/player/components/ScoredSecret";
import { UnscoredSecret } from "@/domains/player/components/ScoredSecret/UnscoredSecret";
import { Relic } from "@/domains/player/components/Relic";
import { PromissoryNote } from "@/domains/player/components/PromissoryNote";
import { getPlayerCardTechData } from "@/domains/player/components/PlayerCardShared/playerCardTechUtils";
import { useSettingsStore } from "@/utils/appStore";

type Props = {
  playerData: PlayerData;
};

function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Panel className={cx(styles.scadaPanel, styles.section, className)}>
      {children}
    </Panel>
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
};

const OBJECTIVE_COLUMN_WIDTH = 170;
const OBJECTIVE_GRID_GAP = 4;
const OBJECTIVES_PER_COLUMN = 6;

function getObjectiveColumnCount({
  secretsScored,
  knownUnscoredSecrets,
  soCount,
  promissoryNotes,
  relics,
}: Omit<ObjectivesGridProps, "exhaustedRelics" | "minColumns">): number {
  const knownUnscoredCount = Object.keys(knownUnscoredSecrets ?? {}).length;
  const secretCount =
    Object.keys(secretsScored).length +
    knownUnscoredCount +
    Math.max((soCount ?? 0) - knownUnscoredCount, 0);
  const otherCount = relics.length + promissoryNotes.length;
  const totalCount = secretCount + otherCount;

  if (totalCount <= OBJECTIVES_PER_COLUMN) return 1;

  return 1 + Math.ceil(otherCount / OBJECTIVES_PER_COLUMN);
}

function ObjectivesGrid({
  secretsScored,
  knownUnscoredSecrets,
  soCount,
  promissoryNotes,
  relics,
  exhaustedRelics,
  minColumns = 1,
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

  if (allItems.length <= OBJECTIVES_PER_COLUMN) {
    return (
      <Box className={styles.objectivesGrid} style={{ minWidth }}>
        {allItems}
      </Box>
    );
  }

  const otherColumns = [];
  for (let start = 0; start < otherItems.length; start += OBJECTIVES_PER_COLUMN) {
    otherColumns.push(otherItems.slice(start, start + OBJECTIVES_PER_COLUMN));
  }

  return (
    <Box className={styles.objectivesGridSplit} style={{ minWidth }}>
      <Box className={styles.objectivesColumn}>{secretItems}</Box>
      {otherColumns.map((columnItems, index) => (
        <Box className={styles.objectivesColumn} key={`other-column-${index}`}>
          {columnItems}
        </Box>
      ))}
    </Box>
  );
}

type PlanetsAreaProps = {
  planets: string[];
  exhaustedPlanetAbilities?: string[];
  exhaustedPlanets?: string[];
  plotCards?: PlotCard[] | null;
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
  plotCards,
  faction,
  breachTokensReinf,
  sleeperTokensReinf,
  ghostWormholesReinf,
  galvanizeTokensReinf,
  showReinforcements = true,
}: PlanetsAreaProps) {
  return (
    <Group gap={4} wrap="nowrap" align="flex-start">
      <Group gap={4} wrap="nowrap" align="flex-start">
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
      {Array.isArray(plotCards) && plotCards.length > 0 && (
        <Box className={styles.plotPanel}>
          <PlotCardsList
            plotCards={plotCards}
            faction={faction}
            keyPrefix="mobile-plot"
            compact
          />
        </Box>
      )}
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

  return (
    <PlayerCardBox
      color={player.color}
      faction={player.faction}
      showFactionBackground={false}
      subtleBorder
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
        <Section className={styles.statusSection}>
          <Stack gap={4} align="center" w="100%">
            <Group gap={4} align="flex-start" wrap="nowrap">
              <PlayerEconomyStack
                tg={player.tg}
                commodities={player.commodities}
                commoditiesTotal={player.commoditiesTotal}
                debtTokens={player.debtTokens}
              />
              <PlayerCardCounts
                pnCount={player.pnCount}
                acCount={player.acCount}
              />
            </Group>
            {settings.showPlayerAreaCommandTokens && (
              <Box className={styles.ccRow} pt="xs">
                <CCPool
                  tacticalCC={player.tacticalCC}
                  fleetCC={player.fleetCC}
                  strategicCC={player.strategicCC}
                  mahactEdict={mahactEdict}
                  layout="horizontal"
                />
              </Box>
            )}
            <FragmentsPool fragments={player.fragments} />
          </Stack>
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
          />
        </Section>

        <Section className={styles.techSection}>
          <TechGridMobile
            techs={filteredTechs}
            exhaustedTechs={props.playerData.exhaustedTechs}
            minColumns={techColumns}
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
            showTotalSpend={settings.showPlayerAreaTotalSpend}
          >
            <PlanetsArea
              planets={player.planets}
              exhaustedPlanetAbilities={player.exhaustedPlanetAbilities}
              exhaustedPlanets={player.exhaustedPlanets}
              plotCards={player.plotCards}
              faction={player.faction}
              breachTokensReinf={player.breachTokensReinf}
              sleeperTokensReinf={player.sleeperTokensReinf}
              ghostWormholesReinf={player.ghostWormholesReinf}
              galvanizeTokensReinf={player.galvanizeTokensReinf}
              showReinforcements={settings.showPlayerAreaReinforcements}
            />
          </PlayerCardPlanetsSection>
        </Section>

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
