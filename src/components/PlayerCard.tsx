import {
  Group,
  Text,
  Grid,
  Stack,
  Box,
  Image,
  Flex,
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
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { CCPool } from "./PlayerArea/CCPool";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { ArmyStats, PromissoryNote } from "./PlayerArea";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { StatusIndicator } from "./PlayerArea/StatusIndicator";
import { PlayerCardBox } from "./PlayerCardBox";
import { DebtTokens } from "./PlayerArea/DebtTokens";
import { lookupUnit } from "@/lookup/units";
import { Relic } from "./PlayerArea/Relic/Relic";
import FadedDivider from "./shared/primitives/FadedDivider/FadedDivider";
import { Commodities } from "./PlayerArea/Commodities/Commodities";
import { TradeGoods } from "./PlayerArea/TradeGoods/TradeGoods";
import FactionAbilitiesTechs from "./PlayerArea/FactionAbilitiesTechs";
import { Nombox } from "./Nombox";
import { SC_NAMES, SC_COLORS } from "@/lookup/strategyCards";
import { getFactionImage } from "@/lookup/factions";

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

export default function PlayerCard(props: Props) {
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
    factionTechs,
    abilities,
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

  const UnitsArea = (
    <SimpleGrid h="100%" cols={{ base: 4, xl: 6 }} spacing="8px">
      {unitPriorityOrder.map((asyncId) => {
        const bestUnit = lookupUnit(asyncId, faction, props.playerData);
        const deployedCount = unitCounts?.[asyncId]?.deployedCount ?? 0;
        if (!bestUnit) {
          return (
            <UnitCardUnavailable
              key={`unavailable-${asyncId}`}
              asyncId={asyncId}
              color={color}
              lockedLabel="Not available"
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
    <PlayerCardBox
      color={color}
      faction={faction}
      paperProps={{
        style: { height: "100%" },
      }}
    >
      {/* Header Section */}
      <Group justify="space-between" align="center" mb="md">
        <Group gap={8} px={4} align="center">
          <Image
            src={factionUrl}
            alt={faction}
            w={32}
            h={32}
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
          <Box visibleFrom="sm" ml="xs">
            <Neighbors neighbors={neighbors || []} />
          </Box>
        </Group>
        <Box>
          <Group gap="xs" align="center">
            {isSpeaker && <SpeakerToken isVisible />}
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
          </Group>
        </Box>
      </Group>

      <FactionAbilitiesTechs
        abilities={abilities}
        factionTechs={factionTechs}
        notResearchedFactionTechs={notResearchedFactionTechs}
      />

      <Grid gutter="md" columns={12}>
        <Grid.Col
          span={{
            base: 6,
            sm: 4,
          }}
        >
          <Stack gap={6}>
            <Group gap={4}>
              <PlayerCardCounts pnCount={pnCount || 0} acCount={acCount || 0} />

              <CCPool
                tacticalCC={tacticalCC}
                fleetCC={fleetCC}
                strategicCC={strategicCC}
                mahactEdict={mahactEdict}
              />
            </Group>
            <FragmentsPool fragments={fragments} />
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
              <Leaders leaders={leaders} faction={faction} />
            </Box>
            <ScoredSecrets
              secretsScored={secretsScored}
              knownUnscoredSecrets={knownUnscoredSecrets}
              unscoredSecrets={soCount || 0}
            />
          </Stack>
        </Grid.Col>

        <Grid.Col span={4} visibleFrom="sm">
          <Box style={{ minHeight: "175px" }}>
            <Leaders leaders={leaders} faction={faction} />
          </Box>
        </Grid.Col>

        <Grid.Col py={0}>
          <Group gap={4} style={{ minHeight: "30px" }}>
            {relics.map((relicId, index) => {
              const isExhausted = exhaustedRelics?.includes(relicId);
              return (
                <Relic
                  key={index}
                  relicId={relicId}
                  isExhausted={!!isExhausted}
                />
              );
            })}
            {promissoryNotes.map((pn) => (
              <PromissoryNote promissoryNoteId={pn} key={pn} />
            ))}
          </Group>
        </Grid.Col>
        <FadedDivider orientation="horizontal" />

        <Grid.Col
          span={{
            base: 12,
          }}
        >
          <Grid gutter={4}>
            <DynamicTechGrid
              techs={techs}
              layout="grid"
              exhaustedTechs={props.playerData.exhaustedTechs}
              minSlotsPerColor={4}
            />
          </Grid>
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
            <Stack gap={4}>
              <TradeGoods tg={tg || 0} />
              <Commodities
                commodities={commodities || 0}
                commoditiesTotal={commoditiesTotal || 0}
              />
              <Box hiddenFrom="sm">
                <ResourceInfluenceCompact planetEconomics={planetEconomics} />
              </Box>
              <DebtTokens debts={debtTokens!} />
            </Stack>

            <Flex visibleFrom="sm" miw={90}>
              <ResourceInfluenceCompact planetEconomics={planetEconomics} />
            </Flex>

            <Group gap={4} wrap="wrap" flex={1}>
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
            </Group>
          </Group>
        </Grid.Col>
      </Grid>
      {nombox !== undefined && Object.keys(nombox).length > 0 && (
        <Box mt="md">
          <Nombox capturedUnits={nombox || {}} />
        </Box>
      )}
    </PlayerCardBox>
  );
}
