import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import { promissoryNotes } from "../../../data/promissoryNotes";
import { cdnImage } from "../../../data/cdnImage";
import classes from "./PromissoryNoteCard.module.css";

type Props = {
  promissoryNoteId: string;
  colorToFaction: Record<string, string>;
};

export function PromissoryNoteCard({
  promissoryNoteId,
  colorToFaction,
}: Props) {
  const noteData = getPromissoryNoteData(promissoryNoteId, colorToFaction);

  if (!noteData) return null;

  return (
    <Box w={320} p="md" className={classes.card}>
      <Stack gap="md">
        {/* Header with icon and basic info */}
        <Group gap="md" align="flex-start">
          <Box w={80} h={80} className={classes.iconContainer}>
            <Image src="/pnicon.png" w={40} h={40} className={classes.icon} />
          </Box>
          <Stack gap={4} flex={1}>
            <Text size="lg" fw={700} c="white">
              {noteData.displayName}
            </Text>
            <Text size="xs" c="cyan.3" fw={600} tt="uppercase">
              Promissory Note
            </Text>
            {noteData.faction && (
              <Group gap={4} align="center">
                <Image
                  src={noteData.factionIcon}
                  w={16}
                  h={16}
                  style={{ flexShrink: 0 }}
                />
                <Text size="xs" c="cyan.4" fw={500} tt="capitalize">
                  {noteData.faction}
                </Text>
              </Group>
            )}
          </Stack>
        </Group>

        <Divider c="cyan.7" opacity={0.6} />

        {/* Note Text */}
        <Box>
          <Text size="sm" c="cyan.3" mb={4} fw={500}>
            Effect
          </Text>
          <Text size="sm" c="gray.1" lh={1.5}>
            {noteData.displayText}
          </Text>
        </Box>

        {noteData.playArea && (
          <>
            <Divider c="cyan.7" opacity={0.6} />

            {/* Play Area Information */}
            <Box>
              <Text size="sm" c="cyan.3" mb={4} fw={500}>
                Usage
              </Text>
              <Text size="sm" c="gray.2" fw={600}>
                {noteData.playImmediately
                  ? "Played immediately when received"
                  : "Placed in play area"}
              </Text>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}

// Helper function to get promissory note data by ID
const getPromissoryNoteData = (
  promissoryNoteId: string,
  colorToFaction: Record<string, string>
) => {
  // Parse the promissory note ID (e.g., "orange_sftt" -> color: "orange", type: "sftt")
  const parts = promissoryNoteId.split("_");
  if (parts.length < 2) {
    // Try to find a direct match for faction-specific notes
    const directMatch = promissoryNotes.find(
      (note) => note.alias === promissoryNoteId
    );
    if (directMatch) {
      return {
        displayName: directMatch.shortName || directMatch.name,
        displayText: directMatch.text,
        faction: directMatch.faction,
        factionIcon: directMatch.faction
          ? cdnImage(`/factions/${directMatch.faction}.png`)
          : undefined,
        playArea: directMatch.playArea,
        playImmediately: directMatch.playImmediately,
      };
    }
    return null;
  }

  const color = parts[0];
  const type = parts.slice(1).join("_");

  // Find the template promissory note (e.g., "<color>_sftt")
  const templateAlias = `<color>_${type}`;
  const noteData = promissoryNotes.find((note) => note.alias === templateAlias);

  if (!noteData) {
    return null;
  }

  // Find the faction associated with this color
  const faction = colorToFaction[color];

  if (!faction) {
    return null;
  }

  // Replace <color> placeholders in the name and text
  const displayName = noteData.name.replace(/<color>/g, color);
  const displayText = noteData.text.replace(/<color>/g, color);

  return {
    displayName: noteData.shortName || displayName,
    displayText,
    faction,
    factionIcon: cdnImage(`/factions/${faction}.png`),
    playArea: noteData.playArea,
    playImmediately: noteData.playImmediately,
  };
};
