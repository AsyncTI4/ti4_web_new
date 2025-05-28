import { Group, Text, Image, Tooltip } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { promissoryNotes } from "../../../data/promissoryNotes";

type PromissoryNoteData = {
  alias: string;
  name: string;
  faction: string;
  text: string;
  shortName?: string;
  shrinkName?: boolean;
};

type Props = {
  promissoryNoteId: string;
};

export function PromissoryNote({ promissoryNoteId }: Props) {
  // Look up promissory note data
  const noteData = promissoryNotes.find(
    (note: PromissoryNoteData) => note.alias === promissoryNoteId
  );

  if (!noteData) {
    console.warn(`Promissory note with ID "${promissoryNoteId}" not found`);
    return null;
  }

  // Determine if this is from another faction (not the player's own)
  const isOtherFaction = true; // For now, assume all are from other factions
  const shimmerColor = isOtherFaction ? "cyan" : "blue";

  // Get faction icon path
  const factionIcon = `/factions/${noteData.faction}.png`;

  return (
    <Tooltip label={noteData.text}>
      <Shimmer color={shimmerColor} py={2} px={6}>
        <Group gap="xs" align="center" wrap="nowrap" style={{ minWidth: 0 }}>
          <Image src="/pnicon.png" style={{ width: "20px", flexShrink: 0 }} />
          <Text
            size="xs"
            fw={700}
            c="white"
            flex={1}
            style={{
              fontFamily: "SLIDER, monospace",
              textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
          >
            {noteData.shortName || noteData.name}
          </Text>
          <Image
            src={factionIcon}
            style={{
              width: "20px",
              flexShrink: 0,
            }}
          />
        </Group>
      </Shimmer>
    </Tooltip>
  );
}
