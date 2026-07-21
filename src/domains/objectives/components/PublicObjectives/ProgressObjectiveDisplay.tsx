import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { Text, Group } from "@mantine/core";
import { IconCheck, IconQuestionMark } from "@tabler/icons-react";
import styles from "./ExpandedObjectiveCard.module.css";
import { ScoreTier } from "@/utils/objectiveScoreTiers";
import { AnonymousPlayerToken } from "@/shared/ui/AnonymousPlayerToken";

type ProgressObjectiveDisplayProps = {
  tier: ScoreTier;
  progressThreshold: number;
  ownProgress: number | null;
  /** Raw per-faction progress from the backend. Only redacted (key absent) for players the
   * viewer can't see stats of - when a real number is present (e.g. the GM's unfiltered view,
   * which redacts nothing), show it instead of "?". */
  factionProgress: Record<string, number>;
};

function Badge({
  completed,
  atThreshold = false,
  children,
}: {
  completed: boolean;
  atThreshold?: boolean;
  children: React.ReactNode;
}) {
  const state = completed
    ? styles.completed
    : atThreshold
      ? styles.atThreshold
      : "";
  return (
    <Group className={`${styles.factionProgressBadge} ${state}`} gap={4}>
      {children}
    </Group>
  );
}

function ProgressObjectiveDisplay({
  tier,
  progressThreshold,
  ownProgress,
  factionProgress,
}: ProgressObjectiveDisplayProps) {
  const { ownFaction, ownScored, identified, anonymousScorers } = tier;

  return (
    <>
      {ownFaction && (
        <Badge completed={ownScored}>
          <CircularFactionIcon faction={ownFaction} size={23} />
          {ownScored ? (
            <IconCheck size={14} color="var(--mantine-color-green-5)" />
          ) : (
            <Text className={styles.progressBadgeText}>
              {ownProgress ?? 0}/{progressThreshold}
            </Text>
          )}
        </Badge>
      )}

      {identified.map(({ player, scored }) => {
        const realProgress = factionProgress[player.faction];
        return (
          <Badge
            key={player.faction}
            completed={scored}
            atThreshold={
              !scored &&
              realProgress !== undefined &&
              realProgress >= progressThreshold
            }
          >
            <CircularFactionIcon
              faction={player.faction}
              factionImageOverride={player.factionImage}
              factionImageTypeOverride={player.factionImageType}
              size={23}
            />
            {scored ? (
              <IconCheck size={14} color="var(--mantine-color-green-5)" />
            ) : realProgress !== undefined ? (
              <Text className={styles.progressBadgeText}>
                {realProgress}/{progressThreshold}
              </Text>
            ) : (
              <IconQuestionMark size={14} color="var(--mantine-color-gray-4)" />
            )}
          </Badge>
        );
      })}

      {/* Scored by a player the viewer can't identify: generic token only, no faction icon.
          Always last, and shuffled per-objective (see computeScoreTier), so neither position nor
          ordering can be used to track a hidden player across objective cards. */}
      {anonymousScorers.map((faction) => (
        <Badge key={faction} completed>
          <AnonymousPlayerToken size={23} />
          <IconCheck size={14} color="var(--mantine-color-gray-5)" />
        </Badge>
      ))}
    </>
  );
}

export default ProgressObjectiveDisplay;
