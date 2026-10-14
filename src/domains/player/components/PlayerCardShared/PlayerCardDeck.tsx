import { Box, Stack } from "@/ds";
import { PlayerData } from "@/entities/data/types";
import { Leaders } from "@/domains/player/components/Leaders";
import { ArmyStats } from "@/domains/player/components/ArmyStats";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerCardUnitsArea";
import { PlotCardsList } from "@/domains/player/components/PlotCardsList";
import { PlayerCardPlanetsArea } from "@/domains/player/components/PlayerCardPlanetsArea";
import { usePlayerCardComputedData } from "./usePlayerCardComputedData";
import { ResourceInfluenceCompact } from "@/domains/player/components/ResourceInfluenceTable";
import { getPlayerCardLayoutFields } from "./getPlayerCardLayoutFields";
import { Compartment } from "./Compartment";
import { LogisticsPlate } from "./LogisticsPlate";
import { ObjectivesRack } from "./ObjectivesRack";
import { ReinforcementTokensGroup } from "@/domains/player/components/ReinforcementTokensGroup";
import { PlayerCardAbilitiesFactionTechsMobile } from "@/domains/player/components/PlayerCardAbilitiesFactionTechs";
import {
  techCategories,
  buildTechElementsForType,
} from "@/domains/player/components/Tech/TechGridShared";
import { PhantomTech } from "@/domains/player/components/Tech/PhantomTech";
import { Nombox } from "@/domains/player/components/composition/Nombox";
import { OmenDice } from "@/domains/player/components/OmenDice";
import { getTechData } from "@/entities/lookup/tech";
import { useGameData } from "@/state/useGameContext";
import { useSettingsStore } from "@/state/appStore";
import styles from "./PlayerCardDeck.module.css";

type Props = {
  playerData: PlayerData;
};


/**
 * How deep the tech rack is drawn: the player's longest color line. Shorter
 * lines are socketed to that depth so the rack stays a rectangle, but nothing
 * is padded past what this player has actually researched.
 */
function getTechRackDepth(techIds: string[]) {
  const counts = techCategories.map(
    (techType) =>
      techIds.filter((techId) => getTechData(techId)?.types[0] === techType)
        .length
  );
  return Math.max(1, ...counts);
}

/**
 * The expanded player dossier for the Player tab. Plates run in the order a
 * player reads an opponent: who they are (faction loadout), what they can do
 * this turn (stores, command tokens, planet spend, leaders), what they hold
 * (secrets, relics, notes), what they have built (tech, units) and where they
 * are (planets, across the full card width).
 *
 * Container queries, not media queries, drive the reflow: the tab's grid
 * deals cards anywhere from ~480px to ~1000px wide.
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

  /* One column per tech color, fluid width — the researched/socket mix reads
     as a build queue at any card width. */
  const techDepth = getTechRackDepth(filteredTechs);
  const techRackColumns = techCategories.map((techType) =>
    buildTechElementsForType(
      techType,
      filteredTechs,
      playerData.exhaustedTechs ?? [],
      techDepth,
      playerData.breakthrough
    )
  );

  const hasHoldings =
    Object.keys(player.secretsScored ?? {}).length > 0 ||
    (player.soCount ?? 0) > 0 ||
    (player.relics?.length ?? 0) > 0 ||
    promissoryNotes.length > 0;

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
            />
          </Box>
        </Compartment>
      )}

      {/* This turn: what they can spend, who they can send, what they hold.
          Stores, ledger and leaders keep their natural widths; holdings take
          the line's slack, or drop to a full-width line of their own when the
          card is too narrow to seat them. The planet ledger sits here rather
          than beside the planet cards — it is a spending figure, and the
          cards get the card's full width back. */}
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

        <Compartment className={styles.economySection}>
          <ResourceInfluenceCompact
            planetEconomics={planetEconomics}
            showTotalSpend={settings.showPlayerAreaTotalSpend}
          />
        </Compartment>

        <Compartment className={styles.leadersSection}>
          <Leaders leaders={player.leaders} faction={player.faction} />
        </Compartment>

        {/* Holdings: one run of seats sized to what the player actually holds,
            so a single relic is one seat, not one seat in a rack of empties. */}
        {hasHoldings && (
          <Compartment className={styles.holdingsSection}>
            <ObjectivesRack
              flow
              secretsScored={player.secretsScored}
              knownUnscoredSecrets={player.knownUnscoredSecrets}
              soCount={player.soCount}
              promissoryNotes={promissoryNotes}
              relics={player.relics}
              exhaustedRelics={player.exhaustedRelics}
            />
          </Compartment>
        )}
      </Box>

      <Compartment className={styles.techSection}>
        <Box className={styles.techRack}>
          {techCategories.map((techType, index) => (
            <Stack key={techType} gap={4} className={styles.techLane}>
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
            spacing="8px"
            showUnitUpgrades={settings.showPlayerAreaUnitUpgrades}
          />
        </Compartment>

        {hasCapturedUnits && (
          <Compartment className={styles.nomboxSection}>
            <Nombox capturedUnits={player.nombox} />
          </Compartment>
        )}

        {settings.showPlayerAreaArmyStrength && (
          <Compartment className={styles.armySection}>
            <ArmyStats stats={armyStats} rank={rank} />
          </Compartment>
        )}
      </Box>

      <Compartment className={styles.planetsSection}>
        <Box className={styles.planetsFlow}>
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
          <OmenDice dice={playerData.omenDice} />
        </Box>
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
