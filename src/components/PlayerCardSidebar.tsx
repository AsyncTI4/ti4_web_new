import { Group, Text, Stack, Box, Image, SimpleGrid } from "@mantine/core";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { Relic } from "./PlayerArea/Relic";
import { Tech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { UnitCard } from "./PlayerArea/UnitCard";
import { CommandTokenCard } from "./PlayerArea/UnitCard/CommandTokenCard";
import { StrategyCardBannerCompact } from "./PlayerArea/StrategyCardBannerCompact";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PromissoryNotesStack } from "./PlayerArea/PromissoryNotesStack";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { CCPool } from "./PlayerArea/CCPool";
import { getTechData } from "../lookup/tech";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { cdnImage } from "../data/cdnImage";
import { StatusIndicator } from "./PlayerArea/StatusIndicator";
import { getUnitAsyncId, isUnitUpgradedOrWarSun } from "@/lookup/units";
import { SC_COLORS, SC_NAMES } from "@/data/strategyCardColors";
import { PlayerCardBox } from "./PlayerCardBox";
import { Nombox } from "./Nombox";
import { DebtTokens } from "./PlayerArea/DebtTokens";
import { getAbility } from "@/lookup/abilities";
import { Ability } from "./PlayerArea/Ability";

type Props = {
  playerData: PlayerData;
  colorToFaction: Record<string, string>;
  factionToColor: Record<string, string>;
  planetAttachments?: Record<string, string[]>;
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
    unitsOwned,
    leaders,

    abilities,
    notResearchedFactionTechs,
  } = props.playerData;

  const scs = props.playerData.scs;
  const promissoryNotes = props.playerData.promissoryNotesInPlayArea || [];
  const exhaustedPlanets = props.playerData.exhaustedPlanets || [];
  const upgradedUnits = unitsOwned.filter(isUnitUpgradedOrWarSun);

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

  const renderTechColumn = (
    techType: string,
    exhaustedTechs: string[] = []
  ) => {
    const filteredTechs = techs.filter((techId) => {
      const techData = getTechData(techId);
      return techData?.types[0] === techType;
    });

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

    return techElements;
  };

  const FragmentsAndCCSection = (
    <Group gap={0} align="stretch">
      <CCPool
        tacticalCC={tacticalCC}
        fleetCC={fleetCC}
        strategicCC={strategicCC}
        mahactEdict={props.playerData.mahactEdict}
      />
      <FragmentsPool fragments={fragments} />
    </Group>
  );

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

      <Group wrap="initial" gap={2} my="xs">
        <Group
          gap={4}
          wrap="nowrap"
          style={{
            overflow: "hidden",
            minWidth: "50%",
            flex: 1,
            flexShrink: 0,
          }}
        >
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

      <Stack gap="md">
        <SimpleGrid cols={2} spacing="xs">
          <Stack gap={8}>
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
          </Stack>
          <Stack gap={8}>
            <Leaders leaders={leaders} />

            {relics.map((relicId, index) => (
              <Relic key={index} relicId={relicId} />
            ))}
            <PromissoryNotesStack
              promissoryNotes={promissoryNotes}
              colorToFaction={props.colorToFaction}
            />
          </Stack>
        </SimpleGrid>

        <Surface pattern="grid" cornerAccents={true} p="md">
          <Stack gap="xs">
            <DynamicTechGrid
              renderTechColumn={renderTechColumn}
              exhaustedTechs={props.playerData.exhaustedTechs}
            />
          </Stack>
        </Surface>

        {/* Units Section - Show command tokens and upgraded units */}
        {(upgradedUnits.length > 0 || props.playerData.ccReinf >= 0) && (
          <Surface p="md">
            <SimpleGrid cols={4} spacing="8px">
              {/* Upgraded Units */}
              {upgradedUnits.map((unitId, index) => {
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

              {/* Command Token Card */}
              {props.playerData.ccReinf !== undefined && (
                <CommandTokenCard
                  color={color}
                  faction={faction}
                  reinforcements={props.playerData.ccReinf}
                  totalCapacity={16}
                />
              )}
            </SimpleGrid>
          </Surface>
        )}

        {/* Resources and Planets Section */}
        <Stack gap="xs">
          <Surface p="md" pattern="circle">
            <Stack gap="sm">
              <ResourceInfluenceCompact planetEconomics={planetEconomics} />
              {props.playerData.debtTokens &&
                Object.keys(props.playerData.debtTokens).length > 0 && (
                  <DebtTokens
                    debts={props.playerData.debtTokens}
                    colorToFaction={props.colorToFaction}
                  />
                )}
            </Stack>
          </Surface>

          <Surface
            p="md"
            pattern="circle"
            cornerAccents={true}
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
          {nombox !== undefined && Object.keys(nombox).length > 0 && (
            <Box mt="md">
              <Nombox
                capturedUnits={nombox || {}}
                factionToColor={props.factionToColor}
              />
            </Box>
          )}
        </Stack>
      </Stack>
    </PlayerCardBox>
  );
}

const getTechTier = (requirements?: string): number => {
  if (!requirements) return 0;

  const matches = requirements.match(/(.)\1*/g);
  if (matches && matches.length > 0) {
    return matches[0].length;
  }

  return 0;
};
