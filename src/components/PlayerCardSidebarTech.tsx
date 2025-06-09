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
import { Tech } from "./PlayerArea/Tech";
import { Surface } from "./PlayerArea/Surface";
import { UnitCard } from "./PlayerArea/UnitCard";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { techs as techsData } from "../data/tech";
import { PlayerData } from "../data/types";
import { cdnImage } from "../data/cdnImage";
import { getUnitAsyncId, isUnitUpgraded } from "@/lookup/units";

type Props = {
  playerData: PlayerData;
  colorToFaction: Record<string, string>;
  factionToColor: Record<string, string>;
};

export default function PlayerCardSidebarTech(props: Props) {
  const { userName, faction, color, techs, unitsOwned } = props.playerData;
  const upgradedUnits = unitsOwned.filter(isUnitUpgraded);
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
      }}
      radius="md"
    >
      <Box pos="relative" style={{ zIndex: 1 }}>
        <Group gap={4} style={{ minWidth: 0, flex: 1 }} mb="sm">
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
        </Group>

        <Stack gap="md">
          <Surface pattern="grid" cornerAccents={true} label="TECH" p="md">
            <Stack gap="xs">
              <DynamicTechGrid renderTechColumn={renderTechColumn} />
            </Stack>
          </Surface>

          {/* Units Section - Only show upgraded units */}
          {upgradedUnits.length > 0 && (
            <Surface p="md" label="UPGRADED UNITS">
              <SimpleGrid cols={4} spacing="8px">
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
              </SimpleGrid>
            </Surface>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}

const getTechData = (techId: string) => {
  return techsData.find((tech) => tech.alias === techId);
};
