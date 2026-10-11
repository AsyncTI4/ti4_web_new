import { useState } from "react";
import { Box } from "@/ds";
import ExpandedObjectiveCard from "./ExpandedObjectiveCard";
import { Objective, Objectives, PlayerData, type LawInPlay } from "@/entities/data/types";
import styles from "./PublicObjectives.module.css";
import { RailLabel } from "@/domains/objectives/components/RailLabel";
import { LawCard } from "@/domains/objectives/components/LawsInPlay";

type ObjectiveColor = "orange" | "blue" | "gray";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
  lawsInPlay?: LawInPlay[];
  alwaysShowRequirements?: boolean;
};

function ExpandedPublicObjectives({
  objectives,
  playerData,
  lawsInPlay = [],
  alwaysShowRequirements = false,
}: Props) {
  const [openObjectiveKey, setOpenObjectiveKey] = useState<string | null>(null);

  const renderCard = (objective: Objective, color: ObjectiveColor) => (
    <ExpandedObjectiveCard
      key={objective.key}
      playerData={playerData}
      objective={objective}
      color={color}
      alwaysShowRequirement={alwaysShowRequirements}
      opened={openObjectiveKey === objective.key}
      onToggle={() =>
        setOpenObjectiveKey((current) =>
          current === objective.key ? null : objective.key
        )
      }
      onOpenChange={(nextOpened) =>
        setOpenObjectiveKey(nextOpened ? objective.key : null)
      }
    />
  );

  const renderStage = (
    title: string,
    stageObjectives: Objective[],
    color: ObjectiveColor,
  ) => {
    if (stageObjectives.length === 0) return null;
    const revealed = stageObjectives.filter((objective) => objective.revealed);
    return (
      <Box className={styles.stage}>
        <RailLabel meta={`${revealed.length} / ${stageObjectives.length}`}>
          {title}
        </RailLabel>
        <Box className={styles.rows}>
          {stageObjectives.map((objective) => renderCard(objective, color))}
        </Box>
      </Box>
    );
  };

  return (
    <Box className={styles.board}>
      <Box className={styles.stageGrid}>
        {renderStage("Stage I", objectives.stage1Objectives, "orange")}
        {renderStage("Stage II", objectives.stage2Objectives, "blue")}
      </Box>

      {objectives.customObjectives.length > 0 && (
        <Box className={styles.stage}>
          <RailLabel>Other points</RailLabel>
          <Box className={styles.customRow}>
            {objectives.customObjectives.map((objective) =>
              renderCard(objective, "gray"),
            )}
          </Box>
        </Box>
      )}

      {lawsInPlay.length > 0 && (
        <Box className={styles.stage}>
          <RailLabel meta={lawsInPlay.length}>Laws in play</RailLabel>
          <Box className={styles.lawGrid}>
            {lawsInPlay.map((law, index) => (
              <LawCard key={`${law.id}-${index}`} law={law} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ExpandedPublicObjectives;
