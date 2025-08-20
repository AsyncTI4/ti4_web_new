import {
  Group,
  Text,
  Grid,
  Stack,
  Box,
  Image,
  SimpleGrid,
  Flex,
  Divider,
} from "@mantine/core";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { Relic } from "./PlayerArea/Relic";
import { Tech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
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
import { getTechData, getTechTier } from "../lookup/tech";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { cdnImage } from "../data/cdnImage";
import { ArmyStats } from "./PlayerArea";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { StrategyCardBannerCompact } from "./PlayerArea/StrategyCardBannerCompact";
import { StatusIndicator } from "./PlayerArea/StatusIndicator";
import { PlayerCardBox } from "./PlayerCardBox";
import { getTokenImagePath } from "@/lookup/tokens";
import { DebtTokens } from "./PlayerArea/DebtTokens";
import { getUnitAsyncId } from "@/lookup/units";
import { getPlanetData } from "@/lookup/planets";
import { Relics } from "./PlayerArea/Relic/Relic";
import { Cardback } from "./PlayerArea/Cardback";
import { TradeGoodsCommodities } from "./PlayerArea/TradeGoodsCommodities/TradeGoodsCommodities";

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
  const newdebtTokens = { "mentak": 2, "cabal": 1, };
  const newGhostWormholesReinf = ["000"];
  const newSleeperTokensReinf = 2;

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

  // Create planet economics object from pre-calculated values
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
    <Flex wrap={"wrap"} justify={"center"} columnGap={16} rowGap={4}>
      <Group gap={4}>
        {props.playerData.ccReinf !== undefined && (
          <CommandTokenCard
            color={color}
            faction={faction}
            reinforcements={props.playerData.ccReinf}
            totalCapacity={16}
          />
        )}
      </Group>
      <Group gap={0}>
        {groundArray}
        <StasisInfantryCard reviveCount={stasisInfantry} color={color} />
      </Group>

      <Group gap={0}>
        {structureArray}
      </Group>
      <Flex wrap={"wrap"} justify={"center"} align={"center"} gap={0}>
        {spaceArray}
      </Flex>

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

  // Helper function to render techs with phantom slots
  const renderTechColumn = (
    techType: string,
    exhaustedTechs: string[] = []
  ) => {
    const filteredTechs = techs.filter((techId) => {
      const techData = getTechData(techId);
      return techData?.types[0] === techType;
    });

    // Sort techs by tier (lower tier first)
    const sortedTechs = filteredTechs.sort((a, b) => {
      const techDataA = getTechData(a);
      const techDataB = getTechData(b);
      const tierA = techDataA ? getTechTier(techDataA.requirements) : 999;
      const tierB = techDataB ? getTechTier(techDataB.requirements) : 999;
      return tierA - tierB;
    });

    const techElements = sortedTechs.map((techId, index) => (
      <Tech
        key={index}
        techId={techId}
        isExhausted={exhaustedTechs.includes(techId)}
      />
    ));

    return [...techElements];
  };


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
      <Grid gutter="md" columns={12}>
        <Grid.Col
          span={{
            base: 6,
            sm: 4
          }}
        >
          <Stack gap={6}>
            <Group>
              <PlayerCardCounts
                pnCount={pnCount || 0}
                acCount={acCount || 0}
              />
              <CCPool tacticalCC={tacticalCC} fleetCC={fleetCC} strategicCC={strategicCC} mahactEdict={mahactEdict} />
            </Group>
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
            <ScoredSecrets
              secretsScored={secretsScored}
              knownUnscoredSecrets={knownUnscoredSecrets}
              unscoredSecrets={soCount || 0}
            />
            <PromissoryNotesStack promissoryNotes={promissoryNotes} />
          </Stack>
        </Grid.Col>

        <Grid.Col
          span={{
            base: 6,
            sm: 4
          }}
        >
          <Leaders leaders={leaders} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12
          }}
        >
          <Divider my={0} />
          <Grid.Col
            span={{
              base: 12
            }}
          >
            <Flex justify={"center"}>
              <Flex direction={"column"} gap={20}>
                <Flex flex={1} justify={"space-between"}>
                  <Flex flex={1} align={"center"} justify={"space-around"} direction={"column"} wrap={"wrap"}>

                    <Box miw={100}>
                      <ArmyStats
                        stats={{
                          spaceArmyRes,
                          groundArmyRes,
                          spaceArmyHealth,
                          groundArmyHealth,
                          spaceArmyCombat,
                          groundArmyCombat,
                        }}
                      />
                    </Box>
                  </Flex>
                  <Flex wrap={"wrap"}>
                    {UnitsArea}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Grid.Col>

          <Divider my={0} />

          <Grid.Col
            span={{
              base: 12
            }}
          >
            <Grid gutter={4}>
              <DynamicTechGrid
                renderTechColumn={renderTechColumn}
                layout="grid"
                exhaustedTechs={props.playerData.exhaustedTechs}
              />
            </Grid>
          </Grid.Col>

          <Divider my={0} />
          <Grid.Col
            span={{
              base: 12
            }}
          >
            <Group>
              <Flex align={"center"}>
                <Flex gap={8} align={"flex-start"} miw={100}>



                  <TradeGoodsCommodities
                    tg={tg || 0}
                    commodities={commodities || 0}
                    commoditiesTotal={commoditiesTotal || 0} />


                  
                  <ResourceInfluenceCompact planetEconomics={planetEconomics} />

                  <DebtTokens debts={newdebtTokens} />

                </Flex>
                <Flex justify={"flex-start"} gap={8} wrap={"wrap"}>
                  {planets.map((planetId, index) => {
                    const planetData = getPlanetData(planetId);
                    const hasLegendaryAbility =
                      planetData?.legendaryAbilityName &&
                      planetData?.legendaryAbilityText;

                    return (
                      <div
                        key={index}
                        style={{ display: "flex", gap: "4px" }}
                      >
                        <PlanetCard planetId={planetId} />
                        {hasLegendaryAbility && (
                          <PlanetAbilityCard
                            planetId={planetId}
                            abilityName={planetData.legendaryAbilityName!}
                            abilityText={planetData.legendaryAbilityText!}
                            exhausted={exhaustedPlanetAbilities.includes(
                              planetId
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </Flex>
              </Flex>
            </Group>
            {nombox !== undefined && Object.keys(nombox).length > 0 && (
              <Box mt="md">
                <Nombox capturedUnits={nombox || {}} />
              </Box>
            )}
          </Grid.Col>
          <Grid.Col span={3} p="sm">
            <Stack gap="xs">

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
            </Stack>
          </Grid.Col>
        </Grid.Col>
      </Grid>
    </PlayerCardBox>
  );
}
