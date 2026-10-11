import { useState } from "react";
import { Box, UnstyledButton } from "@/ds";
import type { Objective, Objectives, PlayerData } from "@/entities/data/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { ObjectiveDetailsCard } from "@/domains/cards/components/ObjectiveDetailsCard/ObjectiveDetailsCard";
import { getSeatOrder } from "@/domains/objectives/hooks/useOrderedFactions";
import styles from "./ObjectiveSeatMatrix.module.css";

type Stage = "orange" | "blue" | "gray";

type Props = {
  objectives: Objectives;
  playerData: PlayerData[];
};

function dotState(objective: Objective, faction: string) {
  if (objective.scoredFactions.includes(faction)) return "y";
  const threshold = objective.progressThreshold;
  if (threshold > 0 && (objective.factionProgress[faction] ?? 0) >= threshold) return "q";
  return undefined;
}

function dotTitle(state: string | undefined, faction: string) {
  if (state === "y") return `${faction}: scored`;
  if (state === "q") return `${faction}: qualifies`;
  return faction;
}

function MatrixRow({
  objective,
  stage,
  seats,
  playerData,
  opened,
  onOpenChange,
}: {
  objective: Objective;
  stage: Stage;
  seats: PlayerData[];
  playerData: PlayerData[];
  opened: boolean;
  onOpenChange: (opened: boolean) => void;
}) {
  return (
    <SmoothPopover position="right" opened={opened} onChange={onOpenChange}>
      <SmoothPopover.Target>
        <UnstyledButton
          className={styles.row}
          data-k={stage}
          onClick={() => onOpenChange(!opened)}
          aria-haspopup="dialog"
        >
          <span className={styles.name}>{objective.name}</span>
          {seats.map((seat) => {
            const state = dotState(objective, seat.faction);
            return (
              <i
                key={seat.faction}
                className={styles.dot}
                data-s={state}
                title={dotTitle(state, seat.faction)}
              />
            );
          })}
        </UnstyledButton>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <ObjectiveDetailsCard
          objectiveKey={objective.key}
          playerData={playerData}
          hasRedTape={objective.hasRedTape}
          scoredFactions={objective.scoredFactions}
          color={stage}
          factionProgress={objective.factionProgress}
          progressThreshold={objective.progressThreshold}
        />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

/**
 * Objectives as a seat matrix for the table rail: one row per revealed
 * objective, one dot per seat in seat order. Filled = scored, ring = qualifies.
 */
export function ObjectiveSeatMatrix({ objectives, playerData }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const seats = getSeatOrder(playerData);
  const rows: { objective: Objective; stage: Stage }[] = [
    ...objectives.stage1Objectives.map((objective) => ({ objective, stage: "orange" as const })),
    ...objectives.stage2Objectives.map((objective) => ({ objective, stage: "blue" as const })),
    ...objectives.customObjectives.map((objective) => ({ objective, stage: "gray" as const })),
  ];
  const revealed = rows.filter(({ objective }) => objective.revealed);
  const unrevealedCount = rows.length - revealed.length;

  return (
    <Box
      className={styles.matrix}
      style={{ "--seats": seats.length } as React.CSSProperties}
    >
      <Box className={styles.head}>
        <span />
        {seats.map((seat) => (
          <FactionIcon
            key={seat.faction}
            faction={seat.faction}
            factionImageOverride={seat.factionImage}
            factionImageTypeOverride={seat.factionImageType}
            alt={seat.faction}
            title={seat.userName}
            w={16}
            h={16}
            className={styles.headIcon}
          />
        ))}
      </Box>
      {revealed.map(({ objective, stage }) => (
        <MatrixRow
          key={objective.key}
          objective={objective}
          stage={stage}
          seats={seats}
          playerData={playerData}
          opened={openKey === objective.key}
          onOpenChange={(next) => setOpenKey(next ? objective.key : null)}
        />
      ))}
      {unrevealedCount > 0 && (
        <Box className={styles.unrevealed}>Unrevealed ×{unrevealedCount}</Box>
      )}
    </Box>
  );
}
