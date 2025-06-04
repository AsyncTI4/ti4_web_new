import {
  Paper,
  Text,
  Stack,
  Box,
  Image,
  SimpleGrid,
  Group,
} from "@mantine/core";

import { Tech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { UnitCard } from "./PlayerArea/UnitCard";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { HeaderAccent } from "./PlayerArea/HeaderAccent";
import { techs as techsData } from "../data/tech";
import { PlayerData } from "../data/pbd10242";
import { cdnImage } from "../data/cdnImage";
import { units } from "../data/units";

// Helper function to get tech data by ID
const getTechData = (techId: string) => {
  return techsData.find((tech) => tech.alias === techId);
};

// Helper function to get unit async ID
const getUnitAsyncId = (unitId: string) => {
  return units.find((u) => u.id === unitId)?.asyncId;
};

type Props = {
  playerData: PlayerData;
};

export default function TechPlayerCard(props: Props) {
  const { userName, faction, color, techs, unitsOwned } = props.playerData;

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
        filter: props.playerData.passed
          ? "brightness(0.9) saturate(0.4)"
          : "none",
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
        {/* Header Section */}
        <Box
          p="sm"
          mb="lg"
          pos="relative"
          mt={-16}
          ml={-16}
          mr={-8}
          style={{
            borderRadius: 0,
            borderBottomRightRadius: 8,
            background:
              "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 50%, rgba(30, 41, 59, 0.95) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            overflow: "hidden",
            boxShadow:
              "0 4px 16px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(148, 163, 184, 0.15)",
            opacity: props.playerData.passed ? 0.9 : 1,
          }}
        >
          {/* Header bottom border accent */}
          <HeaderAccent color={color} />

          <Group justify="space-between" align="center" wrap="nowrap">
            <Group
              gap={4}
              px={4}
              align="center"
              wrap="nowrap"
              style={{ minWidth: 0 }}
            >
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
                  flexShrink: 0,
                }}
              >
                [{faction}]
              </Text>
              <PlayerColor color={color} size="sm" />
            </Group>
          </Group>
        </Box>

        {/* Main Content */}
        <Stack gap="md">
          {/* Tech Section */}
          <Surface pattern="grid" cornerAccents={true} label="TECH" p="md">
            <Stack gap="xs">
              <SimpleGrid cols={2} spacing="xs">
                <Stack gap={4}>{renderTechColumn("PROPULSION")}</Stack>
                <Stack gap={4}>{renderTechColumn("CYBERNETIC")}</Stack>
              </SimpleGrid>
              <SimpleGrid cols={2} spacing="xs">
                <Stack gap={4}>{renderTechColumn("BIOTIC")}</Stack>
                <Stack gap={4}>{renderTechColumn("WARFARE")}</Stack>
              </SimpleGrid>
            </Stack>
          </Surface>

          {/* Units Section */}
          <Surface p="md" label="UNITS">
            <SimpleGrid cols={6} spacing="8px">
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
            </SimpleGrid>
          </Surface>
        </Stack>
      </Box>

      {/* Faction background image */}
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
