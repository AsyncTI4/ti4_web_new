import {
  Group,
  Text,
  Grid,
  Stack,
  Box,
  Image,
  SimpleGrid,
} from "@mantine/core";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { UnitCard, UnitCardUnavailable } from "./PlayerArea/UnitCard";
import { CommandTokenCard } from "./PlayerArea/UnitCard/CommandTokenCard";
import { StasisInfantryCard } from "./PlayerArea/StasisInfantryCard";
import { StrategyCardBannerCompact } from "./PlayerArea/StrategyCardBannerCompact";
import { SpeakerToken } from "./PlayerArea/SpeakerToken";
import { Neighbors } from "./PlayerArea/Neighbors";
import { ScoredSecret } from "./PlayerArea/ScoredSecret";
import { UnscoredSecret } from "./PlayerArea/ScoredSecret/UnscoredSecret";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { CCPool } from "./PlayerArea/CCPool";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { ArmyStats, PromissoryNote, Plot } from "./PlayerArea";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { StatusIndicator } from "./PlayerArea/StatusIndicator";
import { PlayerCardBox } from "./PlayerCardBox";
import { DebtTokens } from "./PlayerArea/DebtTokens";
import { lookupUnit } from "@/lookup/units";
import { Relic } from "./PlayerArea/Relic/Relic";
import { Commodities } from "./PlayerArea/Commodities/Commodities";
import { TradeGoods } from "./PlayerArea/TradeGoods/TradeGoods";
import { Nombox } from "./Nombox";
import { SC_NAMES, SC_COLORS } from "@/lookup/strategyCards";
import { getFactionImage } from "@/lookup/factions";
import { useGameData } from "@/hooks/useGameContext";
import { filterPlanetsByOcean } from "@/utils/planets";
import { PlayerCardAbilitiesFactionTechs } from "./PlayerArea/PlayerCardAbilitiesFactionTechs";
import { BreachTokens } from "./PlayerArea/BreachTokens";
import { SleeperTokens } from "./PlayerArea/SleeperTokens";
import { GhostWormholeTokens } from "./PlayerArea/GhostWormholeTokens";
import { GalvanizeTokens } from "./PlayerArea/GalvanizeTokens";
import styles from "./PlayerCardMobile.module.css";
import cx from "clsx";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  playerData: PlayerData;
};

const unitPriorityOrder = [
  "ws", // War Sun
  "fs", // Flagship
  "dn", // Dreadnought
  "cv", // Carrier
  "ca", // Cruiser
  "dd", // Destroyer
  "ff", // Fighter
  "mf", // Mech
  "gf", // Infantry
  "sd", // Space Dock
  "pd", // PDS
];

export default function PlayerCardMobile(props: Props) {
  const gameData = useGameData();
  const rank = gameData?.armyRankings?.[props.playerData.faction];

  const {
    userName,
    faction,
    factionImage,
    factionImageType,
    color,
    tacticalCC,
    fleetCC,
    strategicCC,
    fragments,
    isSpeaker,
    spaceArmyRes,
    groundArmyRes,
    spaceArmyHealth,
    groundArmyHealth,
    spaceArmyCombat,
    groundArmyCombat,
    techs,
    relics,
    planets,
    secretsScored,
    knownUnscoredSecrets,
    leaders,
    scs = [],
    promissoryNotesInPlayArea = [],
    resources,
    totResources,
    influence,
    totInfluence,
    optimalResources,
    totOptimalResources,
    optimalInfluence,
    totOptimalInfluence,
    flexValue,
    totFlexValue,
    unitCounts,
    stasisInfantry,
    exhaustedSCs,
    passed,
    active,
    neighbors,
    tg,
    commodities,
    commoditiesTotal,
    soCount,
    pnCount,
    acCount,
    debtTokens,
    exhaustedRelics,
    nombox,
    exhaustedPlanetAbilities,
    notResearchedFactionTechs,

    abilities,
    plotCards,
    customPromissoryNotes,
    breachTokensReinf,
    galvanizeTokensReinf,
    sleeperTokensReinf,
    ghostWormholesReinf,
  } = props.playerData;
  const factionUrl = getFactionImage(faction, factionImage, factionImageType);

  const promissoryNotes = promissoryNotesInPlayArea;

  const mahactEdict = props.playerData.mahactEdict || [];
  const armyStats = {
    spaceArmyRes,
    groundArmyRes,
    spaceArmyHealth,
    groundArmyHealth,
    spaceArmyCombat,
    groundArmyCombat,
  };

  const planetEconomics = {
    total: {
      currentResources: resources,
      totalResources: totResources,
      currentInfluence: influence,
      totalInfluence: totInfluence,
    },
    optimal: {
      currentResources: optimalResources,
      totalResources: totOptimalResources,
      currentInfluence: optimalInfluence,
      totalInfluence: totOptimalInfluence,
    },
    flex: {
      currentFlex: flexValue,
      totalFlex: totFlexValue,
    },
  };

  const { regularPlanets, oceanPlanets } = filterPlanetsByOcean(planets);

  const UnitsArea = (
    <SimpleGrid cols={6} spacing="8px">
      {unitPriorityOrder.map((asyncId) => {
        const bestUnit = lookupUnit(asyncId, faction, props.playerData);
        const deployedCount = unitCounts?.[asyncId]?.deployedCount ?? 0;
        if (!bestUnit) {
          return (
            <UnitCardUnavailable
              key={`unavailable-${asyncId}`}
              asyncId={asyncId}
              color={color}
            />
          );
        }
        return (
          <UnitCard
            key={bestUnit.id}
            unitId={bestUnit.id}
            color={color}
            deployedCount={deployedCount}
          />
        );
      })}

      {/* Command Token Card */}
      {props.playerData.ccReinf !== undefined && (
        <CommandTokenCard
          color={color}
          faction={faction}
          reinforcements={props.playerData.ccReinf}
          totalCapacity={16}
        />
      )}

      {/* Add StasisInfantryCard if there are any stasisInfantry */}
      {stasisInfantry > 0 && (
        <StasisInfantryCard reviveCount={stasisInfantry} color={color} />
      )}
    </SimpleGrid>
  );

  return (
    <PlayerCardBox color={color} faction={faction}>
      <Group gap="md" px={4} align="center">
        <Image src={factionUrl} alt={faction} w={32} h={32} />
        <Stack gap={0}>
          <Group>
            <Text span c="white" size="lg" ff="heading">
              {userName}
            </Text>
            <StatusIndicator passed={passed} active={active} />
          </Group>
          <Group gap={8}>
            <Text size="sm" span ml={4} opacity={0.9} c="white" ff="text">
              {faction}
            </Text>
            <PlayerColor color={color} size="xs" />
          </Group>
        </Stack>

        <Box ml="xs">
          <Neighbors neighbors={neighbors || []} />
        </Box>

        <Group gap="xs" align="center" mt={8}>
          {scs.map((scNumber) => {
            const isExhausted = exhaustedSCs?.includes(scNumber);
            return (
              <StrategyCardBannerCompact
                key={scNumber}
                number={scNumber}
                text={SC_NAMES[scNumber as keyof typeof SC_NAMES]}
                color={SC_COLORS[scNumber as keyof typeof SC_COLORS]}
                isExhausted={isExhausted}
              />
            );
          })}
          {isSpeaker && <SpeakerToken isVisible />}
        </Group>
      </Group>

      <Grid gutter="xs" columns={24}>
        <Grid.Col span={22}>
          <PlayerCardAbilitiesFactionTechs
            abilities={abilities}
            notResearchedFactionTechs={notResearchedFactionTechs}
            customPromissoryNotes={customPromissoryNotes}
            variant="mobile"
            breakthrough={props.playerData.breakthrough}
          />
        </Grid.Col>

        <Grid.Col span={24}>
          <Box className={styles.sectionPanel}>
            <Grid gutter="xs" columns={24}>
              <Grid.Col span={6}>
                <Group gap={2} align="flex-start">
                  <Stack gap={4}>
                    <TradeGoods tg={tg || 0} />
                    <Commodities
                      commodities={commodities || 0}
                      commoditiesTotal={commoditiesTotal || 0}
                    />
                    <DebtTokens debts={debtTokens!} />
                  </Stack>
                  <PlayerCardCounts
                    pnCount={pnCount || 0}
                    acCount={acCount || 0}
                  />
                  <CCPool
                    tacticalCC={tacticalCC}
                    fleetCC={fleetCC}
                    strategicCC={strategicCC}
                    mahactEdict={mahactEdict}
                  />
                  <FragmentsPool fragments={fragments} />
                </Group>
              </Grid.Col>

              <Grid.Col span={3}>
                <Stack gap={2}>
                  <Leaders leaders={leaders} faction={faction} mobile />
                </Stack>
              </Grid.Col>

              <Grid.Col span={15}>
                {(() => {
                  const scoredIds = Object.keys(secretsScored);
                  const knownUnscoredIds = Object.keys(
                    knownUnscoredSecrets || {}
                  );
                  const unscored = Math.max(
                    (soCount || 0) - knownUnscoredIds.length,
                    0
                  );

                  return (
                    <Box
                      style={{
                        display: "grid",
                        gridTemplateRows: "repeat(3, auto)",
                        gridTemplateColumns: `repeat(4, max-content)`,
                        gridAutoFlow: "column",
                        gap: "4px",
                      }}
                    >
                      {scoredIds.map((secretId) => (
                        <ScoredSecret
                          key={`scored-${secretId}`}
                          secretId={secretId}
                          variant="scored"
                        />
                      ))}
                      {knownUnscoredIds.map((secretId) => (
                        <ScoredSecret
                          key={`unscored-${secretId}`}
                          secretId={secretId}
                          variant="unscored"
                        />
                      ))}
                      {Array.from({ length: unscored }, (_, index) => (
                        <UnscoredSecret key={`unscored-placeholder-${index}`} />
                      ))}
                      {promissoryNotes.map((pn) => (
                        <PromissoryNote promissoryNoteId={pn} key={pn} />
                      ))}
                      {relics.map((relicId, index) => {
                        const isExhausted = exhaustedRelics?.includes(relicId);
                        return (
                          <Relic
                            key={`relic-${index}`}
                            relicId={relicId}
                            isExhausted={!!isExhausted}
                          />
                        );
                      })}
                    </Box>
                  );
                })()}
              </Grid.Col>
            </Grid>
          </Box>
        </Grid.Col>

        <Grid.Col span={24}>
          <Group gap="xs" align="flex-start" h="100%">
            <Box
              className={cx(
                styles.sectionPanel,
                !isMobileDevice() && styles.techGridDesktop
              )}
              style={{ height: "100%" }}
            >
              <DynamicTechGrid
                techs={techs}
                layout="grid"
                exhaustedTechs={props.playerData.exhaustedTechs}
                minSlotsPerColor={4}
                mobile
                breakthrough={props.playerData.breakthrough}
              />
            </Box>

            <Box
              className={cx(
                styles.sectionPanel,
                isMobileDevice()
                  ? styles.unitGridMobile
                  : styles.unitGridDesktop
              )}
              style={{ height: "100%" }}
            >
              <Box
                style={
                  isMobileDevice() ? { width: "fit-content" } : { flex: 1 }
                }
              >
                {UnitsArea}
              </Box>
            </Box>
          </Group>
        </Grid.Col>

        <Grid.Col span={24} mt="">
          <Box className={styles.sectionPanel}>
            <Group align="flex-start">
              <ResourceInfluenceCompact planetEconomics={planetEconomics} />
              <Group gap={4} wrap="wrap" flex={1}>
                {regularPlanets.map((planetId, index) => {
                  return (
                    <PlanetCard
                      key={index}
                      planetId={planetId}
                      legendaryAbilityExhausted={exhaustedPlanetAbilities.includes(
                        planetId
                      )}
                    />
                  );
                })}
                {oceanPlanets.length > 0 && (
                  <>
                    <Box ml="xs" />
                    {oceanPlanets.map((planetId, index) => {
                      return (
                        <PlanetCard
                          key={`ocean-${index}`}
                          planetId={planetId}
                          legendaryAbilityExhausted={exhaustedPlanetAbilities.includes(
                            planetId
                          )}
                        />
                      );
                    })}
                  </>
                )}

                {plotCards &&
                  Array.isArray(plotCards) &&
                  plotCards.length > 0 && (
                    <SimpleGrid cols={3} spacing="4px">
                      {plotCards.map((plotCard, index) => {
                        return (
                          <Plot
                            key={`plot-${index}`}
                            plotCard={plotCard}
                            faction={faction}
                          />
                        );
                      })}
                    </SimpleGrid>
                  )}
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

              {nombox !== undefined && Object.keys(nombox).length > 0 && (
                <div
                  style={{
                    minWidth: "200px",
                    minHeight: "150px",
                  }}
                >
                  <Nombox capturedUnits={nombox || {}} />
                </div>
              )}
            </Group>
          </Box>
        </Grid.Col>
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
    </PlayerCardBox>
  );
}
