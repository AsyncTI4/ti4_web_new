import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import { getPromissoryNoteData } from "../../../lookup/promissoryNotes";
import { cdnImage } from "../../../data/cdnImage";
import classes from "./PromissoryNoteCard.module.css";
import { useFactionColors } from "@/hooks/useFactionColors";

type Props = {
  promissoryNoteId: string;
};

export function PromissoryNoteCard({ promissoryNoteId }: Props) {
  const factionColorMap = useFactionColors();
  const noteData = getPromissoryNoteData(promissoryNoteId, factionColorMap);

  if (!noteData) return null;

  // Transform to match the expected format
  const displayData = {
    displayName: noteData.noteData.shortName || noteData.displayName,
    displayText: noteData.noteData.text.replace(
      /<color>/g,
      noteData.color || ""
    ),
    faction: noteData.faction,
    factionIcon: noteData.faction
      ? cdnImage(`/factions/${noteData.faction}.png`)
      : undefined,
    playArea: noteData.noteData.playArea,
    playImmediately: noteData.noteData.playImmediately,
  };

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
              {displayData.displayName}
            </Text>
            <Text size="xs" c="cyan.3" fw={600} tt="uppercase">
              Promissory Note
            </Text>
            {displayData.faction && (
              <Group gap={4} align="center">
                <Image
                  src={displayData.factionIcon}
                  w={16}
                  h={16}
                  style={{ flexShrink: 0 }}
                />
                <Text size="xs" c="cyan.4" fw={500} tt="capitalize">
                  {displayData.faction}
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
            {displayData.displayText}
          </Text>
        </Box>

        {displayData.playArea && (
          <>
            <Divider c="cyan.7" opacity={0.6} />

            {/* Play Area Information */}
            <Box>
              <Text size="sm" c="cyan.3" mb={4} fw={500}>
                Usage
              </Text>
              <Text size="sm" c="gray.2" fw={600}>
                {displayData.playImmediately
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

// Function is now imported from lookup/promissoryNotes
