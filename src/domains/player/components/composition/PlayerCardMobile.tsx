import { Group, Box } from "@mantine/core";
import type { ComponentProps } from "react";
import {
  getTechGridMobileColumnCount,
  getTechGridMobileRowCount,
  TechGridMobile,
} from "@/domains/player/components/Tech/TechGridMobile";
import { PlayerData } from "@/entities/data/types";
import { Leaders } from "@/domains/player/components/Leaders";
import { ArmyStats } from "@/domains/player/components/ArmyStats";
import { Nombox } from "./Nombox";
import { useGameData } from "@/hooks/useGameContext";
import { PlayerCardAbilitiesFactionTechsMobile } from "@/domains/player/components/PlayerCardAbilitiesFactionTechs";
import { PlayerCardPlanetsArea } from "@/domains/player/components/PlayerCardPlanetsArea";
import styles from "./PlayerCardMobile.module.css";
import cx from "clsx";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerCardUnitsArea";
import { PlotCardsList } from "@/domains/player/components/PlotCardsList";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerCardShared/usePlayerCardComputedData";
import { PlayerCardPlanetsSection } from "@/domains/player/components/PlayerCardShared/PlayerCardPlanetsSection";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerCardShared/getPlayerCardLayoutFields";
import { Compartment } from "@/domains/player/components/PlayerCardShared/Compartment";
import { LogisticsPlate } from "@/domains/player/components/PlayerCardShared/LogisticsPlate";
import {
  MIN_RACK_ROWS,
  ObjectivesRack,
  getGameObjectiveColumnCount,
  getObjectiveRowCount,
} from "@/domains/player/components/PlayerCardShared/ObjectivesRack";
import { ReinforcementTokensGroup } from "@/domains/player/components/ReinforcementTokensGroup";
import { PlayerCardBox } from "@/domains/player/components/PlayerCardBox";
import { PlayerCardHeaderMobile } from "@/domains/player/components/PlayerCardHeader/PlayerCardHeaderCompact";
import { partitionGenericTechs } from "@/entities/lookup/tech";
import { useSettingsStore } from "@/utils/appStore";

type Props = {
  playerData: PlayerData;
};

/** One compartment of the telemetry band; layout anchors live in this css. */
function Section({ className, ...props }: ComponentProps<typeof Compartment>) {
  return <Compartment {...props} className={cx(styles.section, className)} />;
}

type PlanetsAreaProps = {
  planets: string[];
  exhaustedPlanetAbilities?: string[];
  exhaustedPlanets?: string[];
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
  const objectiveColumns = getGameObjectiveColumnCount(players);
  const techColumns = Math.max(
    1,
    ...players.map((playerData) =>
      getTechGridMobileColumnCount(
        partitionGenericTechs(playerData.techs ?? []).standardTechs
      )
    )
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
    <PlayerCardBox color={player.color} isActive={player.active}>
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
        unfollowedSCs={player.unfollowedSCs}
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
        <Section brackets density="flush" className={styles.statusSection}>
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
        </Section>

        <Section className={styles.leadersSection}>
          <Leaders leaders={player.leaders} faction={player.faction} />
        </Section>

        <Section>
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
            <Nombox capturedUnits={player.nombox} />
          </Section>
        )}
      </Box>
    </PlayerCardBox>
  );
}
