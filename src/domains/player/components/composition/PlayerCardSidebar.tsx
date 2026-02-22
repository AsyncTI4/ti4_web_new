import { Stack, Box, SimpleGrid } from "@mantine/core";
import softStyles from "./PlayerCardSidebar.module.css";
import { DynamicTechGrid } from "@/domains/player/components/PlayerArea/Tech/DynamicTechGrid";
import { ScoredSecrets } from "@/domains/player/components/PlayerArea/ScoredSecrets";
import { PlayerData } from "@/entities/data/types";
import { Leaders } from "@/domains/player/components/PlayerArea/Leaders";
import { PlayerCardBox } from "./PlayerCardBox";
import { PlayerCardHeaderCompact } from "@/domains/player/components/PlayerArea/PlayerCardHeader/PlayerCardHeaderCompact";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerArea/PlayerCardUnitsArea";
import { PlayerCardRelicsPromissoryArea } from "@/domains/player/components/PlayerArea/PlayerCardRelicsPromissoryArea";
import { PlayerCardAbilitiesFactionTechs } from "@/domains/player/components/PlayerArea/PlayerCardAbilitiesFactionTechs";
import { PlotCardsSection } from "@/domains/player/components/PlayerArea/PlotCardsSection";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerArea/PlayerCardShared/usePlayerCardComputedData";
import { PlayerCardCapturedUnits } from "@/domains/player/components/PlayerArea/PlayerCardShared/PlayerCardCapturedUnits";
import { PlayerCardLogisticsRow } from "@/domains/player/components/PlayerArea/PlayerCardShared/PlayerCardLogisticsRow";
import { PlayerCardPlanetsSection } from "@/domains/player/components/PlayerArea/PlayerCardShared/PlayerCardPlanetsSection";

type Props = {
  playerData: PlayerData;
};

export default function PlayerCardSidebar(props: Props) {
  const playerData = props.playerData;
  const {
    userName,
    faction,
    color,
    tacticalCC,
    fleetCC,
    strategicCC,
    fragments,
    isSpeaker,
    nombox,
    relics,
    planets,
    secretsScored,
    knownUnscoredSecrets,
    leaders,
    abilities,
    plotCards,
    customPromissoryNotes,
    breachTokensReinf,
    galvanizeTokensReinf,
    sleeperTokensReinf,
    ghostWormholesReinf,
  } = playerData;

  const {
    factionImageUrl: factionUrl,
    planetEconomics,
    filteredTechs,
    allNotResearchedFactionTechs,
    promissoryNotes,
    mahactEdict,
  } = usePlayerCardComputedData(playerData);

  const scs = playerData.scs || [];
  const exhaustedPlanetAbilities = playerData.exhaustedPlanetAbilities || [];
  const exhaustedPlanets = playerData.exhaustedPlanets || [];

  return (
    <PlayerCardBox color={color} faction={faction}>
      <PlayerCardHeaderCompact
        userName={userName}
        faction={faction}
        color={color}
        factionImageUrl={factionUrl}
        variant="compact"
        isSpeaker={isSpeaker}
        scs={scs}
        exhaustedSCs={playerData.exhaustedSCs}
        passed={playerData.passed}
        active={playerData.active}
      />

      <PlayerCardAbilitiesFactionTechs
        abilities={abilities}
        notResearchedFactionTechs={allNotResearchedFactionTechs}
        customPromissoryNotes={customPromissoryNotes}
        variant="compact"
        breakthrough={playerData.breakthrough}
      />

      <Stack gap={0}>
        <SimpleGrid cols={2} spacing="xs">
          <Stack gap="sm">
            <PlayerCardLogisticsRow
              counts={{
                pnCount: props.playerData.pnCount || 0,
                acCount: props.playerData.acCount || 0,
                tg: props.playerData.tg,
                commodities: props.playerData.commodities,
                commoditiesTotal: props.playerData.commoditiesTotal,
                debtTokens: props.playerData.debtTokens,
              }}
              commandCounters={{
                tacticalCC,
                fleetCC,
                strategicCC,
                mahactEdict,
              }}
              fragments={fragments}
              groupProps={{ gap: 4 }}
            />
            <ScoredSecrets
              secretsScored={secretsScored}
              unscoredSecrets={props.playerData.soCount || 0}
              knownUnscoredSecrets={knownUnscoredSecrets}
            />
          </Stack>

          <Stack gap={2}>
            <Box mb={2}>
              <Leaders leaders={leaders} faction={faction} />
            </Box>
          </Stack>
        </SimpleGrid>

        <Box mt="xs">
          <PlayerCardRelicsPromissoryArea
            relics={relics}
            promissoryNotes={promissoryNotes}
            exhaustedRelics={playerData.exhaustedRelics}
          />
        </Box>

        <Box className={softStyles.softDivider} mt="xs" />

        <Box p="md" className={softStyles.sectionBlock}>
          <Stack gap="xs">
            <DynamicTechGrid
              techs={filteredTechs}
              exhaustedTechs={props.playerData.exhaustedTechs}
              breakthrough={props.playerData.breakthrough}
            />
          </Stack>
        </Box>
        {/* Resources and Planets Section */}
        <Stack gap="xs">
          <Box className={softStyles.softDividerTight} />

          <PlayerCardPlanetsSection
            planetEconomics={planetEconomics}
            groupProps={{ gap: 8, align: "flex-start" }}
            planetsProps={{
              planets,
              exhaustedPlanetAbilities,
              exhaustedPlanets,
              groupProps: { gap: 0, wrap: "wrap", align: "flex-start" },
              reinforcementProps: {
                breachTokensReinf,
                sleeperTokensReinf,
                ghostWormholesReinf,
                galvanizeTokensReinf,
                ml: "xs",
              },
            }}
          />
          <Box className={softStyles.softDividerTight} />
        </Stack>
        <Box p="md" className={softStyles.sectionBlock}>
          <PlayerCardUnitsArea
            playerData={playerData}
            color={color}
            faction={faction}
            cols={6}
          />
        </Box>
        <PlotCardsSection
          plotCards={plotCards}
          faction={faction}
          layout="vertical"
          renderContainer={(content) => (
            <Stack gap="xs">
              <Box className={softStyles.softDividerTight} />
              {content}
              <Box className={softStyles.softDividerTight} />
            </Stack>
          )}
        />

        <PlayerCardCapturedUnits nombox={nombox} />
      </Stack>
    </PlayerCardBox>
  );
}
