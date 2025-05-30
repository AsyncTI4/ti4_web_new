import { Group, Text, Image, Box } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { promissoryNotes } from "../../../data/promissoryNotes";
import { getGradientClasses } from "../gradientClasses";
import { cdnImage } from "../../../data/cdnImage";
import styles from "./PromissoryNote.module.css";

type PromissoryNoteData = {
  alias: string;
  name: string;
  faction?: string;
  color?: string;
  text: string;
  shortName?: string;
  shrinkName?: boolean;
};

type Props = {
  promissoryNoteId: string;
  colorToFaction: Record<string, string>;
  onClick?: () => void;
};

export function PromissoryNote({
  promissoryNoteId,
  colorToFaction,
  onClick,
}: Props) {
  // Parse the promissory note ID (e.g., "orange_sftt" -> color: "orange", type: "sftt")
  const parts = promissoryNoteId.split("_");
  if (parts.length < 2) {
    console.warn(`Invalid promissory note ID format: "${promissoryNoteId}"`);
    return null;
  }

  const color = parts[0];
  const type = parts.slice(1).join("_"); // Handle cases like "multi_part_type"

  // Find the template promissory note (e.g., "<color>_sftt")
  const templateAlias = `<color>_${type}`;
  const noteData = promissoryNotes.find(
    (note: PromissoryNoteData) => note.alias === templateAlias
  );

  if (!noteData) {
    console.warn(
      `Promissory note template with alias "${templateAlias}" not found`
    );
    return null;
  }

  // Find the faction associated with this color
  const faction = colorToFaction[color];

  if (!faction) {
    console.warn(`No faction found for color "${color}"`);
    return null;
  }

  // Replace <color> placeholders in the name and text
  const displayName = noteData.name.replace(/<color>/g, color);

  // Determine if this is from another faction (not the player's own)
  const isOtherFaction = true; // For now, assume all are from other factions
  const shimmerColor = isOtherFaction ? "cyan" : "blue";
  const gradientClasses = getGradientClasses(shimmerColor);

  // Get faction icon path
  const factionIcon = cdnImage(`/factions/${faction}.png`);

  return (
    <Box className={styles.promissoryCard} onClick={onClick}>
      <Shimmer
        color={shimmerColor}
        py={2}
        px={6}
        className={gradientClasses.border}
      >
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
            {noteData.shortName || displayName}
          </Text>
          <Box
            pos="relative"
            style={{
              width: "25px",
            }}
          >
            <Image
              src={factionIcon}
              pos="absolute"
              top={-13}
              left={0}
              style={{
                width: "25px",
              }}
            />
          </Box>
        </Group>
      </Shimmer>
    </Box>
  );
}
