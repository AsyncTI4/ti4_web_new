import { Group, Text, Image, Box } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { getPromissoryNoteData } from "../../../lookup/promissoryNotes";
import { getGradientClasses } from "../gradientClasses";
import { cdnImage } from "../../../data/cdnImage";
import styles from "./PromissoryNote.module.css";

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
  const promissoryNoteData = getPromissoryNoteData(
    promissoryNoteId,
    colorToFaction
  );
  if (!promissoryNoteData) return null;

  const { noteData, faction, displayName } = promissoryNoteData;

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
