import { Group, Text, Stack, Box, Image, SimpleGrid } from "@mantine/core";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { UnitCard } from "./PlayerArea/UnitCard";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { PlayerCardBox } from "./PlayerCardBox";
import { PlayerData } from "../data/types";
import { getUnitAsyncId, isUnitUpgradedOrWarSun } from "@/lookup/units";
import { getFactionImage } from "@/lookup/factions";

type Props = {
  playerData: PlayerData;
};

export default function PlayerCardSidebarTech(props: Props) {
  const {
    userName,
    faction,
    color,
    techs,
    unitsOwned,
    factionImage,
    factionImageType,
  } = props.playerData;
  const upgradedUnits = unitsOwned.filter(isUnitUpgradedOrWarSun);
  const factionUrl = getFactionImage(faction, factionImage, factionImageType);
  return (
    <PlayerCardBox color={color} faction={faction}>
      <Group gap={4} style={{ minWidth: 0, flex: 1 }} mb={6}>
        <Image
          src={factionUrl}
          alt={faction}
          w={24}
          h={24}
          style={{
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
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

      <Stack gap="xs">
        <Stack gap="xs">
          <DynamicTechGrid
            techs={techs}
            exhaustedTechs={props.playerData.exhaustedTechs}
          />
        </Stack>

        {/* Units Section - Only show upgraded units */}
        {upgradedUnits.length > 0 && (
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
                  compact
                />
              );
            })}
          </SimpleGrid>
        )}
      </Stack>
    </PlayerCardBox>
  );
}
