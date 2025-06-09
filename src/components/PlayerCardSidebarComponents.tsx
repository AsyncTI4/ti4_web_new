import {
  Paper,
  Group,
  Text,
  Stack,
  Box,
  Image,
  SimpleGrid,
} from "@mantine/core";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { Relic } from "./PlayerArea/Relic";
import { Tech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { UnitCard } from "./PlayerArea/UnitCard";
import { StrategyCardBannerCompact } from "./PlayerArea/StrategyCardBannerCompact";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PromissoryNotesStack } from "./PlayerArea/PromissoryNotesStack";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { PlayerCardHeader } from "./PlayerArea/PlayerCardHeader";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { CCPool } from "./PlayerArea/CCPool";
import { techs as techsData } from "../data/tech";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { cdnImage } from "../data/cdnImage";
import { StatusIndicator } from "./PlayerArea/StatusIndicator";
import { getUnitAsyncId, isUnitUpgraded } from "@/lookup/units";
import { calculatePlanetEconomics } from "@/lookup/planets";
import { SC_COLORS, SC_NAMES } from "@/data/strategyCardColors";

// Helper function to get tech data by ID
const getTechData = (techId: string) => {
  return techsData.find((tech) => tech.alias === techId);
};

type Props = {
  playerData: PlayerData;
  colorToFaction: Record<string, string>;
  factionToColor: Record<string, string>;
};

export default function PlayerCardSidebarComponents(props: Props) {
  const {
    userName,
    faction,
    color,
    tacticalCC,
    fleetCC,
    strategicCC,
    fragments,
    isSpeaker,

    techs,
    relics,
    planets,
    secretsScored,
    unitsOwned,
    leaders,
  } = props.playerData;
  const scs = props.playerData.scs;
  const promissoryNotes = props.playerData.promissoryNotesInPlayArea || [];
  const exhaustedPlanets = props.playerData.exhaustedPlanets || [];
  const upgradedUnits = unitsOwned.filter(isUnitUpgraded);
  const planetEconomics = calculatePlanetEconomics(planets, exhaustedPlanets);

  const renderTechColumn = (techType: string) => {
    const filteredTechs = techs.filter((techId) => {
      const techData = getTechData(techId);
      return techData?.types[0] === techType;
    });

    const techElements = filteredTechs.map((techId, index) => (
      <Tech key={index} techId={techId} />
    ));

    return techElements;
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
    <Paper
      p="sm"
      m={5}
      pos="relative"
      style={{
        maxWidth: "100%",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        overflow: "hidden",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)",
      }}
      radius="md"
    >
      {/* Subtle inner glow */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(148, 163, 184, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box pos="relative" style={{ zIndex: 1 }}>
        <Group
          gap={4}
          px={4}
          w="100%"
          align="center"
          wrap="nowrap"
          justify="space-between"
          style={{ minWidth: 0 }}
          mb="md"
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
              {" "}
              {/* Color has highest priority for truncation/hiding */}
              <PlayerColor color={color} size="sm" />
            </Box>
          </Group>
        </Group>

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
            {/* Fragments and CC Section */}
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
      </Box>

      {/* Faction background image - harmonized with consistent opacity and positioning */}
      <Box
        pos="absolute"
        bottom={-60}
        right={-40}
        opacity={0.05}
        h={250}
        style={{
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          filter: "grayscale(0.2)",
        }}
      >
        <Image
          src={cdnImage(`/factions/${faction}.png`)}
          alt="faction"
          w="100%"
          h="100%"
          style={{ objectFit: "contain" }}
        />
      </Box>
    </Paper>
  );
}
