import { Box, Group, Stack } from "@mantine/core";
import { PlayerData } from "@/entities/data/types";
import { Leaders } from "@/domains/player/components/Leaders";
import { ArmyStats } from "@/domains/player/components";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerCardUnitsArea";
import { PlotCardsList } from "@/domains/player/components/PlotCardsList";
import { PlayerCardPlanetsArea } from "@/domains/player/components/PlayerCardPlanetsArea";
import { usePlayerCardComputedData } from "./usePlayerCardComputedData";
import { PlayerCardPlanetsSection } from "./PlayerCardPlanetsSection";
import { getPlayerCardLayoutFields } from "./getPlayerCardLayoutFields";
import { Compartment } from "./Compartment";
import { LogisticsPlate } from "./LogisticsPlate";
import { ObjectivesRack, getObjectiveColumnCount } from "./ObjectivesRack";
import { ReinforcementTokensGroup } from "@/domains/player/components/ReinforcementTokensGroup";
import { PlayerCardAbilitiesFactionTechsMobile } from "@/domains/player/components/PlayerCardAbilitiesFactionTechs";
import {
  techCategories,
  buildTechElementsForType,
} from "@/domains/player/components/Tech/TechGridShared";
import { PhantomTech } from "@/domains/player/components/Tech/PhantomTech";
import { Nombox } from "@/domains/player/components/composition/Nombox";
import { useGameData } from "@/hooks/useGameContext";
import { useSettingsStore } from "@/utils/appStore";
import styles from "./PlayerCardDeck.module.css";

type Props = {
  playerData: PlayerData;
};

/** Same floor as the pannable band: a rack never shows fewer than five seats. */
const MIN_RACK_ROWS = 5;

/** Sockets drawn per tech color, so an unresearched line reads as capacity. */
const TECH_MIN_SLOTS = 4;

/**
 * The expanded player dossier: the same compartment band as the pannable map
 * view, reflowed into rows for a surface that is taller than it is wide. Same
 * plates, same fixed order — the band wraps instead of scrolling. Shared by
 * the Player tab's card grid and the Panels-view sidebar; container queries,
 * not media queries, drive the reflow, so both hosts get the layout their
 * actual width deserves.
 */
export function PlayerCardDeck({ playerData }: Props) {
  const gameData = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const player = getPlayerCardLayoutFields(playerData);
  const rank = gameData?.armyRankings?.[player.faction];

  const {
    planetEconomics,
    filteredTechs,
    allNotResearchedFactionTechs,
    promissoryNotes,
    mahactEdict,
    armyStats,
  } = usePlayerCardComputedData(playerData);

  const hasCapturedUnits =
    player.nombox && Object.keys(player.nombox).length > 0;

  /* Column counts stay game-wide so the same rack shows the same number of
     seats on every card in the tab, filled or not. */
  const players = (gameData?.playerData ?? []).filter((p) => p.faction);
  const objectiveColumns = Math.max(
    1,
    ...players.map((otherPlayer) =>
      getObjectiveColumnCount({
        secretsScored: otherPlayer.secretsScored ?? {},
        knownUnscoredSecrets: otherPlayer.knownUnscoredSecrets,
        soCount: otherPlayer.soCount,
        promissoryNotes: otherPlayer.promissoryNotesInPlayArea ?? [],
        relics: otherPlayer.relics ?? [],
      })
    )
  );

  /* One column per tech color, fluid width — the researched/socket mix reads
     as a build queue at any card width. */
  const techRackColumns = techCategories.map((techType) =>
    buildTechElementsForType(
      techType,
      filteredTechs,
      playerData.exhaustedTechs ?? [],
      TECH_MIN_SLOTS,
      false,
      playerData.breakthrough
    )
  );

  const hasLoadout =
    Boolean(playerData.breakthrough?.breakthroughId) ||
    (settings.showPlayerAreaFactionAbilities &&
      ((player.abilities?.length ?? 0) > 0 ||
        (player.customPromissoryNotes?.length ?? 0) > 0 ||
        allNotResearchedFactionTechs.length > 0));

  return (
    /* The deck: compartments in the band's fixed order, wrapping into rows.
       Every group sits in a Module plate; nothing floats on the card. */
    <Box className={styles.deck}>
      {/* Faction loadout — breakthrough, faction techs, notes, abilities —
          the deck's first plate, subdivided into bays by a hairline lattice.
          Chips wrap inside their bay, so group boundaries hold at any card
          width instead of groups tumbling onto ragged rows. */}
      {hasLoadout && (
        <Compartment density="flush" className={styles.loadoutSection}>
          <Box className={styles.loadoutRail}>
            <PlayerCardAbilitiesFactionTechsMobile
              abilities={player.abilities}
              notResearchedFactionTechs={allNotResearchedFactionTechs}
              customPromissoryNotes={player.customPromissoryNotes}
              breakthrough={playerData.breakthrough}
              showFactionAbilities={settings.showPlayerAreaFactionAbilities}
              groupClassName={styles.loadoutGroup}
              groupLabelClassName={styles.loadoutGroupLabel}
            />
          </Box>
        </Compartment>
      )}

      <Box className={styles.row}>
        <Compartment brackets density="flush" className={styles.statusSection}>
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
        </Compartment>

        <Compartment className={styles.holdingsSection}>
          <ObjectivesRack
            fluid
            secretsScored={player.secretsScored}
            knownUnscoredSecrets={player.knownUnscoredSecrets}
            soCount={player.soCount}
            promissoryNotes={promissoryNotes}
            relics={player.relics}
            exhaustedRelics={player.exhaustedRelics}
            minColumns={objectiveColumns}
            minRows={MIN_RACK_ROWS}
          />
        </Compartment>

        <Compartment className={styles.leadersSection}>
          <Leaders leaders={player.leaders} faction={player.faction} />
        </Compartment>
      </Box>

      <Compartment className={styles.techSection}>
        <Box className={styles.techRack}>
          {techCategories.map((techType, index) => (
            <Stack key={techType} gap={4}>
              {techRackColumns[index].length > 0 ? (
                techRackColumns[index]
              ) : (
                <PhantomTech techType={techType} />
              )}
            </Stack>
          ))}
        </Box>
      </Compartment>

      <Box className={styles.row}>
        <Compartment className={styles.unitsSection}>
          <PlayerCardUnitsArea
            playerData={playerData}
            color={player.color}
            faction={player.faction}
            cols={{ base: 4, xl: 6 }}
            spacing="8px"
            showUnitUpgrades={settings.showPlayerAreaUnitUpgrades}
          />
        </Compartment>

        {hasCapturedUnits && (
          <Compartment className={styles.nomboxSection}>
            <Nombox capturedUnits={player.nombox} compact />
          </Compartment>
        )}

        {settings.showPlayerAreaArmyStrength && (
          <Compartment className={styles.armySection}>
            <ArmyStats stats={armyStats} rank={rank} />
          </Compartment>
        )}
      </Box>

      <Compartment className={styles.planetsSection}>
        <PlayerCardPlanetsSection
          planetEconomics={planetEconomics}
          gap={4}
          economyGap={6}
          align="stretch"
          showTotalSpend={settings.showPlayerAreaTotalSpend}
        >
          <Group gap={4} align="center" className={styles.planetsFlow}>
            <PlayerCardPlanetsArea
              planets={player.planets}
              exhaustedPlanetAbilities={player.exhaustedPlanetAbilities}
              exhaustedPlanets={player.exhaustedPlanets}
            />
            {settings.showPlayerAreaReinforcements && (
              <ReinforcementTokensGroup
                breachTokensReinf={player.breachTokensReinf}
                sleeperTokensReinf={player.sleeperTokensReinf}
                ghostWormholesReinf={player.ghostWormholesReinf}
                galvanizeTokensReinf={player.galvanizeTokensReinf}
                ml="xs"
              />
            )}
          </Group>
        </PlayerCardPlanetsSection>
      </Compartment>

      {Array.isArray(player.plotCards) && player.plotCards.length > 0 && (
        <Compartment className={styles.plotsSection}>
          <PlotCardsList
            plotCards={player.plotCards}
            faction={player.faction}
            keyPrefix="card-plot"
          />
        </Compartment>
      )}
    </Box>
  );
}
