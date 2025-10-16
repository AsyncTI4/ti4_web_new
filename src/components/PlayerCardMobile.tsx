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
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { CCPool } from "./PlayerArea/CCPool";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { ArmyStats, PromissoryNote, Tech } from "./PlayerArea";
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
import { getAbility } from "@/lookup/abilities";
import { Ability } from "./PlayerArea/Ability";
import Caption from "./shared/Caption/Caption";

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
    <SimpleGrid h="100%" cols={6} spacing="8px">
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

  const researchedFactionTechs = factionTechs?.filter(
    (techId) => !notResearchedFactionTechs.includes(techId)
  );

  return (
    <PlayerCardBox color={color} faction={faction}>
      <Group gap="md" px={4} align="center">
        <Image
          src={factionUrl}
          alt={faction}
          w={32}
          h={32}
          style={{
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
          }}
        />
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
      <Group gap="xs" wrap="wrap" align="center" mb="lg" mt="xs">
        <Stack gap={4}>
          <Caption size="xs">Abilities</Caption>
          <Group gap={2}>
            {abilities?.map((abilityId, index) => {
              const abilityData = getAbility(abilityId);
              if (!abilityData) return;
              return <Ability id={abilityId} key={index} />;
            })}
          </Group>
        </Stack>

        <Stack gap={4}>
          <Caption size="xs">Faction Techs</Caption>
          <Group gap={2}>
            {researchedFactionTechs?.map((techId, index) => (
              <Tech techId={techId} key={index} />
            ))}
            {notResearchedFactionTechs?.length > 0 &&
              notResearchedFactionTechs.map((techId) => (
                <Tech techId={techId} key={techId} />
              ))}
          </Group>
        </Stack>
      </Group>

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
            <PlayerCardCounts pnCount={pnCount || 0} acCount={acCount || 0} />
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

        <Grid.Col span={14}>
          <Group align="flex-start">
            <ResourceInfluenceCompact planetEconomics={planetEconomics} />
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

        <Grid.Col span={24}>
          <Group gap={4}>
            <ScoredSecrets
              secretsScored={secretsScored}
              knownUnscoredSecrets={knownUnscoredSecrets}
              unscoredSecrets={soCount || 0}
              horizontal
            />
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

        <Grid.Col span={24}>
          <Group gap="xs" align="flex-start">
            <DynamicTechGrid
              techs={techs}
              layout="grid"
              exhaustedTechs={props.playerData.exhaustedTechs}
              minSlotsPerColor={4}
              mobile
            />

            {UnitsArea}
            {nombox !== undefined && Object.keys(nombox).length > 0 && (
              <div style={{ minWidth: "200px" }}>
                <Nombox capturedUnits={nombox || {}} />
              </div>
            )}
          </Group>
        </Grid.Col>
      </Grid>

      <Box
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <ArmyStats stats={armyStats} />
      </Box>
    </PlayerCardBox>
  );
}
