import {
  Group,
  Text,
  Grid,
  Stack,
  Box,
  Image,
  Flex,
  Divider,
} from "@mantine/core";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { PlanetAbilityCard } from "./PlayerArea/PlanetAbilityCard";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { UnitCard } from "./PlayerArea/UnitCard";
import { CommandTokenCard } from "./PlayerArea/UnitCard/CommandTokenCard";
import { StasisInfantryCard } from "./PlayerArea/StasisInfantryCard";
import { Nombox } from "./Nombox";
import { StrategyCardBanner } from "./PlayerArea/StrategyCardBanner";
import { Neighbors } from "./PlayerArea/Neighbors";
import { NeedsToFollow } from "./PlayerArea/NeedsToFollow";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PromissoryNotesStack } from "./PlayerArea/PromissoryNotesStack";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { CCPool } from "./PlayerArea/CCPool";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { cdnImage } from "../data/cdnImage";
import { ArmyStats } from "./PlayerArea";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { StatusIndicator } from "./PlayerArea/StatusIndicator";
import { PlayerCardBox } from "./PlayerCardBox";
import { getTokenImagePath } from "@/lookup/tokens";
import { DebtTokens } from "./PlayerArea/DebtTokens";
import { getUnitAsyncId } from "@/lookup/units";
import { getPlanetData } from "@/lookup/planets";
import { Relics } from "./PlayerArea/Relic/Relic";
import { Commodities } from "./PlayerArea/Commodities/Commodities";
import { TradeGoods } from "./PlayerArea/TradeGoods/TradeGoods";
import { GroundArmyStats, SpaceArmyStats } from "./PlayerArea/ArmyStats/ArmyStats";
import FactionAbilitiesTechs from "./PlayerArea/FactionAbilitiesTechs";

// Strategy card names and colors mapping
const SC_NAMES = {
  1: "LEADERSHIP",
  2: "DIPLOMACY",
  3: "POLITICS",
  4: "CONSTRUCTION",
  5: "TRADE",
  6: "WARFARE",
  7: "TECHNOLOGY",
  8: "IMPERIAL",
};
const SC_COLORS = {
  1: "red",
  2: "orange",
  3: "yellow",
  4: "green",
  5: "teal",
  6: "cyan",
  7: "blue",
  8: "purple",
};
type Props = {
  playerData: PlayerData;
};
export default function PlayerCard2Mid(props: Props) {
  const {
    userName,
    faction,
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
    unitsOwned,
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
    unfollowedSCs,
    ghostWormholesReinf,
    sleeperTokensReinf,
    nombox,
  } = props.playerData;
  const promissoryNotes = promissoryNotesInPlayArea;
  const exhaustedPlanetAbilities =
    props.playerData.exhaustedPlanetAbilities || [];
  const mahactEdict = props.playerData.mahactEdict || [];
  const armyStats = {
    spaceArmyRes,
    groundArmyRes,
    spaceArmyHealth,
    groundArmyHealth,
    spaceArmyCombat,
    groundArmyCombat,
  };

  const unitPriority: { [key: string]: number } = {
    'ws': 1,
    'fs': 2,
    'dn': 3,
    'cv': 4,
    'ca': 5,
    'dd': 6,
    'ff': 7,
    'mf': 8,
    'gf': 9,
    'sd': 10,
    'pd': 11,
  };

  const array = unitsOwned.sort((a, b) => {
    const asyncA = getUnitAsyncId(a);
    const asyncB = getUnitAsyncId(b);
    const priorityA = asyncA ? unitPriority[asyncA] : 999;
    const priorityB = asyncB ? unitPriority[asyncB] : 999;

    return priorityA - priorityB;
  }).map((unitId, index) => {
    const asyncId = getUnitAsyncId(unitId);
    const deployedCount = asyncId
      ? (unitCounts[asyncId].deployedCount ?? 0)
      : 0;

    return (
      <UnitCard
        key={index}
        unitId={unitId}
        color={color}
        deployedCount={deployedCount}
      />
    );
  });

  // These numbers are based off of unitPriority above. the list is ordered Space, Ground, Structure. 
  // If a player doesn't have warsuns, the list will be one item shorter. these negative numbers account for the
  // one item difference
  const spaceArray = array.slice(0, -4);  // read this as "get all but the last four"
  const groundArray = array.slice(-4, -2);
  const structureArray = array.slice(-2);

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

  const UnitsArea = (
    <Flex wrap={"wrap"} justify={"center"} columnGap={24} rowGap={4}>
      <Group gap={4} mr={24}>
        {props.playerData.ccReinf !== undefined && (
          <CommandTokenCard
            color={color}
            faction={faction}
            reinforcements={props.playerData.ccReinf}
            totalCapacity={16}
          />
        )}
      </Group>
      <Flex wrap={"wrap"} gap={4}>
        {groundArray}
        <StasisInfantryCard reviveCount={stasisInfantry} color={color} />
      </Flex>
      <Flex wrap={"wrap"} gap={4}>
        {structureArray}
      </Flex>
    </Flex>
  );
  const SpaceUnitsArea = (
    <Flex wrap={"wrap"} justify={"center"} align={"center"} gap={4}>
      {spaceArray}
    </Flex>
  );

  const StrategyAndSpeaker = (
    <Group gap="xs" align="center">
      {scs.map((scNumber, index) => {
        const isExhausted = exhaustedSCs?.includes(scNumber);
        return (
          <StrategyCardBanner
            key={scNumber}
            number={scNumber}
            text={SC_NAMES[scNumber as keyof typeof SC_NAMES]}
            color={SC_COLORS[scNumber as keyof typeof SC_COLORS]}
            isSpeaker={index === 0 && isSpeaker} // Only show speaker on first card
            isExhausted={isExhausted}
          />
        );
      })}
    </Group>
  );


  return (
    <PlayerCardBox
      color={color}
      faction={faction}
      paperProps={{
        style: { height: "100%" },
      }}
    >
      {/* Header Section */}
      <Group justify="space-between" align="center" mb="md">
        <Group gap={4} px={4} align="center">
          <Image
            src={cdnImage(`/factions/${faction}.png`)}
            alt={faction}
            w={24}
            h={24}
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
            }}
          />
          <Stack gap={0}>
            <Group>
              <Text
                span
                c="white"
                size="lg"
                ff="heading"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {userName}
              </Text>
              <StatusIndicator passed={passed} active={active} />
            </Group>
            <Group gap={8}>
              <Text
                size="sm"
                span
                ml={4}
                opacity={0.9}
                c="white"
                ff="text"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {faction}
              </Text>
              <PlayerColor color={color} size="xs" />
            </Group>
          </Stack>

          <Box visibleFrom="sm">
            <Neighbors neighbors={neighbors || []} />
          </Box>
        </Group>
        <Box>{StrategyAndSpeaker}</Box>
      </Group>

      <FactionAbilitiesTechs abilities={props.playerData.abilities} notResearchedFactionTechs={props.playerData.notResearchedFactionTechs} />

      <Divider mb={8} />

      <Grid gutter="md" columns={12}>
        <Grid.Col
          span={{
            base: 6,
            sm: 4
          }}
        >
          <Stack gap={6}>
            <Flex justify={"space-around"}>
              <PlayerCardCounts
                pnCount={pnCount || 0}
                acCount={acCount || 0}
              />
              <CCPool tacticalCC={tacticalCC} fleetCC={fleetCC} strategicCC={strategicCC} mahactEdict={mahactEdict} />
            </Flex>
            <FragmentsPool fragments={fragments} />
            <Relics relics={relics} />
          </Stack>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 6,
            sm: 4
          }}
        >
          <Stack gap={4}>
            <Box hiddenFrom="sm">
              <Leaders leaders={leaders} />
              <Divider my={4} />
            </Box>
            <ScoredSecrets
              secretsScored={secretsScored}
              knownUnscoredSecrets={knownUnscoredSecrets}
              unscoredSecrets={soCount || 0}
            />
            <PromissoryNotesStack promissoryNotes={promissoryNotes} />
          </Stack>
        </Grid.Col>

        <Grid.Col
          visibleFrom="sm"
          span={{
            base: 4
          }}
        >
          <Leaders leaders={leaders} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12
          }}
        >
          <Divider my={8} />
          <Group>
            <Flex justify={"center"} gap={8} align={"flex-start"} miw={50}>
              <Flex direction={"column"} miw={70} maw={70} gap={4}>
                <TradeGoods
                  tg={tg || 0} />

                <Commodities
                  commodities={commodities || 0}
                  commoditiesTotal={commoditiesTotal || 0} />

                <Box hiddenFrom="sm">
                  <ResourceInfluenceCompact planetEconomics={planetEconomics} />
                </Box>

                <DebtTokens debts={debtTokens!} />
              </Flex>

              <Flex visibleFrom="sm" miw={90}>
                <ResourceInfluenceCompact planetEconomics={planetEconomics} />
              </Flex>

              <Flex gap={8} wrap={"wrap"}>
                {planets.map((planetId, index) => {
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
              </Flex>
            </Flex>
          </Group>
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12
          }}
        >
          <Divider mb={8} />
          <Grid gutter={4}>
            <DynamicTechGrid
              techs={techs}
              layout="grid"
              exhaustedTechs={props.playerData.exhaustedTechs}
            />
          </Grid>
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12
          }}
        >
          <Divider mb={8} />
          <Flex direction="column" gap={20} align="center">
            <Flex justify="space-between" align="center" w="100%">


            {/* Ghost Wormhole Reinforcements */}
            {!!ghostWormholesReinf?.length && (
              <Group gap="xs" justify="center">
                {ghostWormholesReinf.map((wormholeId, index) => (
                  <Image
                    key={index}
                    src={cdnImage(
                      `/tokens/${getTokenImagePath(wormholeId)}`
                    )}
                    alt={wormholeId}
                    w={40}
                    h={40}
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))",
                    }}
                  />
                ))}
              </Group>
            )}

            {/* Sleeper Token Reinforcements */}
            {sleeperTokensReinf !== undefined && sleeperTokensReinf > 0 && (
              <Group gap="xs" align="center" justify="center">
                <Image
                  src={cdnImage(`/tokens/${getTokenImagePath("sleeper")}`)}
                  alt="sleeper"
                  w={40}
                  h={40}
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))",
                  }}
                />
                <Text
                  size="lg"
                  fw={700}
                  c="white"
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {sleeperTokensReinf}
                </Text>
              </Group>
            )}
              {nombox !== undefined && Object.keys(nombox).length > 0 && (
                <Nombox capturedUnits={nombox || {}} />
              )}

              <Flex flex={1} gap={4} direction={"column"} align={"center"}>

                <Box hiddenFrom="sm" w={140}>
                  <GroundArmyStats
                    stats={armyStats}
                  />
                </Box>
                <Flex wrap="wrap">
                  {UnitsArea}
                </Flex>

                <Box hiddenFrom="sm" w={140}>
                  <SpaceArmyStats
                    stats={armyStats}
                  />
                </Box>
                <Flex wrap="wrap">
                  {SpaceUnitsArea}
                </Flex>
              </Flex>

              <Flex visibleFrom="sm" align="center" justify="space-around" direction="column" wrap="wrap">
                <Box miw={140}>
                  <ArmyStats
                    stats={armyStats}
                  />
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Grid.Col>


        <Grid.Col span={3} p="sm">
          <Stack gap="xs">
          </Stack>
        </Grid.Col>
      </Grid>
    </PlayerCardBox>
  );
}