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
import { calculatePlanetEconomics } from "@/lookup/planets";
import { PlayerCardBox } from "./PlayerCardBox";

// Helper function to get tech data by ID
const getTechData = (techId: string) => {
  return techsData.find((tech) => tech.alias === techId);
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
  } = props.playerData;
  const scs = props.playerData.scs || [];
  const promissoryNotes = props.playerData.promissoryNotesInPlayArea || [];
  const exhaustedPlanets = props.playerData.exhaustedPlanets || [];
  const planetEconomics = calculatePlanetEconomics(planets, exhaustedPlanets);

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
            ? (props.playerData.unitCounts[asyncId].deployedCount ?? 0)
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
        {props.playerData.stasisInfantry > 0 && (
          <StasisInfantryCard
            reviveCount={props.playerData.stasisInfantry}
            color={color}
          />
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
      {scs.map((scNumber, index) => (
        <StrategyCardBanner
          key={scNumber}
          number={scNumber}
          text={SC_NAMES[scNumber as keyof typeof SC_NAMES]}
          color={SC_COLORS[scNumber as keyof typeof SC_COLORS]}
          isSpeaker={index === 0 && isSpeaker} // Only show speaker on first card
        />
      ))}
    </Group>
  );

  // Helper function to render techs with phantom slots
  const renderTechColumn = (techType: string) => {
    const filteredTechs = techs.filter((techId) => {
      const techData = getTechData(techId);
      return techData?.types[0] === techType;
    });

    const techElements = filteredTechs.map((techId, index) => (
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

          <StatusIndicator
            passed={props.playerData.passed}
            active={props.playerData.active}
          />
          <Box visibleFrom="sm">
            <Neighbors
              neighbors={props.playerData.neighbors || []}
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
                {scs.map((scNumber, index) => (
                  <StrategyCardBannerCompact
                    key={scNumber}
                    number={scNumber}
                    text={SC_NAMES[scNumber as keyof typeof SC_NAMES]}
                    color={SC_COLORS[scNumber as keyof typeof SC_COLORS]}
                    isSpeaker={index === 0 && isSpeaker} // Only show speaker on first card
                  />
                ))}
              </Stack>
            </Box>

            <PlayerCardCounts
              tg={props.playerData.tg || 0}
              commodities={props.playerData.commodities || 0}
              commoditiesTotal={props.playerData.commoditiesTotal || 0}
              soCount={props.playerData.soCount || 0}
              pnCount={props.playerData.pnCount || 0}
              acCount={props.playerData.acCount || 0}
            />
            <Box hiddenFrom="sm">
              <Neighbors
                neighbors={props.playerData.neighbors || []}
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
              tg={props.playerData.tg || 0}
              commodities={props.playerData.commodities || 0}
              commoditiesTotal={props.playerData.commoditiesTotal || 0}
              soCount={props.playerData.soCount || 0}
              pnCount={props.playerData.pnCount || 0}
              acCount={props.playerData.acCount || 0}
            />
            {FragmentsAndCCSection}
            <ScoredSecrets secretsScored={secretsScored} />
            <PromissoryNotesStack
              promissoryNotes={promissoryNotes}
              colorToFaction={props.colorToFaction}
            />
            {/* Needs to Follow Section */}
            <NeedsToFollow values={props.playerData.unfollowedSCs || []} />
            {RelicStack}
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
                    debts={props.playerData.debtTokens}
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
                      />
                    ))}
                  </Group>
                </Surface>
              </Group>
            </Grid.Col>
            <Grid.Col span={3} p="sm">
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
            </Grid.Col>
          </Grid>
        </Grid.Col>

        {/* Full-width Nombox at the bottom */}
        <Grid.Col span={12}>
          <Nombox
            capturedUnits={props.playerData.nombox || {}}
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
