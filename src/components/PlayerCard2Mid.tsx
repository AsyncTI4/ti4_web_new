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
import { memo } from "react";
import { Relic } from "./PlayerArea/Relic";
import { Tech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { UnitCard } from "./PlayerArea/UnitCard";
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
import { techs as techsData } from "../data/tech";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { cdnImage } from "../data/cdnImage";
import { units } from "../data/units";
import { ArmyStats } from "./PlayerArea";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { StrategyCardBannerCompact } from "./PlayerArea/StrategyCardBannerCompact";
import { StatusIndicator } from "./PlayerArea/StatusIndicator";
// Removed calculatePlanetEconomics import - now using pre-calculated values
import { PlayerCardBox } from "./PlayerCardBox";
import { getTokenImagePath } from "../data/tokens";

// Helper function to get tech data by ID
const getTechData = (techId: string) => {
  return techsData.find((tech) => tech.alias === techId);
};

// Helper function to get tier from requirements
const getTechTier = (requirements?: string): number => {
  if (!requirements) return 0;

  // Count the number of same letters (e.g., "BB" = 2, "BBB" = 3)
  const matches = requirements.match(/(.)\1*/g);
  if (matches && matches.length > 0) {
    return matches[0].length;
  }

  return 0;
};

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
  factionToColor: Record<string, string>;
  colorToFaction: Record<string, string>;
  planetAttachments?: Record<string, string[]>;
};

export default memo(function PlayerCard2Mid(props: Props) {
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
    unitsOwned,
    leaders,
    scs = [],
    promissoryNotesInPlayArea = [],
    exhaustedPlanets = [],
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
    <Surface
      h="100%"
      p="md"
      w={{ base: "100%", sm: "fit-content" }}
      style={{
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      <SimpleGrid h="100%" cols={{ base: 4, xl: 6 }} spacing="8px">
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

        {/* Add StasisInfantryCard if there are any stasisInfantry */}
        {stasisInfantry > 0 && (
          <StasisInfantryCard reviveCount={stasisInfantry} color={color} />
        )}
      </SimpleGrid>
    </Surface>
  );

  const RelicStack = (
    <Stack gap={4} w={{ base: "100%" }}>
      {relics.map((relicId, index) => (
        <Relic key={index} relicId={relicId} />
      ))}
    </Stack>
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
  const renderTechColumn = (techType: string) => {
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
      <Tech key={index} techId={techId} />
    ));

    return [...techElements];
  };

  const FragmentsAndCCSection = (
    <Group gap={0} align="stretch">
      {/* T/F/S Section - harmonized with Surface component styling */}
      <CCPool
        tacticalCC={tacticalCC}
        fleetCC={fleetCC}
        strategicCC={strategicCC}
      />
      {/* Fragments Section - harmonized with Surface component styling */}
      <FragmentsPool fragments={fragments} />
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
          <Text
            size="md"
            span
            ml={4}
            opacity={0.9}
            c="white"
            ff="heading"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            }}
          >
            [{faction}]
          </Text>
          <PlayerColor color={color} size="sm" />

          <StatusIndicator passed={passed} active={active} />
          <Box visibleFrom="sm">
            <Neighbors
              neighbors={neighbors || []}
              colorToFaction={props.colorToFaction}
            />
          </Box>
        </Group>
        <Box visibleFrom="sm">{StrategyAndSpeaker}</Box>
      </Group>
      <Grid gutter="md" columns={12}>
        <Grid.Col
          span={{
            base: 6,
            sm: 3,
          }}
          hiddenFrom="lg"
        >
          <Stack gap={6}>
            <Box hiddenFrom="sm" w="100%">
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
            </Box>

            <PlayerCardCounts
              tg={tg || 0}
              commodities={commodities || 0}
              commoditiesTotal={commoditiesTotal || 0}
              soCount={soCount || 0}
              pnCount={pnCount || 0}
              acCount={acCount || 0}
            />
            <Box hiddenFrom="sm">
              <Neighbors
                neighbors={neighbors || []}
                colorToFaction={props.colorToFaction}
              />
            </Box>
          </Stack>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 6,
            sm: 3,
          }}
          hiddenFrom="lg"
        >
          <Leaders leaders={leaders} />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 6,
            sm: 3,
          }}
          hiddenFrom="lg"
        >
          <ScoredSecrets secretsScored={secretsScored} />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 6,
            sm: 3,
          }}
          hiddenFrom="lg"
        >
          <Stack gap={4}>
            <PromissoryNotesStack
              promissoryNotes={promissoryNotes}
              colorToFaction={props.colorToFaction}
            />
            {RelicStack}
          </Stack>
        </Grid.Col>

        <Grid.Col hiddenFrom="lg" span={12}>
          {FragmentsAndCCSection}
        </Grid.Col>

        <Grid.Col span={2} visibleFrom="lg">
          <Stack h="100%">
            <PlayerCardCounts
              tg={tg || 0}
              commodities={commodities || 0}
              commoditiesTotal={commoditiesTotal || 0}
              soCount={soCount || 0}
              pnCount={pnCount || 0}
              acCount={acCount || 0}
            />
            {FragmentsAndCCSection}
            <ScoredSecrets secretsScored={secretsScored} />
            <PromissoryNotesStack
              promissoryNotes={promissoryNotes}
              colorToFaction={props.colorToFaction}
            />
            {RelicStack}
            {/* Needs to Follow Section */}
            <NeedsToFollow values={unfollowedSCs || []} />
          </Stack>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            lg: 10,
          }}
        >
          <Grid gutter="xs">
            <Grid.Col
              span={{
                base: 12,
                lg: 9,
              }}
            >
              <Group gap={0} h="100%">
                <Surface
                  flex={1}
                  pattern="grid"
                  cornerAccents={true}
                  label="TECH"
                  p="md"
                  h="100%"
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                >
                  <Stack>
                    <Grid gutter={4}>
                      <DynamicTechGrid
                        renderTechColumn={renderTechColumn}
                        layout="grid"
                      />
                    </Grid>
                  </Stack>
                </Surface>

                <Box h="100%" visibleFrom="sm">
                  {UnitsArea}
                </Box>
              </Group>
            </Grid.Col>
            <Grid.Col span={3} visibleFrom="lg">
              <Leaders leaders={leaders} />
            </Grid.Col>
            <Grid.Col span={12} hiddenFrom="sm">
              {UnitsArea}
            </Grid.Col>

            <Grid.Col
              span={{
                base: 9,
              }}
            >
              <Surface p="xs" pattern="none" h="100%">
                <Stack>
                  {/* Total/Optimal Section */}
                  <ResourceInfluenceCompact
                    planetEconomics={planetEconomics}
                    debts={debtTokens}
                  />

                  {/* Debt Section */}
                  {/* <DebtTokens debts={debts} /> */}
                </Stack>
              </Surface>
            </Grid.Col>
            <Grid.Col
              span={{
                base: 12,
                sm: 9,
              }}
            >
              <Group h="100%">
                <Surface
                  p="md"
                  pattern="circle"
                  cornerAccents={true}
                  label="Planets"
                  flex={1}
                  h="100%"
                  style={{
                    alignItems: "flex-start",
                  }}
                >
                  <Group gap="xs" pos="relative" style={{ zIndex: 1 }}>
                    {planets.map((planetId, index) => (
                      <PlanetCard
                        key={index}
                        planetId={planetId}
                        exhausted={exhaustedPlanets.includes(planetId)}
                        attachments={props.planetAttachments?.[planetId] || []}
                      />
                    ))}
                  </Group>
                </Surface>
              </Group>
            </Grid.Col>
            <Grid.Col span={3} p="sm">
              <Stack gap="xs">
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
          </Grid>
        </Grid.Col>

        {/* Full-width Nombox at the bottom */}
        <Grid.Col span={12}>
          <Nombox
            capturedUnits={nombox || {}}
            factionToColor={props.factionToColor}
          />
        </Grid.Col>
      </Grid>
    </PlayerCardBox>
  );
});

const getUnitAsyncId = (unitId: string) => {
  return units.find((u) => u.id === unitId)?.asyncId;
};
