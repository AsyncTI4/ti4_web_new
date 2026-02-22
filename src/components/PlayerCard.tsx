import { Group, Grid, Stack, Box, Flex } from "@mantine/core";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { Neighbors } from "./PlayerArea/Neighbors";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { ArmyStats } from "./PlayerArea";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import FadedDivider from "./shared/primitives/FadedDivider/FadedDivider";
import FactionAbilitiesTechs from "./PlayerArea/FactionAbilitiesTechs";
import { PlayerCardUnitsArea } from "./PlayerArea/PlayerCardUnitsArea";
import { PlotCardsSection } from "./PlayerArea/PlotCardsSection";
import { PlayerCardRelicsPromissoryArea } from "./PlayerArea/PlayerCardRelicsPromissoryArea";
import { PlayerCardPlanetsWithReinforcements } from "./PlayerArea/PlayerCardPlanetsArea";
import { usePlayerCardComputedData } from "./PlayerArea/PlayerCardShared/usePlayerCardComputedData";
import { PlayerEconomyStack } from "./PlayerArea/PlayerCardShared/PlayerEconomyStack";
import { PlayerCardCapturedUnits } from "./PlayerArea/PlayerCardShared/PlayerCardCapturedUnits";
import { PlayerCardLogisticsRow } from "./PlayerArea/PlayerCardShared/PlayerCardLogisticsRow";
import { getPlayerCardLayoutFields } from "./PlayerArea/PlayerCardShared/getPlayerCardLayoutFields";
import { PlayerCardShell } from "./PlayerArea/PlayerCardShared/PlayerCardShell";

type Props = {
  playerData: PlayerData;
};

export default function PlayerCard(props: Props) {
  const player = getPlayerCardLayoutFields(props.playerData);
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
      cols={{ base: 4, xl: 6 }}
      spacing="8px"
    />
  );

  return (
    <PlayerCardShell
      player={player}
      factionImageUrl={factionUrl}
      variant="full"
      boxProps={{
        paperProps: {
          style: { height: "100%" },
        },
      }}
    >
      <FactionAbilitiesTechs
        abilities={player.abilities}
        factionTechs={player.factionTechs}
        notResearchedFactionTechs={allNotResearchedFactionTechs}
        customPromissoryNotes={player.customPromissoryNotes}
        breakthrough={props.playerData.breakthrough}
      />

      <Grid gutter="md" columns={12}>
        <Grid.Col
          span={{
            base: 6,
            sm: 4,
          }}
        >
          <Stack gap={6}>
            <Box visibleFrom="sm" ml="xs">
              <Neighbors neighbors={player.neighbors} />
            </Box>
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
              fragmentsPlacement="stacked"
              groupProps={{ gap: 4 }}
            />
          </Stack>
        </Grid.Col>

        <Grid.Col
          span={{
            base: 6,
            sm: 4,
          }}
        >
          <Stack gap={2}>
            <Box hiddenFrom="sm" style={{ minHeight: "175px" }}>
              <Leaders leaders={player.leaders} faction={player.faction} />
            </Box>
            <Box visibleFrom="sm">
              <ScoredSecrets
                secretsScored={player.secretsScored}
                knownUnscoredSecrets={player.knownUnscoredSecrets}
                unscoredSecrets={player.soCount}
              />
            </Box>
          </Stack>
        </Grid.Col>

        <Grid.Col span={4} visibleFrom="sm">
          <Box style={{ minHeight: "175px" }}>
            <Leaders leaders={player.leaders} faction={player.faction} />
          </Box>
        </Grid.Col>

        <Grid.Col py={0}>
          <PlayerCardRelicsPromissoryArea
            relics={player.relics}
            promissoryNotes={promissoryNotes}
            exhaustedRelics={player.exhaustedRelics}
            secretsScored={player.secretsScored}
            knownUnscoredSecrets={player.knownUnscoredSecrets}
            unscoredSecrets={player.soCount}
            horizontal
            showSecrets
            renderArea={({ items, secrets }) => (
              <Group gap={4} style={{ minHeight: "30px" }}>
                {items}
                <Box hiddenFrom="sm">{secrets}</Box>
              </Group>
            )}
          />
        </Grid.Col>
        <FadedDivider orientation="horizontal" />

        <Grid.Col
          span={{
            base: 12,
          }}
        >
          <DynamicTechGrid
            techs={filteredTechs}
            layout="grid"
            exhaustedTechs={props.playerData.exhaustedTechs}
            minSlotsPerColor={4}
            breakthrough={props.playerData.breakthrough}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          {/* Units + Army Stats */}
          <Flex align="flex-start" justify="flex-start" gap="md" wrap="wrap">
            <Box style={{ flex: 1 }}>{UnitsArea}</Box>
            <Box>
              <ArmyStats stats={armyStats} />
            </Box>
          </Flex>
        </Grid.Col>
        <FadedDivider orientation="horizontal" />
        <Grid.Col span={12}>
          <Group gap="md" align="flex-start">
            <PlayerEconomyStack
              tg={player.tg}
              commodities={player.commodities}
              commoditiesTotal={player.commoditiesTotal}
              debtTokens={player.debtTokens}
            >
              <Box hiddenFrom="sm">
                <ResourceInfluenceCompact planetEconomics={planetEconomics} />
              </Box>
            </PlayerEconomyStack>

            <Flex visibleFrom="sm" miw={90}>
              <ResourceInfluenceCompact planetEconomics={planetEconomics} />
            </Flex>

            <PlayerCardPlanetsWithReinforcements
              planets={player.planets}
              exhaustedPlanetAbilities={player.exhaustedPlanetAbilities}
              exhaustedPlanets={player.exhaustedPlanets}
              groupProps={{ gap: 4, wrap: "wrap", align: "flex-start", flex: 1 }}
              planetsWrapperProps={{ style: { flex: 1, minWidth: 0 } }}
              reinforcementProps={{
                breachTokensReinf: player.breachTokensReinf,
                sleeperTokensReinf: player.sleeperTokensReinf,
                ghostWormholesReinf: player.ghostWormholesReinf,
                galvanizeTokensReinf: player.galvanizeTokensReinf,
                gap: 4,
              }}
            />
          </Group>
        </Grid.Col>
        <PlotCardsSection
          plotCards={player.plotCards}
          faction={player.faction}
          renderContainer={(content) => <Grid.Col span={12}>{content}</Grid.Col>}
        />
      </Grid>
      <PlayerCardCapturedUnits nombox={player.nombox} />
    </PlayerCardShell>
  );
}
