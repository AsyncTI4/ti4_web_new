import { Group, Grid, Stack, Box, SimpleGrid } from "@mantine/core";
import { DynamicTechGrid } from "@/domains/player/components/PlayerArea/Tech/DynamicTechGrid";
import { PlayerData, type PlotCard } from "@/entities/data/types";
import { Leaders } from "@/domains/player/components/PlayerArea/Leaders";
import { ArmyStats } from "@/domains/player/components/PlayerArea";
import { Nombox } from "./Nombox";
import { useGameData } from "@/hooks/useGameContext";
import { PlayerCardAbilitiesFactionTechs } from "@/domains/player/components/PlayerArea/PlayerCardAbilitiesFactionTechs";
import { Panel } from "@/shared/ui/primitives/Panel";
import { PlayerCardPlanetsWithReinforcements } from "@/domains/player/components/PlayerArea/PlayerCardPlanetsArea";
import styles from "./PlayerCardMobile.module.css";
import cx from "clsx";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerArea/PlayerCardUnitsArea";
import { PlotCardsList } from "@/domains/player/components/PlayerArea/PlotCardsList";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerArea/PlayerCardShared/usePlayerCardComputedData";
import { PlayerEconomyStack } from "@/domains/player/components/PlayerArea/PlayerCardShared/PlayerEconomyStack";
import { PlayerCardLogisticsRow } from "@/domains/player/components/PlayerArea/PlayerCardShared/PlayerCardLogisticsRow";
import { PlayerCardRelicsPromissoryArea } from "@/domains/player/components/PlayerArea/PlayerCardRelicsPromissoryArea";
import { PlayerCardPlanetsSection } from "@/domains/player/components/PlayerArea/PlayerCardShared/PlayerCardPlanetsSection";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerArea/PlayerCardShared/getPlayerCardLayoutFields";
import { PlayerCardShell } from "@/domains/player/components/PlayerArea/PlayerCardShared/PlayerCardShell";
import { PlayerCardCapturedUnits } from "@/domains/player/components/PlayerArea/PlayerCardShared/PlayerCardCapturedUnits";

type Props = {
  playerData: PlayerData;
};

type ObjectivesGridProps = {
  secretsScored: Record<string, number>;
  knownUnscoredSecrets?: Record<string, number>;
  soCount?: number;
  promissoryNotes: string[];
  relics: string[];
  exhaustedRelics?: string[];
};

function ObjectivesGrid({
  secretsScored,
  knownUnscoredSecrets,
  soCount,
  promissoryNotes,
  relics,
  exhaustedRelics,
}: ObjectivesGridProps) {
  return (
    <PlayerCardRelicsPromissoryArea
      relics={relics}
      promissoryNotes={promissoryNotes}
      exhaustedRelics={exhaustedRelics}
      secretsScored={secretsScored}
      knownUnscoredSecrets={knownUnscoredSecrets}
      unscoredSecrets={soCount || 0}
      showSecrets
      renderArea={({ items, secrets }) => (
        <Box className={styles.objectivesGrid}>
          {secrets}
          {items}
        </Box>
      )}
      secretsRenderWrapper={(items) => items}
    />
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
}: PlanetsAreaProps) {
  return (
    <Group gap={6} wrap="wrap" flex={1}>
      <PlayerCardPlanetsWithReinforcements
        planets={planets}
        exhaustedPlanetAbilities={exhaustedPlanetAbilities}
        exhaustedPlanets={exhaustedPlanets}
        groupProps={{
          gap: 6,
          wrap: "wrap",
          align: "flex-start",
          style: { flex: 1, minWidth: 0 },
        }}
        reinforcementProps={{
          breachTokensReinf,
          sleeperTokensReinf,
          ghostWormholesReinf,
          galvanizeTokensReinf,
          ml: "xs",
        }}
      />
      <PlotCardsList
        plotCards={plotCards}
        faction={faction}
        keyPrefix="mobile-plot"
        renderWrapper={(items) => (
          <SimpleGrid cols={3} spacing="4px">
            {items}
          </SimpleGrid>
        )}
      />
    </Group>
  );
}

export default function PlayerCardMobile(props: Props) {
  const gameData = useGameData();
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

  const UnitsArea = (
    <PlayerCardUnitsArea
      playerData={props.playerData}
      color={player.color}
      faction={player.faction}
      cols={6}
      spacing="6px"
      showUnavailable
    />
  );

  return (
    <PlayerCardShell
      player={player}
      factionImageUrl={factionUrl}
      variant="mobile"
      headerOverrides={{
        neighbors: player.neighbors,
        showNeighbors: true,
      }}
    >
      <Grid gutter={6} columns={24}>
        <Grid.Col span={22}>
          <PlayerCardAbilitiesFactionTechs
            abilities={player.abilities}
            notResearchedFactionTechs={allNotResearchedFactionTechs}
            customPromissoryNotes={player.customPromissoryNotes}
            variant="mobile"
            breakthrough={props.playerData.breakthrough}
          />
        </Grid.Col>

        <Grid.Col span={24}>
          <Panel>
            <Grid gutter={8} columns={24}>
              <Grid.Col span={6}>
                <Group gap={2} align="flex-start">
                  <PlayerEconomyStack
                    tg={player.tg}
                    commodities={player.commodities}
                    commoditiesTotal={player.commoditiesTotal}
                    debtTokens={player.debtTokens}
                  />
                  <PlayerCardLogisticsRow
                    counts={{
                      pnCount: player.pnCount,
                      acCount: player.acCount,
                    }}
                    commandCounters={{
                      tacticalCC: player.tacticalCC,
                      fleetCC: player.fleetCC,
                      strategicCC: player.strategicCC,
                      mahactEdict,
                    }}
                    fragments={player.fragments}
                    groupProps={{ gap: 2 }}
                    commandCountersWrapperProps={{ ml: 4 }}
                  />
                </Group>
              </Grid.Col>

              <Grid.Col span={3} className={styles.dividerLeft}>
                <Stack gap={2}>
                  <Leaders leaders={player.leaders} faction={player.faction} mobile />
                </Stack>
              </Grid.Col>

              <Grid.Col span={15} className={styles.dividerLeft}>
                <ObjectivesGrid
                  secretsScored={player.secretsScored}
                  knownUnscoredSecrets={player.knownUnscoredSecrets}
                  soCount={player.soCount}
                  promissoryNotes={promissoryNotes}
                  relics={player.relics}
                  exhaustedRelics={player.exhaustedRelics}
                />
              </Grid.Col>
            </Grid>
          </Panel>
        </Grid.Col>

        <Grid.Col span={24}>
          <Group gap={6} align="flex-start" h="100%">
            <Panel
              className={cx(!isMobileDevice() && styles.techGridDesktop)}
              style={{ height: "100%" }}
            >
              <DynamicTechGrid
                techs={filteredTechs}
                layout="grid"
                exhaustedTechs={props.playerData.exhaustedTechs}
                minSlotsPerColor={4}
                mobile
                breakthrough={props.playerData.breakthrough}
              />
            </Panel>

            <Panel
              className={cx(
                isMobileDevice() ? styles.unitGridMobile : styles.unitGridDesktop
              )}
              style={{ height: "100%" }}
            >
              <Box style={isMobileDevice() ? { width: "fit-content" } : { flex: 1 }}>
                {UnitsArea}
              </Box>
            </Panel>
          </Group>
        </Grid.Col>

        <Grid.Col span={24}>
          <Panel>
            <PlayerCardPlanetsSection
              planetEconomics={planetEconomics}
              groupProps={{ gap: 6, align: "flex-start" }}
              renderPlanets={() => (
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
                />
              )}
            />
          </Panel>
        </Grid.Col>

        <PlayerCardCapturedUnits nombox={player.nombox}>
          {(units) => (
            <Grid.Col span={24}>
              <Nombox capturedUnits={units} compact />
            </Grid.Col>
          )}
        </PlayerCardCapturedUnits>
      </Grid>

      <Box
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <ArmyStats stats={armyStats} rank={rank} />
      </Box>
    </PlayerCardShell>
  );
}
