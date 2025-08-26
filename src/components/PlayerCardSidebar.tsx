import { Group, Text, Stack, Box, Image, SimpleGrid } from "@mantine/core";
import softStyles from "./PlayerCardSidebar.module.css";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { Relic } from "./PlayerArea/Relic";
import { Tech } from "./PlayerArea/Tech";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { UnitCard, UnitCardUnavailable } from "./PlayerArea/UnitCard";
import { CommandTokenCard } from "./PlayerArea/UnitCard/CommandTokenCard";
import { StrategyCardBannerCompact } from "./PlayerArea/StrategyCardBannerCompact";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PromissoryNotesStack } from "./PlayerArea/PromissoryNotesStack";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { CCPool } from "./PlayerArea/CCPool";
// import { getTechData } from "../lookup/tech";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { cdnImage } from "../data/cdnImage";
import { StatusIndicator } from "./PlayerArea/StatusIndicator";
import { lookupUnit } from "@/lookup/units";
import { SC_COLORS, SC_NAMES } from "@/data/strategyCardColors";
import { PlayerCardBox } from "./PlayerCardBox";
import { Nombox } from "./Nombox";
import { DebtTokens } from "./PlayerArea/DebtTokens";
import { getAbility } from "@/lookup/abilities";
import { Ability } from "./PlayerArea/Ability";
// import { getPlanetData } from "@/lookup/planets";
import { StasisInfantryCard } from "./PlayerArea/StasisInfantryCard";
import { TradeGoods } from "./PlayerArea/TradeGoods/TradeGoods";
import { Commodities } from "./PlayerArea/Commodities/Commodities";

type Props = {
  playerData: PlayerData;
};

export default function PlayerCardSidebar(props: Props) {
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
    // unitsOwned,
    leaders,
    stasisInfantry,
    unitCounts,
    abilities,
    notResearchedFactionTechs,
  } = props.playerData;

  const scs = props.playerData.scs;
  const promissoryNotes = props.playerData.promissoryNotesInPlayArea || [];
  const exhaustedPlanetAbilities =
    props.playerData.exhaustedPlanetAbilities || [];
  // const upgradedUnits = unitsOwned.filter(isUnitUpgradedOrWarSun);

  // Create planet economics object from pre-calculated values
  const planetEconomics = {
    total: {
      currentResources: props.playerData.resources,
      totalResources: props.playerData.totResources,
      currentInfluence: props.playerData.influence,
      totalInfluence: props.playerData.totInfluence,
    },
    optimal: {
      currentResources: props.playerData.optimalResources,
      totalResources: props.playerData.totOptimalResources,
      currentInfluence: props.playerData.optimalInfluence,
      totalInfluence: props.playerData.totOptimalInfluence,
    },
    flex: {
      currentFlex: props.playerData.flexValue,
      totalFlex: props.playerData.totFlexValue,
    },
  };

  // const FragmentsAndCCSection = <Group gap={0} align="stretch"></Group>;

  const unitPriorityOrder = [
    "ws",
    "fs",
    "dn",
    "cv",
    "ca",
    "dd",
    "ff",
    "mf",
    "gf",
    "sd",
    "pd",
  ];

  return (
    <PlayerCardBox color={color} faction={faction}>
      <Group
        gap={4}
        px={4}
        w="100%"
        align="center"
        wrap="nowrap"
        justify="space-between"
        style={{ minWidth: 0 }}
      >
        <Group gap={4} style={{ minWidth: 0, flex: 1 }}>
          {/* Small circular faction icon */}
          <Image
            src={cdnImage(`/factions/${faction}.png`)}
            alt={faction}
            w={24}
            h={24}
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
              flexShrink: 0,
            }}
          />
          <Text
            span
            c="white"
            size="sm"
            ff="heading"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              flexShrink: 0, // Username has lowest priority for truncation
              minWidth: 0,
            }}
          >
            {userName}
          </Text>
          <Text
            size="xs"
            span
            ml={4}
            opacity={0.9}
            c="white"
            ff="heading"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              flexShrink: 1, // Faction has medium priority for truncation
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            [{faction}]
          </Text>
          <Box style={{ flexShrink: 2 }}>
            <PlayerColor color={color} size="sm" />
          </Box>

          <StatusIndicator
            passed={props.playerData.passed}
            active={props.playerData.active}
          />
        </Group>

        <Group gap={8} style={{ flexShrink: 0 }}>
          {scs.map((scNumber, index) => {
            const isExhausted =
              props.playerData.exhaustedSCs?.includes(scNumber);
            return (
              <StrategyCardBannerCompact
                key={scNumber}
                number={scNumber}
                text={SC_NAMES[scNumber]}
                color={SC_COLORS[scNumber]}
                isSpeaker={index === 0 && isSpeaker} // Only show speaker on first card
                isExhausted={isExhausted}
              />
            );
          })}
        </Group>
      </Group>

      {/* Abilities + Unresearched Faction Tech (moved above Tech) */}
      <Group wrap="initial" gap={2} mb="md" mt="xs">
        <Group gap={4}>
          {abilities?.map((abilityId, index) => {
            const abilityData = getAbility(abilityId);
            if (!abilityData) {
              console.log("Could not find ability", abilityId);
            }
            if (!abilityData) return null;

            return (
              <Box
                key={index}
                style={{
                  flexShrink: 1,
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <Ability id={abilityId} />
              </Box>
            );
          })}
        </Group>
        <div style={{ flex: 1 }} />

        {notResearchedFactionTechs?.length > 0 && (
          <Group gap={2} style={{ flexShrink: 1 }}>
            {notResearchedFactionTechs.map((techId, index) => (
              <Box
                key={index}
                style={{
                  filter: "grayscale(0.5)",
                }}
              >
                <Tech techId={techId} />
              </Box>
            ))}
          </Group>
        )}
      </Group>

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
              <Leaders leaders={leaders} />
            </Box>
            {relics.map((relicId, index) => (
              <Relic key={index} relicId={relicId} />
            ))}
            <Box mt={2}>
              <PromissoryNotesStack promissoryNotes={promissoryNotes} />
            </Box>
          </Stack>
        </SimpleGrid>

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
            {planets.map((planetId, index) => (
              <PlanetCard
                key={index}
                planetId={planetId}
                legendaryAbilityExhausted={exhaustedPlanetAbilities.includes(
                  planetId
                )}
              />
            ))}
          </Group>
          <Box className={softStyles.softDividerTight} />
        </Stack>
        <Box p="md" className={softStyles.sectionBlock}>
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

            {props.playerData.ccReinf !== undefined && (
              <CommandTokenCard
                color={color}
                faction={faction}
                reinforcements={props.playerData.ccReinf}
                totalCapacity={16}
              />
            )}

            {stasisInfantry > 0 && (
              <StasisInfantryCard reviveCount={stasisInfantry} color={color} />
            )}
          </SimpleGrid>
        </Box>

        {nombox !== undefined && Object.keys(nombox).length > 0 && (
          <Box mt="md">
            <Nombox capturedUnits={nombox || {}} />
          </Box>
        )}
      </Stack>
    </PlayerCardBox>
  );
}
