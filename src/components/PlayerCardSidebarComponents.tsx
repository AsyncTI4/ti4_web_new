import { Group, Text, Stack, Box, Image, SimpleGrid } from "@mantine/core";
import { Relic } from "./PlayerArea/Relic";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PromissoryNotesStack } from "./PlayerArea/PromissoryNotesStack";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { CCPool } from "./PlayerArea/CCPool";
import { PlayerCardBox } from "./PlayerCardBox";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { cdnImage } from "../data/cdnImage";

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

    relics,
    secretsScored,
    leaders,
  } = props.playerData;
  const promissoryNotes = props.playerData.promissoryNotesInPlayArea || [];

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

          <Group gap={0} align="stretch">
            <CCPool
              tacticalCC={tacticalCC}
              fleetCC={fleetCC}
              strategicCC={strategicCC}
            />

            <FragmentsPool fragments={fragments} />
          </Group>
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
    </PlayerCardBox>
  );
}
