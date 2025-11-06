import { Group, Stack, Box, SimpleGrid } from "@mantine/core";
import softStyles from "./PlayerCardSidebar.module.css";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { CCPool } from "./PlayerArea/CCPool";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { PlayerCardBox } from "./PlayerCardBox";
import { Nombox } from "./Nombox";
import { getFactionImage } from "@/lookup/factions";
import { Plot } from "./PlayerArea/Plot";
import Caption from "./shared/Caption/Caption";
import { PlayerCardHeaderCompact } from "./PlayerArea/PlayerCardHeader/PlayerCardHeaderCompact";
import { PlayerCardUnitsArea } from "./PlayerArea/PlayerCardUnitsArea";
import { PlayerCardPlanetsArea } from "./PlayerArea/PlayerCardPlanetsArea";
import { PlayerCardRelicsPromissoryArea } from "./PlayerArea/PlayerCardRelicsPromissoryArea";
import { PlayerCardAbilitiesFactionTechs } from "./PlayerArea/PlayerCardAbilitiesFactionTechs";
import { usePlanetEconomics } from "@/hooks/usePlanetEconomics";
import { BreachTokens } from "./PlayerArea/BreachTokens";
import { SleeperTokens } from "./PlayerArea/SleeperTokens";
import { GhostWormholeTokens } from "./PlayerArea/GhostWormholeTokens";
import { GalvanizeTokens } from "./PlayerArea/GalvanizeTokens";

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
    techs,
    relics,
    planets,
    secretsScored,
    knownUnscoredSecrets,
    leaders,
    abilities,
    notResearchedFactionTechs,
    factionImage,
    factionImageType,
    plotCards,
    customPromissoryNotes,
    breachTokensReinf,
    galvanizeTokensReinf,
    sleeperTokensReinf,
    ghostWormholesReinf,
  } = playerData;
  const factionUrl = getFactionImage(faction, factionImage, factionImageType);

  const scs = playerData.scs || [];
  const promissoryNotes = playerData.promissoryNotesInPlayArea || [];
  const exhaustedPlanetAbilities = playerData.exhaustedPlanetAbilities || [];
  const planetEconomics = usePlanetEconomics(playerData);

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
        notResearchedFactionTechs={notResearchedFactionTechs}
        customPromissoryNotes={customPromissoryNotes}
        variant="compact"
        breakthrough={playerData.breakthrough}
      />

      <Stack gap={0}>
        <SimpleGrid cols={2} spacing="xs">
          <Stack gap="sm">
            <Group gap={4}>
              <PlayerCardCounts
                pnCount={props.playerData.pnCount || 0}
                acCount={props.playerData.acCount || 0}
                tg={props.playerData.tg}
                commodities={props.playerData.commodities}
                commoditiesTotal={props.playerData.commoditiesTotal}
                debtTokens={props.playerData.debtTokens}
              />
              <CCPool
                tacticalCC={tacticalCC}
                fleetCC={fleetCC}
                strategicCC={strategicCC}
                mahactEdict={props.playerData.mahactEdict}
              />
              <FragmentsPool fragments={fragments} />
            </Group>
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
              techs={techs}
              exhaustedTechs={props.playerData.exhaustedTechs}
            />
          </Stack>
        </Box>
        {/* Resources and Planets Section */}
        <Stack gap="xs">
          <Box className={softStyles.softDividerTight} />

          <Group gap={8} align="flex-start">
            <ResourceInfluenceCompact planetEconomics={planetEconomics} />

            <Group gap={0} wrap="wrap" align="flex-start">
              <PlayerCardPlanetsArea
                planets={planets}
                exhaustedPlanetAbilities={exhaustedPlanetAbilities}
                gap={0}
              />
              <Group gap={0} wrap="wrap" align="flex-start" ml="xs">
                {breachTokensReinf && breachTokensReinf > 0 && (
                  <BreachTokens count={breachTokensReinf} />
                )}
                {sleeperTokensReinf && sleeperTokensReinf > 0 && (
                  <SleeperTokens count={sleeperTokensReinf} />
                )}
                {ghostWormholesReinf && ghostWormholesReinf.length > 0 && (
                  <GhostWormholeTokens wormholeIds={ghostWormholesReinf} />
                )}
                {galvanizeTokensReinf && galvanizeTokensReinf > 0 && (
                  <GalvanizeTokens count={galvanizeTokensReinf} />
                )}
              </Group>
            </Group>
          </Group>
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
        {plotCards && Array.isArray(plotCards) && plotCards.length > 0 && (
          <Stack gap="xs">
            <Box className={softStyles.softDividerTight} />
            <Caption size="xs">Plots</Caption>
            <Group gap="md" align="flex-start">
              <Group gap={4} wrap="wrap" flex={1}>
                {plotCards.map((plotCard, index) => {
                  return (
                    <Plot
                      key={`plot-${index}`}
                      plotCard={plotCard}
                      faction={faction}
                    />
                  );
                })}
              </Group>
            </Group>
            <Box className={softStyles.softDividerTight} />
          </Stack>
        )}

        {nombox !== undefined && Object.keys(nombox).length > 0 && (
          <Box mt="md">
            <Nombox capturedUnits={nombox || {}} />
          </Box>
        )}
      </Stack>
    </PlayerCardBox>
  );
}
