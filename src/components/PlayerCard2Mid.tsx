import {
  Group,
  Text,
  Grid,
  Stack,
  Box,
  Image,
  SimpleGrid,
  Flex,
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
  const newdebtTokens = { "mentak": 2, "cabal": 1 };

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
    <Flex h="100%" justify="center" gap="2px">
      {unitsOwned.map((unitId, index) => {
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
      })}

      {stasisInfantry > 0 && (
        <StasisInfantryCard reviveCount={stasisInfantry} color={color} />
      )}
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
            <Group gap={8}>
            <Text
              size="xs"
              span
              ml={4}
              opacity={0.9}
              c="white"
              ff="text"
              fs="italic"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {faction}
            </Text>
            <PlayerColor color={color} size="xs" />
            </Group>
          </Stack>

          <StatusIndicator passed={passed} active={active} />
          <Box visibleFrom="sm">
            <Neighbors neighbors={neighbors || []} />
          </Box>
        </Group>
        <Box>{StrategyAndSpeaker}</Box>
      </Group>
      <Grid gutter="md" columns={12}>
        <Grid.Col
          span={{
            base: 4,
            sm: 2
          }}
        >
          <Stack gap={6}>
            {/* <Box hiddenFrom="sm" w="100%">
              <Stack gap="xs" align="center">
                {scs.map((scNumber, index) => {
                  const isExhausted = exhaustedSCs?.includes(scNumber);
                  return (
                    <StrategyCardBannerCompact
                      key={scNumber}
                      number={scNumber}
                      text={SC_NAMES[scNumber as keyof typeof SC_NAMES]}
                      color={SC_COLORS[scNumber as keyof typeof SC_COLORS]}
                      isSpeaker={index === 0 && isSpeaker} // Only show speaker on first card
                      isExhausted={isExhausted}
                    />
                  );
                })}
              </Stack>
            </Box> */}

            {/* <Box hiddenFrom="sm">
              <Neighbors neighbors={neighbors || []} />
            </Box> */}
            <PlayerCardCounts
              tg={tg || 0}
              commodities={commodities || 0}
              commoditiesTotal={commoditiesTotal || 0}
              pnCount={pnCount || 0}
              acCount={acCount || 0}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{
            base: 4,
            sm: 1
          }}>
          <Group gap={0} align="stretch">

            <Stack
              gap={2}
              align="center"
              justify="center"
              pos="relative"
              h="100%"
              style={{ zIndex: 1 }}
            >
              {props.playerData.ccReinf !== undefined && (
                <CommandTokenCard
                  color={color}
                  faction={faction}
                  reinforcements={props.playerData.ccReinf}
                  totalCapacity={16}
                />
              )}
              <Text
                ff="mono"
                size="lg"
                fw={600}
                c="white"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {tacticalCC}/{fleetCC + mahactEdict.length}
                {mahactEdict.length > 0 ? "*" : ""}/{strategicCC}
              </Text>
              <Surface p="xs"
                label="DEBT"
                labelColor="orange.6" pattern="none" cornerAccents={true} h="100%">
                <Stack>
                  {newdebtTokens && Object.keys(newdebtTokens).length > 0 && (
                    <DebtTokens debts={newdebtTokens} />
                  )}
                </Stack>
              </Surface>
            </Stack>

          </Group>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 4,
            sm: 2
          }}
        >
          <Stack gap={4} w={{ base: "100%" }}>
            <FragmentsPool fragments={fragments} />
            {relics.map((relicId, index) => (
              <Relic key={index} relicId={relicId} />
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 6,
            sm: 3
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
            sm: 3
          }}
        >
          <Leaders leaders={leaders} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12
          }}
        >
          <Grid.Col
            span={{
              base: 12
            }}
          >
            <Group gap={0} h="100%">
              <Surface
                flex={1}
                pattern="grid"
                p="md"
                h="100%"
              >
                <Stack>
                  <Grid gutter={4}>
                    <DynamicTechGrid
                      renderTechColumn={renderTechColumn}
                      layout="grid"
                      exhaustedTechs={props.playerData.exhaustedTechs}
                    />
                  </Grid>
                  <Box h="100%">
                    {UnitsArea}
                  </Box>
                </Stack>
              </Surface>
            </Group>
          </Grid.Col>

          <Grid.Col
            span={{
              base: 12
            }}
          >
            <Group>
              <Surface
                p="md"
                pattern="circle"
                label="Planets"
                flex={1}
                h="100%"
                style={{
                  alignItems: "flex-start",
                }}
              >
                <Group gap="xs" pos="relative" style={{ zIndex: 1 }}>
                  <ResourceInfluenceCompact planetEconomics={planetEconomics} />
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
                  <Box pos={"absolute"} miw={140} right={"0px"}>
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
                </Group>
              </Surface>
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
