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
        className={`${gradientClasses.border} ${styles.shimmerContainer}`}
      >
        <Group className={styles.contentGroup}>
          <Image src="/pnicon.png" className={styles.noteIcon} />
          <Text className={styles.noteText}>
            {noteData.shortName || displayName}
          </Text>
          <Box className={styles.factionIconContainer}>
            <Image src={factionIcon} className={styles.factionIcon} />
          </Box>
        </Group>
      </Shimmer>
    </Box>
  );
}
