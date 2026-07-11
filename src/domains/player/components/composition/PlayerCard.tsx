import { Group, Grid, Stack, Box, Flex } from "@mantine/core";
import { DynamicTechGrid } from "@/domains/player/components/Tech/DynamicTechGrid";
import { Neighbors } from "@/domains/player/components/Neighbors";
import { ScoredSecrets } from "@/domains/player/components/ScoredSecrets";
import { PlayerData } from "@/entities/data/types";
import { Leaders } from "@/domains/player/components/Leaders";
import { ArmyStats } from "@/domains/player/components";
import { ResourceInfluenceCompact } from "@/domains/player/components/ResourceInfluenceTable/ResourceInfluenceCompact";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import FactionAbilitiesTechs from "@/domains/player/components/FactionAbilitiesTechs";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerCardUnitsArea";
import { PlotCardsSection } from "@/domains/player/components/PlotCardsSection";
import { PlayerCardPlanetsArea } from "@/domains/player/components/PlayerCardPlanetsArea";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerCardShared/usePlayerCardComputedData";
import { PlayerEconomyStack } from "@/domains/player/components/PlayerCardShared/PlayerEconomyStack";
import { PlayerCardLogisticsRow } from "@/domains/player/components/PlayerCardShared/PlayerCardLogisticsRow";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerCardShared/getPlayerCardLayoutFields";
import { ReinforcementTokensGroup } from "@/domains/player/components/ReinforcementTokensGroup";
import { PlayerCardBox } from "@/domains/player/components/PlayerCardBox";
import { PlayerCardHeaderFull } from "@/domains/player/components/PlayerCardHeader/PlayerCardHeaderCompact";
import { RelicsPromissoryList } from "@/domains/player/components/RelicsPromissoryList";
import { Nombox } from "./Nombox";
import { useSettingsStore } from "@/utils/appStore";

type Props = {
  playerData: PlayerData;
};

export default function PlayerCard(props: Props) {
  const settings = useSettingsStore((state) => state.settings);
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
  const hasCapturedUnits =
    player.nombox && Object.keys(player.nombox).length > 0;

  const UnitsArea = (
    <PlayerCardUnitsArea
      playerData={props.playerData}
      color={player.color}
      faction={player.faction}
      cols={{ base: 4, xl: 6 }}
      spacing="8px"
      showUnitUpgrades={settings.showPlayerAreaUnitUpgrades}
    />
  );

  return (
    <PlayerCardBox
      color={player.color}
      faction={player.faction}
      paperProps={{ style: { height: "100%" } }}
    >
      <PlayerCardHeaderFull
        userName={player.userName}
        faction={player.faction}
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
      />

      <FactionAbilitiesTechs
        abilities={player.abilities}
        factionTechs={player.factionTechs}
        notResearchedFactionTechs={allNotResearchedFactionTechs}
        customPromissoryNotes={player.customPromissoryNotes}
        breakthrough={props.playerData.breakthrough}
        showFactionAbilities={settings.showPlayerAreaFactionAbilities}
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
              {settings.showPlayerAreaNeighborship && (
                <Neighbors neighbors={player.neighbors} />
              )}
            </Box>
            <PlayerCardLogisticsRow
              counts={{
                pnCount: player.pnCount,
                acCount: player.acCount,
              }}
              commandCounters={
                settings.showPlayerAreaCommandTokens
                  ? {
                      tacticalCC: player.tacticalCC,
                      fleetCC: player.fleetCC,
                      strategicCC: player.strategicCC,
                      mahactEdict,
                    }
                  : undefined
              }
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
          <Group gap={4} style={{ minHeight: "30px" }}>
            <RelicsPromissoryList
              relics={player.relics}
              promissoryNotes={promissoryNotes}
              exhaustedRelics={player.exhaustedRelics}
            />
            <Box hiddenFrom="sm">
              <ScoredSecrets
                secretsScored={player.secretsScored}
                knownUnscoredSecrets={player.knownUnscoredSecrets}
                unscoredSecrets={player.soCount}
                horizontal
              />
            </Box>
          </Group>
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
            {hasCapturedUnits && (
              <Box>
                <Nombox capturedUnits={player.nombox} />
              </Box>
            )}
            {settings.showPlayerAreaArmyStrength && (
              <Box>
                <ArmyStats stats={armyStats} />
              </Box>
            )}
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
                <ResourceInfluenceCompact
                  planetEconomics={planetEconomics}
                  showTotalSpend={settings.showPlayerAreaTotalSpend}
                />
              </Box>
            </PlayerEconomyStack>

            <Flex visibleFrom="sm" miw={90}>
              <ResourceInfluenceCompact
                planetEconomics={planetEconomics}
                showTotalSpend={settings.showPlayerAreaTotalSpend}
              />
            </Flex>

            <Group gap={4} wrap="wrap" align="flex-start" flex={1}>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <PlayerCardPlanetsArea
                  planets={player.planets}
                  exhaustedPlanetAbilities={player.exhaustedPlanetAbilities}
                  exhaustedPlanets={player.exhaustedPlanets}
                />
              </Box>
              {settings.showPlayerAreaReinforcements && (
                <ReinforcementTokensGroup
                  breachTokensReinf={player.breachTokensReinf}
                  sleeperTokensReinf={player.sleeperTokensReinf}
                  ghostWormholesReinf={player.ghostWormholesReinf}
                  galvanizeTokensReinf={player.galvanizeTokensReinf}
                  gap={4}
                />
              )}
            </Group>
          </Group>
        </Grid.Col>
        <Grid.Col span={12}>
          <PlotCardsSection
            plotCards={player.plotCards}
            faction={player.faction}
          />
          </Grid.Col>
        </Grid>
    </PlayerCardBox>
  );
}
