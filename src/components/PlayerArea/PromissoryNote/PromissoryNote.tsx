import { Group, Text, Image, Box } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { getPromissoryNoteData } from "../../../lookup/promissoryNotes";
import { getGradientClasses } from "../gradientClasses";
import { cdnImage } from "../../../data/cdnImage";
import styles from "./PromissoryNote.module.css";
import { Chip } from "@/components/shared/primitives/Chip";
import { useFactionColors } from "@/hooks/useFactionColors";

type Props = {
  promissoryNoteId: string;
  onClick?: () => void;
};

export function PromissoryNote({ promissoryNoteId, onClick }: Props) {
  const factionColorMap = useFactionColors();
  const promissoryNoteData = getPromissoryNoteData(
    promissoryNoteId,
    factionColorMap
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
    <Chip className={styles.promissoryCard} accent="cyan" onClick={onClick}>
      <Shimmer
        color={shimmerColor}
        py={2}
        px={6}
        className={`${gradientClasses.border} ${gradientClasses.backgroundStrong} ${styles.shimmerContainer}`}
      >
        <Group className={styles.contentGroup}>
          <Image src={factionIcon} className={styles.noteIcon} />
          <Text className={styles.noteText}>
            {noteData.shortName || displayName}
          </Text>
        </Group>
      </Shimmer>
    </Chip>
  );
}
